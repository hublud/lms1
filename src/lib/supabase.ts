import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Standard client for client-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables (can be expanded later)
export type Tables = {
  profiles: {
    id: string;
    full_name: string;
    avatar_url: string;
    role: 'admin' | 'teacher' | 'student';
    bio: string;
    created_at: string;
  };
  courses: {
    id: string;
    title: string;
    description: string;
    instructor_id: string;
    category_id: string;
    price: number;
    image_url: string;
    level: string;
    status: string;
  };
  // Add other types as needed...
};
