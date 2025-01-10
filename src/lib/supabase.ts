import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Product {
  id: string;
  name: string;
  description: string;
  collection: string;
  reference: string;
  composition: {
    main: string;
    embroidery?: string;
  };
  technique: string;
  width: string;
  weight: string;
  martindale: string;
  repeats: string;
  end_use: string;
  created_at: string;
}

export interface ProductColor {
  id: string;
  product_id: string;
  color_code: string;
  image_url: string;
  created_at: string;
}

export interface ProductCareInstruction {
  id: string;
  product_id: string;
  icon: string;
  instruction: string;
  created_at: string;
}
