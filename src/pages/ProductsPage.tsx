import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
    setProducts,
    setLoading,
    setError,
} from "../store/slices/productsSlice";
import { addToCart } from "../store/slices/cartSlice";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "../components/ui/card";
import { Package, ShoppingCart, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFormatCurrency, truncateText } from "../lib/utils";
import { toast } from "sonner";
import { setCartOpen } from "../store/slices/uiSlice";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";

// import { InlineWhatsAppButton } from "../components/support/WhatsAppButton";

export default function ProductsPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { products, categories, isLoading } = useAppSelector(
        (state) => state.products
    );
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedCategory, setSelectedCategory] = useState(
        searchParams.get("category") || "all"
    );
    const formatCurrency = useFormatCurrency();

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (selectedCategory !== "all") {
            setSearchParams({ category: selectedCategory });
        } else {
            setSearchParams({});
        }
    }, [selectedCategory]);

    const fetchProducts = async () => {
    try {
      dispatch(setLoading(true))
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        dispatch(setError(error.message))
        return
      }

      dispatch(setProducts(data || []))
    } catch (error) {
      dispatch(setError('Failed to fetch products'))
    } finally {
      dispatch(setLoading(false))
    }
  }

    const handleAddToCart = (product: any) => {
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

        toast.success("Added to cart", {
            position: "top-center",
            className: "w-fit text-sm py-2 px-3",
        });

        dispatch(setCartOpen(true));
    };

    const handleBuyNow = (product: any) => {
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

        toast.success("অর্ডার কনফার্ম করুন ", {
            position: "top-right",
            className: "lg:ml-4",
        });

        navigate("/checkout");
    };

    const filteredProducts =
        selectedCategory === "all"
            ? products
            : products.filter(
                  (product) => product.category === selectedCategory
              );

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse space-y-8">
                    <div className="h-96 bg-muted rounded-lg"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="h-80 bg-muted rounded-lg"
                            ></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Category Filter */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">Our Products</h1>
                    <div className="flex items-center gap-4">
                        {/* <InlineWhatsAppButton message="Hi! I need help choosing the right product." /> */}
                        <Filter className="h-5 w-5 text-muted-foreground" />
                        <Select
                            value={selectedCategory}
                            onValueChange={(value) =>
                                setSelectedCategory(value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>

                            <SelectGroup >
                                <SelectLabel>Category</SelectLabel>
                                <SelectItem value="all">All Categories</SelectItem>
                            {categories.map((category) => (
                                    
                                <SelectItem value={category} key={category}>
                                    {category}
                                </SelectItem>
                        ))}                                
                        </SelectGroup>
                        </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                    <Card
                        key={product.id}
                        className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
                        onClick={() => navigate(`/product/${product.id}`)}
                    >
                        <CardHeader className="p-0">
                            <div className="relative overflow-hidden rounded-t-lg">
                                <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <Badge
                                    variant="secondary"
                                    className="absolute top-3 left-3"
                                >
                                    {product.category}
                                </Badge>
                                {product.stock < 10 && product.stock > 0 && (
                                    <Badge
                                        variant="destructive"
                                        className="absolute top-3 right-3"
                                    >
                                        Only {product.stock} left!
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>

                        <CardContent className="p-4">
                            <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                                {product.name}
                            </h3>
                            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                                {truncateText(product.description, 100)}
                            </p>
                            {product.offer_price ? (
                                <div>
                                    <span className="text-2xl font-bold text-primary block">
                                        {formatCurrency(product.offer_price)}
                                    </span>
                                    <span className="text-sm line-through text-muted-foreground">
                                        {formatCurrency(product.price)}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-2xl font-bold text-primary">
                                    {formatCurrency(product.price)}
                                </span>
                            )}
                        </CardContent>

                        <CardFooter className="p-4 pt-0">
                            <div className="flex gap-2 w-full">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddToCart(product);
                                    }}
                                    disabled={product.stock === 0}
                                >
                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                    {product.stock === 0
                                        ? "Out of Stock"
                                        : "Add to Cart"}
                                </Button>
                                <Button
                                    className="flex-1"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleBuyNow(product);
                                    }}
                                    disabled={product.stock === 0}
                                >
                                    অর্ডার করুন 
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                    <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-xl font-semibold mb-2">
                        No Products Found
                    </h2>
                    <p className="text-muted-foreground">
                        No products found in this category. Try selecting a
                        different category.
                    </p>
                </div>
            )}
        </div>
    );
}
