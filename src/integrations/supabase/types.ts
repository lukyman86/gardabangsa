export type AppRole = 'admin' | 'operator' | 'anggota'
export type MemberStatus = 'pending' | 'active' | 'rejected' | 'inactive'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          email: string
          phone: string | null
          no_ktp: string | null
          cabang_id: string | null
          avatar_url: string | null
          address: string | null
          birth_date: string | null
          status: MemberStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          email: string
          phone?: string | null
          no_ktp?: string | null
          cabang_id?: string | null
          avatar_url?: string | null
          address?: string | null
          birth_date?: string | null
          status?: MemberStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          phone?: string | null
          no_ktp?: string | null
          cabang_id?: string | null
          avatar_url?: string | null
          address?: string | null
          birth_date?: string | null
          status?: MemberStatus
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: { id: string; user_id: string; role: AppRole; created_at: string }
        Insert: { id?: string; user_id: string; role: AppRole; created_at?: string }
        Update: { id?: string; user_id?: string; role?: AppRole; created_at?: string }
        Relationships: []
      }
      cabang: {
        Row: { id: string; name: string; slug: string; region: string | null; created_at: string }
        Insert: { id?: string; name: string; slug: string; region?: string | null; created_at?: string }
        Update: { id?: string; name?: string; slug?: string; region?: string | null; created_at?: string }
        Relationships: []
      }
      news: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string | null
          content: string
          cover_url: string | null
          category_id: string | null
          author_id: string | null
          cabang_id: string | null
          published: boolean
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          excerpt?: string | null
          content: string
          cover_url?: string | null
          category_id?: string | null
          author_id?: string | null
          cabang_id?: string | null
          published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          excerpt?: string | null
          content?: string
          cover_url?: string | null
          category_id?: string | null
          author_id?: string | null
          cabang_id?: string | null
          published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      news_categories: {
        Row: { id: string; name: string; slug: string; scope: 'nasional' | 'cabang'; created_at: string }
        Insert: { id?: string; name: string; slug: string; scope?: 'nasional' | 'cabang'; created_at?: string }
        Update: { id?: string; name?: string; slug?: string; scope?: 'nasional' | 'cabang'; created_at?: string }
        Relationships: []
      }
      galleries: {
        Row: {
          id: string
          title: string
          description: string | null
          media_url: string
          media_type: 'image' | 'video'
          cabang_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          media_url: string
          media_type?: 'image' | 'video'
          cabang_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          media_url?: string
          media_type?: 'image' | 'video'
          cabang_id?: string | null
          created_at?: string
        }
        Relationships: []
      }
      contacts: {
        Row: { id: string; name: string; email: string; subject: string | null; message: string; resolved: boolean; created_at: string }
        Insert: { id?: string; name: string; email: string; subject?: string | null; message: string; resolved?: boolean; created_at?: string }
        Update: { id?: string; name?: string; email?: string; subject?: string | null; message?: string; resolved?: boolean; created_at?: string }
        Relationships: []
      }
      agenda: {
        Row: { id: string; title: string; description: string | null; location: string | null; start_at: string; end_at: string | null; created_at: string }
        Insert: { id?: string; title: string; description?: string | null; location?: string | null; start_at: string; end_at?: string | null; created_at?: string }
        Update: { id?: string; title?: string; description?: string | null; location?: string | null; start_at?: string; end_at?: string | null; created_at?: string }
        Relationships: []
      }
      documents: {
        Row: { id: string; title: string; description: string | null; file_url: string; category: string | null; created_at: string }
        Insert: { id?: string; title: string; description?: string | null; file_url: string; category?: string | null; created_at?: string }
        Update: { id?: string; title?: string; description?: string | null; file_url?: string; category?: string | null; created_at?: string }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      has_role: {
        Args: { _user_id: string; _role: AppRole }
        Returns: boolean
      }
    }
    Enums: {
      app_role: AppRole
      member_status: MemberStatus
    }
    CompositeTypes: Record<string, never>
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']
