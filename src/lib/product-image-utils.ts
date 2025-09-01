import { supabase } from "./supabase";
import { uploadFile, deleteFile } from "./storage-utils";

/**
 * Uploads product images to Supabase Storage and creates records in the product_images table
 * @param productId The ID of the product to associate images with
 * @param files Array of files to upload
 * @returns Array of public URLs for the uploaded images
 *
 * Note: This function requires the storage-bucket-setup.sql script to be run in your Supabase SQL Editor
 * to set up the necessary RLS policies and create the product-images bucket.
 */
export async function uploadProductImages(
    productId: string,
    files: File[]
): Promise<string[]> {
    if (!files.length) return [];

    const bucketName = "product-images";
    const uploadedUrls: string[] = [];

    try {
        // Check if the bucket exists first
        const { data: buckets, error: listError } =
            await supabase.storage.listBuckets();

        if (listError) {
            console.error("Error listing buckets:", listError);
            console.warn(
                "Make sure you have run the storage-bucket-setup.sql script in your Supabase SQL Editor"
            );
            return [];
        }

        const bucketExists = buckets?.some(
            (bucket) => bucket.name === bucketName
        );

        if (!bucketExists) {
            console.error(
                `Bucket '${bucketName}' does not exist. Please run the storage-bucket-setup.sql script in your Supabase SQL Editor.`
            );
            return [];
        }

        for (const [index, file] of Array.from(files).entries()) {
            // Create a unique file name to avoid collisions
            const fileExt = file.name.split(".").pop();
            const fileName = `${Math.random()
                .toString(36)
                .substring(2, 15)}_${Date.now()}.${fileExt}`;
            const filePath = `products/${fileName}`;

            // Upload the file to Supabase Storage
            const publicUrl = await uploadFile(bucketName, filePath, file);

            if (!publicUrl) {
                console.error(
                    `Failed to upload file ${file.name} to bucket ${bucketName}`
                );
                continue;
            }

            // Insert record into product_images table
            const { error: insertError } = await supabase
                .from("product_images")
                .insert({
                    product_id: productId,
                    storage_path: filePath,
                    public_url: publicUrl,
                    file_name: fileName,
                    file_size: file.size,
                    mime_type: file.type,
                    is_primary: index === 0, // First image is primary by default
                    display_order: index,
                });

            if (insertError) {
                console.error(
                    "Error inserting product image record:",
                    insertError
                );
                console.warn(
                    "Make sure you have run the product-images-setup.sql script in your Supabase SQL Editor"
                );
                // If database insert fails, try to delete the uploaded file
                await deleteFile(bucketName, filePath);
                continue;
            }

            uploadedUrls.push(publicUrl);
        }

        return uploadedUrls;
    } catch (error) {
        console.error("Error uploading product images:", error);
        console.warn(
            "Please run both storage-bucket-setup.sql and product-images-setup.sql scripts in your Supabase SQL Editor"
        );
        return [];
    }
}

/**
 * Deletes product images from Supabase Storage and removes records from the product_images table
 * @param productId The ID of the product whose images should be deleted
 * @returns Boolean indicating success or failure
 */
export async function deleteProductImages(productId: string): Promise<boolean> {
    try {
        // Get all image records for this product
        const { data: images, error: fetchError } = await supabase
            .from("product_images")
            .select("id, storage_path, public_url")
            .eq("product_id", productId);

        if (fetchError) {
            console.error("Error fetching product images:", fetchError);
            return false;
        }

        if (!images || images.length === 0) return true;

        const bucketName = "product-images";

        // Delete each image from storage
        for (const image of images) {
            await deleteFile(bucketName, image.storage_path);
        }

        // Delete all image records for this product
        const { error: deleteError } = await supabase
            .from("product_images")
            .delete()
            .eq("product_id", productId);

        if (deleteError) {
            console.error("Error deleting product image records:", deleteError);
            return false;
        }

        return true;
    } catch (error) {
        console.error("Error deleting product images:", error);
        return false;
    }
}

/**
 * Sets an image as the primary image for a product
 * @param imageId The ID of the image to set as primary
 * @param productId The ID of the product
 * @returns Boolean indicating success or failure
 */
export async function setPrimaryProductImage(
    imageId: string,
    productId: string
): Promise<boolean> {
    try {
        const { error } = await supabase.rpc("set_primary_image", {
            image_id: imageId,
            product_id: productId,
        });

        if (error) {
            console.error("Error setting primary image:", error);
            return false;
        }

        return true;
    } catch (error) {
        console.error("Error setting primary image:", error);
        return false;
    }
}

/**
 * Gets all images for a product
 * @param productId The ID of the product
 * @returns Array of image objects with id, url, isPrimary, and displayOrder
 */
export async function getProductImages(productId: string) {
    try {
        const { data, error } = await supabase.rpc("get_product_images", {
            product_id: productId,
        });

        if (error) {
            console.error("Error getting product images:", error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error("Error getting product images:", error);
        return [];
    }
}
