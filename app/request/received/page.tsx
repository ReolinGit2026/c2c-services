import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/app/components/site-header";

export default function RequestReceivedPage() {
  return <><SiteHeader /><main className="page-shell" style={{ maxWidth: 690, paddingTop: 80, textAlign: "center" }}><span style={{ display: "inline-grid", placeItems: "center", width: 58, height: 58, borderRadius: "50%", background: "#dcf4e9", color: "var(--green)", fontSize: 26 }}>✓</span><div className="eyebrow" style={{ marginTop: 22 }}>Request received</div><h1 style={{ color: "var(--navy)", fontSize: "clamp(2rem,5vw,3rem)", letterSpacing: "-.05em", margin: "10px 0" }}>Thanks for contacting C2C.</h1><p style={{ color: "#65758a", fontSize: 15, lineHeight: 1.75 }}>Your plumbing request has been submitted. The C2C team will review the details and may contact you about possible next steps.</p><p style={{ color: "#7b8796", fontSize: 12, lineHeight: 1.6 }}>A provider introduction or job arrangement is not guaranteed.</p><Link href="/" className="btn btn-outline" style={{ marginTop: 16 }}>Return to home</Link></main><SiteFooter /></>;
}
