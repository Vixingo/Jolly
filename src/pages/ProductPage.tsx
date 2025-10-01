import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../store/hooks";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Package, ShoppingCart } from "lucide-react";
import { useFormatCurrency } from "../lib/utils";
import { addToCart } from "../store/slices/cartSlice";
import { setCartOpen } from "../store/slices/uiSlice";
import { toast } from "sonner";
import type { Product } from "../store/slices/productsSlice";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import WhatsAppButton from "../components/support/WhatsAppButton";
import { supabase } from "@/lib/supabase";
import enhancedTracking from "@/lib/event-tracking";

export default function ProductPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [hasTrackedView, setHasTrackedView] = useState(false);
    const formatCurrency = useFormatCurrency();

    useEffect(() => {
        fetchProduct();
    }, [id]);

    // Track ViewContent event when product is loaded (only once)
    useEffect(() => {
        if (product && !hasTrackedView) {
            enhancedTracking.viewContent({
                item_id: product.id,
                item_name: product.name,
                item_category: product.category,
                price: product.price,
                quantity: 1,
                currency: 'BDT'
            });
            setHasTrackedView(true);
        }
    }, [product, hasTrackedView]);

    const fetchProduct = async () => {
        if (!id) return;
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error("Error fetching product:", error);
                setProduct(null);
            } else {
                setProduct(data);
            }
        } catch (error) {
            console.error("Error fetching product:", error);
            setProduct(null);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (!product) return;

        dispatch(
            addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images[0],
                quantity: 1,
                category: product.category,
            })
        );

        // Track AddToCart event
        enhancedTracking.addToCart({
            item_id: product.id,
            item_name: product.name,
            item_category: product.category,
            price: product.price,
            quantity: 1,
            currency: 'BDT'
        });

        toast.success("Added to cart", {
            position: "top-center",
            className: "w-fit text-sm py-2 px-3",
        });
        dispatch(setCartOpen(true));
    };

    const handleBuyNow = () => {
        if (!product) return;

        dispatch(
            addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images[0],
                quantity: 1,
                category: product.category,
            })
        );

        // Track AddToCart event for Buy Now
        enhancedTracking.addToCart({
            item_id: product.id,
            item_name: product.name,
            item_category: product.category,
            price: product.price,
            quantity: 1,
            currency: 'BDT'
        });

        toast.success("অর্ডার কনফার্ম করুন ", {  
            position: "top-right",
            className: "lg:ml-4",
        });

        navigate("/checkout");
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse space-y-8">
                    <div className="h-96 bg-muted rounded-lg"></div>
                    <div className="space-y-4">
                        <div className="h-8 bg-muted rounded w-3/4"></div>
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                        <div className="h-4 bg-muted rounded w-1/4"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card>
                    <CardContent className="text-center py-12">
                        <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">
                            Product Not Found
                        </h2>
                        <p className="text-muted-foreground">
                            The product you're looking for doesn't exist or has
                            been removed.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Schema.org Product microdata */}
            <div 
                itemScope 
                itemType="https://schema.org/Product"
                className="hidden"
            >
                <meta itemProp="productID" content={product.id} />
                <meta itemProp="name" content={product.name} />
                <meta itemProp="description" content={product.description} />
                <meta itemProp="image" content={product.images[0]} />
                <meta itemProp="category" content={product.category} />
                <div itemProp="brand" itemScope itemType="https://schema.org/Brand">
                    <meta itemProp="name" content={(product as any).brand || ''} />
                </div>
                <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
                    <meta itemProp="price" content={String(product.offer_price || product.price)} />
                    <meta itemProp="priceCurrency" content="BDT" />
                    <meta itemProp="availability" content={product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"} />
                    <meta itemProp="url" content={window.location.href} />
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Replace the existing image gallery with carousel */}
                <div className="relative overflow-hidden rounded-lg bg-background">
                    <Carousel
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        className="w-full"
                    >
                        <CarouselContent>
                            {product.images.map((image, index) => (
                                <CarouselItem
                                    key={index}
                                    className="basis-full"
                                >
                                    <div className="aspect-square overflow-hidden rounded-lg">
                                        <img
                                            src={image}
                                            alt={`Product image ${index + 1}`}
                                            className="h-full w-full object-cover object-center"
                                        />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
                        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
                    </Carousel>
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            {product.name}
                        </h1>
                        {product.offer_price ? (
                            <div className="mb-4">
                                <p className="text-2xl font-semibold text-primary">
                                    {formatCurrency(product.offer_price)}
                                </p>
                                <p className="text-lg line-through text-muted-foreground">
                                    {formatCurrency(product.price)}
                                </p>
                            </div>
                        ) : (
                            <p className="text-2xl font-semibold text-primary mb-4">
                                {formatCurrency(product.price)}
                            </p>
                        )}
                        <p className="text-muted-foreground">
                            {product.description}
                        </p>
                    </div>

                    <div className="space-y-5">
                        <p className="text-sm text-muted-foreground">
                            Category:{" "}
                            <span className="text-muted-foreground">
                                {product.category}
                            </span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Stock:{" "}
                            <span className="text-muted-foreground">
                                {product.stock} units
                            </span>
                        </p>
                    </div>

                    {/* Move buttons outside the details section for mobile */}
                    <div className="hidden md:flex gap-4 pt-6">
                        <Button
                            onClick={handleAddToCart}
                            variant="outline"
                            className="flex-1"
                            disabled={!product || product.stock === 0}
                        >
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            {product.stock === 0
                                ? "Out of Stock"
                                : "Add to Cart"}
                        </Button>
                        <Button
                            onClick={handleBuyNow}
                            className="flex-1"
                            disabled={!product || product.stock === 0}
                        >
                             অর্ডার করুন 
                        </Button>
                    </div>
                </div>
            </div>

            {/* Fixed bottom buttons for mobile */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
                <div className="flex gap-4 max-w-lg mx-auto">
                    <Button
                        onClick={handleAddToCart}
                        variant="outline"
                        className="flex-1"
                        disabled={!product || product.stock === 0}
                    >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                    </Button>
                    <Button
                        onClick={handleBuyNow}
                        className="flex-1"
                        disabled={!product || product.stock === 0}
                    >
অর্ডার করুন 
                    </Button>
                </div>
            </div>

            {/* WhatsApp Support Button */}
            <WhatsAppButton
                message={`Hi! I have a question about ${
                    product?.name || "this product"
                }.`}
            />
        </div>
    );
}
