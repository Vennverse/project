export interface User {
  id: string;
  email: string;
  full_name: string;
  company_name?: string;
  phone?: string;
  avatar_url?: string;
  user_type: 'buyer' | 'seller' | 'admin';
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Business {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  industry: string;
  business_type: 'franchise' | 'acquisition' | 'partnership';
  location: string;
  asking_price: number;
  revenue?: number;
  profit?: number;
  established_year?: number;
  employees?: number;
  website_url?: string;
  franchise_fee?: number;
  royalty_fee?: number;
  territory_available?: string;
  support_training?: string;
  status: 'active' | 'sold' | 'pending' | 'draft';
  featured: boolean;
  views: number;
  created_at: string;
  updated_at: string;
  business_images?: BusinessImage[];
  profiles?: User;
}

export interface BusinessImage {
  id: string;
  business_id: string;
  image_url: string;
  alt_text?: string;
  is_primary: boolean;
  display_order: number;
  created_at: string;
}

export interface Bid {
  id: string;
  business_id: string;
  bidder_id: string;
  amount: number;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  expires_at?: string;
  created_at: string;
  updated_at: string;
  profiles?: User;
}

export interface Message {
  id: string;
  business_id?: string;
  sender_id: string;
  recipient_id: string;
  subject?: string;
  content: string;
  read: boolean;
  created_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  business_id: string;
  created_at: string;
  businesses?: Business;
}

export interface AdminSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  description?: string;
  updated_by?: string;
  updated_at: string;
}