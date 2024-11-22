import { createClient } from '@supabase/supabase-js'
import { reactive } from 'vue'

// 👉 Create a single supabase client for interacting with your database
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
)

export const formActionDefault = {
  formProcess: false,
  formStatus: 200,
  formErrorMessage: '',
  formSuccessMessage: ''
}

// Reactive user state
export const userData = reactive({
  id: null,
  email: null,
  metadata: null,
})

// Function to check authentication status
export const isAuthenticated = async () => {
  const { data, error } = await supabase.auth.getSession()

  if (error) {
    console.error('Error getting session:', error.message)
    return false
  }

  if (data.session) {
    const { id, email, user_metadata } = data.session.user
    userData.id = id
    userData.email = email
    userData.metadata = user_metadata
  } else {
    userData.id = null
    userData.email = null
    userData.metadata = null
  }

  return !!data.session
}
export default supabase