import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/app/components/site-header";
import { CustomerRequestForm } from "@/app/components/intake-form";

export default function RequestPage() {
  return <><SiteHeader /><main className="page-shell" style={{ maxWidth: 860, paddingTop: 54 }}><Link href="/" style={{ fontSize: 13, color: "var(--green)" }}>← Back to C2C Services</Link><div style={{ marginTop: 24, padding: "clamp(22px,5vw,42px)", border: "1px solid #e3eaf0", borderRadius: 16, boxShadow: "0 14px 45px #142a3d0a" }}><div className="eyebrow">Customer plumbing request</div><h1 style={{ margin: "10px 0 10px", color: "var(--navy)", fontSize: "clamp(1.8rem,4vw,2.5rem)", letterSpacing: "-.04em" }}>Tell us what you need</h1><p style={{ margin: "0 0 26px", color: "#65758a", fontSize: 14, lineHeight: 1.7 }}>Share a few details so C2C can review your plumbing request and look for a suitable local provider to contact.</p><CustomerRequestForm /></div><p style={{ maxWidth: 700, margin: "18px auto 0", color: "#7b8796", fontSize: 11, lineHeight: 1.6 }}>This is an early pilot form. Submitting a request does not guarantee provider availability, a quote or a job booking.</p></main><SiteFooter /></>;
}
