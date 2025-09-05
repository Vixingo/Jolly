// Facebook Conversion API tracking utility
// Handles server-side event tracking for Facebook Ads

import { supabase } from "./supabase";

// Facebook Conversion API event types
export type FacebookEventType =
    | "PageView"
    | "ViewContent"
    | "AddToCart"
    | "InitiateCheckout"
    | "Purchase"
    | "Lead"
    | "CompleteRegistration"
    | "Search"
    | "Contact";

// Event data structure for Facebook Conversion API
export interface FacebookEventData {
    event_name: FacebookEventType;
    event_time: number;
    event_id?: string;
    user_data?: {
        em?: string; // email (hashed)
        ph?: string; // phone (hashed)
        fn?: string; // first name (hashed)
        ln?: string; // last name (hashed)
        ct?: string; // city (hashed)
        st?: string; // state (hashed)
        zp?: string; // zip code (hashed)
        country?: string; // country code
        external_id?: string; // user ID
        client_ip_address?: string;
        client_user_agent?: string;
        fbc?: string; // Facebook click ID
        fbp?: string; // Facebook browser ID
    };
    custom_data?: {
        currency?: string;
        value?: number;
        content_ids?: string[];
        content_type?: string;
        content_name?: string;
        content_category?: string;
        num_items?: number;
        search_string?: string;
        status?: string;
        contents?: Array<{ id: string; quantity: number; item_price?: number }>;
    };
    event_source_url?: string;
    action_source:
        | "website"
        | "email"
        | "app"
        | "phone_call"
        | "chat"
        | "physical_store"
        | "system_generated"
        | "other";
}

// Facebook Conversion API settings
interface FacebookSettings {
    pixel_id: string;
    access_token: string;
    api_version: string;
}

// Simple hash function for PII data (SHA-256 would be better in production)
function simpleHash(data: string): string {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
        const char = data.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
}

// Get Facebook settings from store settings
export async function getFacebookSettings(): Promise<FacebookSettings | null> {
    try {
        const { data, error } = await supabase.rpc("get_api_configurations");

        if (error || !data || data.length === 0) {
            console.warn("No store settings found for Facebook tracking");
            return null;
        }

        const settings = data[0];

        if (!settings.fb_pixel_id || !settings.fb_access_token) {
            console.warn("Facebook Pixel ID or Access Token not configured");
            return null;
        }

        return {
            pixel_id: settings.fb_pixel_id,
            access_token: settings.fb_access_token,
            api_version: settings.fb_api_version || "18.0",
        };
    } catch (error) {
        console.error("Error fetching Facebook settings:", error);
        return null;
    }
}

// Send event to Facebook Conversion API
export async function sendFacebookEvent(
    eventData: FacebookEventData
): Promise<boolean> {
    try {
        const settings = await getFacebookSettings();

        if (!settings) {
            console.warn(
                "Facebook tracking not configured, skipping event:",
                eventData.event_name
            );
            return false;
        }

        const url = `https://graph.facebook.com/v${settings.api_version}/${settings.pixel_id}/events`;

        const payload = {
            data: [eventData],
            access_token: settings.access_token,
        };

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error("Facebook Conversion API error:", errorData);
            return false;
        }

        const result = await response.json();

        if (result.events_received !== 1) {
            console.warn("Facebook event not received properly:", result);
            return false;
        }

        console.log("Facebook event sent successfully:", eventData.event_name);
        return true;
    } catch (error) {
        console.error("Error sending Facebook event:", error);
        return false;
    }
}

// Generate event ID to prevent duplicate events
function generateEventId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Get user data for tracking (with hashing for privacy)
function getUserData(userInfo?: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    userId?: string;
}): FacebookEventData["user_data"] {
    if (!userInfo) return {};

    return {
        em: userInfo.email
            ? simpleHash(userInfo.email.toLowerCase())
            : undefined,
        ph: userInfo.phone
            ? simpleHash(userInfo.phone.replace(/[^0-9]/g, ""))
            : undefined,
        fn: userInfo.firstName
            ? simpleHash(userInfo.firstName.toLowerCase())
            : undefined,
        ln: userInfo.lastName
            ? simpleHash(userInfo.lastName.toLowerCase())
            : undefined,
        ct: userInfo.city ? simpleHash(userInfo.city.toLowerCase()) : undefined,
        st: userInfo.state
            ? simpleHash(userInfo.state.toLowerCase())
            : undefined,
        zp: userInfo.zipCode ? simpleHash(userInfo.zipCode) : undefined,
        country: userInfo.country ? userInfo.country.toLowerCase() : undefined,
        external_id: userInfo.userId ? simpleHash(userInfo.userId) : undefined,
        client_ip_address: undefined, // Would need server-side implementation
        client_user_agent:
            typeof navigator !== "undefined" ? navigator.userAgent : undefined,
        fbc: undefined, // Facebook click ID from URL parameters
        fbp: undefined, // Facebook browser ID from cookie
    };
}

// Track page view event
export async function trackPageView(
    url?: string,
    userInfo?: Parameters<typeof getUserData>[0]
): Promise<boolean> {
    const eventData: FacebookEventData = {
        event_name: "PageView",
        event_time: Math.floor(Date.now() / 1000),
        event_id: generateEventId(),
        user_data: getUserData(userInfo),
        event_source_url:
            url ||
            (typeof window !== "undefined" ? window.location.href : undefined),
        action_source: "website",
    };

    return sendFacebookEvent(eventData);
}

// Track product view event
export async function trackViewContent(
    productId: string,
    productName: string,
    category: string,
    value: number,
    currency: string = "USD",
    userInfo?: Parameters<typeof getUserData>[0]
): Promise<boolean> {
    const eventData: FacebookEventData = {
        event_name: "ViewContent",
        event_time: Math.floor(Date.now() / 1000),
        event_id: generateEventId(),
        user_data: getUserData(userInfo),
        custom_data: {
            currency,
            value,
            content_ids: [productId],
            content_type: "product",
            content_name: productName,
            content_category: category,
        },
        event_source_url:
            typeof window !== "undefined" ? window.location.href : undefined,
        action_source: "website",
    };

    return sendFacebookEvent(eventData);
}

// Track add to cart event
export async function trackAddToCart(
    productId: string,
    productName: string,
    category: string,
    value: number,
    currency: string = "USD",
    quantity: number = 1,
    contents?: Array<{ id: string; quantity: number; item_price?: number }>,
    userInfo?: Parameters<typeof getUserData>[0]
): Promise<boolean> {
    const eventData: FacebookEventData = {
        event_name: "AddToCart",
        event_time: Math.floor(Date.now() / 1000),
        event_id: generateEventId(),
        user_data: getUserData(userInfo),
        custom_data: {
            currency,
            value,
            content_ids: [productId],
            content_type: "product",
            content_name: productName,
            content_category: category,
            num_items: quantity,
            contents: contents || [{ id: productId, quantity }],
        },
        event_source_url:
            typeof window !== "undefined" ? window.location.href : undefined,
        action_source: "website",
    };

    return sendFacebookEvent(eventData);
}

// Track initiate checkout event
export async function trackInitiateCheckout(
    value: number,
    currency: string = "USD",
    numItems: number,
    contentIds: string[],
    contentName?: string,
    contents?: Array<{ id: string; quantity: number; item_price?: number }>,
    userInfo?: Parameters<typeof getUserData>[0]
): Promise<boolean> {
    const eventData: FacebookEventData = {
        event_name: "InitiateCheckout",
        event_time: Math.floor(Date.now() / 1000),
        event_id: generateEventId(),
        user_data: getUserData(userInfo),
        custom_data: {
            content_name: contentName,
            currency,
            value,
            content_ids: contentIds,
            content_type: "product",
            num_items: numItems,
            contents: contents,
        },
        event_source_url:
            typeof window !== "undefined" ? window.location.href : undefined,
        action_source: "website",
    };

    return sendFacebookEvent(eventData);
}

// Track purchase event
export async function trackPurchase(
    orderId: string,
    value: number,
    currency: string = "USD",
    contentIds: string[],
    numItems: number,
    contentName?: string,
    contents?: Array<{ id: string; quantity: number; item_price?: number }>,
    userInfo?: Parameters<typeof getUserData>[0]
): Promise<boolean> {
    const eventData: FacebookEventData = {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: generateEventId(),
        user_data: getUserData(userInfo),
        custom_data: {
            currency,
            value,
            content_ids: contentIds,
            content_type: "product",
            num_items: numItems,
            content_name: contentName,
            contents: contents,
            status: orderId,
        },
        event_source_url:
            typeof window !== "undefined" ? window.location.href : undefined,
        action_source: "website",
    };

    return sendFacebookEvent(eventData);
}

// Track search event
export async function trackSearch(
    searchString: string,
    userInfo?: Parameters<typeof getUserData>[0]
): Promise<boolean> {
    const eventData: FacebookEventData = {
        event_name: "Search",
        event_time: Math.floor(Date.now() / 1000),
        event_id: generateEventId(),
        user_data: getUserData(userInfo),
        custom_data: {
            search_string: searchString,
        },
        event_source_url:
            typeof window !== "undefined" ? window.location.href : undefined,
        action_source: "website",
    };

    return sendFacebookEvent(eventData);
}

// Track lead event (for newsletter signups, contact forms, etc.)
export async function trackLead(
    value?: number,
    currency: string = "USD",
    userInfo?: Parameters<typeof getUserData>[0]
): Promise<boolean> {
    const eventData: FacebookEventData = {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        event_id: generateEventId(),
        user_data: getUserData(userInfo),
        custom_data: value
            ? {
                  currency,
                  value,
              }
            : undefined,
        event_source_url:
            typeof window !== "undefined" ? window.location.href : undefined,
        action_source: "website",
    };

    return sendFacebookEvent(eventData);
}

// Track contact event (for phone calls, emails, chats, etc.)
export async function trackContact(
    value?: number,
    currency: string = "USD",
    userInfo?: Parameters<typeof getUserData>[0]
): Promise<boolean> {
    const eventData: FacebookEventData = {
        event_name: "Contact",
        event_time: Math.floor(Date.now() / 1000),
        event_id: generateEventId(),
        user_data: getUserData(userInfo),
        custom_data: value
            ? {
                  currency,
                  value,
              }
            : undefined,
        event_source_url:
            typeof window !== "undefined" ? window.location.href : undefined,
        action_source: "website",
    };

    return sendFacebookEvent(eventData);
}

// Track registration event
export async function trackCompleteRegistration(
    userInfo?: Parameters<typeof getUserData>[0]
): Promise<boolean> {
    const eventData: FacebookEventData = {
        event_name: "CompleteRegistration",
        event_time: Math.floor(Date.now() / 1000),
        event_id: generateEventId(),
        user_data: getUserData(userInfo),
        event_source_url:
            typeof window !== "undefined" ? window.location.href : undefined,
        action_source: "website",
    };

    return sendFacebookEvent(eventData);
}

// Utility function to test Facebook Conversion API connection
export async function testFacebookConnection(): Promise<{
    success: boolean;
    message: string;
}> {
    try {
        const settings = await getFacebookSettings();

        if (!settings) {
            return {
                success: false,
                message:
                    "Facebook settings not configured. Please add Pixel ID and Access Token.",
            };
        }

        // Send a test event
        const testEvent: FacebookEventData = {
            event_name: "PageView",
            event_time: Math.floor(Date.now() / 1000),
            event_id: `test_${generateEventId()}`,
            user_data: {},
            action_source: "website",
            event_source_url: "https://test.example.com",
        };

        const success = await sendFacebookEvent(testEvent);

        return {
            success,
            message: success
                ? "Facebook Conversion API connection successful!"
                : "Failed to connect to Facebook Conversion API. Please check your settings.",
        };
    } catch (error) {
        return {
            success: false,
            message: `Connection test failed: ${
                error instanceof Error ? error.message : "Unknown error"
            }`,
        };
    }
}
