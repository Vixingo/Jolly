import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setProducts, setLoading, setError } from '../store/slices/productsSlice'
import { addToCart } from '../store/slices/cartSlice'
import { useStoreName, useStoreSettings } from '../contexts/StoreSettingsContext'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '../components/ui/card'
import Footer from '../components/layout/Footer'
import { 
  ArrowRight, 
  Star, 
  ShoppingCart,
  Package,
  TrendingUp,
  Zap
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useFormatCurrency, truncateText } from '../lib/utils'
import { getLocalProducts } from '../lib/local-data-service'

// Add these imports at the top
import { useNavigate } from 'react-router-dom'
import { setCartOpen } from '../store/slices/uiSlice'
import { toast } from 'sonner'

export default function HomePage() {
  const dispatch = useAppDispatch()
  const { products, categories, isLoading } = useAppSelector(state => state.products)
  const navigate = useNavigate()
  const storeName = useStoreName()
  const { storeSettings } = useStoreSettings()
  const formatCurrency = useFormatCurrency()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      dispatch(setLoading(true))
      const products = await getLocalProducts()
      dispatch(setProducts(products))
    } catch (error) {
      dispatch(setError('Failed to fetch products'))
    } finally {
      dispatch(setLoading(false))
    }
  }

  const handleAddToCart = (product: any) => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1,
      category: product.category
    }))

    toast.success('Added to cart', {
      position: 'top-center',
      className: 'w-fit text-sm py-2 px-3'
    })
    
    dispatch(setCartOpen(true))
  }

  const handleBuyNow = (product: any) => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1,
      category: product.category
    }))

    toast.success('Proceeding to checkout', {
      position: 'bottom-left',
      className: 'lg:ml-4'
    })
    
    navigate('/checkout')
  }

  const featuredProducts = products.slice(0, 6)
  const popularCategories = categories.slice(0, 4)

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-96 bg-muted rounded-lg"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Welcome to{' '}
            <span className="text-primary">{storeName}</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {storeSettings?.store_description || 'Discover amazing products with exceptional quality and unbeatable prices. Shop with confidence and enjoy a seamless shopping experience.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link to="/products">
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              Learn More
            </Button>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 opacity-10">
          <Package className="h-32 w-32 text-primary" />
        </div>
        <div className="absolute bottom-10 right-10 opacity-10">
          <TrendingUp className="h-32 w-32 text-primary" />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Shop by Category
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our curated collection of products organized by category
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {popularCategories.map((category) => (
              <Link
                key={category}
                to={`/products?category=${category}`}
                className="group"
              >
                <Card className="text-center hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                      <Package className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {category}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Featured Products
              </h2>
              <p className="text-muted-foreground">
                Handpicked products you'll love
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to="/products">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
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
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      {formatCurrency(product.price)}
                    </span>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < 4 ? 'text-yellow-400 fill-current' : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="p-4 pt-0">
                  <div className="flex gap-2 w-full">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAddToCart(product)
                      }}
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                    <Button 
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleBuyNow(product)
                      }}
                      disabled={product.stock === 0}
                    >
                      Buy Now
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Shopping?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Jolly for their shopping needs
          </p>
          <Button 
            asChild 
            size="lg" 
            variant="secondary"
            className="text-lg px-8 py-6"
          >
            <Link to="/products">
              <Zap className="mr-2 h-5 w-5" />
              Explore Products
            </Link>
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}
