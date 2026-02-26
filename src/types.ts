import { LucideIcon } from 'lucide-react';

export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
  description?: string;
}

export interface Product {
  id: number;
  category_id: number;
  category_name?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  dealer_price?: number;
  moq: number;
  stock: number;
  images: string[];
  specifications: Record<string, any>;
  is_featured: boolean;
  is_new: boolean;
  application: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'customer' | 'admin' | 'dealer';
  phone?: string;
  gst_number?: string;
  created_at?: string;
}

export interface Address {
  id: number;
  user_id: number;
  type: 'shipping' | 'billing';
  name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  product_slug: string;
  product_images: string; // JSON string
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  user_id: number;
  user_name?: string;
  user_email?: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: string;
  shipping_address: string;
  created_at: string;
  items?: OrderItem[];
}

export interface StoreSettings {
  store_name: string;
  logo: string;
  contact_email: string;
  contact_phone: string;
  gst_number: string;
  address: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
}
