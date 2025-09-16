import React, { useEffect, useState } from 'react';

// Lightweight product interface for demo
interface TrackingProduct {
    item_id: string;
    item_name: string;
    item_category?: string;
    item_category2?: string;
    item_brand?: string;
    price: number;
    quantity: number;
    currency?: string;
}

// Lightweight event tracking for demo purposes
const lightweightTracking = {
    pageView: (title: string, path: string) => {
        console.log('📄 Page View:', { title, path, timestamp: new Date().toISOString() });
    },
    viewContent: (product: TrackingProduct, params?: any) => {
        console.log('👁️ View Content:', { product, params, timestamp: new Date().toISOString() });
    },
    addToCart: (product: TrackingProduct, params?: any) => {
        console.log('🛒 Add to Cart:', { product, params, timestamp: new Date().toISOString() });
    },
    removeFromCart: (product: TrackingProduct, params?: any) => {
        console.log('🗑️ Remove from Cart:', { product, params, timestamp: new Date().toISOString() });
    },
    beginCheckout: (items: TrackingProduct[], params?: any) => {
        console.log('💳 Begin Checkout:', { items, params, timestamp: new Date().toISOString() });
    },
    purchase: (orderId: string, items: TrackingProduct[], params?: any) => {
        console.log('✅ Purchase:', { orderId, items, params, timestamp: new Date().toISOString() });
    },
    search: (term: string, params?: any) => {
        console.log('🔍 Search:', { term, params, timestamp: new Date().toISOString() });
    },
    signUp: (method: string, params?: any) => {
        console.log('📝 Sign Up:', { method, params, timestamp: new Date().toISOString() });
    },
    login: (method: string, params?: any) => {
        console.log('🔑 Login:', { method, params, timestamp: new Date().toISOString() });
    },
    generateLead: (value: number, currency: string, type: string, params?: any) => {
        console.log('🎯 Generate Lead:', { value, currency, type, params, timestamp: new Date().toISOString() });
    },
    customEvent: (name: string, params?: any) => {
        console.log('⚡ Custom Event:', { name, params, timestamp: new Date().toISOString() });
    }
};

// Example product data
const sampleProduct: TrackingProduct = {
    item_id: 'prod_123',
    item_name: 'Wireless Bluetooth Headphones',
    item_category: 'Electronics',
    item_category2: 'Audio',
    item_brand: 'TechBrand',
    price: 99.99,
    quantity: 1,
    currency: 'USD'
};



/**
 * Example component demonstrating event tracking utility usage
 * This shows how to implement tracking for common e-commerce events
 */
const EventTrackingExample: React.FC = () => {
    const [cartItems, setCartItems] = useState<TrackingProduct[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Track page view when component mounts
    useEffect(() => {
        lightweightTracking.pageView('Event Tracking Demo', '/demo/event-tracking');
    }, []);

    // Handle product view
    const handleViewProduct = () => {
        lightweightTracking.viewContent(sampleProduct, {
            source: 'demo_page',
            section: 'featured_products'
        });
        alert('Product view tracked! Check console.');
    };

    // Handle add to cart
    const handleAddToCart = () => {
        const productToAdd = { ...sampleProduct, quantity: 1 };
        
        lightweightTracking.addToCart(productToAdd, {
            source: 'product_page',
            button_location: 'main_cta'
        });
        
        setCartItems(prev => {
            const existingItem = prev.find(item => item.item_id === productToAdd.item_id);
            if (existingItem) {
                return prev.map(item => 
                    item.item_id === productToAdd.item_id 
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, productToAdd];
        });
        
        alert('Add to cart tracked! Check console.');
    };

    // Handle remove from cart
    const handleRemoveFromCart = (product: TrackingProduct) => {
        lightweightTracking.removeFromCart(product, {
            source: 'cart_page',
            removal_reason: 'user_action'
        });
        
        setCartItems(prev => prev.filter(item => item.item_id !== product.item_id));
        alert('Remove from cart tracked! Check console.');
    };

    // Handle begin checkout
    const handleBeginCheckout = () => {
        if (cartItems.length === 0) {
            alert('Add items to cart first!');
            return;
        }

        lightweightTracking.beginCheckout(cartItems, {
            currency: 'USD',
            coupon: 'DEMO10',
            checkout_step: 1,
            checkout_option: 'guest_checkout'
        });
        
        alert('Begin checkout tracked! Check console.');
    };

    // Handle purchase
    const handlePurchase = () => {
        if (cartItems.length === 0) {
            alert('Add items to cart first!');
            return;
        }

        const orderId = `order_${Date.now()}`;
        
        lightweightTracking.purchase(orderId, cartItems, {
            currency: 'USD',
            tax: 8.99,
            shipping: 5.99,
            coupon: 'DEMO10',
            affiliation: 'Demo Store',
            payment_method: 'credit_card',
            shipping_method: 'standard'
        });
        
        setCartItems([]); // Clear cart after purchase
        alert(`Purchase tracked! Order ID: ${orderId}. Check console.`);
    };

    // Handle search
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            lightweightTracking.search(searchTerm.trim(), {
                search_source: 'header_search',
                results_count: 42 // Mock results count
            });
            alert(`Search tracked for: "${searchTerm}". Check console.`);
        }
    };

    // Handle sign up
    const handleSignUp = () => {
        lightweightTracking.signUp('email', {
            signup_source: 'demo_page',
            signup_method: 'form'
        });
        setIsLoggedIn(true);
        alert('Sign up tracked! Check console.');
    };

    // Handle login
    const handleLogin = () => {
        lightweightTracking.login('email', {
            login_source: 'demo_page',
            login_method: 'form'
        });
        setIsLoggedIn(true);
        alert('Login tracked! Check console.');
    };

    // Handle lead generation
    const handleGenerateLead = () => {
        lightweightTracking.generateLead(25, 'USD', 'newsletter_signup', {
            lead_source: 'demo_page',
            campaign: 'demo_campaign'
        });
        alert('Lead generation tracked! Check console.');
    };

    // Handle custom event
    const handleCustomEvent = () => {
        lightweightTracking.customEvent('demo_interaction', {
            interaction_type: 'button_click',
            element_id: 'custom_event_button',
            timestamp: new Date().toISOString(),
            user_engagement_score: 85
        });
        alert('Custom event tracked! Check console.');
    };

    const totalValue = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Event Tracking Demo</h1>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h2 className="text-lg font-semibold text-blue-800 mb-2">📊 How to Test</h2>
                <ul className="text-blue-700 space-y-1">
                    <li>• Open browser console to see event logs</li>
                    <li>• All events are logged to console for demo purposes</li>
                </ul>
            </div>

            {/* Product Section */}
            <div className="bg-white border rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">🛍️ Product Interactions</h2>
                <div className="flex items-center space-x-4 mb-4">
                    <div className="flex-1">
                        <h3 className="font-medium">{sampleProduct.item_name}</h3>
                        <p className="text-gray-600">${sampleProduct.price}</p>
                        <p className="text-sm text-gray-500">{sampleProduct.item_category} • {sampleProduct.item_brand}</p>
                    </div>
                    <div className="space-x-2">
                        <button 
                            onClick={handleViewProduct}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            View Product
                        </button>
                        <button 
                            onClick={handleAddToCart}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>

            {/* Cart Section */}
            <div className="bg-white border rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">🛒 Shopping Cart ({cartItems.length} items)</h2>
                {cartItems.length > 0 ? (
                    <div>
                        {cartItems.map((item) => (
                            <div key={item.item_id} className="flex justify-between items-center py-2 border-b">
                                <div>
                                    <span className="font-medium">{item.item_name}</span>
                                    <span className="text-gray-600 ml-2">x{item.quantity}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                    <button 
                                        onClick={() => handleRemoveFromCart(item)}
                                        className="px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                        <div className="mt-4 pt-4 border-t">
                            <div className="flex justify-between items-center mb-4">
                                <span className="font-semibold">Total: ${totalValue.toFixed(2)}</span>
                            </div>
                            <div className="space-x-2">
                                <button 
                                    onClick={handleBeginCheckout}
                                    className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                                >
                                    Begin Checkout
                                </button>
                                <button 
                                    onClick={handlePurchase}
                                    className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                                >
                                    Complete Purchase
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500">Cart is empty. Add some products!</p>
                )}
            </div>

            {/* Search Section */}
            <div className="bg-white border rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">🔍 Search</h2>
                <form onSubmit={handleSearch} className="flex space-x-2">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search for products..."
                        className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button 
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Search
                    </button>
                </form>
            </div>

            {/* User Actions Section */}
            <div className="bg-white border rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">👤 User Actions</h2>
                <div className="space-x-2 mb-4">
                    {!isLoggedIn ? (
                        <>
                            <button 
                                onClick={handleSignUp}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Sign Up
                            </button>
                            <button 
                                onClick={handleLogin}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Login
                            </button>
                        </>
                    ) : (
                        <span className="text-green-600 font-medium">✓ Logged In</span>
                    )}
                </div>
                <button 
                    onClick={handleGenerateLead}
                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 mr-2"
                >
                    Generate Lead
                </button>
                <button 
                    onClick={handleCustomEvent}
                    className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                >
                    Custom Event
                </button>
            </div>

            {/* Debug Section */}
            <div className="bg-gray-50 border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">🔧 Debug Information</h2>
                <div className="space-y-2 text-sm">
                    <p><strong>Cart Items:</strong> {cartItems.length}</p>
                    <p><strong>Cart Value:</strong> ${totalValue.toFixed(2)}</p>
                    <p><strong>Tracking:</strong> ✅ Lightweight Console Logging</p>
                </div>
            </div>
        </div>
    );
};

export default EventTrackingExample;