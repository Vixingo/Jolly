import { supabase } from './supabase'

/**
 * Ensures that the specified bucket exists in Supabase Storage
 * If it doesn't exist, it creates the bucket with the specified public access
 * 
 * Note: This function requires proper RLS policies to be set up in Supabase.
 * Run the storage-bucket-setup.sql script in your Supabase SQL Editor first.
 */
export async function ensureBucketExists(bucketName: string, isPublic: boolean = false) {
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error(`Error listing buckets:`, listError)
      console.warn('Make sure you have run the storage-bucket-setup.sql script in your Supabase SQL Editor')
      return false
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName)
    
    // If bucket doesn't exist, create it
    if (!bucketExists) {
      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: isPublic,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
      })
      
      if (createError) {
        console.error(`Error creating bucket ${bucketName}:`, createError)
        console.warn('This is likely due to missing RLS policies. Run the storage-bucket-setup.sql script in your Supabase SQL Editor.')
        return false
      }
      
      console.log(`Created bucket: ${bucketName} (public: ${isPublic})`)
    } else {
      console.log(`Bucket already exists: ${bucketName}`)
    }
    
    return true
  } catch (error) {
    console.error('Error ensuring bucket exists:', error)
    console.warn('Please run the storage-bucket-setup.sql script in your Supabase SQL Editor to set up the necessary RLS policies.')
    return false
  }
}

/**
 * Lists all buckets in Supabase Storage
 */
export async function listBuckets() {
  try {
    const { data, error } = await supabase.storage.listBuckets()
    
    if (error) {
      console.error('Error listing buckets:', error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error('Error listing buckets:', error)
    return []
  }
}

/**
 * Uploads a file to Supabase Storage and returns the public URL
 */
export async function uploadFile(
  bucketName: string,
  filePath: string,
  file: File,
  options?: { cacheControl?: string; upsert?: boolean }
): Promise<string | null> {
  try {
    // Ensure bucket exists
    const bucketReady = await ensureBucketExists(bucketName, true)
    if (!bucketReady) {
      throw new Error(`Bucket ${bucketName} could not be created or accessed`)
    }
    
    // Upload file
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: options?.cacheControl || '3600',
        upsert: options?.upsert || false
      })
      
    if (error) {
      throw error
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path)
      
    return publicUrl
  } catch (error) {
    console.error('Error uploading file:', error)
    return null
  }
}

/**
 * Deletes a file from Supabase Storage
 */
export async function deleteFile(bucketName: string, filePath: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath])
      
    if (error) {
      console.error('Error deleting file:', error)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Error deleting file:', error)
    return false
  }
}

/**
 * Uploads a file to the user-uploads bucket and returns the public URL
 * This is a convenience function for the user-uploads bucket
 */
export async function uploadUserFile(
  filePath: string,
  file: File,
  options?: { cacheControl?: string; upsert?: boolean }
): Promise<string | null> {
  return uploadFile('user-uploads', filePath, file, options)
}

/**
 * Extracts the file path from a Supabase Storage URL
 */
export function getFilePathFromUrl(url: string): string | null {
  try {
    // Parse the URL to extract the path
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split('/')
    
    // Remove the first empty string and the bucket name
    pathParts.shift() // Remove empty string from leading slash
    pathParts.shift() // Remove bucket name
    
    // Join the remaining parts to get the file path
    return pathParts.join('/')
  } catch (error) {
    console.error('Error extracting file path from URL:', error)
    return null
  }
}