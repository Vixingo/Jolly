import { ensureBucketExists } from './storage-utils'

/**
 * Initializes the Supabase storage buckets needed for the application
 * This should be called when the application starts
 * 
 * Note: Before using this function, make sure to run the storage-bucket-setup.sql
 * script in your Supabase SQL Editor to set up the necessary RLS policies.
 */
export async function initializeStorage() {
  console.log('Initializing Supabase storage buckets...')
  
  try {
    // Create product-images bucket (public)
    const productImagesResult = await ensureBucketExists('product-images', true)
    if (!productImagesResult) {
      console.warn('Failed to create or access product-images bucket. Please run the storage-bucket-setup.sql script in your Supabase SQL Editor.')
    }
    
    // Create user-uploads bucket (public)
    const userUploadsResult = await ensureBucketExists('user-uploads', true)
    if (!userUploadsResult) {
      console.warn('Failed to create or access user-uploads bucket. Please run the storage-bucket-setup.sql script in your Supabase SQL Editor.')
    }
    
    console.log('Storage initialization complete')
    return productImagesResult && userUploadsResult
  } catch (error) {
    console.error('Error during storage initialization:', error)
    console.warn('Please run the storage-bucket-setup.sql script in your Supabase SQL Editor to set up the necessary RLS policies.')
    return false
  }
}