"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { cleanText, requestCategories, urgencyOptions, validEmail, validPhone } from "@/lib/intake-schema";

const privacyNoticeVersion = "draft-0.1";
const emailValue = (formData: FormData) => cleanText(formData.get("email"), 254).toLowerCase();
const textList = (value: string) => [...new Set(value.split(/[\n,;]/).map(part => part.trim()).filter(Boolean))].slice(0, 20);

async function intakeKey(formType: "request" | "provider") {
  const requestHeaders = await headers();
  const address = requestHeaders.get("x-real-ip") ?? requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const salt = process.env.INTAKE_RATE_LIMIT_SALT ?? process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? "local-development";
  return createHash("sha256").update(`${salt}:${formType}:${address}`).digest("hex");
}

function trapTriggered(formData: FormData) {
  const trap = cleanText(formData.get("website"), 200);
  const started = Number(formData.get("form_started_at"));
  const elapsed = Date.now() - started;
  return trap.length > 0 || !Number.isFinite(started) || elapsed < 1500 || elapsed > 30 * 60 * 1000;
}

export async function submitRequest(_previous: { error: string } | null, formData: FormData): Promise<{ error: string } | null> {
  if (trapTriggered(formData)) return { error: "We couldn’t submit that request. Please try again." };
  const contactName = cleanText(formData.get("contact_name"), 100);
  const phone = cleanText(formData.get("phone"), 30);
  const email = emailValue(formData);
  const area = cleanText(formData.get("area"), 120);
  const category = cleanText(formData.get("category"), 40);
  const description = cleanText(formData.get("description"), 2000);
  const urgency = cleanText(formData.get("urgency"), 20);
  const preferredTime = cleanText(formData.get("preferred_time"), 120);

  if (contactName.length < 2 || !validPhone(phone) || !validEmail(email) || area.length < 2 || !requestCategories.includes(category as typeof requestCategories[number]) || description.length < 10 || !urgencyOptions.includes(urgency as typeof urgencyOptions[number]) || formData.get("consent") !== "yes") {
    return { error: "Check the required fields and consent box, then try again." };
  }

  const supabase = createSupabaseAdminClient();
  const { data: allowed, error: rateError } = await supabase.rpc("check_intake_rate_limit", {
    p_form_type: "request", p_ip_hash: await intakeKey("request"), p_limit: 5,
  });
  if (rateError || !allowed) return { error: "We couldn’t submit this request right now. Please wait and try again." };

  const { error } = await supabase.rpc("submit_service_request", {
    p_contact_name: contactName,
    p_phone: phone,
    p_email: email || null,
    p_area_text: area,
    p_category: category,
    p_description: description,
    p_urgency: urgency,
    p_preferred_time_text: preferredTime || null,
    p_privacy_notice_version: privacyNoticeVersion,
  });
  if (error) return { error: "We couldn’t submit your request right now. Please try again later." };
  redirect("/request/received");
}

export async function submitProviderApplication(_previous: { error: string } | null, formData: FormData): Promise<{ error: string } | null> {
  if (trapTriggered(formData)) return { error: "We couldn’t submit that application. Please try again." };
  const contactName = cleanText(formData.get("contact_name"), 100);
  const businessName = cleanText(formData.get("business_name"), 150);
  const phone = cleanText(formData.get("phone"), 30);
  const email = emailValue(formData);
  const services = textList(cleanText(formData.get("services"), 500));
  const areas = textList(cleanText(formData.get("service_areas"), 500));
  if (contactName.length < 2 || businessName.length < 2 || !validPhone(phone) || !validEmail(email) || services.length === 0 || areas.length === 0 || formData.get("consent") !== "yes") {
    return { error: "Check the required fields and consent box, then try again." };
  }

  const supabase = createSupabaseAdminClient();
  const { data: allowed, error: rateError } = await supabase.rpc("check_intake_rate_limit", {
    p_form_type: "provider", p_ip_hash: await intakeKey("provider"), p_limit: 3,
  });
  if (rateError || !allowed) return { error: "We couldn’t submit this application right now. Please wait and try again." };

  const { error } = await supabase.rpc("submit_provider_application", {
    p_contact_name: contactName,
    p_business_name: businessName,
    p_phone: phone,
    p_email: email || null,
    p_services: services,
    p_service_areas: areas,
    p_privacy_notice_version: privacyNoticeVersion,
  });
  if (error) return { error: "We couldn’t submit your application right now. Please try again later." };
  redirect("/providers/apply/received");
}
