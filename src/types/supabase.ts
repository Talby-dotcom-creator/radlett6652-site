export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)";
  };
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author: string | null;
          category: string | null;
          content: string;
          created_at: string | null;
          featured: boolean | null;
          id: string;
          image_url: string | null;
          is_members_only: boolean | null;
          is_published: boolean | null;
          publish_date: string;
          slug: string | null;
          summary: string;
          tags: string[] | null;
          title: string;
          updated_at: string | null;
          view_count: number | null;
        };
        Insert: {
          author?: string | null;
          category?: string | null;
          content: string;
          created_at?: string | null;
          featured?: boolean | null;
          id?: string;
          image_url?: string | null;
          is_members_only?: boolean | null;
          is_published?: boolean | null;
          publish_date?: string;
          slug?: string | null;
          summary: string;
          tags?: string[] | null;
          title: string;
          updated_at?: string | null;
          view_count?: number | null;
        };
        Update: {
          author?: string | null;
          category?: string | null;
          content?: string;
          created_at?: string | null;
          featured?: boolean | null;
          id?: string;
          image_url?: string | null;
          is_members_only?: boolean | null;
          is_published?: boolean | null;
          publish_date?: string;
          slug?: string | null;
          summary?: string;
          tags?: string[] | null;
          title?: string;
          updated_at?: string | null;
          view_count?: number | null;
        };
        Relationships: [];
      };
      events: {
        Row: {
          created_at: string | null;
          description: string;
          event_date: string;
          id: string;
          image_url: string | null;
          is_members_only: boolean | null;
          is_past_event: boolean | null;
          location: string;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description: string;
          event_date: string;
          id?: string;
          image_url?: string | null;
          is_members_only?: boolean | null;
          is_past_event?: boolean | null;
          location: string;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string;
          event_date?: string;
          id?: string;
          image_url?: string | null;
          is_members_only?: boolean | null;
          is_past_event?: boolean | null;
          location?: string;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      faq_items: {
        Row: {
          answer: string;
          created_at: string | null;
          id: string;
          is_published: boolean | null;
          question: string;
          sort_order: number | null;
          updated_at: string | null;
        };
        Insert: {
          answer: string;
          created_at?: string | null;
          id?: string;
          is_published?: boolean | null;
          question: string;
          sort_order?: number | null;
          updated_at?: string | null;
        };
        Update: {
          answer?: string;
          created_at?: string | null;
          id?: string;
          is_published?: boolean | null;
          question?: string;
          sort_order?: number | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      lodge_documents: {
        Row: {
          category: string;
          created_at: string | null;
          description: string | null;
          id: string;
          title: string;
          updated_at: string | null;
          url: string;
        };
        Insert: {
          category: string;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          title: string;
          updated_at?: string | null;
          url: string;
        };
        Update: {
          category?: string;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          title?: string;
          updated_at?: string | null;
          url?: string;
        };
        Relationships: [];
      };
      meeting_minutes: {
        Row: {
          content: string;
          created_at: string | null;
          id: string;
          meeting_date: string;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          content: string;
          created_at?: string | null;
          id?: string;
          meeting_date: string;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          content?: string;
          created_at?: string | null;
          id?: string;
          meeting_date?: string;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      member_profiles: {
        Row: {
          contact_email: string | null;
          contact_phone: string | null;
          created_at: string | null;
          email_verified: boolean | null;
          full_name: string;
          grand_lodge_rank: string | null;
          id: string;
          join_date: string;
          last_login: string | null;
          masonic_provincial_rank: string | null;
          needs_password_reset: boolean | null;
          notes: string | null;
          position: string | null;
          registration_date: string | null;
          role: string;
          share_contact_info: boolean | null;
          status: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          contact_email?: string | null;
          contact_phone?: string | null;
          created_at?: string | null;
          email_verified?: boolean | null;
          full_name: string;
          grand_lodge_rank?: string | null;
          id?: string;
          join_date?: string;
          last_login?: string | null;
          masonic_provincial_rank?: string | null;
          needs_password_reset?: boolean | null;
          notes?: string | null;
          position?: string | null;
          registration_date?: string | null;
          role?: string;
          share_contact_info?: boolean | null;
          status?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          contact_email?: string | null;
          contact_phone?: string | null;
          created_at?: string | null;
          email_verified?: boolean | null;
          full_name?: string;
          grand_lodge_rank?: string | null;
          id?: string;
          join_date?: string;
          last_login?: string | null;
          masonic_provincial_rank?: string | null;
          needs_password_reset?: boolean | null;
          notes?: string | null;
          position?: string | null;
          registration_date?: string | null;
          role?: string;
          share_contact_info?: boolean | null;
          status?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      officers: {
        Row: {
          created_at: string | null;
          full_name: string;
          id: string;
          image_url: string | null;
          is_active: boolean | null;
          position: string;
          sort_order: number | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          full_name: string;
          id?: string;
          image_url?: string | null;
          is_active?: boolean | null;
          position: string;
          sort_order?: number | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          full_name?: string;
          id?: string;
          image_url?: string | null;
          is_active?: boolean | null;
          position?: string;
          sort_order?: number | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      page_content: {
        Row: {
          content: string;
          content_type: string | null;
          id: string;
          page_name: string;
          section_name: string;
          updated_at: string | null;
        };
        Insert: {
          content: string;
          content_type?: string | null;
          id?: string;
          page_name: string;
          section_name: string;
          updated_at?: string | null;
        };
        Update: {
          content?: string;
          content_type?: string | null;
          id?: string;
          page_name?: string;
          section_name?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      "Past Summons": {
        Row: {
          category: string | null;
          created_at: string;
          file_url: string | null;
          id: number;
          Title: string | null;
        };
        Insert: {
          category?: string | null;
          created_at?: string;
          file_url?: string | null;
          id?: number;
          Title?: string | null;
        };
        Update: {
          category?: string | null;
          created_at?: string;
          file_url?: string | null;
          id?: number;
          Title?: string | null;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          description: string | null;
          id: string;
          setting_key: string;
          setting_type: string | null;
          setting_value: string;
          updated_at: string | null;
        };
        Insert: {
          description?: string | null;
          id?: string;
          setting_key: string;
          setting_type?: string | null;
          setting_value: string;
          updated_at?: string | null;
        };
        Update: {
          description?: string | null;
          id?: string;
          setting_key?: string;
          setting_type?: string | null;
          setting_value?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      testimonials: {
        Row: {
          content: string;
          created_at: string | null;
          id: string;
          image_url: string | null;
          is_published: boolean | null;
          member_name: string;
          sort_order: number | null;
          updated_at: string | null;
        };
        Insert: {
          content: string;
          created_at?: string | null;
          id?: string;
          image_url?: string | null;
          is_published?: boolean | null;
          member_name: string;
          sort_order?: number | null;
          updated_at?: string | null;
        };
        Update: {
          content?: string;
          created_at?: string | null;
          id?: string;
          image_url?: string | null;
          is_published?: boolean | null;
          member_name?: string;
          sort_order?: number | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      generate_slug: {
        Args: { title: string };
        Returns: string;
      };
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
// Note: runtime client creation (createClient / global attach) does not belong
// in the generated types file. Keep this file for type declarations only.
// Create and export the Supabase client from a runtime module (e.g. `src/lib/supabase.ts`).
