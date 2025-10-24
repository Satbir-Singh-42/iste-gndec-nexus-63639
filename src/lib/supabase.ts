import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseClient = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    console.log("✅ Supabase client initialized successfully");
  } catch (error) {
    console.error("❌ Failed to create Supabase client:", error);
    console.error(
      "Please check your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables"
    );
  }
} else {
  console.warn(
    "⚠️  Supabase not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to environment variables."
  );
}

export const supabase = supabaseClient as any;

export type Database = {
  public: {
    Tables: {
      events: {
        Row: {
          id: number;
          title: string;
          date: string;
          time: string;
          location: string;
          description: string;
          status: string;
          capacity: string;
          organizer: string;
          details: string;
          agenda: string[];
          created_at: string;
          hidden?: boolean;
          display_order?: number;
        };
        Insert: Omit<
          Database["public"]["Tables"]["events"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["events"]["Insert"]>;
      };
      members_core_team: {
        Row: {
          id: number;
          name: string;
          position: string;
          image: string;
          email?: string;
          linkedin?: string;
          github?: string;
          instagram?: string;
          hidden?: boolean;
          display_order?: number;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["members_core_team"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["members_core_team"]["Insert"]
        >;
      };
      members_post_holders: {
        Row: {
          id: number;
          name: string;
          position: string;
          image: string;
          email?: string;
          linkedin?: string;
          github?: string;
          instagram?: string;
          hidden?: boolean;
          display_order?: number;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["members_post_holders"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["members_post_holders"]["Insert"]
        >;
      };
      members_executive: {
        Row: {
          id: number;
          name: string;
          position: string;
          image: string;
          email?: string;
          linkedin?: string;
          github?: string;
          instagram?: string;
          hidden?: boolean;
          display_order?: number;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["members_executive"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["members_executive"]["Insert"]
        >;
      };
      members_faculty: {
        Row: {
          id: number;
          name: string;
          title: string;
          image: string;
          description: string;
          linkedin?: string;
          github?: string;
          instagram?: string;
          hidden?: boolean;
          display_order?: number;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["members_faculty"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["members_faculty"]["Insert"]
        >;
      };
      gallery: {
        Row: {
          id: number;
          title: string;
          images: string[];
          category: string;
          description: string;
          created_at: string;
          hidden?: boolean;
          display_order?: number;
        };
        Insert: Omit<
          Database["public"]["Tables"]["gallery"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["gallery"]["Insert"]>;
      };
      notices: {
        Row: {
          id: number;
          title: string;
          date: string;
          time: string;
          type: string;
          status: string;
          description: string;
          rich_description?: string;
          poster_url?: string;
          attachments?: {
            name: string;
            url: string;
            type: string;
          }[];
          external_link?: string;
          created_at: string;
          hidden?: boolean;
          display_order?: number;
        };
        Insert: Omit<
          Database["public"]["Tables"]["notices"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["notices"]["Insert"]>;
      };
      event_highlights: {
        Row: {
          id: number;
          title: string;
          date: string;
          location: string;
          description: string;
          poster: string;
          instagram_link: string;
          attendees: string;
          highlights: string[];
          created_at: string;
          hidden?: boolean;
          display_order?: number;
        };
        Insert: Omit<
          Database["public"]["Tables"]["event_highlights"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["event_highlights"]["Insert"]
        >;
      };
      projects: {
        Row: {
          id: number;
          title: string;
          description: string;
          image_url: string;
          technologies: string[];
          github_link?: string;
          demo_link?: string;
          status: string;
          category: string;
          featured?: boolean;
          hidden?: boolean;
          display_order?: number;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["projects"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>;
      };
      site_settings: {
        Row: {
          id: number;
          setting_key: string;
          setting_value: boolean;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["site_settings"]["Row"],
          "id" | "updated_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["site_settings"]["Insert"]
        >;
      };
    };
  };
};
