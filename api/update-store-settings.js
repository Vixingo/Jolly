// API endpoint to update store settings JSON file
// This would be deployed as a serverless function or API route

import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const settings = req.body;
    
    // Path to the store settings file
    const filePath = path.join(process.cwd(), 'src/assets/data/store-settings.json');
    
    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write the updated settings
    fs.writeFileSync(filePath, JSON.stringify(settings, null, 2));
    
    res.status(200).json({ success: true, message: 'Store settings updated successfully' });
  } catch (error) {
    console.error('Error updating store settings:', error);
    res.status(500).json({ error: 'Failed to update store settings' });
  }
}