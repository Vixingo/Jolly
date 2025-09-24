import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { useAppDispatch } from '../store/hooks'
import { setUser, setProfile, setLoading, setError } from '../store/slices/authSlice'
import { initializeStorage } from '../lib/init-storage'

interface AuthContextType {
  user: User | null
  profile: any
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  initializeAuth: () => Promise<any>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null)
  const [profile, setProfileState] = useState<any>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const dispatch = useAppDispatch()

  // Initialize auth only when needed
  const initializeAuth = async () => {
    if (isInitialized) return
    
    try {
      // Initialize storage buckets
      await initializeStorage()
      
      // Get initial session
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setUserState(session.user)
        dispatch(setUser(session.user))
        fetchProfile(session.user.id)
      }
      dispatch(setLoading(false))

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_, session) => {
          if (session) {
            setUserState(session.user)
            dispatch(setUser(session.user))
            fetchProfile(session.user.id)
          } else {
            setUserState(null)
            setProfileState(null)
            dispatch(setUser(null))
            dispatch(setProfile(null))
          }
          dispatch(setLoading(false))
        }
      )
      
      setIsInitialized(true)
      return subscription
    } catch (error) {
      console.error('Failed to initialize auth:', error)
      dispatch(setLoading(false))
    }
  }

  // Set loading to false immediately for better LCP
  useEffect(() => {
    dispatch(setLoading(false))
  }, [dispatch])

  async function fetchProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return
      }

      setProfileState(data)
      dispatch(setProfile(data))
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  async function signIn(email: string, password: string) {
    try {
      // Initialize auth if not already done
      await initializeAuth()
      
      dispatch(setLoading(true))
      dispatch(setError(null))

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        dispatch(setError(error.message))
        throw error
      }
    } catch (error) {
      console.error('Error signing in:', error)
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }

  async function signUp(email: string, password: string, fullName: string) {
    try {
      // Initialize auth if not already done
      await initializeAuth()
      
      dispatch(setLoading(true))
      dispatch(setError(null))

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) {
        dispatch(setError(error.message))
        throw error
      }

      // Create user profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              email: data.user.email!,
              full_name: fullName,
              role: 'customer',
            },
          ])

        if (profileError) {
          console.error('Error creating profile:', profileError)
        }
      }
    } catch (error) {
      console.error('Error signing up:', error)
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }

  async function signOut() {
    try {
      // Initialize auth if not already done
      await initializeAuth()
      
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error signing out:', error)
      }
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  async function resetPassword(email: string) {
    try {
      // Initialize auth if not already done
      await initializeAuth()
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Error resetting password:', error)
      throw error
    }
  }

  const value = {
    user,
    profile,
    signIn,
    signUp,
    signOut,
    resetPassword,
    initializeAuth,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
