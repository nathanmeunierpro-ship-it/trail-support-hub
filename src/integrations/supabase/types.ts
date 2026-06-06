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
      avis: {
        Row: {
          commentaire: string | null
          created_at: string
          event_id: string
          from_user: string
          id: string
          note: number
          to_user: string
        }
        Insert: {
          commentaire?: string | null
          created_at?: string
          event_id: string
          from_user: string
          id?: string
          note: number
          to_user: string
        }
        Update: {
          commentaire?: string | null
          created_at?: string
          event_id?: string
          from_user?: string
          id?: string
          note?: number
          to_user?: string
        }
        Relationships: []
      }
      benevoles: {
        Row: {
          bio: string | null
          created_at: string
          departement: string | null
          dispo_text: string | null
          disponibilites: string[] | null
          id: string
          niveau_trail: string | null
          nom: string | null
          prenom: string | null
          region: string | null
          sports_pratiques: string[] | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          departement?: string | null
          dispo_text?: string | null
          disponibilites?: string[] | null
          id: string
          niveau_trail?: string | null
          nom?: string | null
          prenom?: string | null
          region?: string | null
          sports_pratiques?: string[] | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          departement?: string | null
          dispo_text?: string | null
          disponibilites?: string[] | null
          id?: string
          niveau_trail?: string | null
          nom?: string | null
          prenom?: string | null
          region?: string | null
          sports_pratiques?: string[] | null
        }
        Relationships: []
      }
      candidatures: {
        Row: {
          benevole_id: string
          created_at: string
          disponibilite: boolean
          email: string
          event_id: string
          experience: string | null
          id: string
          mission_souhaitee: string | null
          nom: string
          prenom: string
          statut: string
        }
        Insert: {
          benevole_id: string
          created_at?: string
          disponibilite?: boolean
          email: string
          event_id: string
          experience?: string | null
          id?: string
          mission_souhaitee?: string | null
          nom: string
          prenom: string
          statut?: string
        }
        Update: {
          benevole_id?: string
          created_at?: string
          disponibilite?: boolean
          email?: string
          event_id?: string
          experience?: string | null
          id?: string
          mission_souhaitee?: string | null
          nom?: string
          prenom?: string
          statut?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidatures_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidatures_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events_public"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          date: string
          description: string | null
          email_contact: string
          id: string
          missions: string[] | null
          nb_benevoles: number
          nom: string
          region: string
          statut: string
          type_sport: string
          user_id: string
          ville: string
        }
        Insert: {
          created_at?: string
          date: string
          description?: string | null
          email_contact: string
          id?: string
          missions?: string[] | null
          nb_benevoles: number
          nom: string
          region: string
          statut?: string
          type_sport: string
          user_id: string
          ville: string
        }
        Update: {
          created_at?: string
          date?: string
          description?: string | null
          email_contact?: string
          id?: string
          missions?: string[] | null
          nb_benevoles?: number
          nom?: string
          region?: string
          statut?: string
          type_sport?: string
          user_id?: string
          ville?: string
        }
        Relationships: []
      }
      favoris: {
        Row: {
          benevole_id: string
          created_at: string
          event_id: string
          id: string
        }
        Insert: {
          benevole_id: string
          created_at?: string
          event_id: string
          id?: string
        }
        Update: {
          benevole_id?: string
          created_at?: string
          event_id?: string
          id?: string
        }
        Relationships: []
      }
      organisateurs: {
        Row: {
          created_at: string
          departement: string | null
          id: string
          nom_organisation: string | null
          site_web: string | null
          type_organisation: string | null
        }
        Insert: {
          created_at?: string
          departement?: string | null
          id: string
          nom_organisation?: string | null
          site_web?: string | null
          type_organisation?: string | null
        }
        Update: {
          created_at?: string
          departement?: string | null
          id?: string
          nom_organisation?: string | null
          site_web?: string | null
          type_organisation?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      events_public: {
        Row: {
          created_at: string | null
          date: string | null
          description: string | null
          id: string | null
          missions: string[] | null
          nb_benevoles: number | null
          nom: string | null
          region: string | null
          statut: string | null
          type_sport: string | null
          user_id: string | null
          ville: string | null
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          description?: string | null
          id?: string | null
          missions?: string[] | null
          nb_benevoles?: number | null
          nom?: string | null
          region?: string | null
          statut?: string | null
          type_sport?: string | null
          user_id?: string | null
          ville?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string | null
          description?: string | null
          id?: string | null
          missions?: string[] | null
          nb_benevoles?: number | null
          nom?: string | null
          region?: string | null
          statut?: string | null
          type_sport?: string | null
          user_id?: string | null
          ville?: string | null
        }
        Relationships: []
      }
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
