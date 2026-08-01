"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { T } from "@/types";

interface ResetDataButtonProps {
  t: T;
  onConfirmReset: () => void;
}

export default function ResetDataButton({ t, onConfirmReset }: ResetDataButtonProps) {
  const [armed, setArmed] = useState(false);

  return (
    <div style={{ marginTop: 30, paddingTop: 16, borderTop: "1px solid var(--line)" }}>
      {!armed ? (
        <button
          type="button"
          className="bir-btn"
          style={{ background: "transparent", color: "var(--ink-soft)", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}
          onClick={() => setArmed(true)}
        >
          <RefreshCw size={13} /> {t("reset_demo_data")}
        </button>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, flexWrap: "wrap" }}>
          <span style={{ color: "var(--ink-soft)" }}>{t("reset_confirm_text")}</span>
          <button
            type="button"
            className="bir-btn bir-btn-danger"
            style={{ padding: "6px 12px", borderRadius: 8 }}
            onClick={() => {
              onConfirmReset();
              setArmed(false);
            }}
          >
            {t("reset_yes")}
          </button>
          <button type="button" className="bir-btn bir-btn-ghost" style={{ padding: "6px 12px", borderRadius: 8 }} onClick={() => setArmed(false)}>
            {t("reset_cancel")}
          </button>
        </div>
      )}
    </div>
  );
}
