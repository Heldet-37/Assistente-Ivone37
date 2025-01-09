import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a singleton instance that can be safely used even without proper configuration
export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key'
);

// Add a helper to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseKey);
};

// Wrap database operations with configuration check
async function ensureSupabaseConfig() {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase configuration is missing. Please connect to Supabase first.');
  }
}

export async function createUserProfile(email: string, name: string) {
  await ensureSupabaseConfig();
  
  const { data: userData, error: userError } = await supabase
    .from('users')
    .insert({
      email,
      name,
    })
    .select()
    .single();

  if (userError) {
    throw userError;
  }

  // Create default preferences
  await supabase
    .from('user_preferences')
    .insert({
      user_id: userData.id,
      preferred_name: name,
    });

  // Create default user data
  await supabase
    .from('user_data')
    .insert({
      user_id: userData.id,
      interests: [],
      favorite_topics: [],
    });

  return userData;
}

export async function updateUserProfile(userId: string, updates: {
  name?: string;
  email?: string;
  interests?: string[];
  favorite_topics?: string[];
}) {
  await ensureSupabaseConfig();

  const { error: userError } = await supabase
    .from('users')
    .update({
      name: updates.name,
      email: updates.email,
    })
    .eq('id', userId);

  if (userError) {
    throw userError;
  }

  if (updates.interests || updates.favorite_topics) {
    const { error: dataError } = await supabase
      .from('user_data')
      .update({
        interests: updates.interests,
        favorite_topics: updates.favorite_topics,
      })
      .eq('user_id', userId);

    if (dataError) {
      throw dataError;
    }
  }
}

export async function getFullUserProfile(userId: string) {
  await ensureSupabaseConfig();

  const [userData, preferences, data] = await Promise.all([
    supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single(),
    supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single(),
    supabase
      .from('user_data')
      .select('*')
      .eq('user_id', userId)
      .single(),
  ]);

  return {
    ...userData.data,
    preferences: preferences.data,
    userData: data.data,
  };
}