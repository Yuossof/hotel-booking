"use client";

import { Building2, Pencil, Trash2 } from "lucide-react";
import { localized } from "@/lib/display";
import { City, Lang, T } from "@/types";

interface CitiesListProps {
  cities: City[];
  lang: Lang;
  t: T;
  onEdit: (city: City) => void;
  onDelete: (cityId: number) => void;
  loading?: boolean;
}

export default function CitiesList({ cities, lang, t, onEdit, onDelete, loading }: CitiesListProps) {
  if (loading) {
    return (
      <div className="bir-card" style={{ padding: 36, textAlign: "center", color: "var(--ink-soft)" }}>
        {t("loading_text")}
      </div>
    );
  }

  if (cities.length === 0) {
    return (
      <div className="bir-card" style={{ padding: 36, textAlign: "center", color: "var(--ink-soft)" }}>
        <Building2 size={22} style={{ margin: "0 auto 8px" }} />
        {t("cities_empty")}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {cities.map((c) => (
        <div
          key={c.id}
          className="bir-card"
          style={{ padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 8,
                background: "var(--primary-tint)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
              }}
            >
              🏙️
            </div>
            <div>
              <div className="bir-display" style={{ fontWeight: 700 }}>
                {localized(c.name, lang)}
              </div>
              <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>
                AR: {c.name.ar || "—"} · EN: {c.name.en || "—"} · TR: {c.name.tr || "—"} · UR: {c.name.ur || "—"}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              className="bir-btn bir-btn-ghost"
              style={{ padding: "7px 12px", borderRadius: 8, fontSize: 12.5, display: "flex", alignItems: "center", gap: 4 }}
              onClick={() => onEdit(c)}
            >
              <Pencil size={13} /> {t("edit")}
            </button>
            <button
              type="button"
              className="bir-btn bir-btn-danger"
              style={{ padding: "7px 12px", borderRadius: 8, fontSize: 12.5, display: "flex", alignItems: "center", gap: 4 }}
              onClick={() => onDelete(c.id)}
            >
              <Trash2 size={13} /> {t("delete")}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
