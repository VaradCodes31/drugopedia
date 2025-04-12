
# Drugopedia

A modern, sleek website for accessing comprehensive drug information.

## Features

- Browse drugs by name and category
- Detailed drug information pages with organized sections
- Comprehensive filtering and search capabilities
- Responsive design with elegant animations
- Backend API built with Go and MySQL

## Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- shadcn/ui components
- React Router for navigation
- Tanstack Query for data fetching

### Backend
- Go (Golang) with Gorilla Mux
- MySQL database

## Setup Instructions

### Prerequisites
- Node.js and npm (for the frontend)
- Go 1.16+ (for the backend)
- MySQL server

### Database Setup

1. Create a new MySQL database:
```sql
CREATE DATABASE DBMS_MiniProject;
```

2. Use the provided schema to create the required tables:

```sql
-- Create the categories table
CREATE TABLE categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT
);

-- Create the drugs table
CREATE TABLE drugs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category_id INT,
  drug_class VARCHAR(255),
  requires_prescription BOOLEAN DEFAULT FALSE,
  dosage TEXT,
  max_dosage VARCHAR(255),
  warnings TEXT,
  mechanism_of_action TEXT,
  pharmacokinetics TEXT,
  half_life VARCHAR(100),
  onset_of_action VARCHAR(100),
  route_of_administration VARCHAR(100),
  pregnancy_category VARCHAR(50),
  pregnancy_info TEXT,
  lactation_info TEXT,
  storage_info TEXT,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Create the side_effects table
CREATE TABLE side_effects (
  id INT PRIMARY KEY AUTO_INCREMENT,
  drug_id INT NOT NULL,
  effect VARCHAR(255) NOT NULL,
  type ENUM('common', 'serious', 'rare') DEFAULT 'common',
  FOREIGN KEY (drug_id) REFERENCES drugs(id)
);

-- Create the interactions table
CREATE TABLE interactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  drug_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  severity ENUM('minor', 'moderate', 'major'),
  FOREIGN KEY (drug_id) REFERENCES drugs(id)
);

-- Create the contraindications table
CREATE TABLE contraindications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  drug_id INT NOT NULL,
  contraindication VARCHAR(255) NOT NULL,
  FOREIGN KEY (drug_id) REFERENCES drugs(id)
);
```

3. Insert sample data into the database (you can add more drugs and categories as needed):

```sql
-- Insert categories
INSERT INTO categories (name, description) VALUES 
('Antibiotics', 'Medications used to treat bacterial infections'),
('Analgesics', 'Pain relieving medications'),
('Antidepressants', 'Medications used to treat depression'),
('Antihypertensives', 'Medications used to treat high blood pressure'),
('Antihistamines', 'Medications used to treat allergies');

-- Insert drugs
INSERT INTO drugs (name, description, category_id, drug_class, requires_prescription, dosage, warnings, mechanism_of_action) VALUES 
('Amoxicillin', 'A penicillin antibiotic that fights bacteria in your body. Used to treat many different types of infection.', 1, 'Penicillin Antibiotic', true, '<p>Adults and children weighing 40 kg or more: 250 mg every 8 hours, 500 mg every 8 hours, 500 mg every 12 hours, or 875 mg every 12 hours, depending on the type and severity of infection.</p>', 'Penicillin allergy can cause severe, potentially fatal reactions.', 'Inhibits bacterial cell wall synthesis'),
('Ibuprofen', 'A nonsteroidal anti-inflammatory drug (NSAID) used to relieve pain, reduce inflammation, and reduce fever.', 2, 'NSAID', false, '<p>Adults: 200 to 400 mg orally every 4 to 6 hours as needed, not to exceed 1200 mg per day unless directed by a physician.</p>', 'Can increase risk of heart attack or stroke. Not recommended for use during pregnancy.', 'Inhibits cyclooxygenase (COX) enzymes');

-- Insert side effects
INSERT INTO side_effects (drug_id, effect, type) VALUES 
(1, 'Diarrhea', 'common'),
(1, 'Nausea', 'common'),
(1, 'Vomiting', 'common'),
(1, 'Severe allergic reaction', 'serious'),
(2, 'Upset stomach', 'common'),
(2, 'Heartburn', 'common'),
(2, 'Stomach bleeding', 'serious');

-- Insert interactions
INSERT INTO interactions (drug_id, name, description, severity) VALUES 
(1, 'Probenecid', 'Increases amoxicillin levels by reducing its elimination', 'moderate'),
(2, 'Aspirin', 'Increased risk of gastrointestinal side effects', 'moderate'),
(2, 'Blood pressure medications', 'May decrease effectiveness of blood pressure medications', 'moderate');

-- Insert contraindications
INSERT INTO contraindications (drug_id, contraindication) VALUES 
(1, 'Penicillin allergy'),
(1, 'History of amoxicillin-associated cholestatic jaundice/hepatic dysfunction'),
(2, 'Active stomach/intestinal bleeding'),
(2, 'History of allergic reaction to aspirin or other NSAIDs');
```

### Running the Backend

1. Navigate to the backend directory:
```bash
cd backend
```

2. Run the Go server:
```bash
go run main.go
```

The backend server will start on port 8000.

### Running the Frontend

1. Install the frontend dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will be available at http://localhost:8080.

## API Endpoints

- `GET /api/drugs` - Get all drugs (with optional filters)
- `GET /api/drugs/{id}` - Get a specific drug by ID
- `GET /api/categories` - Get all drug categories
- `GET /api/categories/{id}` - Get a specific category by ID
- `GET /api/categories/{id}/drugs` - Get all drugs in a specific category

## Additional Information

- The MySQL connection uses the user 'root' with password 'sQl_25@VA'
- The backend handles CORS to allow requests from the frontend
- All data is served through the RESTful API endpoints

## License

This project is licensed under the MIT License.
