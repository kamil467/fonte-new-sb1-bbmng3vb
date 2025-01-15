import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  parent_id: number | null;
  order: number;
  created_at: string;
  updated_at: string;
  icon_url?: string;
}

export interface SubCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  parent_id: number | null;
  order: number;
  created_at: string;
  updated_at: string;
  icon_url?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  image_url: string;
  category_id: number;
  reference: string;
  composition: {
    main: string;
    embroidery?: string;
  };
  technique?: string;
  width?: string;
  weight?: string;
  martindale?: string;
  repeats?: string;
  end_use?: string;
  price?: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductColor {
  id: number;
  product_id: number;
  name: string;
  color_code: string;
  image_url: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductCareInstruction {
  id: number;
  product_id: number;
  icon: string;
  instruction: string;
  created_at: string;
  updated_at: string;
}

export interface Region
{
  id: number;
  name: string;
  locale:string;
  created_at: string;
  code: string;
}
export interface RegionCategoryMapping
{
  id: number;
  region_id: number;
  category_id: number;
  created_at: string;
}

export interface RegionProductMapping
{
  id: number;
  region_id: number;
  product_id: number;
  created_at: string;
}
export interface RegionSubCategoryMapping
{
  id: number;
  region_id: number;
  subcategory_id: number;
  created_at: string;
}