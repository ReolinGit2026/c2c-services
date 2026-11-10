import Link from "next/link";

export function SiteHeader() {
  return (
    <header style={{ borderBottom: "1px solid #edf1f5", background: "#ffffffed", position: "sticky", top: 0, zIndex: 10, backdropFilter: "blur(12px)" }}>
      <div className="page-shell" style={{ minHeight: 76, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
        <Link href="/" aria-label="C2C Services home" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 38, height: 38, display: "grid", placeItems: "center", borderRadius: 11, background: "var(--navy)", color: "white", fontSize: 16, fontWeight: 850, letterSpacing: "-.08em" }}>C2C</span>
          <span style={{ color: "var(--navy)", fontSize: 15, fontWeight: 800 }}>Services</span>
        </Link>
        <nav aria-label="Main navigation" style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 13, fontWeight: 650, color: "#40516a" }}>
          <Link href="/#how-it-works" className="desktop-link">How it works</Link>
          <Link href="/providers/apply" className="desktop-link">For providers</Link>
          <Link href="/request" className="btn btn-primary" style={{ minHeight: 42, paddingInline: 16, fontSize: 13 }}>Request a plumber <span aria-hidden="true">↗</span></Link>
        </nav>
      </div>
      <style>{"@media(max-width:600px){.desktop-link{display:none}}"}</style>
    </header>
  );
}

export function SiteFooter() {
  return <footer style={{ marginTop: 90, borderTop: "1px solid #e8edf2", background: "#f8fafb" }}><div className="page-shell" style={{ paddingBlock: 27, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap", color: "#65758b", fontSize: 12 }}><span>© {new Date().getFullYear()} C2C Services · East Rand, Gauteng</span><div style={{ display: "flex", gap: 20 }}><Link href="/privacy">Privacy</Link><Link href="/admin/login">Admin</Link></div></div></footer>;
}
