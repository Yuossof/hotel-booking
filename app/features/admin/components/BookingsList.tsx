"use client";

import { useEffect, useState } from "react";
import { Calendar, CheckCircle2, Phone, Users, XCircle } from "lucide-react";
import { ROOM_TYPES } from "@/lib/constants";
import { localized } from "@/lib/display";
import { Booking, Lang, T } from "@/types";

interface BookingsListProps {
  bookings: Booking[];
  lang: Lang;
  t: T;
  onConfirm: (booking: Booking) => void;
  onDecline: (booking: Booking) => void;
  loading?: boolean;
}

export default function BookingsList({ bookings, lang, t, onConfirm, onDecline, loading }: BookingsListProps) {
  const [roomTypeOptions, setRoomTypeOptions] = useState<{ key: string; name: { ar: string; en: string; tr: string; ur: string } }[]>([]);

  useEffect(() => {
    fetch("/api/room-types")
      .then((r) => r.json())
      .then((d) => { if (d.roomTypes) setRoomTypeOptions(d.roomTypes); })
      .catch(() => {});
  }, []);

  if (loading) {
    return (
      <div className="bir-card" style={{ padding: 36, textAlign: "center", color: "var(--ink-soft)" }}>
        {t("loading_text")}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="bir-card" style={{ padding: 36, textAlign: "center", color: "var(--ink-soft)" }}>
        {t("bookings_empty")}
      </div>
    );
  }

  const statusStyle = (status: Booking["status"]) => ({
    background: status === "pending" ? "var(--gold-tint)" : status === "confirmed" ? "var(--primary-tint)" : "var(--danger-tint)",
    color: status === "pending" ? "#8A6A26" : status === "confirmed" ? "var(--primary-dark)" : "var(--danger)",
  });

  const statusLabel = (status: Booking["status"]) =>
    status === "pending" ? t("status_pending") : status === "confirmed" ? t("status_confirmed") : t("status_declined");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {bookings.map((b) => (
        <div key={b.id} className="bir-card" style={{ padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <div>
              <div style={{ fontWeight: 700 }}>
                {b.guestName} — {localized(b.hotelName, lang)}
              </div>
              <div style={{ fontSize: 12.5, color: "var(--ink-soft)", display: "flex", gap: 12, flexWrap: "wrap", marginTop: 4 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Calendar size={12} /> {b.checkIn} → {b.checkOut}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Users size={12} /> {b.guestsCount}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Phone size={12} /> {b.guestPhone}
                </span>
                {b.roomType && (() => {
                  const fromApi = roomTypeOptions.find((r) => r.key === b.roomType);
                  const fromStatic = ROOM_TYPES.find((r) => r.key === b.roomType);
                  return <span>{fromApi ? (fromApi.name[lang] || fromApi.name.en) : fromStatic ? (fromStatic[lang] || fromStatic.en) : b.roomType}</span>;
                })()}
              </div>
            </div>
            <span className="bir-badge" style={{ ...statusStyle(b.status), height: "fit-content" }}>
              {statusLabel(b.status)}
            </span>
          </div>
          {b.status === "pending" && (
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button
                type="button"
                className="bir-btn bir-btn-primary"
                style={{ padding: "8px 14px", borderRadius: 8, fontSize: 12.5, display: "flex", alignItems: "center", gap: 4 }}
                onClick={() => onConfirm(b)}
              >
                <CheckCircle2 size={14} /> {t("confirm_availability")}
              </button>
              <button
                type="button"
                className="bir-btn bir-btn-danger"
                style={{ padding: "8px 14px", borderRadius: 8, fontSize: 12.5, display: "flex", alignItems: "center", gap: 4 }}
                onClick={() => onDecline(b)}
              >
                <XCircle size={14} /> {t("no_rooms")}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
