import { useState, useEffect } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../config/supabase'
import { SupabaseService } from '../services/supabaseService'

export interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  userProfile: any | null
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    userProfile: null,
  })

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) {
        console.error('Error getting session:', error)
        setAuthState(prev => ({ ...prev, loading: false }))
        return
      }

      if (session?.user) {
        try {
          const userProfile = await SupabaseService.getCurrentUserProfile()
          setAuthState({
            user: session.user,
            session,
            loading: false,
            userProfile,
          })
        } catch (error) {
          console.error('Error getting user profile:', error)
          setAuthState({
            user: session.user,
            session,
            loading: false,
            userProfile: null,
          })
        }
      } else {
        setAuthState({
          user: null,
          session: null,
          loading: false,
          userProfile: null,
        })
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        // Sonsuz döngüyü önlemek için loading state kontrolü
        if (authState.loading) return;
        
        if (session?.user) {
          try {
            setAuthState(prev => ({ ...prev, loading: true }));
            const userProfile = await SupabaseService.getCurrentUserProfile()
            setAuthState({
              user: session.user,
              session,
              loading: false,
              userProfile,
            })
          } catch (error) {
            console.error('Error getting user profile:', error)
            setAuthState({
              user: session.user,
              session,
              loading: false,
              userProfile: null,
            })
          }
        } else {
          setAuthState({
            user: null,
            session: null,
            loading: false,
            userProfile: null,
          })
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }))
      const result = await SupabaseService.signUp(email, password, userData)
      return result
    } catch (error) {
      throw error
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }))
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }))
      const result = await SupabaseService.signIn(email, password)
      return result
    } catch (error) {
      throw error
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }))
    }
  }

  const signOut = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }))
      await SupabaseService.signOut()
    } catch (error) {
      throw error
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }))
    }
  }

  const updateProfile = async (userData: any) => {
    if (!authState.user) throw new Error('No user logged in')
    
    try {
      const updatedProfile = await SupabaseService.updateUserProfile(authState.user.id, userData)
      setAuthState(prev => ({ ...prev, userProfile: updatedProfile }))
      return updatedProfile
    } catch (error) {
      throw error
    }
  }

  return {
    ...authState,
    signUp,
    signIn,
    signOut,
    updateProfile,
  }
}

