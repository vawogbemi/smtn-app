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
      boxes: {
        Row: {
          cargo: number
          created_at: string
          destination: string
          height: number | null
          id: number
          length: number | null
          method: string
          shipment: number
          weight: number | null
          width: number | null
        }
        Insert: {
          cargo: number
          created_at?: string
          destination: string
          height?: number | null
          id?: number
          length?: number | null
          method: string
          shipment: number
          weight?: number | null
          width?: number | null
        }
        Update: {
          cargo?: number
          created_at?: string
          destination?: string
          height?: number | null
          id?: number
          length?: number | null
          method?: string
          shipment?: number
          weight?: number | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "boxes_fkey"
            columns: ["cargo", "shipment", "destination", "method"]
            isOneToOne: false
            referencedRelation: "cargo"
            referencedColumns: ["id", "shipment", "destination", "method"]
          }
        ]
      }
      cargo: {
        Row: {
          created_at: string
          description: string
          destination: string
          employee: string | null
          id: number
          method: string
          paid: boolean | null
          receiver: string | null
          sender: string | null
          shipment: number
        }
        Insert: {
          created_at?: string
          description?: string
          destination: string
          employee?: string | null
          id?: number
          method: string
          paid?: boolean | null
          receiver?: string | null
          sender?: string | null
          shipment: number
        }
        Update: {
          created_at?: string
          description?: string
          destination?: string
          employee?: string | null
          id?: number
          method?: string
          paid?: boolean | null
          receiver?: string | null
          sender?: string | null
          shipment?: number
        }
        Relationships: [
          {
            foreignKeyName: "cargo_employee_fkey"
            columns: ["employee"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cargo_fkey"
            columns: ["shipment", "destination", "method"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id", "destination", "method"]
          },
          {
            foreignKeyName: "cargo_sender_fkey"
            columns: ["sender"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      shipments: {
        Row: {
          created_at: string
          destination: string
          id: number
          method: string
          status: number
        }
        Insert: {
          created_at?: string
          destination: string
          id: number
          method: string
          status?: number
        }
        Update: {
          created_at?: string
          destination?: string
          id?: number
          method?: string
          status?: number
        }
        Relationships: []
      }
      users: {
        Row: {
          address: string
          avatar_url: string
          city: string
          created_at: string
          email: string | null
          id: string
          name: string
          phone_number: number | null
          postal_code: string
        }
        Insert: {
          address?: string
          avatar_url?: string
          city?: string
          created_at?: string
          email?: string | null
          id: string
          name?: string
          phone_number?: number | null
          postal_code?: string
        }
        Update: {
          address?: string
          avatar_url?: string
          city?: string
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone_number?: number | null
          postal_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
