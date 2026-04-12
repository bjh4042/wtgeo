export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      content_edits: {
        Row: {
          content_id: string
          content_type: string | null
          created_at: string
          description: string | null
          grade: string | null
          icon: string | null
          id: string
          image_url: string | null
          lat: number | null
          lng: number | null
          name: string | null
          reference_url: string | null
          source: string | null
          updated_at: string
          youtube_url: string | null
        }
        Insert: {
          content_id: string
          content_type?: string | null
          created_at?: string
          description?: string | null
          grade?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          lat?: number | null
          lng?: number | null
          name?: string | null
          reference_url?: string | null
          source?: string | null
          updated_at?: string
          youtube_url?: string | null
        }
        Update: {
          content_id?: string
          content_type?: string | null
          created_at?: string
          description?: string | null
          grade?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          lat?: number | null
          lng?: number | null
          name?: string | null
          reference_url?: string | null
          source?: string | null
          updated_at?: string
          youtube_url?: string | null
        }
        Relationships: []
      }
      custom_content: {
        Row: {
          content_id: string
          content_type: string
          created_at: string
          description: string | null
          grade: string | null
          icon: string | null
          id: string
          image_url: string | null
          lat: number
          lng: number
          name: string
          reference_url: string | null
          source: string | null
          youtube_url: string | null
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string
          description?: string | null
          grade?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          lat: number
          lng: number
          name: string
          reference_url?: string | null
          source?: string | null
          youtube_url?: string | null
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string
          description?: string | null
          grade?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          lat?: number
          lng?: number
          name?: string
          reference_url?: string | null
          source?: string | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      custom_places: {
        Row: {
          address: string | null
          category: string
          created_at: string
          description: string | null
          grade: string | null
          id: string
          image_url: string | null
          lat: number
          lng: number
          name: string
          origin: string | null
          place_id: string
          reference_url: string | null
          sub_category: string | null
          youtube_url: string | null
        }
        Insert: {
          address?: string | null
          category: string
          created_at?: string
          description?: string | null
          grade?: string | null
          id?: string
          image_url?: string | null
          lat: number
          lng: number
          name: string
          origin?: string | null
          place_id: string
          reference_url?: string | null
          sub_category?: string | null
          youtube_url?: string | null
        }
        Update: {
          address?: string | null
          category?: string
          created_at?: string
          description?: string | null
          grade?: string | null
          id?: string
          image_url?: string | null
          lat?: number
          lng?: number
          name?: string
          origin?: string | null
          place_id?: string
          reference_url?: string | null
          sub_category?: string | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      error_reports: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          place_id: string
          place_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          place_id: string
          place_name: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          place_id?: string
          place_name?: string
        }
        Relationships: []
      }
      gyeongnam_edits: {
        Row: {
          area: number | null
          city_id: string
          created_at: string
          highlights: string[] | null
          id: string
          lat: number | null
          lng: number | null
          logo_url: string | null
          mascot: string | null
          mascot_emoji: string | null
          mascot_image_url: string | null
          name: string | null
          name_hanja: string | null
          name_origin: string | null
          official_site: string | null
          population: number | null
          updated_at: string
        }
        Insert: {
          area?: number | null
          city_id: string
          created_at?: string
          highlights?: string[] | null
          id?: string
          lat?: number | null
          lng?: number | null
          logo_url?: string | null
          mascot?: string | null
          mascot_emoji?: string | null
          mascot_image_url?: string | null
          name?: string | null
          name_hanja?: string | null
          name_origin?: string | null
          official_site?: string | null
          population?: number | null
          updated_at?: string
        }
        Update: {
          area?: number | null
          city_id?: string
          created_at?: string
          highlights?: string[] | null
          id?: string
          lat?: number | null
          lng?: number | null
          logo_url?: string | null
          mascot?: string | null
          mascot_emoji?: string | null
          mascot_image_url?: string | null
          name?: string | null
          name_hanja?: string | null
          name_origin?: string | null
          official_site?: string | null
          population?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      place_edits: {
        Row: {
          address: string | null
          category: string | null
          created_at: string
          description: string | null
          grade: string | null
          id: string
          image_url: string | null
          lat: number | null
          lng: number | null
          name: string | null
          origin: string | null
          place_id: string
          reference_url: string | null
          sub_category: string | null
          updated_at: string
          youtube_url: string | null
        }
        Insert: {
          address?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          grade?: string | null
          id?: string
          image_url?: string | null
          lat?: number | null
          lng?: number | null
          name?: string | null
          origin?: string | null
          place_id: string
          reference_url?: string | null
          sub_category?: string | null
          updated_at?: string
          youtube_url?: string | null
        }
        Update: {
          address?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          grade?: string | null
          id?: string
          image_url?: string | null
          lat?: number | null
          lng?: number | null
          name?: string | null
          origin?: string | null
          place_id?: string
          reference_url?: string | null
          sub_category?: string | null
          updated_at?: string
          youtube_url?: string | null
        }
        Relationships: []
      }
      school_edits: {
        Row: {
          address: string | null
          created_at: string
          district: string | null
          id: string
          lat: number | null
          lng: number | null
          name: string | null
          phone: string | null
          school_index: number
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          district?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          name?: string | null
          phone?: string | null
          school_index: number
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          district?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          name?: string | null
          phone?: string | null
          school_index?: number
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
