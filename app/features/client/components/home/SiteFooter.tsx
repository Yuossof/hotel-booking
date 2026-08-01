import { T } from "@/types";

export default function SiteFooter({ t }: { t: T }) {
  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 20px 30px" }}>
      <div style={{ fontSize: 11.5, color: "var(--ink-soft)", textAlign: "center", lineHeight: 1.7 }}>{t("footer_note")}</div>
    </div>
  );
}
