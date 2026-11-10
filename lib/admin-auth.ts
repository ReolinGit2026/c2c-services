import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: membership, error } = await supabase
    .from("admin_users")
    .select("user_id, active")
    .eq("user_id", user.id)
    .eq("active", true)
    .maybeSingle();
  if (error || !membership) redirect("/admin/login?error=unauthorized");

  const { data: assurance } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (assurance?.currentLevel !== "aal2") redirect("/admin/mfa");
  return { supabase, user };
}

export async function requireAdminWithoutMfaRedirect() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: membership, error } = await supabase
    .from("admin_users")
    .select("user_id, active")
    .eq("user_id", user.id)
    .eq("active", true)
    .maybeSingle();
  if (error || !membership) redirect("/admin/login?error=unauthorized");
  return { supabase, user };
}
