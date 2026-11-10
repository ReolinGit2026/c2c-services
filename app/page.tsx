import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/app/components/site-header";

const steps = [
  { no: "01", title: "Tell us what’s happening", text: "Share a few details about the plumbing work and the area where help is needed." },
  { no: "02", title: "C2C reviews your request", text: "Our team reviews the information and looks for suitable local providers to contact." },
  { no: "03", title: "Arrange the next step", text: "C2C can introduce you to an interested provider so you can discuss the work directly." },
];

export default function HomePage() {
  return <>
    <SiteHeader />
    <main>
      <section style={{ overflow: "hidden", background: "linear-gradient(115deg,#f3faf8 0%,#f7f9fb 47%,#eef5fd 100%)", borderBottom: "1px solid #eef2f5" }}>
        <div className="page-shell" style={{ minHeight: 555, display: "grid", gridTemplateColumns: "1.04fr .96fr", alignItems: "center", gap: 42, paddingBlock: 68 }}>
          <div style={{ position: "relative", zIndex: 1 }}>
            <div className="eyebrow" style={{ display: "flex", alignItems: "center", gap: 9 }}><span style={{ width: 26, height: 2, background: "var(--green)" }} /> Local plumbing connections · East Rand</div>
            <h1 style={{ maxWidth: 650, margin: "22px 0 18px", color: "var(--navy)", fontSize: "clamp(2.7rem,5.4vw,4.55rem)", lineHeight: .99, letterSpacing: "-.065em" }}>Need a local service?<br /><span style={{ color: "var(--green)" }}>Let C2C connect you.</span></h1>
            <p style={{ maxWidth: 540, margin: 0, color: "#576981", fontSize: 17, lineHeight: 1.75 }}>C2C Services connects customers with suitable local service providers, helping make the process of finding and arranging a service simpler.</p>
            <div style={{ display: "flex", gap: 12, marginTop: 29, flexWrap: "wrap" }}><Link href="/request" className="btn btn-primary">Tell us what you need <span aria-hidden="true">→</span></Link><Link href="/providers/apply" className="btn btn-outline">I’m a service provider</Link></div>
            <div style={{ display: "flex", gap: 22, marginTop: 31, color: "#66768a", fontSize: 12, flexWrap: "wrap" }}><span><b style={{ color: "var(--green)", marginRight: 7 }}>✓</b>Plumbing requests</span><span><b style={{ color: "var(--green)", marginRight: 7 }}>✓</b>East Rand, Gauteng</span><span><b style={{ color: "var(--green)", marginRight: 7 }}>✓</b>Human reviewed</span></div>
          </div>
          <div aria-label="Illustration showing a customer request being connected with a local plumbing provider" role="img" style={{ position: "relative", minHeight: 390, display: "grid", placeItems: "center" }}>
            <div style={{ position: "absolute", width: 370, height: 370, borderRadius: "50%", background: "radial-gradient(circle,#d5efe5 0%,#d5efe566 55%,transparent 72%)", filter: "blur(4px)" }} />
            <div style={{ position: "relative", width: "min(100%,440px)", height: 345 }}>
              <div style={{ position: "absolute", inset: "35px 20px 18px", border: "1px solid #dce8e8", borderRadius: "50%", transform: "rotate(-13deg)" }} />
              <div style={{ position: "absolute", left: "8%", top: "9%", width: 230, borderRadius: 16, padding: 18, background: "white", boxShadow: "0 18px 45px #19395d1a", border: "1px solid #e7edf2" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: 11, fontWeight: 800, color: "#263a55" }}>NEW REQUEST</span><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#54c49a" }} /></div>
                <p style={{ margin: "13px 0 8px", color: "var(--navy)", fontSize: 15, fontWeight: 750 }}>Leaking kitchen tap</p>
                <span style={{ color: "#77869a", fontSize: 11 }}>Benoni · Plumbing</span>
                <div style={{ marginTop: 16, height: 5, borderRadius: 10, background: "#e8f5ef" }}><div style={{ width: "66%", height: "100%", borderRadius: 10, background: "var(--green)" }} /></div>
              </div>
              <div style={{ position: "absolute", right: "6%", top: "36%", width: 207, borderRadius: 15, padding: 17, background: "var(--navy)", color: "white", boxShadow: "0 20px 46px #10233f35" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ width: 37, height: 37, borderRadius: 12, background: "#ffffff1a", display: "grid", placeItems: "center", color: "#9de4c5", fontSize: 18 }}>↗</span><div><div style={{ fontSize: 12, fontWeight: 800 }}>C2C Services</div><div style={{ fontSize: 10, color: "#bfccdb", marginTop: 4 }}>Local connection</div></div></div>
                <div style={{ display: "flex", gap: 5, alignItems: "center", marginTop: 17 }}><span style={{ height: 1, flex: 1, background: "#ffffff43" }} /><span style={{ width: 6, height: 6, border: "1px solid #a2dfc1", borderRadius: "50%" }} /><span style={{ height: 1, flex: 1, background: "#ffffff43" }} /></div>
              </div>
              <div style={{ position: "absolute", left: "18%", bottom: "6%", width: 232, borderRadius: 16, padding: 16, background: "white", boxShadow: "0 15px 40px #19395d1a", border: "1px solid #e7edf2", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ width: 42, height: 42, display: "grid", placeItems: "center", borderRadius: 14, background: "#e4f5ec", color: "#087f70", fontSize: 20 }}>⌁</span><div><div style={{ fontSize: 12, color: "var(--navy)", fontWeight: 750 }}>Local provider</div><div style={{ color: "#77869a", fontSize: 10, marginTop: 4 }}>Service area match</div></div><span style={{ marginLeft: "auto", color: "var(--green)", fontSize: 17 }}>✓</span>
              </div>
              <span style={{ position: "absolute", right: "18%", top: "9%", width: 12, height: 12, background: "#91d7b8", borderRadius: "50%" }} />
              <span style={{ position: "absolute", left: "2%", bottom: "27%", width: 8, height: 8, background: "#79ace7", borderRadius: "50%" }} />
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="page-shell" style={{ paddingTop: 82 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 24, flexWrap: "wrap" }}><div><div className="eyebrow">A simple place to start</div><h2 style={{ margin: "12px 0 0", color: "var(--navy)", fontSize: "clamp(1.8rem,3.2vw,2.55rem)", letterSpacing: "-.045em" }}>From plumbing problem to a local connection</h2></div><p style={{ maxWidth: 355, margin: 0, color: "#64748b", fontSize: 14, lineHeight: 1.7 }}>C2C reviews your request and helps coordinate an introduction with a suitable provider in the area.</p></div>
        <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 18, marginTop: 34 }}>
          {steps.map(step => <article key={step.no} style={{ minHeight: 185, padding: 23, border: "1px solid #e3eaf0", borderRadius: 14, background: "white" }}><div style={{ width: 36, height: 36, display: "grid", placeItems: "center", borderRadius: 10, background: "#e6f5ee", color: "var(--green)", fontSize: 12, fontWeight: 850 }}>{step.no}</div><h3 style={{ margin: "18px 0 8px", color: "var(--navy)", fontSize: 16 }}>{step.title}</h3><p style={{ margin: 0, color: "#69788c", fontSize: 13, lineHeight: 1.7 }}>{step.text}</p></article>)}
        </div>
      </section>

      <section className="page-shell" style={{ marginTop: 72, padding: "26px 30px", borderRadius: 14, background: "#f2f7fb", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 22, flexWrap: "wrap" }}><div><div className="eyebrow">For local plumbers</div><h2 style={{ margin: "8px 0 5px", color: "var(--navy)", fontSize: 21 }}>Interested in joining the C2C network?</h2><p style={{ margin: 0, color: "#64748b", fontSize: 13 }}>Tell us about your business and the areas you serve.</p></div><Link href="/providers/apply" className="btn btn-outline">Apply as a provider <span aria-hidden="true">→</span></Link></section>
    </main>
    <SiteFooter />
    <style>{"@media(max-width:800px){main section:first-child .page-shell{grid-template-columns:1fr!important;padding-block:48px!important}main section:first-child .page-shell>div:nth-child(2){min-height:320px!important}.steps-grid{grid-template-columns:1fr!important}}"}</style>
  </>;
}
