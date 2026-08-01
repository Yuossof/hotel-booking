"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Hotel, Lang, T } from "@/types";
import { ROOM_TYPES, AMENITIES } from "@/lib/constants";
import { formatPrice, localized } from "@/lib/display";
import { ChevronLeft, ChevronRight, CheckCircle2, MapPin, MessageCircle, ArrowLeft } from "lucide-react";

export default function HotelDetailPage({
  hotel,
  lang,
  t,
  onBack,
  onBook,
}: {
  hotel: Hotel;
  lang: Lang;
  t: T;
  onBack: () => void;
  onBook: (hotel: Hotel) => void;
}) {
  const [roomOptions, setRoomOptions] = useState<{ key: string; name: { ar: string; en: string; tr: string; ur: string } }[]>([]);
  const [amenityOptions, setAmenityOptions] = useState<{ key: string; name: { ar: string; en: string; tr: string; ur: string } }[]>([]);

  useEffect(() => {
    fetch("/api/room-types")
      .then((r) => r.json())
      .then((d) => { if (d.roomTypes) setRoomOptions(d.roomTypes); })
      .catch(() => {});
    fetch("/api/amenities")
      .then((r) => r.json())
      .then((d) => { if (d.amenities) setAmenityOptions(d.amenities); })
      .catch(() => {});
  }, []);

  const gallery = hotel.gallery && hotel.gallery.length > 0 ? hotel.gallery : [hotel.image];
  const [imgIndex, setImgIndex] = useState(0);
  const prevImg = useCallback(() => setImgIndex((i) => (i === 0 ? gallery.length - 1 : i - 1)), [gallery.length]);
  const nextImg = useCallback(() => setImgIndex((i) => (i === gallery.length - 1 ? 0 : i + 1)), [gallery.length]);

  const name = localized(hotel.name, lang);
  const description = localized(hotel.description, lang);
  const cityLabel = localized(hotel.city.name, lang);
  const priceLabel = formatPrice(hotel.price, lang);
  const perNightLabel = t("per_night");
  const labelFor = (key: string, options: { key: string; name: { ar: string; en: string; tr: string; ur: string } }[], fallbacks: { key: string; ar: string; en: string; tr: string; ur: string }[]) => {
    const fromApi = options.find((o) => o.key === key);
    if (fromApi) return fromApi.name[lang] || fromApi.name.en || key;
    const fromStatic = fallbacks.find((o) => o.key === key);
    if (fromStatic) return fromStatic[lang] || fromStatic.en || key;
    return key;
  };
  const roomTypeLabels = hotel.roomTypes.map((rt) => labelFor(rt, roomOptions, ROOM_TYPES));
  const amenityLabels = hotel.amenities.map((a) => labelFor(a, amenityOptions, AMENITIES));
  const roomsLabel = t("rooms_label");
  const roomsAvailableLabel = t("rooms_available_label");
  const ctaLabel = t("book_now");
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(t("inquire") + " " + name)}`;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 20px 60px" }}>
      <button className="bir-btn" onClick={onBack} style={{ background: "transparent", color: "var(--ink-soft)", display: "flex", alignItems: "center", gap: 6, fontSize: 13, marginBottom: 16, padding: 0 }}>
        <ArrowLeft size={16} /> {t("back_to_list")}
      </button>

      <div dir="ltr" style={{ position: "relative", borderRadius: 14, overflow: "hidden", aspectRatio: "16 / 9" }}>
        <div style={{ display: "flex", height: "100%", transition: "transform .35s ease", transform: `translateX(-${imgIndex * 100}%)` }}>
          {gallery.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt="" style={{ width: "100%", height: "100%", flexShrink: 0, objectFit: "cover" }} />
          ))}
        </div>
        {gallery.length > 1 && (
          <>
            <button type="button" onClick={prevImg} style={{ position: "absolute", left: 8, top: "50%", translate: "0 -50%", background: "rgba(0,0,0,.45)", border: "none", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}>
              <ChevronLeft size={20} />
            </button>
            <button type="button" onClick={nextImg} style={{ position: "absolute", right: 8, top: "50%", translate: "0 -50%", background: "rgba(0,0,0,.45)", border: "none", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}>
              <ChevronRight size={20} />
            </button>
            <div style={{ position: "absolute", bottom: 10, left: "50%", translate: "-50% 0", display: "flex", gap: 6 }}>
              {gallery.map((_, i) => (
                <button key={i} type="button" onClick={() => setImgIndex(i)} style={{ width: 8, height: 8, borderRadius: "50%", border: "none", padding: 0, background: i === imgIndex ? "#fff" : "rgba(255,255,255,.45)", cursor: "pointer" }} />
              ))}
            </div>
          </>
        )}
      </div>

      <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
        <div>
          <div style={{ fontSize: 13, color: "var(--gold)", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
            <MapPin size={14} /> {cityLabel}
          </div>
          <div className="bir-display" style={{ fontSize: 26, fontWeight: 800, marginTop: 4 }}>{name}</div>
        </div>
        <div>
          <span className="bir-display" style={{ fontSize: 22, fontWeight: 800, color: "var(--primary-dark)" }}>{priceLabel}</span>
          <span style={{ fontSize: 12, color: "var(--ink-soft)" }}> {perNightLabel}</span>
        </div>
      </div>

      <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.8, marginTop: 14 }}>{description}</p>

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginTop: 18 }}>
        <div>
          <div style={{ fontSize: 11.5, color: "var(--ink-soft)" }}>{roomsLabel}</div>
          <div style={{ fontWeight: 800, fontSize: 16 }}>{hotel.totalRooms}</div>
        </div>
        <div>
          <div style={{ fontSize: 11.5, color: "var(--ink-soft)" }}>{roomsAvailableLabel}</div>
          <div style={{ fontWeight: 800, fontSize: 16, color: hotel.availableRooms > 0 ? "var(--primary-dark)" : "var(--danger)" }}>{hotel.availableRooms}</div>
        </div>
      </div>

      {roomTypeLabels.length > 0 && (
        <div style={{ marginTop: 22 }}>
          <div className="bir-display" style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{t("detail_room_types")}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {roomTypeLabels.map((label, i) => <span key={i} className="bir-badge bir-badge-available">{label}</span>)}
          </div>
        </div>
      )}

      {amenityLabels.length > 0 && (
        <div style={{ marginTop: 22 }}>
          <div className="bir-display" style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{t("detail_amenities")}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {amenityLabels.map((label, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--ink-soft)" }}>
                <CheckCircle2 size={14} color="var(--primary)" /> {label}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: 22 }}>
        <div className="bir-display" style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{t("detail_policies")}</div>
        <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 11.5, color: "var(--ink-soft)" }}>{t("detail_checkin")}</div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{hotel.checkInTime || "—"}</div>
          </div>
          <div>
            <div style={{ fontSize: 11.5, color: "var(--ink-soft)" }}>{t("detail_checkout")}</div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{hotel.checkOutTime || "—"}</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 22 }}>
        <div className="bir-display" style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{t("detail_location")}</div>
        {hotel.locationUrl ? (
          <a href={hotel.locationUrl} target="_blank" rel="noopener noreferrer" className="bir-btn bir-btn-ghost" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 8, textDecoration: "none", fontSize: 13 }}>
            <MapPin size={14} /> {t("detail_open_maps")}
          </a>
        ) : (
          <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>{t("detail_no_location")}</div>
        )}
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
        <button className="bir-btn bir-btn-primary" style={{ flex: 1, padding: "13px 16px", borderRadius: 10 }} onClick={() => onBook(hotel)}>
          {ctaLabel}
        </button>
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="bir-btn" style={{ padding: "13px 20px", borderRadius: 10, background: "#25D366", color: "#fff", display: "flex", alignItems: "center", gap: 6, textDecoration: "none", fontSize: 13 }}>
          <MessageCircle size={16} /> {t("contact_whatsapp")}
        </a>
      </div>
    </div>
  );
}
