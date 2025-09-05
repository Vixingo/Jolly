// Facebook Events Integration
// Centralizes both Facebook Pixel and Conversion API tracking

import {
  trackViewContent,
  trackAddToCart,
  trackInitiateCheckout,
  trackPurchase,
  trackContact
} from './facebook-tracking';
import type { FacebookEventData } from './facebook-tracking';

// User information interface for tracking
export interface UserTrackingInfo {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  userId?: string;
}

// Product information interface for tracking
export interface ProductTrackingInfo {
  id: string;
  name: string;
  category?: string;
  price: number;
  quantity: number;
}

// Track view content event (both Pixel and Conversion API)
export const trackProductView = async (
  product: ProductTrackingInfo,
  userInfo?: UserTrackingInfo,
  currency: string = 'USD'
) => {
  // Track via Facebook Pixel
  if (window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_ids: [product.id],
      content_type: 'product',
      content_name: product.name,
      content_category: product.category,
      value: product.price,
      currency
    });
  }

  // Track via Conversion API
  await trackViewContent(
    product.id,
    product.name,
    product.category || '',
    product.price,
    currency,
    userInfo
  );
};

// Track add to cart event (both Pixel and Conversion API)
export const trackProductAddToCart = async (
  product: ProductTrackingInfo,
  userInfo?: UserTrackingInfo,
  currency: string = 'USD'
) => {
  const contents = [{
    id: product.id,
    quantity: product.quantity,
    item_price: product.price
  }];

  // Track via Facebook Pixel
  if (window.fbq) {
    window.fbq('track', 'AddToCart', {
      content_ids: [product.id],
      content_type: 'product',
      content_name: product.name,
      content_category: product.category,
      value: product.price * product.quantity,
      currency,
      contents
    });
  }

  // Track via Conversion API
  await trackAddToCart(
    product.id,
    product.name,
    product.category || '',
    product.price * product.quantity,
    currency,
    product.quantity,
    contents,
    userInfo
  );
};

// Track initiate checkout event (both Pixel and Conversion API)
export const trackCheckoutStart = async (
  products: ProductTrackingInfo[],
  userInfo?: UserTrackingInfo,
  currency: string = 'USD'
) => {
  const totalValue = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  const contentIds = products.map(product => product.id);
  const totalItems = products.reduce((sum, product) => sum + product.quantity, 0);
  const contentName = products.length === 1 ? products[0].name : `${products.length} products`;
  const contents = products.map(product => ({
    id: product.id,
    quantity: product.quantity,
    item_price: product.price
  }));

  // Track via Facebook Pixel
  if (window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      content_ids: contentIds,
      content_type: 'product',
      content_name: contentName,
      value: totalValue,
      currency,
      num_items: totalItems,
      contents
    });
  }

  // Track via Conversion API
  await trackInitiateCheckout(
    totalValue,
    currency,
    totalItems,
    contentIds,
    contentName,
    contents,
    userInfo
  );
};

// Track purchase event (both Pixel and Conversion API)
export const trackOrderComplete = async (
  orderId: string,
  products: ProductTrackingInfo[],
  userInfo?: UserTrackingInfo,
  currency: string = 'USD'
) => {
  const totalValue = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  const contentIds = products.map(product => product.id);
  const totalItems = products.reduce((sum, product) => sum + product.quantity, 0);
  const contentName = products.length === 1 ? products[0].name : `${products.length} products`;
  const contents = products.map(product => ({
    id: product.id,
    quantity: product.quantity,
    item_price: product.price
  }));

  // Track via Facebook Pixel
  if (window.fbq) {
    window.fbq('track', 'Purchase', {
      content_ids: contentIds,
      content_type: 'product',
      content_name: contentName,
      value: totalValue,
      currency,
      num_items: totalItems,
      contents,
      order_id: orderId
    });
  }

  // Track via Conversion API
  await trackPurchase(
    orderId,
    totalValue,
    currency,
    contentIds,
    totalItems,
    contentName,
    contents,
    userInfo
  );
};

// Track contact event (both Pixel and Conversion API)
export const trackContactEvent = async (
  userInfo?: UserTrackingInfo,
  value?: number,
  currency: string = 'USD'
) => {
  // Track via Facebook Pixel
  if (window.fbq) {
    const eventParams: Record<string, any> = {};
    
    if (value) {
      eventParams.value = value;
      eventParams.currency = currency;
    }
    
    window.fbq('track', 'Contact', eventParams);
  }

  // Track via Conversion API
  await trackContact(value, currency, userInfo);
};