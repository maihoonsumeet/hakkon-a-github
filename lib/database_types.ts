// Auto-generated types for Supabase
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          password: string
          role: string
          avatar: string
          bio: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          password: string
          role: string
          avatar: string
          bio?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          password?: string
          role?: string
          avatar?: string
          bio?: string
          created_at?: string
          updated_at?: string
        }
      }
      clubs: {
        Row: {
          id: number
          name: string
          sport: string
          logo: string
          tagline: string
          description: string
          creator_id: string
          funding_current: number
          funding_goal: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          sport: string
          logo: string
          tagline: string
          description: string
          creator_id: string
          funding_current?: number
          funding_goal?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          sport?: string
          logo?: string
          tagline?: string
          description?: string
          creator_id?: string
          funding_current?: number
          funding_goal?: number
          created_at?: string
          updated_at?: string
        }
      }
      user_club_follows: {
        Row: {
          user_id: string
          club_id: number
          created_at: string
        }
        Insert: {
          user_id: string
          club_id: number
          created_at?: string
        }
        Update: {
          user_id?: string
          club_id?: number
          created_at?: string
        }
      }
      posts: {
        Row: {
          id: number
          club_id: number
          text: string
          image: string | null
          likes: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          club_id: number
          text: string
          image?: string | null
          likes?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          club_id?: number
          text?: string
          image?: string | null
          likes?: number
          created_at?: string
          updated_at?: string
        }
      }
      comments: {
        Row: {
          id: number
          post_id: number
          user_id: string
          text: string
          created_at: string
        }
        Insert: {
          id?: number
          post_id: number
          user_id: string
          text: string
          created_at?: string
        }
        Update: {
          id?: number
          post_id?: number
          user_id?: string
          text?: string
          created_at?: string
        }
      }
      players: {
        Row: {
          id: number
          club_id: number
          name: string
          position: string
          number: number | null
          avatar: string
          created_at: string
        }
        Insert: {
          id?: number
          club_id: number
          name: string
          position: string
          number?: number | null
          avatar: string
          created_at?: string
        }
        Update: {
          id?: number
          club_id?: number
          name?: string
          position?: string
          number?: number | null
          avatar?: string
          created_at?: string
        }
      }
      merch: {
        Row: {
          id: number
          club_id: number
          name: string
          price: number
          image: string
          created_at: string
        }
        Insert: {
          id?: number
          club_id: number
          name: string
          price: number
          image: string
          created_at?: string
        }
        Update: {
          id?: number
          club_id?: number
          name?: string
          price?: number
          image?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}