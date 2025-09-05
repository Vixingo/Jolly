import { supabase } from "./supabase";

interface FacebookSettings {
    fb_pixel_id?: string;
    fb_access_token?: string;
    fb_api_version?: string;
}

/**
 * Checks if Facebook settings are properly configured in the database
 * @returns A promise that resolves to an object containing the status of Facebook settings
 */
export async function checkFacebookSettings(): Promise<{
    isConfigured: boolean;
    settings: FacebookSettings | null;
    error: string | null;
}> {
    try {
        // Get store settings from database
        const { data, error } = await supabase.rpc("get_api_configurations");

        if (error) {
            console.error("Error fetching store settings:", error);
            return {
                isConfigured: false,
                settings: null,
                error: `Database error: ${error.message}`,
            };
        }

        if (!data || data.length === 0) {
            return {
                isConfigured: false,
                settings: null,
                error: "No store settings found in database",
            };
        }

        const storeSettings = data[0];
        const fbSettings: FacebookSettings = {
            fb_pixel_id: storeSettings.fb_pixel_id,
            fb_access_token: storeSettings.fb_access_token,
            fb_api_version: storeSettings.fb_api_version,
        };

        // Check if required Facebook settings are configured
        const isConfigured =
            !!fbSettings.fb_pixel_id && !!fbSettings.fb_access_token;

        return {
            isConfigured,
            settings: fbSettings,
            error: isConfigured
                ? null
                : "Facebook Pixel ID or Access Token not configured",
        };
    } catch (err) {
        console.error("Error checking Facebook settings:", err);
        return {
            isConfigured: false,
            settings: null,
            error: err instanceof Error ? err.message : "Unknown error",
        };
    }
}

/**
 * Validates Facebook Pixel ID format
 * @param pixelId The Facebook Pixel ID to validate
 * @returns True if the Pixel ID format is valid, false otherwise
 */
export function isValidPixelId(pixelId: string | undefined): boolean {
    if (!pixelId) return false;

    // Facebook Pixel IDs are typically numeric and 15-16 digits long
    return /^\d{15,16}$/.test(pixelId);
}

/**
 * Validates Facebook Access Token format
 * @param accessToken The Facebook Access Token to validate
 * @returns True if the Access Token format appears valid, false otherwise
 */
export function isValidAccessToken(accessToken: string | undefined): boolean {
    if (!accessToken) return false;

    // Facebook access tokens are typically long strings with alphanumeric characters
    // This is a simple check - real tokens have specific formats but this is a basic validation
    return accessToken.length > 20;
}
