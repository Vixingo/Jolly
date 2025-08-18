# Supabase Storage Setup for Jolly E-commerce

This guide explains how to set up the necessary storage buckets and permissions in your Supabase project for the Jolly E-commerce platform.

## Prerequisites

- A Supabase project with the database already set up using `database-setup.sql`
- Admin access to your Supabase project

## Setup Instructions

### 1. Run the Storage Bucket Setup SQL

1. Log in to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy the entire contents of `storage-bucket-setup.sql`
4. Paste it into a new SQL query
5. Execute the query

This script will:
- Create the necessary Row Level Security (RLS) policies for storage buckets and objects
- Create the `product-images` and `user-uploads` buckets with public access

### 2. Run the Product Images Table Setup SQL

1. In the SQL Editor, create a new query
2. Copy the entire contents of `product-images-setup.sql`
3. Paste it into the query
4. Execute the query

This script will:
- Create the `product_images` table to store image metadata
- Set up RLS policies for the table
- Create functions and triggers to manage product images

## Troubleshooting

If you encounter errors related to storage buckets or image uploads, check the following:

1. **RLS Policy Errors**: Make sure you've run both SQL scripts in your Supabase SQL Editor

2. **Permission Errors**: Ensure your user has the 'admin' role in the `users` table

3. **Bucket Creation Errors**: If you see errors like "Bucket could not be created or accessed" or "new row violates row-level security policy", it means the RLS policies are not properly set up. Run the `storage-bucket-setup.sql` script.

4. **Image Upload Errors**: If images upload to storage but don't appear in the product, make sure you've run the `product-images-setup.sql` script to create the necessary tables and triggers.

## Storage Structure

The application uses two main storage buckets:

1. **product-images**: Stores all product images
   - Path format: `products/{random_id}_{timestamp}.{extension}`

2. **user-uploads**: Stores user-uploaded files
   - Path format: `{user_id}/{random_id}_{timestamp}.{extension}`

Both buckets are set to public access to allow direct URL access to the files.