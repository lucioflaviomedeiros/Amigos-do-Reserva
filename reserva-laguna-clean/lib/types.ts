export type Section = 'obras' | 'servicos'
export type SupplierStatus = 'pending' | 'approved' | 'rejected'
export type UserRole = 'morador' | 'admin'
export type InviteStatus = 'invited' | 'active' | 'revoked'

export interface Supplier {
  id: string
  created_at: string
  name: string
  type: 'empresa' | 'autonomo'
  section: Section
  category: string
  description: string
  phone: string | null
  whatsapp: string | null
  website: string | null
  instagram: string | null
  address: string | null
  city: string | null
  photos: string[]
  avg_rating: number
  review_count: number
  verified: boolean
  featured: boolean
  status: SupplierStatus
  indicated_by: string | null
  indicated_by_unit: string | null
  self_registered: boolean
}

export interface Review {
  id: string
  created_at: string
  supplier_id: string
  user_id: string
  rating: number
  comment: string
  approved: boolean
  helpful_count: number
  user?: { full_name: string; unit: string }
  supplier?: { name: string }
}

export interface Profile {
  id: string
  created_at: string
  full_name: string
  unit: string
  phone: string | null
  role: UserRole
  invite_status: InviteStatus
  avatar_url: string | null
}

export interface Invite {
  id: string
  created_at: string
  token: string
  full_name: string
  unit: string
  phone: string | null
  status: InviteStatus
  expires_at: string
  completed_at: string | null
  user_id: string | null
}

export interface SiteSettings {
  id: string
  cover_photo_url: string | null
  notice_text: string
  updated_at: string
}
