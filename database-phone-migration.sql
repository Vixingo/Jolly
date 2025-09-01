-- Migration script to add phone number field to orders table
-- Run this in your Supabase SQL Editor

-- Add phone number field to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS customer_phone TEXT;

-- Add email field to orders table for invoice functionality
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS customer_email TEXT;

-- Add payment method field to track payment type
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'cod';

-- Add invoice requested field for online payments
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS invoice_requested BOOLEAN DEFAULT false;

-- Add invoice email field for when invoice is requested
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS invoice_email TEXT;

-- Create index for better performance on phone number queries
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_payment_method ON orders(payment_method);

-- Update existing orders to have default values
UPDATE orders 
SET payment_method = 'cod' 
WHERE payment_method IS NULL;

UPDATE orders 
SET invoice_requested = false 
WHERE invoice_requested IS NULL;

-- Verify the updated schema
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'orders'
ORDER BY ordinal_position;