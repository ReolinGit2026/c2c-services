import { requireAdminWithoutMfaRedirect } from "@/lib/admin-auth";
import { MfaSetup } from "@/app/admin/mfa/mfa-setup";

export const dynamic = "force-dynamic";

export default async function AdminMfaPage() {
  await requireAdminWithoutMfaRedirect();
  return <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "#f4f7fa" }}><section style={{ width: "min(100%,500px)", padding: 32, background: "white", border: "1px solid #e3eaf0", borderRadius: 16 }}><div className="eyebrow">Account security</div><h1 style={{ margin: "10px 0", color: "var(--navy)", fontSize: 28 }}>Set up multi-factor authentication</h1><p style={{ margin: "0 0 22px", color: "#66768a", fontSize: 13, lineHeight: 1.7 }}>C2C admin access requires a verified authenticator factor. Keep your authenticator available for future sign-ins.</p><MfaSetup /></section></main>;
}
