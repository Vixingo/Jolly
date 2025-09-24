import storeSettingsData from '../assets/data/store-settings.json';
import productsData from '../assets/data/products.json';
import type { StoreSettings } from './store-settings';
import type { Product } from '../store/slices/productsSlice';

// Local data service that replaces Supabase calls with local JSON data

/**
 * Get store settings from local JSON file
 * Replaces the getStoreSettings function from store-settings.ts
 */
export function getLocalStoreSettings(): StoreSettings | null {
  try {
    return storeSettingsData as StoreSettings;
  } catch (error) {
    console.error('Error loading local store settings:', error);
    return null;
  }
}

/**
 * Get all products from local JSON file
 * Replaces Supabase product fetching
 */
export function getLocalProducts(): Product[] {
  try {
    return productsData as Product[];
  } catch (error) {
    console.error('Error loading local products:', error);
    return [];
  }
}

/**
 * Get a single product by ID from local JSON file
 */
export function getLocalProductById(id: string): Product | null {
  try {
    const products = getLocalProducts();
    return products.find(product => product.id === id) || null;
  } catch (error) {
    console.error('Error loading local product by ID:', error);
    return null;
  }
}

/**
 * Get products by category from local JSON file
 */
export function getLocalProductsByCategory(category: string): Product[] {
  try {
    const products = getLocalProducts();
    return products.filter(product => product.category === category);
  } catch (error) {
    console.error('Error loading local products by category:', error);
    return [];
  }
}

/**
 * Search products by name or description from local JSON file
 */
export function searchLocalProducts(query: string): Product[] {
  try {
    const products = getLocalProducts();
    const lowercaseQuery = query.toLowerCase();
    
    return products.filter(product => 
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery)
    );
  } catch (error) {
    console.error('Error searching local products:', error);
    return [];
  }
}

/**
 * Get unique categories from local products
 */
export function getLocalCategories(): string[] {
  try {
    const products = getLocalProducts();
    const categories = [...new Set(products.map(product => product.category))];
    return categories.filter(Boolean); // Remove any null/undefined categories
  } catch (error) {
    console.error('Error loading local categories:', error);
    return [];
  }
}

// Export types for consistency
export type { StoreSettings, Product };