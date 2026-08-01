import { BedDouble } from "lucide-react";
import { T } from "@/types";

export default function BrandMark({ t }: { t: T }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 9,
          background: "var(--primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <BedDouble size={18} color="#fff" />
      </div>
      <span className="bir-display" style={{ fontSize: 18, fontWeight: 800 }}>
        {t("brand")}
      </span>
    </div>
  );
}
