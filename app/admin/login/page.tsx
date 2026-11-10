import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminLoginForm } from "@/app/admin/login/login-form";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const membership = user ? await supabase.from("admin_users").select("active").eq("user_id", user.id).eq("active", true).maybeSingle() : null;
  if (user && membership?.data?.active) redirect("/admin");
  const params = await searchParams;
  return <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "linear-gradient(135deg,#f1f7f7,#f3f6fb)" }}><div style={{ width: "min(100%,430px)", padding: 34, border: "1px solid #e1e8ef", borderRadius: 16, background: "white", boxShadow: "0 20px 60px #16325312" }}><Link href="/" style={{ color: "var(--green)", fontSize: 13 }}>← C2C Services</Link><div className="eyebrow" style={{ marginTop: 28 }}>Operations workspace</div><h1 style={{ margin: "9px 0 9px", color: "var(--navy)", fontSize: 30, letterSpacing: "-.04em" }}>Admin sign in</h1><p style={{ margin: "0 0 24px", color: "#66768a", fontSize: 13, lineHeight: 1.65 }}>This area is limited to authorized C2C operations users. Multi-factor authentication is required.</p>{(params.error === "unauthorized" || (user && !membership?.data?.active)) && <p role="alert" style={{ color: "#a33131", fontSize: 13 }}>This account isn’t authorized. Contact the C2C admin.</p>}<AdminLoginForm /></div></main>;
}
