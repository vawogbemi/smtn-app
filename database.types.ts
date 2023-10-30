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
          description: string | null
          destination: string
          employee_id: string | null
          height: number | null
          id: number
          length: number | null
          paid: number | null
          reciever_email: string | null
          sender_id: string | null
          shipment_id: number
          status: number
          weight: number | null
          width: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          destination?: string
          employee_id?: string | null
          height?: number | null
          id?: number
          length?: number | null
          paid?: number | null
          reciever_email?: string | null
          sender_id?: string | null
          shipment_id: number
          status?: number
          weight?: number | null
          width?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          destination?: string
          employee_id?: string | null
          height?: number | null
          id?: number
          length?: number | null
          paid?: number | null
          reciever_email?: string | null
          sender_id?: string | null
          shipment_id?: number
          status?: number
          weight?: number | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "packages_employee_id_fkey"
            columns: ["employee_id"]
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
          status: number
        }
        Insert: {
          created_at?: string
          id: number
          status?: number
        }
        Update: {
          created_at?: string
          id?: number
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
          id?: string
          name?: string
          phone_number?: number | null
          postal_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
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
