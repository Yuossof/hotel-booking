import { Lang, LocalizedText } from "@/types";

/** Picks the right-language string out of a localized field, with sensible fallbacks. */
export function localized(field: LocalizedText | string | undefined, lang: Lang): string {
  if (!field) return "";
  if (typeof field === "string") return field;
  return field[lang] || field.ar || field.en || Object.values(field)[0] || "";
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
