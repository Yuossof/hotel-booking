"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, X } from "lucide-react";
import { ROOM_TYPES } from "@/lib/constants";
import { localized, optionLabel } from "@/lib/display";
import { BookingFormValues, Hotel, Lang, T } from "@/types";

interface BookingDrawerProps {
  hotel: Hotel;
  lang: Lang;
  t: T;
  onClose: () => void;
}

const EMPTY_FORM: BookingFormValues = {
  guestName: "",
  guestPhone: "",
  guestEmail: "",
  checkIn: "",
  checkOut: "",
  guestsCount: 1,
  roomType: "",
};

export default function BookingDrawer({ hotel, lang, t, onClose }: BookingDrawerProps) {
  const [form, setForm] = useState<BookingFormValues>(EMPTY_FORM);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [roomTypeOptions, setRoomTypeOptions] = useState<{ id: number; name: { ar: string; en: string; tr: string; ur: string } }[]>([]);

  const set = (patch: Partial<BookingFormValues>) => setForm((prev) => ({ ...prev, ...patch }));

  const hotelName = localized(hotel.name, lang);

  useEffect(() => {
    fetch("/api/room-types", { headers: { "x-lang": lang } })
      .then((r) => r.json())
      .then((d) => { if (d.roomTypes) setRoomTypeOptions(d.roomTypes); })
      .catch(() => {});
  }, [lang]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => onClose(), 2500);
      return () => clearTimeout(timer);
    }
  }, [success, onClose]);

  const handleSubmit = async () => {
    const { guestName, guestPhone, guestEmail, checkIn, checkOut, guestsCount, roomType } = form;

    setError("");

    if (!guestName.trim() || !guestPhone.trim() || !checkIn || !checkOut) {
      setError(t("error_required"));
      return;
    }
    if (new Date(checkOut) <= new Date(checkIn)) {
      setError(t("error_dates"));
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-lang": lang },
        body: JSON.stringify({
          hotelId: hotel.id,
          guestName: guestName.trim(),
          guestPhone: guestPhone.trim(),
          guestEmail: guestEmail.trim(),
          checkIn,
          checkOut,
          guestsCount: Number(guestsCount),
          roomType,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Booking failed");
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء تسجيل الحجز");
    } finally {
      setSubmitting(false);
    }
  };

  // Styles المضافة للـ inputs عشان نضمن إنها متخرجش برا الحواف
  const inputStyle = { width: "100%", boxSizing: "border-box" as const };
  const labelStyle = { fontSize: 12, color: "var(--ink-soft)", marginBottom: 4, display: "block", fontWeight: 500 };

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)", zIndex: 50, display: "flex", justifyContent: "flex-start" }}
      onClick={onClose}
    >
      <div
        className="bir-slideover bir-card"
        style={{ width: "100%", maxWidth: "420px", height: "100%", borderRadius: 0, overflowY: "auto", boxSizing: "border-box", display: "flex", flexDirection: "column", backgroundColor: "var(--bg-base, #ffffff)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={hotel.image || `https://picsum.photos/seed/${hotel.id}/480/300`}
          alt={hotelName}
          style={{ width: "100%", height: "220px", objectFit: "cover", display: "block", flexShrink: 0 }}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", flex: 1, boxSizing: "border-box" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div>
              <div className="bir-display" style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.3 }}>
                {hotelName}
              </div>
            </div>
            <button type="button" className="bir-btn" onClick={onClose} style={{ background: "transparent", padding: 4, flexShrink: 0, marginLeft: 12 }} aria-label="close">
              <X size={22} color="var(--ink-soft)" />
            </button>
          </div>

          {success ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, gap: 16, padding: "40px 0", textAlign: "center" }}>
            <CheckCircle2 size={56} color="#10B981" />
            <div className="bir-display" style={{ fontSize: 20, fontWeight: 700 }}>{t("booking_success")}</div>
          </div>
        ) : (
          <>
            {hotel.availableRooms === 0 && (
              <div style={{ background: "var(--gold-tint, #FEF9C3)", color: "#854D0E", fontSize: 13, padding: "12px", borderRadius: 8, marginBottom: 20, border: "1px solid #FEF08A" }}>
                {t("no_rooms_hint")}
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
              <div>
                <label style={labelStyle}>{t("full_name")}</label>
                <input
                  className="bir-input"
                  style={inputStyle}
                  placeholder={t("full_name")}
                  value={form.guestName}
                  onChange={(e) => set({ guestName: e.target.value })}
                />
              </div>

              <div>
                <label style={labelStyle}>{t("phone_whatsapp")}</label>
                <input
                  className="bir-input"
                  style={inputStyle}
                  placeholder={t("phone_whatsapp")}
                  value={form.guestPhone}
                  onChange={(e) => set({ guestPhone: e.target.value })}
                />
              </div>

              <div>
                <label style={labelStyle}>{t("email_optional")}</label>
                <input
                  className="bir-input"
                  style={inputStyle}
                  placeholder={t("email_optional")}
                  value={form.guestEmail}
                  onChange={(e) => set({ guestEmail: e.target.value })}
                />
              </div>

              {/* Flex Container for Dates with minWidth: 0 to prevent overflow */}
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <label style={labelStyle}>{t("checkin_date")}</label>
                  <input type="date" className="bir-input" style={inputStyle} value={form.checkIn} onChange={(e) => set({ checkIn: e.target.value })} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <label style={labelStyle}>{t("checkout_date")}</label>
                  <input type="date" className="bir-input" style={inputStyle} value={form.checkOut} onChange={(e) => set({ checkOut: e.target.value })} />
                </div>
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <label style={labelStyle}>{t("guests_count")}</label>
                  <input
                    type="number"
                    min="1"
                    className="bir-input"
                    style={inputStyle}
                    value={form.guestsCount}
                    onChange={(e) => set({ guestsCount: e.target.value })}
                  />
                </div>

                {hotel.roomTypes && hotel.roomTypes.length > 0 && (
                  <div style={{ flex: 2, minWidth: 0 }}>
                    <label style={labelStyle}>{t("room_type_label")}</label>
                    <select className="bir-input" style={inputStyle} value={form.roomType} onChange={(e) => set({ roomType: e.target.value })}>
                      <option value="">{t("room_type_any")}</option>
                      {hotel.roomTypes.map((k) => {
                        const label = optionLabel(k, roomTypeOptions, ROOM_TYPES, lang);
                        return (
                          <option key={k} value={k}>{label}</option>
                        );
                      })}
                    </select>
                  </div>
                )}
              </div>

              {error && <div style={{ color: "#EF4444", fontSize: 13, marginTop: 4, fontWeight: 500 }}>{error}</div>}
              
              <div style={{ marginTop: "auto", paddingTop: 16 }}>
                <button
                  type="button"
                  className="bir-btn bir-btn-primary"
                  style={{ width: "100%", padding: "14px 16px", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 16, fontWeight: 600 }}
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting && <Loader2 size={18} className="bir-spin" />}
                  {hotel.availableRooms > 0 ? t("submit_book") : t("submit_inquire")}
                </button>
                <p style={{ fontSize: 12, color: "var(--ink-soft)", lineHeight: 1.6, textAlign: "center", marginTop: 12 }}>{t("booking_note")}</p>
              </div>
            </div>
          </>
        )}
        </div>
      </div>
    </div>
  );
}