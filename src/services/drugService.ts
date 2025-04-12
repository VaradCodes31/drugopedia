
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Types for our API responses
export interface Drug {
  id: number;
  name: string;
  description: string;
  category: string;
  category_id: number;
  drug_class?: string;
  requires_prescription: boolean;
  dosage?: string;
  max_dosage?: string;
  side_effects?: string[];
  common_side_effects?: string[];
  serious_side_effects?: string[];
  rare_side_effects?: string[];
  warnings?: string;
  interactions?: {
    name: string;
    description: string;
    severity?: string;
  }[];
  contraindications?: string[] | string;
  mechanism_of_action?: string;
  pharmacokinetics?: string;
  half_life?: string;
  onset_of_action?: string;
  route_of_administration?: string;
  pregnancy_category?: string;
  pregnancy_info?: string;
  lactation_info?: string;
  storage_info?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  drug_count: number;
}

interface GetDrugsParams {
  search?: string;
  categories?: string[];
  prescriptionFilter?: string;
  sortBy?: string;
  limit?: number;
}

// Get top/featured drugs for the homepage
export const getTopDrugs = async (): Promise<Drug[]> => {
  try {
    const response = await axios.get(`${API_URL}/drugs`, {
      params: { limit: 6 }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching top drugs:", error);
    return [];
  }
};

// Get all drug categories
export const getDrugCategories = async (): Promise<Category[]> => {
  try {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
  } catch (error) {
    console.error("Error fetching drug categories:", error);
    return [];
  }
};

// Get drugs with filters
export const getDrugs = async (params: GetDrugsParams): Promise<Drug[]> => {
  try {
    const response = await axios.get(`${API_URL}/drugs`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching drugs:", error);
    return [];
  }
};

// Get a drug by ID
export const getDrugById = async (id: number): Promise<Drug> => {
  try {
    const response = await axios.get(`${API_URL}/drugs/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching drug with ID ${id}:`, error);
    throw error;
  }
};

// Get category by ID
export const getCategoryById = async (id: number): Promise<Category> => {
  try {
    const response = await axios.get(`${API_URL}/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching category with ID ${id}:`, error);
    throw error;
  }
};

// Get drugs by category
export const getDrugsByCategory = async (categoryId: number): Promise<Drug[]> => {
  try {
    const response = await axios.get(`${API_URL}/categories/${categoryId}/drugs`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching drugs for category ${categoryId}:`, error);
    return [];
  }
};
