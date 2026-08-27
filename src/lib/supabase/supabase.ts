import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types matching your existing schema
export interface FrameRecord {
  id: string;
  user_id: string;
  caption: string;
  image_url: string;
  template_name: string;
  sharing: boolean;
  custom_path: string;
  created_at: string;
}
