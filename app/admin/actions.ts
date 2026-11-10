"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, requireAdminWithoutMfaRedirect } from "@/lib/admin-auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const requestStatuses = ["new", "reviewing", "contacting_providers", "introduced", "follow_up", "closed"] as const;
const requestOutcomes = ["unknown", "booked", "not_booked", "cancelled", "unreachable"] as const;
const providerStatuses = ["new", "reviewing", "accepted_for_pilot", "declined", "inactive"] as const;
const actions = ["considered", "contact_attempted", "responded", "declined", "introduced"] as const;
const value = (formData: FormData, key: string, max = 1000) => String(formData.get(key) ?? "").trim().slice(0, max);

export async function signInAdmin(_previous: { error: string } | null, formData: FormData): Promise<{ error: string } | null> {
  const email = value(formData, "email", 254).toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Enter your admin email and password." };
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Sign-in failed. Check your credentials or contact the C2C admin." };
  redirect("/admin");
}

export async function signOutAdmin() {
  const { supabase } = await requireAdminWithoutMfaRedirect();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function updateRequest(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = value(formData, "request_id", 36);
  const status = value(formData, "status", 40);
  const outcome = value(formData, "outcome", 40);
  const note = value(formData, "note", 1000);
  if (!/^[0-9a-f-]{36}$/i.test(id) || !requestStatuses.includes(status as typeof requestStatuses[number]) || !requestOutcomes.includes(outcome as typeof requestOutcomes[number])) return;
  const { data: current, error: readError } = await supabase.from("service_requests").select("first_action_at").eq("id", id).maybeSingle();
  if (readError || !current) return;
  const recordsFirstAction = !current.first_action_at && (status !== "new" || Boolean(note));
  const patch: { status: string; outcome: string; first_action_at?: string; closed_at: string | null } = {
    status,
    outcome: outcome === "unknown" ? "unknown" : outcome,
    closed_at: status === "closed" ? new Date().toISOString() : null,
  };
  if (recordsFirstAction) patch.first_action_at = new Date().toISOString();
  const { error } = await supabase.from("service_requests").update({
    ...patch,
  }).eq("id", id);
  if (error) return;
  if (recordsFirstAction) await supabase.from("request_events").insert({ request_id: id, actor_admin_id: (await supabase.auth.getUser()).data.user?.id, event_type: "first_action_recorded" });
  if (note) await supabase.from("request_events").insert({ request_id: id, actor_admin_id: (await supabase.auth.getUser()).data.user?.id, event_type: "note_added", note });
  revalidatePath("/admin");
}

export async function updateProvider(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = value(formData, "provider_id", 36);
  const status = value(formData, "status", 40);
  const note = value(formData, "note", 1000);
  if (!/^[0-9a-f-]{36}$/i.test(id) || !providerStatuses.includes(status as typeof providerStatuses[number])) return;
  const { error } = await supabase.from("provider_applications").update({ status }).eq("id", id);
  if (error) return;
  if (note) await supabase.from("provider_application_events").insert({ provider_application_id: id, actor_admin_id: (await supabase.auth.getUser()).data.user?.id, event_type: "note_added", note });
  revalidatePath("/admin");
}

export async function recordProviderAction(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const requestId = value(formData, "request_id", 36);
  const providerId = value(formData, "provider_id", 36);
  const action = value(formData, "action", 40);
  const note = value(formData, "note", 1000);
  if (!/^[0-9a-f-]{36}$/i.test(requestId) || !/^[0-9a-f-]{36}$/i.test(providerId) || !actions.includes(action as typeof actions[number])) return;
  const { data: current, error } = await supabase.from("service_requests").select("first_action_at").eq("id", requestId).maybeSingle();
  if (error || !current) return;
  if (!current.first_action_at) {
    await supabase.from("service_requests").update({ first_action_at: new Date().toISOString() }).eq("id", requestId);
    await supabase.from("request_events").insert({ request_id: requestId, actor_admin_id: user.id, event_type: "first_action_recorded" });
  }
  await supabase.from("request_provider_actions").insert({ request_id: requestId, provider_application_id: providerId, created_by: user.id, action, response_at: action === "responded" || action === "declined" ? new Date().toISOString() : null, notes: note || null });
  revalidatePath("/admin");
}
