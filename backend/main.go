
package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
	_ "github.com/go-sql-driver/mysql"
)

// Database connection
var db *sql.DB

// Drug represents the drug model
type Drug struct {
	ID                   int           `json:"id"`
	Name                 string        `json:"name"`
	Description          string        `json:"description"`
	CategoryID           int           `json:"category_id"`
	Category             string        `json:"category"`
	DrugClass            string        `json:"drug_class,omitempty"`
	RequiresPrescription bool          `json:"requires_prescription"`
	Dosage               string        `json:"dosage,omitempty"`
	MaxDosage            string        `json:"max_dosage,omitempty"`
	SideEffects          []string      `json:"side_effects,omitempty"`
	CommonSideEffects    []string      `json:"common_side_effects,omitempty"`
	SeriousSideEffects   []string      `json:"serious_side_effects,omitempty"`
	RareSideEffects      []string      `json:"rare_side_effects,omitempty"`
	Warnings             string        `json:"warnings,omitempty"`
	Interactions         []Interaction `json:"interactions,omitempty"`
	Contraindications    []string      `json:"contraindications,omitempty"`
	MechanismOfAction    string        `json:"mechanism_of_action,omitempty"`
	Pharmacokinetics     string        `json:"pharmacokinetics,omitempty"`
	HalfLife             string        `json:"half_life,omitempty"`
	OnsetOfAction        string        `json:"onset_of_action,omitempty"`
	RouteOfAdministration string       `json:"route_of_administration,omitempty"`
	PregnancyCategory    string        `json:"pregnancy_category,omitempty"`
	PregnancyInfo        string        `json:"pregnancy_info,omitempty"`
	LactationInfo        string        `json:"lactation_info,omitempty"`
	StorageInfo          string        `json:"storage_info,omitempty"`
}

// Category represents the drug category model
type Category struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description,omitempty"`
	DrugCount   int    `json:"drug_count"`
}

// Interaction represents a drug interaction
type Interaction struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Severity    string `json:"severity,omitempty"`
}

func main() {
	// Connect to the database
	var err error
	db, err = sql.Open("mysql", "root:sQl_25@VA@tcp(localhost:3306)/DBMS_MiniProject")
	if err != nil {
		log.Fatal("Error connecting to the database: ", err)
	}
	defer db.Close()

	// Verify connection
	err = db.Ping()
	if err != nil {
		log.Fatal("Error connecting to the database: ", err)
	}
	fmt.Println("Connected to the database successfully!")

	// Create router
	router := mux.NewRouter()

	// Define API routes
	router.HandleFunc("/api/drugs", getDrugs).Methods("GET")
	router.HandleFunc("/api/drugs/{id}", getDrugByID).Methods("GET")
	router.HandleFunc("/api/categories", getCategories).Methods("GET")
	router.HandleFunc("/api/categories/{id}", getCategoryByID).Methods("GET")
	router.HandleFunc("/api/categories/{id}/drugs", getDrugsByCategory).Methods("GET")

	// Set up CORS
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:8080", "http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Origin", "Accept"},
		AllowCredentials: true,
	})

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}

	handler := c.Handler(router)
	log.Printf("Server running on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}

// Get all drugs with filtering
func getDrugs(w http.ResponseWriter, r *http.Request) {
	queryParams := r.URL.Query()
	
	// Define base query
	baseQuery := `
		SELECT d.id, d.name, d.description, d.category_id, c.name as category, 
		d.drug_class, d.requires_prescription 
		FROM drugs d
		LEFT JOIN categories c ON d.category_id = c.id
		WHERE 1=1
	`
	
	// Initialize parameters for the query
	var params []interface{}
	var conditions []string

	// Add search filter
	if search := queryParams.Get("search"); search != "" {
		conditions = append(conditions, "(d.name LIKE ? OR d.description LIKE ?)")
		params = append(params, "%"+search+"%", "%"+search+"%")
	}

	// Add category filter
	if categoriesParam := queryParams.Get("categories"); categoriesParam != "" {
		categories := strings.Split(categoriesParam, ",")
		placeholders := make([]string, len(categories))
		for i, category := range categories {
			placeholders[i] = "?"
			categoryID, _ := strconv.Atoi(category)
			params = append(params, categoryID)
		}
		conditions = append(conditions, fmt.Sprintf("d.category_id IN (%s)", strings.Join(placeholders, ",")))
	}

	// Add prescription filter
	if prescriptionFilter := queryParams.Get("prescriptionFilter"); prescriptionFilter != "" && prescriptionFilter != "all" {
		var requiresPrescription bool
		if prescriptionFilter == "prescription" {
			requiresPrescription = true
		} else {
			requiresPrescription = false
		}
		conditions = append(conditions, "d.requires_prescription = ?")
		params = append(params, requiresPrescription)
	}

	// Construct the WHERE clause
	if len(conditions) > 0 {
		baseQuery += " AND " + strings.Join(conditions, " AND ")
	}

	// Add sorting
	sortBy := queryParams.Get("sortBy")
	switch sortBy {
	case "name_desc":
		baseQuery += " ORDER BY d.name DESC"
	case "category":
		baseQuery += " ORDER BY c.name ASC, d.name ASC"
	default:
		baseQuery += " ORDER BY d.name ASC"
	}

	// Add limit if specified
	if limitStr := queryParams.Get("limit"); limitStr != "" {
		limit, err := strconv.Atoi(limitStr)
		if err == nil && limit > 0 {
			baseQuery += " LIMIT ?"
			params = append(params, limit)
		}
	}

	// Execute query
	rows, err := db.Query(baseQuery, params...)
	if err != nil {
		http.Error(w, "Error retrieving drugs from database", http.StatusInternalServerError)
		log.Println("Error retrieving drugs:", err)
		return
	}
	defer rows.Close()

	// Parse results
	var drugs []Drug
	for rows.Next() {
		var drug Drug
		err := rows.Scan(
			&drug.ID, &drug.Name, &drug.Description, 
			&drug.CategoryID, &drug.Category, 
			&drug.DrugClass, &drug.RequiresPrescription,
		)
		if err != nil {
			http.Error(w, "Error scanning drug record", http.StatusInternalServerError)
			log.Println("Error scanning drug:", err)
			return
		}
		drugs = append(drugs, drug)
	}

	// Return JSON response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(drugs)
}

// Get a specific drug by ID
func getDrugByID(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id := params["id"]

	// Get basic drug info
	var drug Drug
	err := db.QueryRow(`
		SELECT d.id, d.name, d.description, d.category_id, c.name as category, 
		d.drug_class, d.requires_prescription, d.dosage, d.max_dosage, 
		d.warnings, d.mechanism_of_action, d.pharmacokinetics, d.half_life,
		d.onset_of_action, d.route_of_administration, d.pregnancy_category,
		d.pregnancy_info, d.lactation_info, d.storage_info
		FROM drugs d
		LEFT JOIN categories c ON d.category_id = c.id
		WHERE d.id = ?
	`, id).Scan(
		&drug.ID, &drug.Name, &drug.Description, 
		&drug.CategoryID, &drug.Category, 
		&drug.DrugClass, &drug.RequiresPrescription,
		&drug.Dosage, &drug.MaxDosage, &drug.Warnings,
		&drug.MechanismOfAction, &drug.Pharmacokinetics, &drug.HalfLife,
		&drug.OnsetOfAction, &drug.RouteOfAdministration, &drug.PregnancyCategory,
		&drug.PregnancyInfo, &drug.LactationInfo, &drug.StorageInfo,
	)
	
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Drug not found", http.StatusNotFound)
			return
		}
		http.Error(w, "Error retrieving drug from database", http.StatusInternalServerError)
		log.Println("Error retrieving drug:", err)
		return
	}

	// Get side effects
	commonRows, err := db.Query("SELECT effect FROM side_effects WHERE drug_id = ? AND type = 'common'", id)
	if err == nil {
		defer commonRows.Close()
		var commonEffects []string
		for commonRows.Next() {
			var effect string
			if err := commonRows.Scan(&effect); err == nil {
				commonEffects = append(commonEffects, effect)
			}
		}
		drug.CommonSideEffects = commonEffects
	}

	seriousRows, err := db.Query("SELECT effect FROM side_effects WHERE drug_id = ? AND type = 'serious'", id)
	if err == nil {
		defer seriousRows.Close()
		var seriousEffects []string
		for seriousRows.Next() {
			var effect string
			if err := seriousRows.Scan(&effect); err == nil {
				seriousEffects = append(seriousEffects, effect)
			}
		}
		drug.SeriousSideEffects = seriousEffects
	}

	rareRows, err := db.Query("SELECT effect FROM side_effects WHERE drug_id = ? AND type = 'rare'", id)
	if err == nil {
		defer rareRows.Close()
		var rareEffects []string
		for rareRows.Next() {
			var effect string
			if err := rareRows.Scan(&effect); err == nil {
				rareEffects = append(rareEffects, effect)
			}
		}
		drug.RareSideEffects = rareEffects
	}

	// Combine all side effects for the side_effects field
	var allEffects []string
	allEffects = append(allEffects, drug.CommonSideEffects...)
	allEffects = append(allEffects, drug.SeriousSideEffects...)
	allEffects = append(allEffects, drug.RareSideEffects...)
	drug.SideEffects = allEffects

	// Get contraindications
	contraRows, err := db.Query("SELECT contraindication FROM contraindications WHERE drug_id = ?", id)
	if err == nil {
		defer contraRows.Close()
		var contraindications []string
		for contraRows.Next() {
			var contraindication string
			if err := contraRows.Scan(&contraindication); err == nil {
				contraindications = append(contraindications, contraindication)
			}
		}
		drug.Contraindications = contraindications
	}

	// Get interactions
	interactionRows, err := db.Query(`
		SELECT name, description, severity 
		FROM interactions 
		WHERE drug_id = ?
	`, id)
	if err == nil {
		defer interactionRows.Close()
		var interactions []Interaction
		for interactionRows.Next() {
			var interaction Interaction
			if err := interactionRows.Scan(&interaction.Name, &interaction.Description, &interaction.Severity); err == nil {
				interactions = append(interactions, interaction)
			}
		}
		drug.Interactions = interactions
	}

	// Return JSON response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(drug)
}

// Get all categories
func getCategories(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query(`
		SELECT c.id, c.name, c.description, COUNT(d.id) as drug_count
		FROM categories c
		LEFT JOIN drugs d ON c.id = d.category_id
		GROUP BY c.id
		ORDER BY c.name
	`)
	if err != nil {
		http.Error(w, "Error retrieving categories from database", http.StatusInternalServerError)
		log.Println("Error retrieving categories:", err)
		return
	}
	defer rows.Close()

	var categories []Category
	for rows.Next() {
		var category Category
		err := rows.Scan(&category.ID, &category.Name, &category.Description, &category.DrugCount)
		if err != nil {
			http.Error(w, "Error scanning category record", http.StatusInternalServerError)
			log.Println("Error scanning category:", err)
			return
		}
		categories = append(categories, category)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(categories)
}

// Get a specific category by ID
func getCategoryByID(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id := params["id"]

	var category Category
	err := db.QueryRow(`
		SELECT c.id, c.name, c.description, COUNT(d.id) as drug_count
		FROM categories c
		LEFT JOIN drugs d ON c.id = d.category_id
		WHERE c.id = ?
		GROUP BY c.id
	`, id).Scan(&category.ID, &category.Name, &category.Description, &category.DrugCount)
	
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Category not found", http.StatusNotFound)
			return
		}
		http.Error(w, "Error retrieving category from database", http.StatusInternalServerError)
		log.Println("Error retrieving category:", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(category)
}

// Get drugs by category
func getDrugsByCategory(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	categoryID := params["id"]

	rows, err := db.Query(`
		SELECT d.id, d.name, d.description, d.category_id, c.name as category, 
		d.drug_class, d.requires_prescription 
		FROM drugs d
		LEFT JOIN categories c ON d.category_id = c.id
		WHERE d.category_id = ?
		ORDER BY d.name
	`, categoryID)
	if err != nil {
		http.Error(w, "Error retrieving drugs from database", http.StatusInternalServerError)
		log.Println("Error retrieving drugs:", err)
		return
	}
	defer rows.Close()

	var drugs []Drug
	for rows.Next() {
		var drug Drug
		err := rows.Scan(
			&drug.ID, &drug.Name, &drug.Description, 
			&drug.CategoryID, &drug.Category, 
			&drug.DrugClass, &drug.RequiresPrescription,
		)
		if err != nil {
			http.Error(w, "Error scanning drug record", http.StatusInternalServerError)
			log.Println("Error scanning drug:", err)
			return
		}
		drugs = append(drugs, drug)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(drugs)
}
