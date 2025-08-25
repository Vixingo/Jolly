-- Theme Color Migration for Store Settings
-- Add theme color fields to store_settings table
-- Run this in your Supabase SQL Editor

-- Add theme color columns to store_settings table
ALTER TABLE store_settings 
ADD COLUMN IF NOT EXISTS theme_primary_color TEXT DEFAULT '#3b82f6',
ADD COLUMN IF NOT EXISTS theme_secondary_color TEXT DEFAULT '#64748b',
ADD COLUMN IF NOT EXISTS theme_accent_color TEXT DEFAULT '#f59e0b';

-- Add comment to describe the new columns
COMMENT ON COLUMN store_settings.theme_primary_color IS 'Primary theme color in hex format (e.g., #3b82f6)';
COMMENT ON COLUMN store_settings.theme_secondary_color IS 'Secondary theme color in hex format (e.g., #64748b)';
COMMENT ON COLUMN store_settings.theme_accent_color IS 'Accent theme color in hex format (e.g., #f59e0b)';

-- Update the get_store_settings function to include theme colors
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
    s.store_whatsapp, s.store_address, s.logo_url, s.currency,
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

-- Update existing store settings with default theme colors if they don't have them
UPDATE store_settings 
SET 
  theme_primary_color = COALESCE(theme_primary_color, '#3b82f6'),
  theme_secondary_color = COALESCE(theme_secondary_color, '#64748b'),
  theme_accent_color = COALESCE(theme_accent_color, '#f59e0b')
WHERE is_active = true;

COMMIT;