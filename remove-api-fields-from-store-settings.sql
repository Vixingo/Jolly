-- Migration to remove API-related fields from store_settings table
-- This should be run after creating the api_configurations table and migrating data
-- Run this in your Supabase SQL Editor

-- Remove Facebook Conversion API fields
ALTER TABLE store_settings 
DROP COLUMN IF EXISTS fb_api_version,
DROP COLUMN IF EXISTS fb_pixel_id,
DROP COLUMN IF EXISTS fb_access_token;

-- Remove Courier Service API fields
-- Pathao API fields
ALTER TABLE store_settings 
DROP COLUMN IF EXISTS pathao_client_id,
DROP COLUMN IF EXISTS pathao_client_secret,
DROP COLUMN IF EXISTS pathao_username,
DROP COLUMN IF EXISTS pathao_password,
DROP COLUMN IF EXISTS pathao_base_url,
DROP COLUMN IF EXISTS pathao_enabled;

-- Steadfast API fields
ALTER TABLE store_settings 
DROP COLUMN IF EXISTS stedfast_api_key,
DROP COLUMN IF EXISTS stedfast_secret_key,
DROP COLUMN IF EXISTS stedfast_base_url,
DROP COLUMN IF EXISTS stedfast_enabled;

-- RedX API fields
ALTER TABLE store_settings 
DROP COLUMN IF EXISTS redx_api_token,
DROP COLUMN IF EXISTS redx_base_url,
DROP COLUMN IF EXISTS redx_enabled;

-- Remove Payment Gateway API fields
-- SSLCOMMERZ API fields
ALTER TABLE store_settings 
DROP COLUMN IF EXISTS sslcommerz_store_id,
DROP COLUMN IF EXISTS sslcommerz_store_password,
DROP COLUMN IF EXISTS sslcommerz_sandbox_mode,
DROP COLUMN IF EXISTS sslcommerz_enabled;

-- bKash API fields
ALTER TABLE store_settings 
DROP COLUMN IF EXISTS bkash_app_key,
DROP COLUMN IF EXISTS bkash_app_secret,
DROP COLUMN IF EXISTS bkash_username,
DROP COLUMN IF EXISTS bkash_password,
DROP COLUMN IF EXISTS bkash_sandbox_mode,
DROP COLUMN IF EXISTS bkash_enabled;

-- Remove Google Tag Manager fields
ALTER TABLE store_settings 
DROP COLUMN IF EXISTS gtm_container_id,
DROP COLUMN IF EXISTS ga_measurement_id,
DROP COLUMN IF EXISTS google_ads_conversion_id,
DROP COLUMN IF EXISTS google_ads_conversion_label,
DROP COLUMN IF EXISTS gtm_enabled;

-- Update the get_store_settings function to exclude API fields
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
  theme_accent_color TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.store_name,
    s.store_description,
    s.store_email,
    s.store_phone,
    s.store_whatsapp,
    s.store_address,
    s.logo_url,
    s.favicon_url,
    s.currency,
    s.facebook_url,
    s.instagram_url,
    s.twitter_url,
    s.linkedin_url,
    s.youtube_url,
    s.tiktok_url,
    s.privacy_policy,
    s.terms_of_service,
    s.return_policy,
    s.shipping_policy,
    s.theme_primary_color,
    s.theme_secondary_color,
    s.theme_accent_color,
    s.created_at,
    s.updated_at
  FROM store_settings s
  WHERE s.is_active = true
  ORDER BY s.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the public store settings view to exclude API fields
CREATE OR REPLACE VIEW public_store_settings AS
SELECT 
  id,
  store_name,
  store_description,
  logo_url,
  favicon_url,
  currency,
  facebook_url,
  instagram_url,
  twitter_url,
  linkedin_url,
  youtube_url,
  tiktok_url,
  theme_primary_color,
  theme_secondary_color,
  theme_accent_color
FROM store_settings
WHERE is_active = true
ORDER BY created_at DESC
LIMIT 1;

-- Update the get_public_store_settings function
CREATE OR REPLACE FUNCTION get_public_store_settings()
RETURNS TABLE (
  id UUID,
  store_name TEXT,
  store_description TEXT,
  logo_url TEXT,
  favicon_url TEXT,
  currency TEXT,
  facebook_url TEXT,
  instagram_url TEXT,
  twitter_url TEXT,
  linkedin_url TEXT,
  youtube_url TEXT,
  tiktok_url TEXT,
  theme_primary_color TEXT,
  theme_secondary_color TEXT,
  theme_accent_color TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM public_store_settings;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_store_settings() TO authenticated;
GRANT EXECUTE ON FUNCTION get_public_store_settings() TO authenticated;

-- Note: Before running this migration, make sure to:
-- 1. Create the api_configurations table using api-table-setup.sql
-- 2. Migrate existing API data from store_settings to api_configurations if needed
-- 3. Update your application code to use the new api_configurations table