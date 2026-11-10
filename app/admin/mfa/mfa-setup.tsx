"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import Image from "next/image";
import { useRouter } from "next/navigation";

type FactorState = { id: string; qr?: string; secret?: string; challengeId?: string; error?: string; loading: boolean };

export function MfaSetup() {
  const router = useRouter();
  const [factor, setFactor] = useState<FactorState>({ id: "", loading: true });
  const [code, setCode] = useState("");
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = supabaseUrl && supabaseKey ? createBrowserClient(supabaseUrl, supabaseKey) : null;

  useEffect(() => {
    let active = true;
    async function load() {
      if (!supabase) { setFactor({ id: "", loading: false, error: "Supabase is not configured." }); return; }
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (!active) return;
      const existing = data?.totp.find(item => item.status === "verified");
      if (error) { setFactor({ id: "", loading: false, error: "Could not load your MFA setup. Sign in again and retry." }); return; }
      if (existing) setFactor({ id: existing.id, loading: false });
      else setFactor({ id: "", loading: false });
    }
    void load();
    return () => { active = false; };
  }, [supabase]);

  async function beginSetup() {
    if (!supabase) return;
    setFactor(current => ({ ...current, loading: true, error: undefined }));
    const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp", friendlyName: "C2C Admin" });
    if (error || !data) { setFactor(current => ({ ...current, loading: false, error: "Could not start MFA setup. Please retry." })); return; }
    setFactor({ id: data.id, qr: data.totp.qr_code, secret: data.totp.secret, loading: false });
  }

  async function verify() {
    if (!supabase || !factor.id) return;
    setFactor(current => ({ ...current, loading: true, error: undefined }));
    let challengeId = factor.challengeId;
    if (!challengeId) {
      const { data, error } = await supabase.auth.mfa.challenge({ factorId: factor.id });
      if (error || !data) { setFactor(current => ({ ...current, loading: false, error: "Could not start the MFA check. Please retry." })); return; }
      challengeId = data.id;
    }
    const { error } = await supabase.auth.mfa.verify({ factorId: factor.id, challengeId, code: code.replace(/\s/g, "") });
    if (error) { setFactor(current => ({ ...current, loading: false, challengeId, error: "That code didn’t work. Check your authenticator and try again." })); return; }
    router.replace("/admin");
    router.refresh();
  }

  return <div style={{ display: "grid", gap: 16 }}>
    {factor.loading && <p style={{ color: "#65758a", fontSize: 13 }}>Checking multi-factor authentication…</p>}
    {!factor.loading && !factor.id && <><p style={{ color: "#65758a", fontSize: 13, lineHeight: 1.65 }}>Set up an authenticator app to protect access to customer and provider records.</p><button className="btn btn-primary" onClick={beginSetup}>Set up authenticator</button></>}
    {factor.qr && <div style={{ textAlign: "center", border: "1px solid #e3eaf0", borderRadius: 12, padding: 16 }}><p style={{ margin: "0 0 12px", fontSize: 13, color: "var(--navy)", fontWeight: 700 }}>Scan with your authenticator app</p><Image src={factor.qr} alt="Authenticator setup QR code" width={180} height={180} unoptimized style={{ margin: "auto" }} /><p style={{ color: "#758398", fontSize: 11 }}>Or enter this setup key manually:</p><code style={{ color: "var(--navy)", fontSize: 12, wordBreak: "break-all" }}>{factor.secret}</code></div>}
    {!factor.loading && factor.id && <><div className="field"><label htmlFor="mfa-code">6-digit authenticator code</label><input id="mfa-code" inputMode="numeric" autoComplete="one-time-code" maxLength={8} value={code} onChange={event => setCode(event.target.value)} /></div><button className="btn btn-primary" onClick={verify} disabled={factor.loading || code.replace(/\D/g, "").length < 6}>Verify and continue</button></>}
    {factor.error && <p role="alert" style={{ margin: 0, color: "#a33131", fontSize: 13 }}>{factor.error}</p>}
  </div>;
}
