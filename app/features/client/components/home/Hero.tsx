import { T } from "@/types";

export default function Hero({ t }: { t: T }) {
  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "36px 20px 10px" }}>
      <div className="bir-display" style={{ fontSize: 30, fontWeight: 800, lineHeight: 1.3 }}>
        {t("hero_title")}
      </div>
      <p style={{ color: "var(--ink-soft)", fontSize: 14, marginTop: 6, maxWidth: 560 }}>{t("hero_subtitle")}</p>
    </div>
  );
}
