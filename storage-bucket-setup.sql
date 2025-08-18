-- Storage Bucket Setup for Jolly E-commerce Platform
-- Run this in your Supabase SQL Editor

-- Enable storage by creating the extension if it doesn't exist
CREATE EXTENSION IF NOT EXISTS "pg_net";

-- Create storage schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS storage;

-- Remove all existing policies for storage.buckets to avoid conflicts
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'buckets' AND schemaname = 'storage') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON storage.buckets';
    END LOOP;
END $$;

-- Remove all existing policies for storage.objects to avoid conflicts
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON storage.objects';
    END LOOP;
END $$;

-- Create policies for storage.buckets

-- Allow admins to create buckets
CREATE POLICY "Admins can create buckets" 
  ON storage.buckets FOR INSERT 
  WITH CHECK (is_admin());

-- Allow admins to update buckets
CREATE POLICY "Admins can update buckets" 
  ON storage.buckets FOR UPDATE 
  USING (is_admin());

-- Allow admins to delete buckets
CREATE POLICY "Admins can delete buckets" 
  ON storage.buckets FOR DELETE 
  USING (is_admin());

-- Allow everyone to view buckets
CREATE POLICY "Buckets are viewable by everyone" 
  ON storage.buckets FOR SELECT 
  USING (true);

-- Create policies for storage.objects

-- Allow admins to insert objects into any bucket
CREATE POLICY "Admins can upload to any bucket" 
  ON storage.objects FOR INSERT 
  WITH CHECK (is_admin());

-- Allow admins to update objects in any bucket
CREATE POLICY "Admins can update objects in any bucket" 
  ON storage.objects FOR UPDATE 
  USING (is_admin());

-- Allow admins to delete objects in any bucket
CREATE POLICY "Admins can delete objects in any bucket" 
  ON storage.objects FOR DELETE 
  USING (is_admin());

-- Allow everyone to view objects in public buckets
CREATE POLICY "Public objects are viewable by everyone" 
  ON storage.objects FOR SELECT 
  USING (bucket_id IN ('product-images', 'user-uploads'));

-- Create product-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create user-uploads bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-uploads', 'user-uploads', true)
ON CONFLICT (id) DO NOTHING;

COMMIT;