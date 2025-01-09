export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          created_at: string
          last_interaction: string
          interaction_count: number
          mood_tracking: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          created_at?: string
          last_interaction?: string
          interaction_count?: number
          mood_tracking?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          created_at?: string
          last_interaction?: string
          interaction_count?: number
          mood_tracking?: string
        }
      }
      conversations: {
        Row: {
          id: string
          user_id: string
          message: string
          response: string
          sentiment: string | null
          created_at: string
          context: Json
        }
        Insert: {
          id?: string
          user_id: string
          message: string
          response: string
          sentiment?: string | null
          created_at?: string
          context?: Json
        }
        Update: {
          id?: string
          user_id?: string
          message?: string
          response?: string
          sentiment?: string | null
          created_at?: string
          context?: Json
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          preferred_name: string | null
          theme: string
          language: string
          notification_enabled: boolean
          custom_settings: Json
        }
        Insert: {
          id?: string
          user_id: string
          preferred_name?: string | null
          theme?: string
          language?: string
          notification_enabled?: boolean
          custom_settings?: Json
        }
        Update: {
          id?: string
          user_id?: string
          preferred_name?: string | null
          theme?: string
          language?: string
          notification_enabled?: boolean
          custom_settings?: Json
        }
      }
      user_data: {
        Row: {
          id: string
          user_id: string
          interests: string[]
          favorite_topics: string[]
          interaction_history: Json
          last_topics: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          interests?: string[]
          favorite_topics?: string[]
          interaction_history?: Json
          last_topics?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          interests?: string[]
          favorite_topics?: string[]
          interaction_history?: Json
          last_topics?: Json
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}