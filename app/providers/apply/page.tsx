import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/app/components/site-header";
import { ProviderApplicationForm } from "@/app/components/intake-form";

export default function ProviderApplyPage() {
  return <><SiteHeader /><main className="page-shell" style={{ maxWidth: 860, paddingTop: 54 }}><Link href="/" style={{ fontSize: 13, color: "var(--green)" }}>← Back to C2C Services</Link><div style={{ marginTop: 24, padding: "clamp(22px,5vw,42px)", border: "1px solid #e3eaf0", borderRadius: 16, boxShadow: "0 14px 45px #142a3d0a" }}><div className="eyebrow">For plumbing businesses</div><h1 style={{ margin: "10px 0", color: "var(--navy)", fontSize: "clamp(1.8rem,4vw,2.5rem)", letterSpacing: "-.04em" }}>Apply to join our provider network</h1><p style={{ margin: "0 0 26px", color: "#65758a", fontSize: 14, lineHeight: 1.7 }}>Tell us about your plumbing services and service areas. C2C will review your application and may contact you to discuss the pilot.</p><ProviderApplicationForm /></div><p style={{ maxWidth: 700, margin: "18px auto 0", color: "#7b8796", fontSize: 11, lineHeight: 1.6 }}>Submitting an application does not mean you have been verified or accepted, and does not guarantee leads or work. Do not upload or send identity or trade documents through this form.</p></main><SiteFooter /></>;
}
