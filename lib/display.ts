import { Lang, LocalizedText } from "@/types";

/** Picks the right-language string out of a localized field, with sensible fallbacks. */
export function localized(field: LocalizedText | string | undefined, lang: Lang): string {
  if (!field) return "";
  if (typeof field === "string") return field;
  return field[lang] || field.ar || field.en || Object.values(field)[0] || "";
}

/** Formats a stale option key (e.g. "free_breakfast", "roomService") into a natural label. */
const TITLE_CASE_OVERRIDES: Record<string, string> = {
  wifi: "WiFi",
  ac: "AC",
  tv: "TV",
  airConditioning: "Air Conditioning",
};

export function humanizeOptionKey(key: string): string {
  const value = String(key ?? "");
  if (TITLE_CASE_OVERRIDES[value]) return TITLE_CASE_OVERRIDES[value];
  const words = value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(/[_\s]+/)
    .filter(Boolean);
  if (words.length === 0) return value;
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

/** Resolves a room-type/amenity id or stale key into a localized label. */
export function optionLabel(
  value: string,
  options: { id: number; name: { ar: string; en: string; tr: string; ur: string } }[],
  fallbacks: { id: number; ar: string; en: string; tr: string; ur: string }[],
  lang: Lang,
): string {
  const numeric = Number(value);
  if (Number.isInteger(numeric) && numeric > 0) {
    const fromApi = options.find((o) => o.id === numeric);
    if (fromApi) return fromApi.name[lang] || fromApi.name.ar || fromApi.name.en || value;
    const fromStatic = fallbacks.find((o) => o.id === numeric);
    if (fromStatic) return fromStatic[lang] || fromStatic.ar || fromStatic.en || value;
  }
  return humanizeOptionKey(value);
}

/** Formats a price in Saudi Riyal (SAR) for display. */
export function formatPrice(price: number, lang: Lang): string {
  const value = Number(price) || 0;
  const locale = lang === "ar" ? "ar-SA" : lang === "tr" ? "tr-TR" : lang === "ur" ? "ur-PK" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "SAR",
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
  }).format(value);
}
