// src/types/supabase.ts
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      user_chemical_watch_list: {
        Row: {
          id: string;
          user_id: string | null;
          product_id: number | null;
          quantity_on_hand: number | null;
          location: string | null;
          sds_available: boolean | null;
          sds_issue_date: string | null;
          hazardous_substance: boolean | null;
          dangerous_good: boolean | null;
          dangerous_goods_class: string | null;
          description: string | null;
          packing_group: string | null;
          subsidiary_risks: string | null;
          consequence: string | null;
          likelihood: string | null;
          risk_rating: string | null;
          swp_required: boolean | null;
          comments_swp: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          product_id?: number | null;
          quantity_on_hand?: number | null;
          location?: string | null;
          sds_available?: boolean | null;
          sds_issue_date?: string | null;
          hazardous_substance?: boolean | null;
          dangerous_good?: boolean | null;
          dangerous_goods_class?: string | null;
          description?: string | null;
          packing_group?: string | null;
          subsidiary_risks?: string | null;
          consequence?: string | null;
          likelihood?: string | null;
          risk_rating?: string | null;
          swp_required?: boolean | null;
          comments_swp?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          product_id?: number | null;
          quantity_on_hand?: number | null;
          location?: string | null;
          sds_available?: boolean | null;
          sds_issue_date?: string | null;
          hazardous_substance?: boolean | null;
          dangerous_good?: boolean | null;
          dangerous_goods_class?: string | null;
          description?: string | null;
          packing_group?: string | null;
          subsidiary_risks?: string | null;
          consequence?: string | null;
          likelihood?: string | null;
          risk_rating?: string | null;
          swp_required?: boolean | null;
          comments_swp?: string | null;
          created_at?: string | null;
        };
      };
      product: {
        Row: {
          id: number;
          barcode: string;
          name: string | null;
          contents_size_weight: string | null;
          sds_url: string | null;
          manufacturer: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: number;
          barcode: string;
          name?: string | null;
          contents_size_weight?: string | null;
          sds_url?: string | null;
          manufacturer?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: number;
          barcode?: string;
          name?: string | null;
          contents_size_weight?: string | null;
          sds_url?: string | null;
          manufacturer?: string | null;
          created_at?: string | null;
        };
      };
      sds_metadata: {
        Row: {
          product_id: number;
          vendor: string | null;
          issue_date: string | null;
          hazardous_substance: boolean | null;
          dangerous_good: boolean | null;
          dangerous_goods_class: string | null;
          description: string | null;
          packing_group: string | null;
          subsidiary_risks: string | null;
          raw_json: Json | null;
          created_at: string | null;
        };
        Insert: {
          product_id: number;
          vendor?: string | null;
          issue_date?: string | null;
          hazardous_substance?: boolean | null;
          dangerous_good?: boolean | null;
          dangerous_goods_class?: string | null;
          description?: string | null;
          packing_group?: string | null;
          subsidiary_risks?: string | null;
          raw_json?: Json | null;
          created_at?: string | null;
        };
        Update: {
          product_id?: number;
          vendor?: string | null;
          issue_date?: string | null;
          hazardous_substance?: boolean | null;
          dangerous_good?: boolean | null;
          dangerous_goods_class?: string | null;
          description?: string | null;
          packing_group?: string | null;
          subsidiary_risks?: string | null;
          raw_json?: Json | null;
          created_at?: string | null;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
