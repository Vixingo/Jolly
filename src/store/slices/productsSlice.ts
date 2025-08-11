import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  stock: number
  created_at: string
  updated_at: string
}

interface ProductsState {
  products: Product[]
  categories: string[]
  selectedCategory: string | null
  isLoading: boolean
  error: string | null
  searchQuery: string
  filteredProducts: Product[]
}

const initialState: ProductsState = {
  products: [],
  categories: [],
  selectedCategory: null,
  isLoading: false,
  error: null,
  searchQuery: '',
  filteredProducts: [],
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload
      state.categories = [...new Set(action.payload.map(product => product.category))]
      state.filteredProducts = action.payload
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload
      state.filteredProducts = state.products.filter(product => 
        !action.payload || product.category === action.payload
      )
    },
    
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
      const query = action.payload.toLowerCase()
      const categoryFilter = state.selectedCategory
      
      state.filteredProducts = state.products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(query) || 
                            product.description.toLowerCase().includes(query)
        const matchesCategory = !categoryFilter || product.category === categoryFilter
        return matchesSearch && matchesCategory
      })
    },
    
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload)
      if (!state.categories.includes(action.payload.category)) {
        state.categories.push(action.payload.category)
      }
    },
    
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex(p => p.id === action.payload.id)
      if (index !== -1) {
        state.products[index] = action.payload
      }
    },
    
    removeProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(p => p.id !== action.payload)
    },
    
    clearFilters: (state) => {
      state.selectedCategory = null
      state.searchQuery = ''
      state.filteredProducts = state.products
    },
  },
})

export const { 
  setProducts, 
  setLoading, 
  setError, 
  setSelectedCategory, 
  setSearchQuery, 
  addProduct, 
  updateProduct, 
  removeProduct, 
  clearFilters 
} = productsSlice.actions

export default productsSlice.reducer
