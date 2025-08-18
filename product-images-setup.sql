-- Product Images Table Setup for Jolly E-commerce Platform
-- Run this in your Supabase SQL Editor

-- Create product_images table to store image metadata
CREATE TABLE IF NOT EXISTS product_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  is_primary BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies for product_images table
CREATE POLICY "Product images are viewable by everyone" 
  ON product_images FOR SELECT 
  USING (true);

CREATE POLICY "Product images are insertable by admins" 
  ON product_images FOR INSERT 
  WITH CHECK (is_admin());

CREATE POLICY "Product images are updatable by admins" 
  ON product_images FOR UPDATE 
  USING (is_admin());

CREATE POLICY "Product images are deletable by admins" 
  ON product_images FOR DELETE 
  USING (is_admin());

-- Create function to get all images for a product
CREATE OR REPLACE FUNCTION get_product_images(product_id UUID)
RETURNS TABLE (id UUID, public_url TEXT, is_primary BOOLEAN, display_order INTEGER) AS $$
BEGIN
  RETURN QUERY
  SELECT pi.id, pi.public_url, pi.is_primary, pi.display_order
  FROM product_images pi
  WHERE pi.product_id = $1
  ORDER BY pi.is_primary DESC, pi.display_order ASC;
END;
$$ LANGUAGE plpgsql;

-- Create function to set primary image for a product
CREATE OR REPLACE FUNCTION set_primary_image(image_id UUID, product_id UUID)
RETURNS VOID AS $$
BEGIN
  -- First, set all images for this product as non-primary
  UPDATE product_images
  SET is_primary = false
  WHERE product_id = $2;
  
  -- Then set the specified image as primary
  UPDATE product_images
  SET is_primary = true
  WHERE id = $1 AND product_id = $2;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update products.images array when product_images changes
CREATE OR REPLACE FUNCTION update_product_images_array()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the images array in the products table
  UPDATE products
  SET images = ARRAY(
    SELECT public_url
    FROM product_images
    WHERE product_id = NEW.product_id OR product_id = OLD.product_id
    ORDER BY is_primary DESC, display_order ASC
  )
  WHERE id = COALESCE(NEW.product_id, OLD.product_id);
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for insert, update, delete on product_images
CREATE TRIGGER product_images_insert_trigger
AFTER INSERT ON product_images
FOR EACH ROW
EXECUTE FUNCTION update_product_images_array();

CREATE TRIGGER product_images_update_trigger
AFTER UPDATE ON product_images
FOR EACH ROW
EXECUTE FUNCTION update_product_images_array();

CREATE TRIGGER product_images_delete_trigger
AFTER DELETE ON product_images
FOR EACH ROW
EXECUTE FUNCTION update_product_images_array();