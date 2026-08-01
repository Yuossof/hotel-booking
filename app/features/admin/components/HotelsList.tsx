"use client";

import { Building2, Pencil, Trash2 } from "lucide-react";
import { formatPrice, localized } from "@/lib/display";
import { Hotel, Lang, T } from "@/types";

interface HotelsListProps {
  hotels: Hotel[];
  lang: Lang;
  t: T;
  onEdit: (hotel: Hotel) => void;
  onDelete: (hotelId: number) => void;
  loading?: boolean;
}

export default function HotelsList({ hotels, lang, t, onEdit, onDelete, loading }: HotelsListProps) {
  if (loading) {
    return (
      <div className="bir-card" style={{ padding: 36, textAlign: "center", color: "var(--ink-soft)" }}>
        {t("loading_text")}
      </div>
    );
  }

  if (hotels.length === 0) {
    return (
      <div className="bir-card" style={{ padding: 36, textAlign: "center", color: "var(--ink-soft)" }}>
        <Building2 size={22} style={{ margin: "0 auto 8px" }} />
        {t("my_hotels_empty")}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {hotels.map((h) => (
        <div key={h.id} className="bir-card" style={{ padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={h.image || `https://picsum.photos/seed/${h.id}/480/300`}
              alt=""
              style={{ width: 56, height: 56, borderRadius: 8, objectFit: "cover" }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            <div>
              <div className="bir-display" style={{ fontWeight: 700 }}>
                {localized(h.name, lang)}
                {h.featured && (
                  <span className="bir-badge bir-badge-low" style={{ marginInlineStart: 8 }}>
                    {t("most_requested_title")}
                  </span>
                )}
              </div>
              <div style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>
                {localized(h.city.name, lang)} · {formatPrice(h.price, lang)} · {h.availableRooms}/{h.totalRooms}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              className="bir-btn bir-btn-ghost"
              style={{ padding: "7px 12px", borderRadius: 8, fontSize: 12.5, display: "flex", alignItems: "center", gap: 4 }}
              onClick={() => onEdit(h)}
            >
              <Pencil size={13} /> {t("edit")}
            </button>
            <button
              type="button"
              className="bir-btn bir-btn-danger"
              style={{ padding: "7px 12px", borderRadius: 8, fontSize: 12.5, display: "flex", alignItems: "center", gap: 4 }}
              onClick={() => onDelete(h.id)}
            >
              <Trash2 size={13} /> {t("delete")}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
