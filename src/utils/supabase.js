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
export const isAuthenticated = async () => {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error('Error getting session:', error.message);
    return { loggedIn: false, metadata: null };
  }

  if (data.session) {
    const { id, email, user_metadata } = data.session.user;

    userData.id = id;
    userData.email = email;
    userData.metadata = user_metadata;

    return { loggedIn: true, metadata: user_metadata };
  }

  userData.id = null;
  userData.email = null;
  userData.metadata = null;

  return { loggedIn: false, metadata: null };
};

export default supabase