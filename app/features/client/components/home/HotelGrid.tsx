"use client";

import { formatPrice, localized } from "@/lib/display";
import { Hotel, Lang, T } from "@/types";
import HotelCard from "./HotelCard";

interface HotelGridProps {
  hotels: Hotel[];
  featured: Hotel[];
  lang: Lang;
  t: T;
  onSelect: (hotel: Hotel) => void;
  onBook: (hotel: Hotel) => void;
}

interface CardData {
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
  ctaLabel: string;
  whatsappHref: string;
}

function toCardData(h: Hotel, lang: Lang, t: T): CardData {
  const isFull = h.availableRooms <= 0;
  const pct = h.totalRooms > 0 ? Math.round((h.availableRooms / h.totalRooms) * 100) : 0;
  const hotelName = localized(h.name, lang);

  return {
    id: h.id,
    name: hotelName,
    description: localized(h.description, lang),
    image: h.image || `https://picsum.photos/seed/${h.id}/480/300`,
    cityLabel: localized(h.city.name, lang),
    priceLabel: formatPrice(h.price, lang),
    perNightLabel: t("per_night"),
    badgeClass: isFull ? "bir-badge-danger" : h.featured ? "bir-badge-primary" : "bir-badge-low",
    badgeLabel: isFull ? t("badge_full") : h.featured ? t("most_requested_title") : "",
    fillRatio: pct,
    ctaLabel: isFull ? t("badge_full") : t("book_now"),
    whatsappHref: `https://wa.me/?text=${encodeURIComponent(t("inquire") + " " + hotelName)}`,
  };
}

export default function HotelGrid({ hotels, featured, lang, t, onSelect, onBook }: HotelGridProps) {
  return (
    <div style={{ maxWidth: 1120, margin: "0 auto", padding: "24px 20px 40px" }}>


      {hotels.length === 0 ? (
        <div style={{ textAlign: "center", padding: 36, color: "var(--ink-soft)", fontSize: 14 }}>
          {t("no_hotels_city")}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 16 }}>
          {hotels.map((h) => (
            <HotelCard
              key={h.id}
              hotel={toCardData(h, lang, t)}
              onOpenDetail={() => onSelect(h)}
              onQuickBook={() => onBook(h)}
            />
          ))}
        </div>
      )}
      <div className="my-6"></div>
      {featured.length > 0 && (
        <>
          <div className="bir-display" style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>
            {t("most_requested_title")}
          </div>
          <p style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 14 }}>{t("most_requested_sub")}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 16, marginBottom: 36 }}>
            {featured.map((h) => (
              <HotelCard
                key={h.id}
                hotel={toCardData(h, lang, t)}
                onOpenDetail={() => onSelect(h)}
                onQuickBook={() => onBook(h)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
