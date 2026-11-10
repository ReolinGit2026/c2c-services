"use client";

import { useActionState } from "react";
import { signInAdmin } from "@/app/admin/actions";

export function AdminLoginForm() {
  const [state, action, pending] = useActionState(signInAdmin, null);
  return <form action={action} style={{ display: "grid", gap: 16 }}>
    <div className="field"><label htmlFor="email">Admin email</label><input id="email" name="email" type="email" autoComplete="username" required maxLength={254} /></div>
    <div className="field"><label htmlFor="password">Password</label><input id="password" name="password" type="password" autoComplete="current-password" required /></div>
    {state?.error && <p role="alert" style={{ margin: 0, color: "#a33131", fontSize: 13 }}>{state.error}</p>}
    <button className="btn btn-primary" disabled={pending}>{pending ? "Signing in…" : "Sign in securely"}</button>
  </form>;
}
