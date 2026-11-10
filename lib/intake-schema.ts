export const requestCategories = [
  "geyser",
  "burst-pipe",
  "blocked-drain",
  "leak",
  "installation",
  "other",
] as const;

export const urgencyOptions = ["urgent", "soon", "flexible"] as const;

export type IntakeResult = { ok: true } | { ok: false; error: string };

export function cleanText(value: FormDataEntryValue | null, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").slice(0, maxLength);
}

export function validEmail(email: string) {
  return email === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 9 && digits.length <= 15;
}
