import { supabase } from './supabase';
// import { getLocalStoreSettings, getLocalProducts } from './local-data-service';
import type { StoreSettings } from './store-settings';
import type { Product } from '../store/slices/productsSlice';

/**
 * Service to sync changes between Supabase and local JSON files
 * Ensures local data stays up-to-date when admin makes changes
 */

// Global flag to track if realtime sync has been initialized
let isRealtimeSyncInitialized = false;

/**
 * Updates local store settings (browser-compatible)
 * In a real application, this would trigger a build process or API call
 * to update the static JSON files
 */
export async function updateLocalStoreSettings(settings: StoreSettings): Promise<void> {
  try {
    // In a browser environment, we can't directly write to files
    // This triggers an API call to update the static files
    console.log('Store settings updated - triggering file update:', settings);
    
    // Call API endpoint to update the JSON files
    try {
      const response = await fetch('http://localhost:3001/api/update-store-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      
      if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
      }
      
      console.log('Local store settings file updated successfully');
    } catch (apiError) {
      console.warn('Could not update local file (API not available):', apiError);
      // Continue without failing - the Supabase update still succeeded
    }
  } catch (error) {
    console.error('Error updating local store settings:', error);
    throw error;
  }
}

/**
 * Updates local products (browser-compatible)
 * In a real application, this would trigger a build process or API call
 * to update the static JSON files
 */
export async function updateLocalProducts(products: Product[]): Promise<void> {
  try {
    // In a browser environment, we can't directly write to files
    // This triggers an API call to update the static files
    console.log('Products updated - triggering file update:', products.length, 'products');
    
    // Call API endpoint to update the JSON files
    try {
      const response = await fetch('http://localhost:3001/api/update-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(products)
      });
      
      if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
      }
      
      console.log('Local products file updated successfully');
    } catch (apiError) {
      console.warn('Could not update local file (API not available):', apiError);
      // Continue without failing - the Supabase update still succeeded
    }
  } catch (error) {
    console.error('Error updating local products:', error);
    throw error;
  }
}

/**
 * Syncs store settings from Supabase to local JSON
 */
export async function syncStoreSettingsFromSupabase(): Promise<void> {
  try {
    const { data: settings, error } = await supabase
      .from('store_settings_view')
      .select('*')
      .single();
    
    if (error) {
      console.error('Error fetching store settings from Supabase:', error);
      return;
    }
    
    if (settings) {
      await updateLocalStoreSettings(settings);
    }
  } catch (error) {
    console.error('Error syncing store settings:', error);
  }
}

/**
 * Syncs products from Supabase to local JSON
 */
export async function syncProductsFromSupabase(): Promise<void> {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching products from Supabase:', error);
      return;
    }
    
    if (products) {
      await updateLocalProducts(products);
    }
  } catch (error) {
    console.error('Error syncing products:', error);
  }
}

/**
 * Sets up real-time listeners for Supabase changes
 * Automatically updates local JSON files when data changes
 */
export function setupRealtimeSync(): void {
  // Prevent multiple initializations
  if (isRealtimeSyncInitialized) {
    return;
  }

  // Listen for store settings changes
  supabase
    .channel('store_settings_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'store_settings'
      },
      async (payload) => {
        console.log('Store settings changed:', payload);
        await syncStoreSettingsFromSupabase();
      }
    )
    .subscribe();

  // Listen for products changes
  supabase
    .channel('products_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'products'
      },
      async (payload) => {
        console.log('Products changed:', payload);
        await syncProductsFromSupabase();
      }
    )
    .subscribe();

  isRealtimeSyncInitialized = true;
  console.log('Real-time sync listeners set up successfully');
}

/**
 * Enhanced store settings update function that syncs to local file
 */
export async function updateStoreSettingsWithSync(settings: Partial<StoreSettings>): Promise<StoreSettings | null> {
  try {
    // Initialize realtime sync when admin actions are performed
    setupRealtimeSync();

    // Update in Supabase
    const { data, error } = await supabase
      .from('store_settings')
      .update(settings)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating store settings in Supabase:', error);
      return null;
    }
    
    // Sync to local file
    if (data) {
      await updateLocalStoreSettings(data);
    }
    
    return data;
  } catch (error) {
    console.error('Error updating store settings with sync:', error);
    return null;
  }
}

/**
 * Enhanced product update function that syncs to local file
 */
export async function updateProductWithSync(productId: string, updates: Partial<Product>): Promise<Product | null> {
  try {
    // Initialize realtime sync when admin actions are performed
    setupRealtimeSync();

    // Update in Supabase
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', productId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating product in Supabase:', error);
      return null;
    }
    
    // Sync all products to local file
    await syncProductsFromSupabase();
    
    return data;
  } catch (error) {
    console.error('Error updating product with sync:', error);
    return null;
  }
}

/**
 * Enhanced product creation function that syncs to local file
 */
export async function createProductWithSync(product: Partial<Product>): Promise<Product | null> {
  try {
    // Initialize realtime sync when admin actions are performed
    setupRealtimeSync();

    // Create in Supabase
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating product in Supabase:', error);
      return null;
    }
    
    // Sync all products to local file
    await syncProductsFromSupabase();
    
    return data;
  } catch (error) {
    console.error('Error creating product with sync:', error);
    return null;
  }
}

/**
 * Enhanced product deletion function that syncs to local file
 */
export async function deleteProductWithSync(productId: string): Promise<boolean> {
  try {
    // Initialize realtime sync when admin actions are performed
    setupRealtimeSync();

    // Delete from Supabase
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);
    
    if (error) {
      console.error('Error deleting product from Supabase:', error);
      return false;
    }
    
    // Sync all products to local file
    await syncProductsFromSupabase();
    
    return true;
  } catch (error) {
    console.error('Error deleting product with sync:', error);
    return false;
  }
}