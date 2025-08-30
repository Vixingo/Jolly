-- Migration to add comprehensive API fields to store_settings table
-- This includes Facebook Conversion API, Courier Services, Payment Gateways, and Google Tag Manager

-- Add Facebook Conversion API fields
ALTER TABLE store_settings 
ADD COLUMN IF NOT EXISTS fb_api_version VARCHAR(10) DEFAULT '18.0',
ADD COLUMN IF NOT EXISTS fb_pixel_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS fb_access_token TEXT;

-- Add Courier Service API fields
-- Pathao API fields
ALTER TABLE store_settings 
ADD COLUMN IF NOT EXISTS pathao_client_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS pathao_client_secret TEXT,
ADD COLUMN IF NOT EXISTS pathao_username VARCHAR(255),
ADD COLUMN IF NOT EXISTS pathao_password TEXT,
ADD COLUMN IF NOT EXISTS pathao_base_url VARCHAR(255) DEFAULT 'https://api-hermes.pathao.com',
ADD COLUMN IF NOT EXISTS pathao_enabled BOOLEAN DEFAULT FALSE;

-- Stedfast API fields
ALTER TABLE store_settings 
ADD COLUMN IF NOT EXISTS stedfast_api_key TEXT,
ADD COLUMN IF NOT EXISTS stedfast_secret_key TEXT,
ADD COLUMN IF NOT EXISTS stedfast_base_url VARCHAR(255) DEFAULT 'https://portal.steadfast.com.bd/api/v1',
ADD COLUMN IF NOT EXISTS stedfast_enabled BOOLEAN DEFAULT FALSE;

-- RedX API fields
ALTER TABLE store_settings 
ADD COLUMN IF NOT EXISTS redx_api_token TEXT,
ADD COLUMN IF NOT EXISTS redx_base_url VARCHAR(255) DEFAULT 'https://openapi.redx.com.bd/v1.0.0-beta',
ADD COLUMN IF NOT EXISTS redx_enabled BOOLEAN DEFAULT FALSE;

-- Add Payment Gateway API fields
-- SSLCOMMERZ API fields
ALTER TABLE store_settings 
ADD COLUMN IF NOT EXISTS sslcommerz_store_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS sslcommerz_store_password TEXT,
ADD COLUMN IF NOT EXISTS sslcommerz_sandbox_mode BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS sslcommerz_enabled BOOLEAN DEFAULT FALSE;

-- BKASH API fields
ALTER TABLE store_settings 
ADD COLUMN IF NOT EXISTS bkash_app_key VARCHAR(255),
ADD COLUMN IF NOT EXISTS bkash_app_secret TEXT,
ADD COLUMN IF NOT EXISTS bkash_username VARCHAR(255),
ADD COLUMN IF NOT EXISTS bkash_password TEXT,
ADD COLUMN IF NOT EXISTS bkash_sandbox_mode BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS bkash_enabled BOOLEAN DEFAULT FALSE;

-- Add Google Tag Manager fields
ALTER TABLE store_settings 
ADD COLUMN IF NOT EXISTS gtm_container_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS ga_measurement_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS google_ads_conversion_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS google_ads_conversion_label VARCHAR(255),
ADD COLUMN IF NOT EXISTS gtm_enabled BOOLEAN DEFAULT FALSE;

-- Update the get_store_settings function to include all new fields
CREATE OR REPLACE FUNCTION get_store_settings()
RETURNS TABLE (
  id UUID,
  store_name VARCHAR(255),
  store_description TEXT,
  store_logo_url TEXT,
  store_email VARCHAR(255),
  store_phone VARCHAR(50),
  store_whatsapp VARCHAR(50),
  store_address TEXT,
  currency VARCHAR(10),
  facebook_url VARCHAR(255),
  instagram_url VARCHAR(255),
  twitter_url VARCHAR(255),
  linkedin_url VARCHAR(255),
  youtube_url VARCHAR(255),
  tiktok_url VARCHAR(255),
  privacy_policy TEXT,
  terms_of_service TEXT,
  return_policy TEXT,
  shipping_policy TEXT,
  theme_primary_color VARCHAR(7),
  theme_secondary_color VARCHAR(7),
  theme_accent_color VARCHAR(7),
  -- Facebook Conversion API fields
  fb_api_version VARCHAR(10),
  fb_pixel_id VARCHAR(255),
  fb_access_token TEXT,
  -- Courier Service fields
  pathao_client_id VARCHAR(255),
  pathao_client_secret TEXT,
  pathao_username VARCHAR(255),
  pathao_password TEXT,
  pathao_base_url VARCHAR(255),
  pathao_enabled BOOLEAN,
  stedfast_api_key TEXT,
  stedfast_secret_key TEXT,
  stedfast_base_url VARCHAR(255),
  stedfast_enabled BOOLEAN,
  redx_api_token TEXT,
  redx_base_url VARCHAR(255),
  redx_enabled BOOLEAN,
  -- Payment Gateway fields
  sslcommerz_store_id VARCHAR(255),
  sslcommerz_store_password TEXT,
  sslcommerz_sandbox_mode BOOLEAN,
  sslcommerz_enabled BOOLEAN,
  bkash_app_key VARCHAR(255),
  bkash_app_secret TEXT,
  bkash_username VARCHAR(255),
  bkash_password TEXT,
  bkash_sandbox_mode BOOLEAN,
  bkash_enabled BOOLEAN,
  -- Google Tag Manager fields
  gtm_container_id VARCHAR(255),
  ga_measurement_id VARCHAR(255),
  google_ads_conversion_id VARCHAR(255),
  google_ads_conversion_label VARCHAR(255),
  gtm_enabled BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.store_name,
    s.store_description,
    s.store_logo_url,
    s.store_email,
    s.store_phone,
    s.store_whatsapp,
    s.store_address,
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
    -- Facebook Conversion API fields
    s.fb_api_version,
    s.fb_pixel_id,
    s.fb_access_token,
    -- Courier Service fields
    s.pathao_client_id,
    s.pathao_client_secret,
    s.pathao_username,
    s.pathao_password,
    s.pathao_base_url,
    s.pathao_enabled,
    s.stedfast_api_key,
    s.stedfast_secret_key,
    s.stedfast_base_url,
    s.stedfast_enabled,
    s.redx_api_token,
    s.redx_base_url,
    s.redx_enabled,
    -- Payment Gateway fields
    s.sslcommerz_store_id,
    s.sslcommerz_store_password,
    s.sslcommerz_sandbox_mode,
    s.sslcommerz_enabled,
    s.bkash_app_key,
    s.bkash_app_secret,
    s.bkash_username,
    s.bkash_password,
    s.bkash_sandbox_mode,
    s.bkash_enabled,
    -- Google Tag Manager fields
    s.gtm_container_id,
    s.ga_measurement_id,
    s.google_ads_conversion_id,
    s.google_ads_conversion_label,
    s.gtm_enabled,
    s.created_at,
    s.updated_at
  FROM store_settings s
  ORDER BY s.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_store_settings() TO authenticated;

-- Comment on the new columns for documentation
COMMENT ON COLUMN store_settings.fb_api_version IS 'Facebook Conversion API version';
COMMENT ON COLUMN store_settings.fb_pixel_id IS 'Facebook Pixel ID for conversion tracking';
COMMENT ON COLUMN store_settings.fb_access_token IS 'Facebook Conversion API access token';

COMMENT ON COLUMN store_settings.pathao_client_id IS 'Pathao API client ID';
COMMENT ON COLUMN store_settings.pathao_client_secret IS 'Pathao API client secret';
COMMENT ON COLUMN store_settings.pathao_username IS 'Pathao API username';
COMMENT ON COLUMN store_settings.pathao_password IS 'Pathao API password';
COMMENT ON COLUMN store_settings.pathao_base_url IS 'Pathao API base URL';
COMMENT ON COLUMN store_settings.pathao_enabled IS 'Enable Pathao courier service';

COMMENT ON COLUMN store_settings.stedfast_api_key IS 'Stedfast API key';
COMMENT ON COLUMN store_settings.stedfast_secret_key IS 'Stedfast API secret key';
COMMENT ON COLUMN store_settings.stedfast_base_url IS 'Stedfast API base URL';
COMMENT ON COLUMN store_settings.stedfast_enabled IS 'Enable Stedfast courier service';

COMMENT ON COLUMN store_settings.redx_api_token IS 'RedX API token';
COMMENT ON COLUMN store_settings.redx_base_url IS 'RedX API base URL';
COMMENT ON COLUMN store_settings.redx_enabled IS 'Enable RedX courier service';

COMMENT ON COLUMN store_settings.sslcommerz_store_id IS 'SSLCOMMERZ store ID';
COMMENT ON COLUMN store_settings.sslcommerz_store_password IS 'SSLCOMMERZ store password';
COMMENT ON COLUMN store_settings.sslcommerz_sandbox_mode IS 'SSLCOMMERZ sandbox mode flag';
COMMENT ON COLUMN store_settings.sslcommerz_enabled IS 'Enable SSLCOMMERZ payment gateway';

COMMENT ON COLUMN store_settings.bkash_app_key IS 'bKash application key';
COMMENT ON COLUMN store_settings.bkash_app_secret IS 'bKash application secret';
COMMENT ON COLUMN store_settings.bkash_username IS 'bKash API username';
COMMENT ON COLUMN store_settings.bkash_password IS 'bKash API password';
COMMENT ON COLUMN store_settings.bkash_sandbox_mode IS 'bKash sandbox mode flag';
COMMENT ON COLUMN store_settings.bkash_enabled IS 'Enable bKash payment gateway';

COMMENT ON COLUMN store_settings.gtm_container_id IS 'Google Tag Manager container ID';
COMMENT ON COLUMN store_settings.ga_measurement_id IS 'Google Analytics measurement ID';
COMMENT ON COLUMN store_settings.google_ads_conversion_id IS 'Google Ads conversion ID';
COMMENT ON COLUMN store_settings.google_ads_conversion_label IS 'Google Ads conversion label';
COMMENT ON COLUMN store_settings.gtm_enabled IS 'Enable Google Tag Manager integration';