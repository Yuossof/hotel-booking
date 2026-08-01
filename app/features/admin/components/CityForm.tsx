"use client";

import { CityFormValues, T } from "@/types";

interface CityFormProps {
  t: T;
  values: CityFormValues;
  onChange: (values: CityFormValues) => void;
  errorMessage?: string;
  isEditing: boolean;
  onSubmit: () => void;
  submitting?: boolean;
}

const LANG_FIELDS: { key: keyof CityFormValues; label: string }[] = [
  { key: "nameAr", label: "AR" },
  { key: "nameEn", label: "EN" },
  { key: "nameTr", label: "TR" },
  { key: "nameUr", label: "UR" },
];

export default function CityForm({ t, values, onChange, errorMessage, isEditing, onSubmit, submitting }: CityFormProps) {
  const set = (patch: Partial<CityFormValues>) => onChange({ ...values, ...patch });

  return (
    <div className="bir-card" style={{ padding: 22, maxWidth: 480 }}>
      <div className="bir-display" style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
        {isEditing ? t("tab_edit_city") : t("tab_add_city")}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {LANG_FIELDS.map(({ key, label }) => (
          <div key={key} style={{ display: "flex", gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-soft)", minWidth: 30, paddingTop: 10 }}>
              {label}
            </span>
            <input
              className="bir-input"
              placeholder={`${t("city_name_ph")} (${label})`}
              value={values[key] || ""}
              onChange={(e) => set({ [key]: e.target.value })}
              style={{ flex: 1 }}
            />
          </div>
        ))}

        {errorMessage && <div style={{ color: "var(--danger)", fontSize: 12.5 }}>{errorMessage}</div>}

        <button
          type="button"
          className="bir-btn bir-btn-primary"
          style={{ padding: "11px 16px", borderRadius: 10, marginTop: 4 }}
          disabled={submitting}
          onClick={onSubmit}
        >
          {submitting ? t("loading_text") : isEditing ? t("save_changes") : t("add_city_btn")}
        </button>
      </div>
    </div>
  );
}
