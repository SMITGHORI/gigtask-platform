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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'freelancer' | 'client' | 'admin'
          bio: string | null
          skills: string[] | null
          location: string | null
          phone: string | null
          website: string | null
          hourly_rate: number | null
          rating: number | null
          total_earnings: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'freelancer' | 'client' | 'admin'
          bio?: string | null
          skills?: string[] | null
          location?: string | null
          phone?: string | null
          website?: string | null
          hourly_rate?: number | null
          rating?: number | null
          total_earnings?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'freelancer' | 'client' | 'admin'
          bio?: string | null
          skills?: string[] | null
          location?: string | null
          phone?: string | null
          website?: string | null
          hourly_rate?: number | null
          rating?: number | null
          total_earnings?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          slug: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon?: string | null
          slug: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string | null
          slug?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      gigs: {
        Row: {
          id: string
          title: string
          description: string
          category_id: string
          client_id: string
          budget_type: 'fixed' | 'hourly'
          budget_amount: number
          budget_min: number | null
          budget_max: number | null
          deadline: string | null
          skills_required: string[]
          status: 'draft' | 'published' | 'in_progress' | 'completed' | 'cancelled'
          difficulty_level: 'beginner' | 'intermediate' | 'expert'
          location_type: 'remote' | 'onsite' | 'hybrid'
          location: string | null
          attachments: Json[] | null
          views: number
          applications_count: number
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          category_id: string
          client_id: string
          budget_type: 'fixed' | 'hourly'
          budget_amount: number
          budget_min?: number | null
          budget_max?: number | null
          deadline?: string | null
          skills_required: string[]
          status?: 'draft' | 'published' | 'in_progress' | 'completed' | 'cancelled'
          difficulty_level?: 'beginner' | 'intermediate' | 'expert'
          location_type?: 'remote' | 'onsite' | 'hybrid'
          location?: string | null
          attachments?: Json[] | null
          views?: number
          applications_count?: number
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category_id?: string
          client_id?: string
          budget_type?: 'fixed' | 'hourly'
          budget_amount?: number
          budget_min?: number | null
          budget_max?: number | null
          deadline?: string | null
          skills_required?: string[]
          status?: 'draft' | 'published' | 'in_progress' | 'completed' | 'cancelled'
          difficulty_level?: 'beginner' | 'intermediate' | 'expert'
          location_type?: 'remote' | 'onsite' | 'hybrid'
          location?: string | null
          attachments?: Json[] | null
          views?: number
          applications_count?: number
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      applications: {
        Row: {
          id: string
          gig_id: string
          freelancer_id: string
          proposal: string
          proposed_rate: number
          estimated_duration: string | null
          cover_letter: string | null
          attachments: Json[] | null
          status: 'pending' | 'accepted' | 'rejected' | 'withdrawn'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          gig_id: string
          freelancer_id: string
          proposal: string
          proposed_rate: number
          estimated_duration?: string | null
          cover_letter?: string | null
          attachments?: Json[] | null
          status?: 'pending' | 'accepted' | 'rejected' | 'withdrawn'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          gig_id?: string
          freelancer_id?: string
          proposal?: string
          proposed_rate?: number
          estimated_duration?: string | null
          cover_letter?: string | null
          attachments?: Json[] | null
          status?: 'pending' | 'accepted' | 'rejected' | 'withdrawn'
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          gig_id: string
          reviewer_id: string
          reviewee_id: string
          rating: number
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          gig_id: string
          reviewer_id: string
          reviewee_id: string
          rating: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          gig_id?: string
          reviewer_id?: string
          reviewee_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          gig_id: string
          client_id: string
          freelancer_id: string
          amount: number
          platform_fee: number
          net_amount: number
          status: 'pending' | 'completed' | 'failed' | 'refunded'
          stripe_payment_intent_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          gig_id: string
          client_id: string
          freelancer_id: string
          amount: number
          platform_fee: number
          net_amount: number
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          stripe_payment_intent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          gig_id?: string
          client_id?: string
          freelancer_id?: string
          amount?: number
          platform_fee?: number
          net_amount?: number
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          stripe_payment_intent_id?: string | null
          created_at?: string
          updated_at?: string
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
