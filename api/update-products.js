// API endpoint to update products JSON file
// This would be deployed as a serverless function or API route

import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const products = req.body;
    
    // Path to the products file
    const filePath = path.join(process.cwd(), 'src/assets/data/products.json');
    
    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write the updated products
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
    
    res.status(200).json({ success: true, message: 'Products updated successfully' });
  } catch (error) {
    console.error('Error updating products:', error);
    res.status(500).json({ error: 'Failed to update products' });
  }
}