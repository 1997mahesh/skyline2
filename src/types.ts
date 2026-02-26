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
}

export interface AuthState {
  user: User | null;
  token: string | null;
}
