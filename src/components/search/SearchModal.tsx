import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setSearchOpen } from '../../store/slices/uiSlice'
import { setSearchQuery } from '../../store/slices/productsSlice'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { 
  X, 
  Search, 
  Package,
  TrendingUp
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useFormatCurrency, debounce } from '../../lib/utils'

export default function SearchModal() {
  const dispatch = useAppDispatch()
  const { searchOpen } = useAppSelector(state => state.ui)
  const { searchQuery, filteredProducts, categories } = useAppSelector(state => state.products)
  const [localQuery, setLocalQuery] = useState('')
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const formatCurrency = useFormatCurrency()

  useEffect(() => {
    if (searchOpen) {
      setLocalQuery(searchQuery)
      // Load recent searches from localStorage
      const saved = localStorage.getItem('recentSearches')
      if (saved) {
        setRecentSearches(JSON.parse(saved))
      }
    }
  }, [searchOpen, searchQuery])

  const handleSearch = debounce((query: string) => {
    dispatch(setSearchQuery(query))
    // Save to recent searches
    if (query.trim()) {
      const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5)
      setRecentSearches(updated)
      localStorage.setItem('recentSearches', JSON.stringify(updated))
    }
  }, 300)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocalQuery(value)
    handleSearch(value)
  }

  const handleRecentSearch = (query: string) => {
    setLocalQuery(query)
    dispatch(setSearchQuery(query))
  }

  const handleClearRecent = () => {
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }

  if (!searchOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={() => dispatch(setSearchOpen(false))}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
        <div className="w-full max-w-2xl bg-background rounded-lg shadow-xl border">
          {/* Header */}
          <div className="flex items-center space-x-3 p-4 border-b">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={localQuery}
              onChange={handleInputChange}
              className="flex-1 border-0 focus-visible:ring-0 text-lg"
              autoFocus
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dispatch(setSearchOpen(false))}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="max-h-96 overflow-y-auto">
            {localQuery.trim() ? (
              // Search Results
              <div className="p-4">
                {filteredProducts.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                    </p>
                    {filteredProducts.slice(0, 8).map((product) => (
                      <Link
                        key={product.id}
                        to={`/product/${product.id}`}
                        onClick={() => dispatch(setSearchOpen(false))}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="w-12 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground truncate">
                            {product.name}
                          </h3>
                          <p className="text-sm text-muted-foreground truncate">
                            {product.description}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-sm font-medium text-primary">
                              {formatCurrency(product.price)}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {product.category}
                            </Badge>
                          </div>
                        </div>
                      </Link>
                    ))}
                    {filteredProducts.length > 8 && (
                      <div className="text-center pt-2">
                        <Button variant="outline" size="sm">
                          View all results
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No products found</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Try adjusting your search terms
                    </p>
                  </div>
                )}
              </div>
            ) : (
              // Default State
              <div className="p-4">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-foreground">Recent Searches</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearRecent}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        Clear
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((search, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleRecentSearch(search)}
                          className="text-xs"
                        >
                          {search}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Categories */}
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-3">Popular Categories</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.slice(0, 6).map((category) => (
                      <Button
                        key={category}
                        variant="ghost"
                        className="justify-start h-auto p-3"
                        onClick={() => handleRecentSearch(category)}
                      >
                        <TrendingUp className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{category}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
