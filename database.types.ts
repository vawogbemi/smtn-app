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
      packages: {
        Row: {
          created_at: string
          id: number
          reciever_id: string | null
          sender_id: string | null
          shipment_id: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          reciever_id?: string | null
          sender_id?: string | null
          shipment_id?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          reciever_id?: string | null
          sender_id?: string | null
          shipment_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "packages_reciever_id_fkey"
            columns: ["reciever_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "packages_sender_id_fkey"
            columns: ["sender_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "packages_shipment_id_fkey"
            columns: ["shipment_id"]
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          }
        ]
      }
      shipments: {
        Row: {
          created_at: string
          id: number
          status: string
        }
        Insert: {
          created_at?: string
          id?: number
          status: string
        }
        Update: {
          created_at?: string
          id?: number
          status?: string
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
