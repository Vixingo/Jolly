# Event Tracking Utility

A unified event tracking utility that pushes standardized e-commerce events to dataLayer for GTM integration. Supports the flow: **React App → dataLayer.push() → GTM → [GA4 + Pixel + CAPI + Ads]**

## Features

- ✅ Standard GA4 Enhanced Ecommerce events
- ✅ Automatic dataLayer.push() for GTM integration
- ✅ Facebook Pixel & Conversion API integration
- ✅ Google Analytics 4 tracking
- ✅ Type-safe interfaces
- ✅ User data enhancement
- ✅ Custom parameter support
- ✅ SSR-safe implementation

## Installation

```typescript
import eventTracking from '@/lib/event-tracking';
// or
import { trackViewContent, trackAddToCartEvent } from '@/lib/event-tracking';
```

## Quick Start

### Basic Usage with Enhanced Tracking

```typescript
import eventTracking from '@/lib/event-tracking';

// View product
eventTracking.viewContent({
    item_id: 'prod_123',
    item_name: 'Wireless Headphones',
    item_category: 'Electronics',
    price: 99.99,
    quantity: 1,
    currency: 'USD'
});

// Add to cart
eventTracking.addToCart({
    item_id: 'prod_123',
    item_name: 'Wireless Headphones',
    item_category: 'Electronics',
    price: 99.99,
    quantity: 2,
    currency: 'USD'
});

// Begin checkout
eventTracking.beginCheckout([
    {
        item_id: 'prod_123',
        item_name: 'Wireless Headphones',
        item_category: 'Electronics',
        price: 99.99,
        quantity: 2,
        currency: 'USD'
    }
]);

// Purchase
eventTracking.purchase('order_456', [
    {
        item_id: 'prod_123',
        item_name: 'Wireless Headphones',
        item_category: 'Electronics',
        price: 99.99,
        quantity: 2,
        currency: 'USD'
    }
], {
    tax: 10.00,
    shipping: 5.99,
    currency: 'USD'
});
```

## Event Types

### 1. View Content (Product View)

```typescript
import { trackViewContent } from '@/lib/event-tracking';

trackViewContent({
    item_id: 'prod_123',
    item_name: 'Product Name',
    item_category: 'Category',
    item_brand: 'Brand Name',
    price: 29.99,
    quantity: 1,
    currency: 'USD'
});
```

### 2. Add to Cart

```typescript
import { trackAddToCartEvent } from '@/lib/event-tracking';

trackAddToCartEvent({
    item_id: 'prod_123',
    item_name: 'Product Name',
    item_category: 'Category',
    price: 29.99,
    quantity: 2,
    currency: 'USD'
});
```

### 3. Remove from Cart

```typescript
import { trackRemoveFromCartEvent } from '@/lib/event-tracking';

trackRemoveFromCartEvent({
    item_id: 'prod_123',
    item_name: 'Product Name',
    item_category: 'Category',
    price: 29.99,
    quantity: 1,
    currency: 'USD'
});
```

### 4. Begin Checkout

```typescript
import { trackBeginCheckoutEvent } from '@/lib/event-tracking';

trackBeginCheckoutEvent(
    [/* array of products */],
    {
        currency: 'USD',
        coupon: 'SAVE10',
        value: 199.98
    }
);
```

### 5. Purchase

```typescript
import { trackPurchaseEvent } from '@/lib/event-tracking';

trackPurchaseEvent(
    'order_123',
    [/* array of products */],
    {
        currency: 'USD',
        tax: 15.99,
        shipping: 9.99,
        affiliation: 'Online Store'
    }
);
```

### 6. Search

```typescript
import { trackSearchEvent } from '@/lib/event-tracking';

trackSearchEvent('wireless headphones');
```

### 7. Sign Up

```typescript
import { trackSignUpEvent } from '@/lib/event-tracking';

trackSignUpEvent('email'); // method: email, google, facebook, etc.
```

### 8. Login

```typescript
import { trackLoginEvent } from '@/lib/event-tracking';

trackLoginEvent('email');
```

### 9. Generate Lead

```typescript
import { trackGenerateLeadEvent } from '@/lib/event-tracking';

trackGenerateLeadEvent(50, 'USD', 'newsletter_signup');
```

### 10. Page View

```typescript
import { trackPageViewEvent } from '@/lib/event-tracking';

trackPageViewEvent('Product Page', '/products/wireless-headphones');
```

### 11. Custom Events

```typescript
import { trackCustomEvent } from '@/lib/event-tracking';

trackCustomEvent('video_play', {
    video_title: 'Product Demo',
    video_duration: 120,
    video_current_time: 30
});
```

## React Component Examples

### Product Page

```typescript
import React, { useEffect } from 'react';
import eventTracking from '@/lib/event-tracking';

interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    brand?: string;
}

const ProductPage: React.FC<{ product: Product }> = ({ product }) => {
    useEffect(() => {
        // Track product view when component mounts
        eventTracking.viewContent({
            item_id: product.id,
            item_name: product.name,
            item_category: product.category,
            item_brand: product.brand,
            price: product.price,
            quantity: 1,
            currency: 'USD'
        });
    }, [product]);

    const handleAddToCart = (quantity: number) => {
        eventTracking.addToCart({
            item_id: product.id,
            item_name: product.name,
            item_category: product.category,
            item_brand: product.brand,
            price: product.price,
            quantity,
            currency: 'USD'
        });
    };

    return (
        <div>
            <h1>{product.name}</h1>
            <p>${product.price}</p>
            <button onClick={() => handleAddToCart(1)}>
                Add to Cart
            </button>
        </div>
    );
};
```

### Shopping Cart

```typescript
import React from 'react';
import eventTracking from '@/lib/event-tracking';

const ShoppingCart: React.FC<{ items: CartItem[] }> = ({ items }) => {
    const handleRemoveItem = (item: CartItem) => {
        eventTracking.removeFromCart({
            item_id: item.id,
            item_name: item.name,
            item_category: item.category,
            price: item.price,
            quantity: item.quantity,
            currency: 'USD'
        });
    };

    const handleCheckout = () => {
        const products = items.map(item => ({
            item_id: item.id,
            item_name: item.name,
            item_category: item.category,
            price: item.price,
            quantity: item.quantity,
            currency: 'USD'
        }));

        eventTracking.beginCheckout(products);
    };

    return (
        <div>
            {items.map(item => (
                <div key={item.id}>
                    <span>{item.name}</span>
                    <button onClick={() => handleRemoveItem(item)}>
                        Remove
                    </button>
                </div>
            ))}
            <button onClick={handleCheckout}>
                Proceed to Checkout
            </button>
        </div>
    );
};
```

### Search Component

```typescript
import React, { useState } from 'react';
import eventTracking from '@/lib/event-tracking';

const SearchComponent: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            eventTracking.search(searchTerm.trim());
            // Perform actual search...
        }
    };

    return (
        <form onSubmit={handleSearch}>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
            />
            <button type="submit">Search</button>
        </form>
    );
};
```

## Advanced Usage

### With User Data

```typescript
import { trackPurchaseEvent } from '@/lib/event-tracking';

const user = {
    user_id: 'user_123',
    email: 'user@example.com',
    first_name: 'John',
    last_name: 'Doe'
};

trackPurchaseEvent(
    'order_456',
    products,
    { currency: 'USD', tax: 10.00 },
    user, // User data for enhanced tracking
    { custom_param: 'value' } // Custom parameters
);
```

### Custom Parameters

```typescript
eventTracking.viewContent(
    product,
    {
        source: 'email_campaign',
        campaign_id: 'summer_sale_2024',
        ab_test_variant: 'variant_b'
    }
);
```

## DataLayer Structure

Events are pushed to `window.dataLayer` with this structure:

```javascript
{
    event: 'view_item',
    timestamp: '2024-01-15T10:30:00.000Z',
    currency: 'USD',
    value: 99.99,
    items: [{
        item_id: 'prod_123',
        item_name: 'Wireless Headphones',
        item_category: 'Electronics',
        price: 99.99,
        quantity: 1
    }],
    user_data: {
        user_id: 'user_123',
        email: 'user@example.com'
    }
}
```

## GTM Configuration

In Google Tag Manager, create triggers for these events:

- `view_item`
- `add_to_cart`
- `remove_from_cart`
- `begin_checkout`
- `purchase`
- `search`
- `sign_up`
- `login`
- `generate_lead`
- `page_view`

## Type Definitions

```typescript
interface TrackingProduct {
    item_id: string;
    item_name: string;
    item_category?: string;
    item_brand?: string;
    price: number;
    quantity: number;
    currency?: string;
    // ... other optional fields
}

interface TrackingUser {
    user_id?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    // ... other optional fields
}

interface EcommerceEventParams {
    currency?: string;
    value?: number;
    transaction_id?: string;
    tax?: number;
    shipping?: number;
    coupon?: string;
    affiliation?: string;
    // ... other optional fields
}
```

## Best Practices

1. **Always include currency**: Specify currency for all monetary events
2. **Use consistent IDs**: Ensure product IDs are consistent across all events
3. **Track user journey**: Implement tracking at key user interaction points
4. **Test thoroughly**: Verify events in GTM Preview mode and GA4 DebugView
5. **Handle errors gracefully**: The utility includes error handling for tracking failures
6. **Performance**: Events are pushed asynchronously and won't block UI

## Debugging

Enable console logging to see events being pushed:

```javascript
// Events are automatically logged to console
// Check browser console for: "Event pushed to dataLayer: {...}"
```

Use GTM Preview mode and GA4 DebugView to verify events are being received correctly.

## Integration with Existing Systems

This utility automatically integrates with:
- Facebook Pixel (via existing `facebook-events.ts`)
- Google Analytics 4 (via existing `gtm-tracking.ts`)
- Facebook Conversion API (via existing `facebook-tracking.ts`)

All tracking systems work together seamlessly while maintaining the dataLayer as the single source of truth.