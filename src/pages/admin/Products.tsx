import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setProducts, setLoading, setError, addProduct, updateProduct, removeProduct } from '../../store/slices/productsSlice'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { 
  Package, 
  Plus, 
  Search, 
  Edit,
  Trash2
} from 'lucide-react'
import { getLocalProducts } from '../../lib/local-data-service'
import { createProductWithSync, updateProductWithSync, deleteProductWithSync } from '../../lib/sync-service'
import { useFormatCurrency } from '../../lib/utils'
// Removed unused imports: deleteFile, getFilePathFromUrl
import { uploadProductImages, deleteProductImages } from '../../lib/product-image-utils'
import ProductModal from '../../components/admin/ProductModal'
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal'
import type { Product } from '../../store/slices/productsSlice'

export default function AdminProducts() {
  const dispatch = useAppDispatch()
  const { products, isLoading } = useAppSelector(state => state.products)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const formatCurrency = useFormatCurrency()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      dispatch(setLoading(true))
      const products = await getLocalProducts()
      dispatch(setProducts(products))
    } catch {
      dispatch(setError('Failed to fetch products'))
    } finally {
      dispatch(setLoading(false))
    }
  }

  const handleCreateProduct = () => {
    setModalMode('create')
    setSelectedProduct(null)
    setIsProductModalOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setModalMode('edit')
    setSelectedProduct(product)
    setIsProductModalOpen(true)
  }

  const handleDeleteProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedProduct) return

    try {
      // First, delete the product images from storage using our utility
      await deleteProductImages(selectedProduct.id)
      
      // Then delete the product from the database and sync to local JSON
      const success = await deleteProductWithSync(selectedProduct.id)

      if (!success) {
        console.error('Error deleting product')
        return
      }

      dispatch(removeProduct(selectedProduct.id))
      setIsDeleteModalOpen(false)
      setSelectedProduct(null)
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  const handleSaveProduct = async (productData: Partial<Product> & { tempFiles?: File[] }) => {
    try {
      // Extract tempFiles from productData
      const { tempFiles, ...productDataWithoutFiles } = productData
      
      if (modalMode === 'create') {
        // First create the product without images and sync to local JSON
        const data = await createProductWithSync(productDataWithoutFiles)

        if (!data) {
          console.error('Error creating product')
          return
        }
        
        // If we have temporary files, upload them now that we have a product ID
        if (tempFiles && tempFiles.length > 0) {
          const uploadedUrls = await uploadProductImages(data.id, tempFiles)
          
          // Update the product with the image URLs
          if (uploadedUrls.length > 0) {
            const updatedData = await updateProductWithSync(data.id, { images: uploadedUrls })
              
            if (!updatedData) {
              console.error('Error updating product with images')
            } else {
              // Use the updated data with images
              dispatch(addProduct(updatedData))
              setIsProductModalOpen(false)
              setSelectedProduct(null)
              return
            }
          }
        }

        dispatch(addProduct(data))
      } else if (modalMode === 'edit' && selectedProduct) {
        // For edit mode, handle any new temporary files
        if (tempFiles && tempFiles.length > 0) {
          const uploadedUrls = await uploadProductImages(selectedProduct.id, tempFiles)
          
          // Add new URLs to existing images
          productDataWithoutFiles.images = [
            ...(productDataWithoutFiles.images || []),
            ...uploadedUrls
          ]
        }
        
        const data = await updateProductWithSync(selectedProduct.id, productDataWithoutFiles)

        if (!data) {
          console.error('Error updating product')
          return
        }

        dispatch(updateProduct(data))
      }

      setIsProductModalOpen(false)
      setSelectedProduct(null)
    } catch (error) {
      console.error('Error saving product:', error)
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))]

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Product Management</h1>
          <p className="text-muted-foreground mt-1">Manage your store's product inventory</p>
        </div>
        <Button onClick={handleCreateProduct} size="sm" className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Products</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring focus:ring-offset-1"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Total Products</label>
              <div className="p-2 bg-muted rounded-md text-center font-semibold flex items-center justify-center gap-2">
                <Package className="h-4 w-4" />
                {filteredProducts.length}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 flex flex-col h-full">
            <CardHeader className="p-0">
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={product.images[0] || '/placeholder-product.jpg'}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    {product.category}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  {product.stock < 10 && product.stock > 0 && (
                    <Badge variant="destructive">
                      Low Stock
                    </Badge>
                  )}
                  {product.stock === 0 && (
                    <Badge variant="destructive">
                      Out of Stock
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-4 flex-grow">
              <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-2">
                {product.name}
              </h3>
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                {product.description}
              </p>
              
              <div className="space-y-2 mt-auto">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-primary">
                    {formatCurrency(product.price)}
                  </span>
                  <span className="text-sm bg-muted px-2 py-1 rounded-md">
                    Stock: {product.stock}
                  </span>
                </div>
                
                <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between text-xs text-muted-foreground gap-1">
                  <span>Created: {new Date(product.created_at).toLocaleDateString()}</span>
                  <span>Updated: {new Date(product.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
            
            <div className="p-4 pt-0">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEditProduct(product)}
                  className="flex-1 hover:bg-primary hover:text-primary-foreground"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDeleteProduct(product)}
                  className="flex-1 hover:bg-destructive hover:text-destructive-foreground"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card className="text-center py-12 border-dashed">
          <CardContent className="flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <Package className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {searchQuery || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filters to find what you\'re looking for.'
                : 'Your product catalog is empty. Get started by adding your first product.'
              }
            </p>
            {!searchQuery && selectedCategory === 'all' && (
              <Button onClick={handleCreateProduct} className="animate-pulse">
                <Plus className="h-4 w-4 mr-2" />
                Add First Product
              </Button>
            )}
            {(searchQuery || selectedCategory !== 'all') && (
              <Button variant="outline" onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}>
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Product Modal */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false)
          setSelectedProduct(null)
        }}
        onSave={handleSaveProduct}
        product={selectedProduct}
        mode={modalMode}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedProduct(null)
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${selectedProduct?.name}"? This action cannot be undone.`}
      />
    </div>
  )
}
