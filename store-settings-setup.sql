-- Store Settings Table Setup for Jolly E-commerce Platform
-- Run this in your Supabase SQL Editor

-- Create store_settings table
CREATE TABLE IF NOT EXISTS store_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_name TEXT NOT NULL DEFAULT 'My Store',
  store_description TEXT,
  store_email TEXT,
  store_phone TEXT,
  store_whatsapp TEXT,
  store_address TEXT,
  logo_url TEXT,
  logo_storage_path TEXT,
  favicon_url TEXT,
  favicon_storage_path TEXT,
  currency TEXT DEFAULT 'USD' CHECK (currency IN ('USD', 'EUR', 'GBP', 'JPY', 'BDT', 'INR', 'CAD', 'AUD')),
  
  -- Social media links
  facebook_url TEXT,
  instagram_url TEXT,
  twitter_url TEXT,
  linkedin_url TEXT,
  youtube_url TEXT,
  tiktok_url TEXT,
  
  -- Store policies
  privacy_policy TEXT,
  terms_of_service TEXT,
  return_policy TEXT,
  shipping_policy TEXT,
  
  -- Store status and metadata
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for store_settings
-- Everyone can view general and theme store settings (for storefront display)
CREATE POLICY "General and theme settings are viewable by everyone" 
  ON store_settings FOR SELECT 
  USING (true);

-- Create a view for public settings (general and theme only)
CREATE OR REPLACE VIEW public_store_settings AS
SELECT 
  id, store_name, store_description, logo_url, favicon_url,
  theme_primary_color, theme_secondary_color, theme_accent_color
FROM store_settings
WHERE is_active = true
ORDER BY created_at DESC
LIMIT 1;

-- Create function to get public store settings
CREATE OR REPLACE FUNCTION get_public_store_settings()
RETURNS TABLE (
  id UUID,
  store_name TEXT,
  store_description TEXT,
  logo_url TEXT,
  favicon_url TEXT,
  theme_primary_color TEXT,
  theme_secondary_color TEXT,
  theme_accent_color TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM public_store_settings;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Only admins can modify store settings
CREATE POLICY "Only admins can insert store settings" 
  ON store_settings FOR INSERT 
  WITH CHECK (is_admin());

CREATE POLICY "Only admins can update store settings" 
  ON store_settings FOR UPDATE 
  USING (is_admin());

CREATE POLICY "Only admins can delete store settings" 
  ON store_settings FOR DELETE 
  USING (is_admin());

-- Create function to get current store settings
CREATE OR REPLACE FUNCTION get_store_settings()
RETURNS TABLE (
  id UUID,
  store_name TEXT,
  store_description TEXT,
  store_email TEXT,
  store_phone TEXT,
  store_whatsapp TEXT,
  store_address TEXT,
  logo_url TEXT,
  favicon_url TEXT,
  currency TEXT,
  facebook_url TEXT,
  instagram_url TEXT,
  twitter_url TEXT,
  linkedin_url TEXT,
  youtube_url TEXT,
  tiktok_url TEXT,
  privacy_policy TEXT,
  terms_of_service TEXT,
  return_policy TEXT,
  shipping_policy TEXT,
  theme_primary_color TEXT,
  theme_secondary_color TEXT,
  theme_accent_color TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id, s.store_name, s.store_description, s.store_email, s.store_phone,
    s.store_whatsapp, s.store_address, s.logo_url, s.favicon_url, s.currency,
    s.facebook_url, s.instagram_url, s.twitter_url, s.linkedin_url,
    s.youtube_url, s.tiktok_url, s.privacy_policy, s.terms_of_service,
    s.return_policy, s.shipping_policy, s.theme_primary_color,
    s.theme_secondary_color, s.theme_accent_color
  FROM store_settings s
  WHERE s.is_active = true
  ORDER BY s.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_store_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_store_settings_updated_at ON store_settings;
CREATE TRIGGER update_store_settings_updated_at
    BEFORE UPDATE ON store_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_store_settings_updated_at();

-- Insert default store settings if none exist
INSERT INTO store_settings (
  store_name, 
  store_description, 
  store_email, 
  currency
) 
SELECT 
  'Jolly Store',
  'Your one-stop shop for amazing products',
  'contact@jollystore.com',
  'USD'
WHERE NOT EXISTS (SELECT 1 FROM store_settings WHERE is_active = true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_store_settings_active ON store_settings(is_active);
CREATE INDEX IF NOT EXISTS idx_store_settings_created_at ON store_settings(created_at DESC);

COMMIT;