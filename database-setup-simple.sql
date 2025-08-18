-- Jolly E-commerce Platform - Simple Database Setup
-- Run this in your Supabase SQL Editor if the main script has policy conflicts

-- Step 1: Drop existing tables (WARNING: This will delete all data!)
-- Only run this if you're setting up a fresh database or want to start over

-- DROP TABLE IF EXISTS pixel_tracking CASCADE;
-- DROP TABLE IF EXISTS orders CASCADE;
-- DROP TABLE IF EXISTS products CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

-- Step 2: Create tables (uncomment the DROP statements above if you want a fresh start)

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'customer' CHECK (role IN ('admin', 'user', 'customer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  images TEXT[] DEFAULT '{}',
  category TEXT NOT NULL,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  total DECIMAL(10,2) NOT NULL,
  items JSONB NOT NULL,
  shipping_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pixel_tracking table
CREATE TABLE IF NOT EXISTS pixel_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('google_analytics', 'facebook_pixel', 'custom')),
  code TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE pixel_tracking ENABLE ROW LEVEL SECURITY;

-- Step 4: Create basic RLS policies (minimal set to get started)

-- Users table - basic policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Products table - basic policies
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);

-- Orders table - basic policies
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);

-- Step 5: Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

-- Step 6: Create your admin user (replace with your actual email)
-- IMPORTANT: You must sign up first through the regular signup process!
-- Then uncomment and run this:

-- INSERT INTO users (id, email, full_name, role) 
-- VALUES (
--   (SELECT id FROM auth.users WHERE email = 'your-email@example.com'),
--   'your-email@example.com',
--   'Your Name',
--   'admin'
-- );

-- Step 7: Add admin policies AFTER creating your admin user
-- Run this AFTER you've created your admin user above:

-- Create a security definer function to check admin status
-- CREATE OR REPLACE FUNCTION is_admin()
-- RETURNS BOOLEAN AS $$
-- DECLARE
--     is_admin BOOLEAN;
-- BEGIN
--     SELECT (role = 'admin') INTO is_admin FROM users WHERE id = auth.uid();
--     RETURN COALESCE(is_admin, false);
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;

-- CREATE POLICY "Admins can view all users" ON users FOR SELECT USING (is_admin());
-- CREATE POLICY "Admins can insert users" ON users FOR INSERT WITH CHECK (is_admin());
-- CREATE POLICY "Admins can update users" ON users FOR UPDATE USING (is_admin());
-- CREATE POLICY "Admins can delete users" ON users FOR DELETE USING (is_admin());

-- CREATE POLICY "Only admins can modify products" ON products FOR ALL USING (is_admin());

-- CREATE POLICY "Only admins can modify orders" ON orders FOR ALL USING (is_admin());

-- CREATE POLICY "Only admins can manage pixel tracking" ON pixel_tracking FOR ALL USING (is_admin());

-- Note: This script creates a minimal working setup.
-- Run the admin policies (Step 7) only after you've created your admin user.
