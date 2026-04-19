"use server";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export async function updateProgress(userId: string, courseId: string, progress: number) {
  try {
    const { error } = await supabaseAdmin
      .from("enrollments")
      .update({ progress })
      .eq("user_id", userId)
      .eq("course_id", courseId);

    if (error) {
      console.error("Server Action Update Error:", error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
