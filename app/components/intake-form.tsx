"use client";

import { useActionState } from "react";
import { submitProviderApplication, submitRequest } from "@/app/forms/actions";

function Consent({ kind }: { kind: "request" | "provider" }) {
  const purpose = kind === "request" ? "to respond to my plumbing request" : "to review this provider application";
  return <label style={{ display: "flex", alignItems: "flex-start", gap: 10, color: "#576981", fontSize: 12, lineHeight: 1.6 }}><input required name="consent" type="checkbox" value="yes" style={{ marginTop: 3, accentColor: "var(--green)" }} /><span>I agree that C2C may use these details {purpose}. I have read the <a href="/privacy" style={{ color: "var(--green)", textDecoration: "underline" }}>privacy information</a>. Please don’t include sensitive personal or identity information.</span></label>;
}

export function CustomerRequestForm() {
  const [state, action, pending] = useActionState(submitRequest, null);
  return <form action={action} onSubmit={event => { (event.currentTarget.elements.namedItem("form_started_at") as HTMLInputElement).value = String(Date.now()); }} style={{ display: "grid", gap: 19 }}>
    <input type="hidden" name="form_started_at" value="0" /><div className="sr-only" aria-hidden="true"><label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <div className="form-grid">
      <div className="field"><label htmlFor="contact_name">Your name *</label><input id="contact_name" name="contact_name" autoComplete="name" required minLength={2} maxLength={100} /></div>
      <div className="field"><label htmlFor="phone">Phone number *</label><input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="e.g. 082 123 4567" required /></div>
      <div className="field"><label htmlFor="email">Email <span style={{ fontWeight: 400, color: "#718096" }}>(optional)</span></label><input id="email" name="email" type="email" autoComplete="email" maxLength={254} /></div>
      <div className="field"><label htmlFor="area">Suburb or area *</label><input id="area" name="area" autoComplete="address-level2" placeholder="e.g. Benoni" required maxLength={120} /></div>
      <div className="field"><label htmlFor="category">Type of plumbing work *</label><select id="category" name="category" required defaultValue=""><option value="" disabled>Select one</option><option value="geyser">Geyser</option><option value="burst-pipe">Burst pipe</option><option value="blocked-drain">Blocked drain</option><option value="leak">Leak</option><option value="installation">Installation</option><option value="other">Other plumbing work</option></select></div>
      <div className="field"><label htmlFor="urgency">When do you need help? *</label><select id="urgency" name="urgency" required defaultValue=""><option value="" disabled>Select one</option><option value="urgent">As soon as possible</option><option value="soon">Soon</option><option value="flexible">I’m flexible</option></select></div>
      <div className="field span-2"><label htmlFor="description">Briefly describe the issue *</label><textarea id="description" name="description" required minLength={10} maxLength={2000} placeholder="What is happening and where in the property? Please don’t include sensitive details." /></div>
      <div className="field span-2"><label htmlFor="preferred_time">Preferred time <span style={{ fontWeight: 400, color: "#718096" }}>(optional)</span></label><input id="preferred_time" name="preferred_time" maxLength={120} placeholder="e.g. Weekday mornings" /></div>
    </div>
    <Consent kind="request" />
    {state?.error && <p role="alert" style={{ margin: 0, color: "#a33131", fontSize: 13 }}>{state.error}</p>}
    <div><button className="btn btn-primary" type="submit" disabled={pending}>{pending ? "Sending request…" : "Submit plumbing request"} {!pending && <span aria-hidden="true">→</span>}</button></div>
  </form>;
}

export function ProviderApplicationForm() {
  const [state, action, pending] = useActionState(submitProviderApplication, null);
  return <form action={action} onSubmit={event => { (event.currentTarget.elements.namedItem("form_started_at") as HTMLInputElement).value = String(Date.now()); }} style={{ display: "grid", gap: 19 }}>
    <input type="hidden" name="form_started_at" value="0" /><div className="sr-only" aria-hidden="true"><label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <div className="form-grid">
      <div className="field"><label htmlFor="contact_name">Your name *</label><input id="contact_name" name="contact_name" autoComplete="name" required minLength={2} maxLength={100} /></div>
      <div className="field"><label htmlFor="business_name">Business name *</label><input id="business_name" name="business_name" autoComplete="organization" required minLength={2} maxLength={150} /></div>
      <div className="field"><label htmlFor="phone">Phone number *</label><input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="e.g. 082 123 4567" required /></div>
      <div className="field"><label htmlFor="email">Email <span style={{ fontWeight: 400, color: "#718096" }}>(optional)</span></label><input id="email" name="email" type="email" autoComplete="email" maxLength={254} /></div>
      <div className="field span-2"><label htmlFor="services">Plumbing services offered *</label><textarea id="services" name="services" required maxLength={500} placeholder="e.g. geysers, leaks, blocked drains" style={{ minHeight: 85 }} /></div>
      <div className="field span-2"><label htmlFor="service_areas">Suburbs or areas served *</label><textarea id="service_areas" name="service_areas" required maxLength={500} placeholder="Separate areas with commas" style={{ minHeight: 85 }} /></div>
    </div>
    <Consent kind="provider" />
    {state?.error && <p role="alert" style={{ margin: 0, color: "#a33131", fontSize: 13 }}>{state.error}</p>}
    <div><button className="btn btn-primary" type="submit" disabled={pending}>{pending ? "Sending application…" : "Submit provider application"} {!pending && <span aria-hidden="true">→</span>}</button></div>
  </form>;
}
