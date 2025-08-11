import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface UIState {
  sidebarOpen: boolean
  cartOpen: boolean
  searchOpen: boolean
  mobileMenuOpen: boolean
  theme: 'light' | 'dark'
  notifications: Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    message: string
    duration?: number
  }>
}

const initialState: UIState = {
  sidebarOpen: false,
  cartOpen: false,
  searchOpen: false,
  mobileMenuOpen: false,
  theme: 'light',
  notifications: [],
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
    
    toggleCart: (state) => {
      state.cartOpen = !state.cartOpen
    },
    
    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.cartOpen = action.payload
    },
    
    toggleSearch: (state) => {
      state.searchOpen = !state.searchOpen
    },
    
    setSearchOpen: (state, action: PayloadAction<boolean>) => {
      state.searchOpen = action.payload
    },
    
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen
    },
    
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.mobileMenuOpen = action.payload
    },
    
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload
    },
    
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
    },
    
    addNotification: (state, action: PayloadAction<{
      type: 'success' | 'error' | 'warning' | 'info'
      message: string
      duration?: number
    }>) => {
      const id = Math.random().toString(36).substr(2, 9)
      state.notifications.push({
        id,
        ...action.payload,
        duration: action.payload.duration || 5000,
      })
    },
    
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload)
    },
    
    clearNotifications: (state) => {
      state.notifications = []
    },
    
    closeAllModals: (state) => {
      state.sidebarOpen = false
      state.cartOpen = false
      state.searchOpen = false
      state.mobileMenuOpen = false
    },
  },
})

export const { 
  toggleSidebar, 
  setSidebarOpen, 
  toggleCart, 
  setCartOpen, 
  toggleSearch, 
  setSearchOpen, 
  toggleMobileMenu, 
  setMobileMenuOpen, 
  setTheme, 
  toggleTheme, 
  addNotification, 
  removeNotification, 
  clearNotifications, 
  closeAllModals 
} = uiSlice.actions

export default uiSlice.reducer
