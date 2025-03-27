import { Product } from '../components/Store/StoreGrid';

export const API_URL = 'http://localhost:8000/api';

export const fetchProducts = async (filters?: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}): Promise<Product[]> => {
  try {
    // Build URL with query parameters based on filters
    let url = new URL(`${API_URL}/products/`);
    
    // Add filters to query params
    if (filters) {
      if (filters.category) url.searchParams.append('category', filters.category);
      if (filters.minPrice !== undefined) url.searchParams.append('min_price', filters.minPrice.toString());
      if (filters.maxPrice !== undefined) url.searchParams.append('max_price', filters.maxPrice.toString());
      if (filters.search) url.searchParams.append('search', filters.search);
    }
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchProductById = async (id: number): Promise<Product> => {
  try {
    const response = await fetch(`${API_URL}/products/${id}/`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw error;
  }
};