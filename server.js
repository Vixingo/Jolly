// Simple development server to handle API routes for updating JSON files
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API endpoint to update store settings
app.post('/api/update-store-settings', (req, res) => {
  try {
    const settings = req.body;
    
    // Path to the store settings file
    const filePath = path.join(__dirname, 'src/assets/data/store-settings.json');
    
    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write the updated settings
    fs.writeFileSync(filePath, JSON.stringify(settings, null, 2));
    
    console.log('Store settings updated successfully');
    res.status(200).json({ success: true, message: 'Store settings updated successfully' });
  } catch (error) {
    console.error('Error updating store settings:', error);
    res.status(500).json({ error: 'Failed to update store settings' });
  }
});

// API endpoint to update products
app.post('/api/update-products', (req, res) => {
  try {
    const products = req.body;
    
    // Path to the products file
    const filePath = path.join(__dirname, 'src/assets/data/products.json');
    
    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write the updated products
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
    
    console.log('Products updated successfully');
    res.status(200).json({ success: true, message: 'Products updated successfully' });
  } catch (error) {
    console.error('Error updating products:', error);
    res.status(500).json({ error: 'Failed to update products' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Sync API server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Sync API server running on http://localhost:${PORT}`);
  console.log('📁 Ready to sync Supabase changes to local JSON files');
});