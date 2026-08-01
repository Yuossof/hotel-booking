"use client"
import React from "react";
import { MapPin, MessageCircle } from "lucide-react";

export interface HotelCardData {
  id: number;
  name: string;
  description: string;
  image: string;
  cityLabel: string;
  priceLabel: string;
  perNightLabel: string;
  badgeClass: string;
  badgeLabel: string;
  fillRatio: number;
  totalRooms: number;
  roomsLabel: string;
  ctaLabel: string;
  whatsappHref: string;
}

interface HotelCardProps {
  hotel: HotelCardData;
  onOpenDetail: (hotel: HotelCardData) => void;
  onQuickBook: (hotel: HotelCardData) => void;
}

export default function HotelCard({ hotel, onOpenDetail, onQuickBook }: HotelCardProps) {
  return (
    <div className="bir-card" style={{ overflow: "hidden", display: "flex", flexDirection: "column", gap: 10 }}>
      <button
        type="button"
        className="bir-clickable"
        onClick={() => onOpenDetail(hotel)}
        style={{ position: "relative", width: "100%", aspectRatio: "16 / 10", background: "var(--bg)", border: 0, padding: 0, textAlign: "inherit" }}
      >
        <img src={hotel.image} alt={hotel.name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <span className={`bir-badge ${hotel.badgeClass}`} style={{ position: "absolute", top: 10, insetInlineStart: 10 }}>{hotel.badgeLabel}</span>
      </button>

      <button
        type="button"
        className="bir-clickable"
        onClick={() => onOpenDetail(hotel)}
        style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 10, border: 0, background: "transparent", textAlign: "inherit" }}
      >
        <div>
          <div style={{ fontSize: 12, color: "var(--gold)", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
            <MapPin size={13} /> {hotel.cityLabel}
          </div>
          <div className="bir-display" style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>{hotel.name}</div>
        </div>

        <p style={{ fontSize: 13, color: "var(--ink-soft)", margin: 0, lineHeight: 1.6 }}>{hotel.description.slice(0, 100)}...</p>

        <div style={{ height: 6, background: "var(--bg)", borderRadius: 999, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${hotel.fillRatio}%`, background: hotel.fillRatio === 0 ? "var(--danger)" : "var(--primary)", borderRadius: 999 }} />
        </div>

        <div style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>
          {hotel.roomsLabel}: {hotel.totalRooms}
        </div>

        <div>
          <span className="bir-display" style={{ fontSize: 18, fontWeight: 800, color: "var(--primary-dark)" }}>{hotel.priceLabel}</span>
          <span style={{ fontSize: 12, color: "var(--ink-soft)" }}> {hotel.perNightLabel}</span>
        </div>
      </button>

      <div style={{ display: "flex", gap: 8, padding: "0 16px 16px" }}>
        <button className="bir-btn bir-btn-primary" style={{ flex: 1, padding: "10px 14px", borderRadius: 10, fontSize: 13 }} onClick={() => onQuickBook(hotel)}>
          {hotel.ctaLabel}
        </button>
        <a href={hotel.whatsappHref} target="_blank" rel="noopener noreferrer" aria-label="whatsapp" className="bir-btn" style={{ width: 42, borderRadius: 10, background: "#25D366", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
          <MessageCircle size={18} />
        </a>
      </div>
    </div>
  );
}
