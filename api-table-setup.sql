-- API Configuration Table Setup for Jolly E-commerce Platform
-- This table will store all API configurations and will be manageable by admins only
-- Run this in your Supabase SQL Editor

-- Create api_configurations table
CREATE TABLE IF NOT EXISTS api_configurations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Facebook Conversion API fields
  fb_api_version VARCHAR(10) DEFAULT '18.0',
  fb_pixel_id VARCHAR(255),
  fb_access_token TEXT,
  fb_enabled BOOLEAN DEFAULT FALSE,
  
  -- Google Tag Manager and Analytics fields
  gtm_container_id VARCHAR(255),
  ga_measurement_id VARCHAR(255),
  google_ads_conversion_id VARCHAR(255),
  google_ads_conversion_label VARCHAR(255),
  gtm_enabled BOOLEAN DEFAULT FALSE,
  
  -- Pathao Courier Service API fields
  pathao_client_id VARCHAR(255),
  pathao_client_secret TEXT,
  pathao_username VARCHAR(255),
  pathao_password TEXT,
  pathao_base_url VARCHAR(255) DEFAULT 'https://api-hermes.pathao.com',
  pathao_enabled BOOLEAN DEFAULT FALSE,
  
  -- RedX Courier Service API fields
  redx_api_token TEXT,
  redx_base_url VARCHAR(255) DEFAULT 'https://openapi.redx.com.bd/v1.0.0-beta',
  redx_enabled BOOLEAN DEFAULT FALSE,
  
  -- Steadfast Courier Service API fields
  stedfast_api_key TEXT,
  stedfast_secret_key TEXT,
  stedfast_base_url VARCHAR(255) DEFAULT 'https://portal.steadfast.com.bd/api/v1',
  stedfast_enabled BOOLEAN DEFAULT FALSE,
  
  -- SSLCOMMERZ Payment Gateway API fields
  sslcommerz_store_id VARCHAR(255),
  sslcommerz_store_password TEXT,
  sslcommerz_sandbox_mode BOOLEAN DEFAULT TRUE,
  sslcommerz_enabled BOOLEAN DEFAULT FALSE,
  
  -- bKash Payment Gateway API fields
  bkash_app_key VARCHAR(255),
  bkash_app_secret TEXT,
  bkash_username VARCHAR(255),
  bkash_password TEXT,
  bkash_sandbox_mode BOOLEAN DEFAULT TRUE,
  bkash_enabled BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE api_configurations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for api_configurations (Admin only access)
-- Only admins can view API configurations
CREATE POLICY "Only admins can view API configurations" 
  ON api_configurations FOR SELECT 
  USING (is_admin());

-- Only admins can insert API configurations
CREATE POLICY "Only admins can insert API configurations" 
  ON api_configurations FOR INSERT 
  WITH CHECK (is_admin());

-- Only admins can update API configurations
CREATE POLICY "Only admins can update API configurations" 
  ON api_configurations FOR UPDATE 
  USING (is_admin());

-- Only admins can delete API configurations
CREATE POLICY "Only admins can delete API configurations" 
  ON api_configurations FOR DELETE 
  USING (is_admin());

-- Create function to get current API configurations
CREATE OR REPLACE FUNCTION get_api_configurations()
RETURNS TABLE (
  id UUID,
  -- Facebook fields
  fb_api_version VARCHAR(10),
  fb_pixel_id VARCHAR(255),
  fb_access_token TEXT,
  fb_enabled BOOLEAN,
  -- Google fields
  gtm_container_id VARCHAR(255),
  ga_measurement_id VARCHAR(255),
  google_ads_conversion_id VARCHAR(255),
  google_ads_conversion_label VARCHAR(255),
  gtm_enabled BOOLEAN,
  -- Pathao fields
  pathao_client_id VARCHAR(255),
  pathao_client_secret TEXT,
  pathao_username VARCHAR(255),
  pathao_password TEXT,
  pathao_base_url VARCHAR(255),
  pathao_enabled BOOLEAN,
  -- RedX fields
  redx_api_token TEXT,
  redx_base_url VARCHAR(255),
  redx_enabled BOOLEAN,
  -- Steadfast fields
  stedfast_api_key TEXT,
  stedfast_secret_key TEXT,
  stedfast_base_url VARCHAR(255),
  stedfast_enabled BOOLEAN,
  -- SSLCOMMERZ fields
  sslcommerz_store_id VARCHAR(255),
  sslcommerz_store_password TEXT,
  sslcommerz_sandbox_mode BOOLEAN,
  sslcommerz_enabled BOOLEAN,
  -- bKash fields
  bkash_app_key VARCHAR(255),
  bkash_app_secret TEXT,
  bkash_username VARCHAR(255),
  bkash_password TEXT,
  bkash_sandbox_mode BOOLEAN,
  bkash_enabled BOOLEAN,
  -- Metadata
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    -- Facebook fields
    a.fb_api_version,
    a.fb_pixel_id,
    a.fb_access_token,
    a.fb_enabled,
    -- Google fields
    a.gtm_container_id,
    a.ga_measurement_id,
    a.google_ads_conversion_id,
    a.google_ads_conversion_label,
    a.gtm_enabled,
    -- Pathao fields
    a.pathao_client_id,
    a.pathao_client_secret,
    a.pathao_username,
    a.pathao_password,
    a.pathao_base_url,
    a.pathao_enabled,
    -- RedX fields
    a.redx_api_token,
    a.redx_base_url,
    a.redx_enabled,
    -- Steadfast fields
    a.stedfast_api_key,
    a.stedfast_secret_key,
    a.stedfast_base_url,
    a.stedfast_enabled,
    -- SSLCOMMERZ fields
    a.sslcommerz_store_id,
    a.sslcommerz_store_password,
    a.sslcommerz_sandbox_mode,
    a.sslcommerz_enabled,
    -- bKash fields
    a.bkash_app_key,
    a.bkash_app_secret,
    a.bkash_username,
    a.bkash_password,
    a.bkash_sandbox_mode,
    a.bkash_enabled,
    -- Metadata
    a.created_at,
    a.updated_at
  FROM api_configurations a
  WHERE a.is_active = true
  ORDER BY a.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users (RLS will handle admin check)
GRANT EXECUTE ON FUNCTION get_api_configurations() TO authenticated;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_api_configurations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_api_configurations_updated_at_trigger
  BEFORE UPDATE ON api_configurations
  FOR EACH ROW
  EXECUTE FUNCTION update_api_configurations_updated_at();

-- Add comments for documentation
COMMENT ON TABLE api_configurations IS 'API configurations for various services - admin access only';

-- Facebook comments
COMMENT ON COLUMN api_configurations.fb_api_version IS 'Facebook Conversion API version';
COMMENT ON COLUMN api_configurations.fb_pixel_id IS 'Facebook Pixel ID for conversion tracking';
COMMENT ON COLUMN api_configurations.fb_access_token IS 'Facebook Conversion API access token';
COMMENT ON COLUMN api_configurations.fb_enabled IS 'Enable Facebook Conversion API';

-- Google comments
COMMENT ON COLUMN api_configurations.gtm_container_id IS 'Google Tag Manager container ID';
COMMENT ON COLUMN api_configurations.ga_measurement_id IS 'Google Analytics measurement ID';
COMMENT ON COLUMN api_configurations.google_ads_conversion_id IS 'Google Ads conversion ID';
COMMENT ON COLUMN api_configurations.google_ads_conversion_label IS 'Google Ads conversion label';
COMMENT ON COLUMN api_configurations.gtm_enabled IS 'Enable Google Tag Manager integration';

-- Pathao comments
COMMENT ON COLUMN api_configurations.pathao_client_id IS 'Pathao API client ID';
COMMENT ON COLUMN api_configurations.pathao_client_secret IS 'Pathao API client secret';
COMMENT ON COLUMN api_configurations.pathao_username IS 'Pathao API username';
COMMENT ON COLUMN api_configurations.pathao_password IS 'Pathao API password';
COMMENT ON COLUMN api_configurations.pathao_base_url IS 'Pathao API base URL';
COMMENT ON COLUMN api_configurations.pathao_enabled IS 'Enable Pathao courier service';

-- RedX comments
COMMENT ON COLUMN api_configurations.redx_api_token IS 'RedX API token';
COMMENT ON COLUMN api_configurations.redx_base_url IS 'RedX API base URL';
COMMENT ON COLUMN api_configurations.redx_enabled IS 'Enable RedX courier service';

-- Steadfast comments
COMMENT ON COLUMN api_configurations.stedfast_api_key IS 'Steadfast API key';
COMMENT ON COLUMN api_configurations.stedfast_secret_key IS 'Steadfast API secret key';
COMMENT ON COLUMN api_configurations.stedfast_base_url IS 'Steadfast API base URL';
COMMENT ON COLUMN api_configurations.stedfast_enabled IS 'Enable Steadfast courier service';

-- SSLCOMMERZ comments
COMMENT ON COLUMN api_configurations.sslcommerz_store_id IS 'SSLCOMMERZ store ID';
COMMENT ON COLUMN api_configurations.sslcommerz_store_password IS 'SSLCOMMERZ store password';
COMMENT ON COLUMN api_configurations.sslcommerz_sandbox_mode IS 'SSLCOMMERZ sandbox mode flag';
COMMENT ON COLUMN api_configurations.sslcommerz_enabled IS 'Enable SSLCOMMERZ payment gateway';

-- bKash comments
COMMENT ON COLUMN api_configurations.bkash_app_key IS 'bKash application key';
COMMENT ON COLUMN api_configurations.bkash_app_secret IS 'bKash application secret';
COMMENT ON COLUMN api_configurations.bkash_username IS 'bKash API username';
COMMENT ON COLUMN api_configurations.bkash_password IS 'bKash API password';
COMMENT ON COLUMN api_configurations.bkash_sandbox_mode IS 'bKash sandbox mode flag';
COMMENT ON COLUMN api_configurations.bkash_enabled IS 'Enable bKash payment gateway';

-- Insert default configuration row
INSERT INTO api_configurations (fb_api_version) VALUES ('18.0')
ON CONFLICT DO NOTHING;