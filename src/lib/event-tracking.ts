// Unified Event Tracking Utility
// Pushes standardized e-commerce events to dataLayer for GTM integration
// Supports: React App → dataLayer.push() → GTM → [GA4 + Pixel + CAPI + Ads]

import { trackProductView, trackProductAddToCart, trackCheckoutStart, trackOrderComplete } from './facebook-events';
import { 
    trackViewItem as gtmTrackViewItem, 
    trackAddToCart as gtmTrackAddToCart, 
    trackBeginCheckout as gtmTrackBeginCheckout, 
    trackPurchase as gtmTrackPurchase 
} from './gtm-tracking';
import { forceInitializeTracking, isTrackingReady } from './lazy-tracking';

// Initialize dataLayer if it doesn't exist
if (typeof window !== 'undefined' && !window.dataLayer) {
    window.dataLayer = [];
}

// Standard product interface for tracking
export interface TrackingProduct {
    item_id: string;
    item_name: string;
    item_category?: string;
    item_category2?: string;
    item_category3?: string;
    item_brand?: string;
    item_variant?: string;
    price: number;
    quantity: number;
    currency?: string;
    coupon?: string;
    discount?: number;
    affiliation?: string;
    item_list_id?: string;
    item_list_name?: string;
    index?: number;
}

// User information for enhanced tracking
export interface TrackingUser {
    user_id?: string;
    email?: string;
    phone?: string;
    first_name?: string;
    last_name?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    country?: string;
}

// Enhanced ecommerce event parameters
export interface EcommerceEventParams {
    currency?: string;
    value?: number;
    transaction_id?: string;
    coupon?: string;
    shipping?: number;
    tax?: number;
    items?: TrackingProduct[];
    payment_type?: string;
    shipping_tier?: string;
    item_list_id?: string;
    item_list_name?: string;
    promotion_id?: string;
    promotion_name?: string;
    creative_name?: string;
    creative_slot?: string;
    location_id?: string;
    search_term?: string;
    method?: string;
    content_type?: string;
    affiliation?: string;
    custom_parameters?: Record<string, any>;
}

// Push event to dataLayer with standard structure
function pushToDataLayer(event: string, parameters: any = {}) {
    if (typeof window !== 'undefined' && window.dataLayer) {
        const eventData = {
            event,
            timestamp: new Date().toISOString(),
            ...parameters
        };
        
        window.dataLayer.push(eventData);
        console.log('Event pushed to dataLayer:', eventData);
        return true;
    }
    
    console.warn('dataLayer not available');
    return false;
}

// 1. VIEW CONTENT / VIEW ITEM
export async function trackViewContent(
    product: TrackingProduct,
    userInfo?: TrackingUser,
    customParams?: Record<string, any>
) {
    try {
        // GTM/GA4 tracking
        gtmTrackViewItem(
            product.item_id,
            product.item_name,
            product.item_category || '',
            product.price,
            product.currency || 'USD'
        );

        // Facebook Pixel only (no CAPI for ViewContent)
        await trackProductView({
            id: product.item_id,
            name: product.item_name,
            category: product.item_category,
            price: product.price,
            quantity: product.quantity || 1
        }, userInfo, product.currency || 'USD');

        return true;
    } catch (error) {
        console.error('Error tracking view content:', error);
        return false;
    }
}

// 2. ADD TO CART
export async function trackAddToCartEvent(
    product: TrackingProduct,
    user?: TrackingUser,
    customParams?: Record<string, any>
) {
    // Ensure tracking is initialized for important events
    if (!isTrackingReady()) {
        await forceInitializeTracking();
    }

    const currency = product.currency || 'USD';
    const value = product.price * product.quantity;
    
    // Push to dataLayer for GTM
    const success = pushToDataLayer('add_to_cart', {
        currency,
        value,
        items: [product],
        user_data: user,
        ...customParams
    });
    
    // Also trigger existing tracking systems
    if (success) {
        try {
            // Facebook tracking
            await trackProductAddToCart({
                id: product.item_id,
                name: product.item_name,
                category: product.item_category,
                price: product.price,
                quantity: product.quantity
            }, user, currency);
            
            // GTM/GA4 tracking
            gtmTrackAddToCart(
                product.item_id,
                product.item_name,
                product.item_category || '',
                value,
                product.quantity,
                currency,
                product.item_brand
            );
        } catch (error) {
            console.error('Error in additional tracking systems:', error);
        }
    }
    
    return success;
}

// 3. REMOVE FROM CART
export function trackRemoveFromCartEvent(
    product: TrackingProduct,
    user?: TrackingUser,
    customParams?: Record<string, any>
) {
    const currency = product.currency || 'USD';
    const value = product.price * product.quantity;
    
    return pushToDataLayer('remove_from_cart', {
        currency,
        value,
        items: [product],
        user_data: user,
        ...customParams
    });
}

// 4. BEGIN CHECKOUT / INITIATE CHECKOUT
export async function trackBeginCheckoutEvent(
    products: TrackingProduct[],
    params: EcommerceEventParams = {},
    user?: TrackingUser,
    customParams?: Record<string, any>
) {
    // Ensure tracking is initialized for important events
    if (!isTrackingReady()) {
        await forceInitializeTracking();
    }

    const currency = params.currency || products[0]?.currency || 'USD';
    const value = params.value || products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    
    // Push to dataLayer for GTM
    const success = pushToDataLayer('begin_checkout', {
        currency,
        value,
        coupon: params.coupon,
        items: products,
        user_data: user,
        ...customParams
    });
    
    // Also trigger existing tracking systems
    if (success) {
        try {
            // Facebook tracking
            await trackCheckoutStart(
                products.map(p => ({
                    id: p.item_id,
                    name: p.item_name,
                    category: p.item_category,
                    price: p.price,
                    quantity: p.quantity
                })),
                user,
                currency
            );
            
            // GTM/GA4 tracking
            gtmTrackBeginCheckout(
                products.map(p => ({
                    item_id: p.item_id,
                    item_name: p.item_name,
                    item_category: p.item_category,
                    price: p.price,
                    quantity: p.quantity,
                    currency,
                    item_brand: p.item_brand
                })),
                value,
                currency,
                params.coupon
            );
        } catch (error) {
            console.error('Error in additional tracking systems:', error);
        }
    }
    
    return success;
}

// 5. PURCHASE / ORDER COMPLETE
export async function trackPurchaseEvent(
    transactionId: string,
    products: TrackingProduct[],
    params: EcommerceEventParams = {},
    user?: TrackingUser,
    customParams?: Record<string, any>
) {
    // Ensure tracking is initialized for important events
    if (!isTrackingReady()) {
        await forceInitializeTracking();
    }

    const currency = params.currency || products[0]?.currency || 'USD';
    const value = params.value || products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    
    // Push to dataLayer for GTM
    const success = pushToDataLayer('purchase', {
        currency,
        value,
        transaction_id: transactionId,
        tax: params.tax,
        shipping: params.shipping,
        coupon: params.coupon,
        affiliation: params.affiliation,
        items: products,
        user_data: user,
        ...customParams
    });
    
    // Also trigger existing tracking systems
    if (success) {
        try {
            // Facebook tracking
            await trackOrderComplete(
                transactionId,
                products.map(p => ({
                    id: p.item_id,
                    name: p.item_name,
                    category: p.item_category,
                    price: p.price,
                    quantity: p.quantity
                })),
                user,
                currency
            );
            
            // GTM/GA4 tracking
            await gtmTrackPurchase(
                transactionId,
                products.map(p => ({
                    item_id: p.item_id,
                    item_name: p.item_name,
                    item_category: p.item_category,
                    price: p.price,
                    quantity: p.quantity,
                    currency,
                    item_brand: p.item_brand
                })),
                value,
                currency,
                params.tax,
                params.shipping,
                params.coupon,
                params.affiliation
            );
        } catch (error) {
            console.error('Error in additional tracking systems:', error);
        }
    }
    
    return success;
}

// 6. VIEW ITEM LIST (Category/Search Results)
export function trackViewItemListEvent(
    products: TrackingProduct[],
    listId?: string,
    listName?: string,
    user?: TrackingUser,
    customParams?: Record<string, any>
) {
    return pushToDataLayer('view_item_list', {
        item_list_id: listId,
        item_list_name: listName,
        items: products,
        user_data: user,
        ...customParams
    });
}

// 7. SELECT ITEM (Click on product in list)
export function trackSelectItemEvent(
    product: TrackingProduct,
    listId?: string,
    listName?: string,
    user?: TrackingUser,
    customParams?: Record<string, any>
) {
    return pushToDataLayer('select_item', {
        item_list_id: listId,
        item_list_name: listName,
        items: [{ ...product, index: product.index }],
        user_data: user,
        ...customParams
    });
}

// 8. SEARCH
export function trackSearchEvent(
    searchTerm: string,
    user?: TrackingUser,
    customParams?: Record<string, any>
) {
    return pushToDataLayer('search', {
        search_term: searchTerm,
        user_data: user,
        ...customParams
    });
}

// 9. SIGN UP
export function trackSignUpEvent(
    method?: string,
    user?: TrackingUser,
    customParams?: Record<string, any>
) {
    return pushToDataLayer('sign_up', {
        method,
        user_data: user,
        ...customParams
    });
}

// 10. LOGIN
export function trackLoginEvent(
    method?: string,
    user?: TrackingUser,
    customParams?: Record<string, any>
) {
    return pushToDataLayer('login', {
        method,
        user_data: user,
        ...customParams
    });
}

// 11. GENERATE LEAD
export function trackGenerateLeadEvent(
    value?: number,
    currency: string = 'USD',
    contentType?: string,
    user?: TrackingUser,
    customParams?: Record<string, any>
) {
    return pushToDataLayer('generate_lead', {
        currency,
        value,
        content_type: contentType,
        user_data: user,
        ...customParams
    });
}

// 12. PAGE VIEW
export function trackPageViewEvent(
    pageTitle?: string,
    pagePath?: string,
    user?: TrackingUser,
    customParams?: Record<string, any>
) {
    return pushToDataLayer('page_view', {
        page_title: pageTitle || (typeof document !== 'undefined' ? document.title : ''),
        page_location: typeof window !== 'undefined' ? window.location.href : '',
        page_path: pagePath || (typeof window !== 'undefined' ? window.location.pathname : ''),
        user_data: user,
        ...customParams
    });
}

// 13. CUSTOM EVENT
export function trackCustomEvent(
    eventName: string,
    parameters: Record<string, any> = {},
    user?: TrackingUser
) {
    return pushToDataLayer(eventName, {
        ...parameters,
        user_data: user
    });
}

// Utility function to get current user data from context/store
export function getCurrentUser(): TrackingUser | undefined {
    // This should be implemented based on your auth context/store
    // Example implementation:
    try {
        if (typeof localStorage !== 'undefined') {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                return {
                    user_id: user.id,
                    email: user.email,
                    first_name: user.firstName,
                    last_name: user.lastName
                };
            }
        }
    } catch (error) {
        console.error('Error getting current user:', error);
    }
    return undefined;
}

// Enhanced tracking with automatic user detection
export const enhancedTracking = {
    viewContent: (product: TrackingProduct, customParams?: Record<string, any>) => 
        trackViewContent(product, getCurrentUser(), customParams),
    
    addToCart: (product: TrackingProduct, customParams?: Record<string, any>) => 
        trackAddToCartEvent(product, getCurrentUser(), customParams),
    
    removeFromCart: (product: TrackingProduct, customParams?: Record<string, any>) => 
        trackRemoveFromCartEvent(product, getCurrentUser(), customParams),
    
    beginCheckout: (products: TrackingProduct[], params?: EcommerceEventParams, customParams?: Record<string, any>) => 
        trackBeginCheckoutEvent(products, params, getCurrentUser(), customParams),
    
    purchase: (transactionId: string, products: TrackingProduct[], params?: EcommerceEventParams, customParams?: Record<string, any>) => 
        trackPurchaseEvent(transactionId, products, params, getCurrentUser(), customParams),
    
    viewItemList: (products: TrackingProduct[], listId?: string, listName?: string, customParams?: Record<string, any>) => 
        trackViewItemListEvent(products, listId, listName, getCurrentUser(), customParams),
    
    selectItem: (product: TrackingProduct, listId?: string, listName?: string, customParams?: Record<string, any>) => 
        trackSelectItemEvent(product, listId, listName, getCurrentUser(), customParams),
    
    search: (searchTerm: string, customParams?: Record<string, any>) => 
        trackSearchEvent(searchTerm, getCurrentUser(), customParams),
    
    signUp: (method?: string, customParams?: Record<string, any>) => 
        trackSignUpEvent(method, getCurrentUser(), customParams),
    
    login: (method?: string, customParams?: Record<string, any>) => 
        trackLoginEvent(method, getCurrentUser(), customParams),
    
    generateLead: (value?: number, currency?: string, contentType?: string, customParams?: Record<string, any>) => 
        trackGenerateLeadEvent(value, currency, contentType, getCurrentUser(), customParams),
    
    pageView: (pageTitle?: string, pagePath?: string, customParams?: Record<string, any>) => 
        trackPageViewEvent(pageTitle, pagePath, getCurrentUser(), customParams),
    
    customEvent: (eventName: string, parameters?: Record<string, any>) => 
        trackCustomEvent(eventName, parameters, getCurrentUser())
};

// Default export for convenience
export default enhancedTracking;