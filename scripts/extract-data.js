#!/usr/bin/env node

// Data extraction script to migrate from Supabase to local JSON files
// Run this script to extract current store settings and products data

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { config } from 'dotenv';

// Load environment variables
config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Ensure directories exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Download file from URL
const downloadFile = (url, filepath) => {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(filepath);
    
    client.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve();
      });
      
      file.on('error', (err) => {
        fs.unlink(filepath, () => {});
        reject(err);
      });
    }).on('error', reject);
  });
};

// Extract store settings
const extractStoreSettings = async () => {
  console.log('Extracting store settings...');
  
  try {
    const { data, error } = await supabase
      .from('store_settings')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    if (!data) {
      console.log('No store settings found, creating default settings');
      const defaultSettings = {
        store_name: 'Jolly Store',
        store_description: 'Your amazing online store',
        currency: 'USD',
        theme_primary_color: '#3b82f6',
        theme_secondary_color: '#64748b',
        theme_accent_color: '#f59e0b'
      };
      
      ensureDir('src/assets/data');
      fs.writeFileSync(
        'src/assets/data/store-settings.json',
        JSON.stringify(defaultSettings, null, 2)
      );
      return defaultSettings;
    }
    
    // Download logo and favicon if they exist
    if (data.logo_url) {
      try {
        const logoExt = path.extname(new URL(data.logo_url).pathname) || '.png';
        const logoPath = `src/assets/images/store/logo${logoExt}`;
        ensureDir('src/assets/images/store');
        await downloadFile(data.logo_url, logoPath);
        data.logo_url = `/src/assets/images/store/logo${logoExt}`;
        console.log('Downloaded logo');
      } catch (err) {
        console.warn('Failed to download logo:', err.message);
        data.logo_url = null;
      }
    }
    
    if (data.favicon_url) {
      try {
        const faviconExt = path.extname(new URL(data.favicon_url).pathname) || '.ico';
        const faviconPath = `src/assets/images/store/favicon${faviconExt}`;
        ensureDir('src/assets/images/store');
        await downloadFile(data.favicon_url, faviconPath);
        data.favicon_url = `/src/assets/images/store/favicon${faviconExt}`;
        console.log('Downloaded favicon');
      } catch (err) {
        console.warn('Failed to download favicon:', err.message);
        data.favicon_url = null;
      }
    }
    
    // Remove Supabase-specific fields
    delete data.id;
    delete data.created_at;
    delete data.updated_at;
    delete data.is_active;
    delete data.logo_storage_path;
    delete data.favicon_storage_path;
    
    ensureDir('src/assets/data');
    fs.writeFileSync(
      'src/assets/data/store-settings.json',
      JSON.stringify(data, null, 2)
    );
    
    console.log('Store settings extracted successfully');
    return data;
  } catch (error) {
    console.error('Error extracting store settings:', error);
    throw error;
  }
};

// Extract products data
const extractProducts = async () => {
  console.log('Extracting products...');
  
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    if (!products || products.length === 0) {
      console.log('No products found, creating empty products file');
      ensureDir('src/assets/data');
      fs.writeFileSync(
        'src/assets/data/products.json',
        JSON.stringify([], null, 2)
      );
      return [];
    }
    
    // Download product images and update URLs
    const processedProducts = [];
    
    for (const product of products) {
      console.log(`Processing product: ${product.name}`);
      
      const productImages = [];
      
      if (product.images && product.images.length > 0) {
        ensureDir(`src/assets/images/products/${product.id}`);
        
        for (let i = 0; i < product.images.length; i++) {
          const imageUrl = product.images[i];
          try {
            const imageExt = path.extname(new URL(imageUrl).pathname) || '.jpg';
            const imageName = `image-${i + 1}${imageExt}`;
            const imagePath = `src/assets/images/products/${product.id}/${imageName}`;
            
            await downloadFile(imageUrl, imagePath);
            productImages.push(`/src/assets/images/products/${product.id}/${imageName}`);
            console.log(`  Downloaded image ${i + 1}`);
          } catch (err) {
            console.warn(`  Failed to download image ${i + 1}:`, err.message);
          }
        }
      }
      
      // Create processed product
      const processedProduct = {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        images: productImages,
        category: product.category,
        stock: product.stock,
        created_at: product.created_at,
        updated_at: product.updated_at
      };
      
      processedProducts.push(processedProduct);
    }
    
    ensureDir('src/assets/data');
    fs.writeFileSync(
      'src/assets/data/products.json',
      JSON.stringify(processedProducts, null, 2)
    );
    
    console.log(`Extracted ${processedProducts.length} products successfully`);
    return processedProducts;
  } catch (error) {
    console.error('Error extracting products:', error);
    throw error;
  }
};

// Main extraction function
const main = async () => {
  try {
    console.log('Starting data extraction from Supabase...');
    
    await extractStoreSettings();
    await extractProducts();
    
    console.log('\n✅ Data extraction completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Review the extracted data in src/assets/data/');
    console.log('2. Check downloaded images in src/assets/images/');
    console.log('3. Update your application to use local data instead of Supabase');
    
  } catch (error) {
    console.error('\n❌ Data extraction failed:', error);
    process.exit(1);
  }
};

// Run if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { extractStoreSettings, extractProducts };