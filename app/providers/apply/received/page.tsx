import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/app/components/site-header";

export default function ProviderReceivedPage() {
  return <><SiteHeader /><main className="page-shell" style={{ maxWidth: 690, paddingTop: 80, textAlign: "center" }}><span style={{ display: "inline-grid", placeItems: "center", width: 58, height: 58, borderRadius: "50%", background: "#dcf4e9", color: "var(--green)", fontSize: 26 }}>✓</span><div className="eyebrow" style={{ marginTop: 22 }}>Application received</div><h1 style={{ color: "var(--navy)", fontSize: "clamp(2rem,5vw,3rem)", letterSpacing: "-.05em", margin: "10px 0" }}>Thank you for your interest.</h1><p style={{ color: "#65758a", fontSize: 15, lineHeight: 1.75 }}>C2C has received your provider application. Our team may contact you to discuss your services and coverage.</p><p style={{ color: "#7b8796", fontSize: 12, lineHeight: 1.6 }}>An application is not a verification or acceptance decision.</p><Link href="/" className="btn btn-outline" style={{ marginTop: 16 }}>Return to home</Link></main><SiteFooter /></>;
}
