"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { dirOf, getTranslator } from "@/lib/i18n";
import { Hotel, Lang } from "@/types";

import SiteHeader from "./features/client/components/home/SiteHeader";
import Hero from "./features/client/components/home/Hero";
import AvailabilityPulse from "./features/client/components/home/AvailabilityPulse";
import CityFilter from "./features/client/components/home/CityFilter";
import HotelGrid from "./features/client/components/home/HotelGrid";
import BookingDrawer from "./features/client/components/home/BookingDrawer";
import SiteFooter from "./features/client/components/home/SiteFooter";

export default function HomePage() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>("ar");
  const dir = dirOf(lang);
  const t = getTranslator(lang);

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState("all");

  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

  useEffect(() => {
    fetch("/api/hotels")
      .then((res) => res.json())
      .then((data) => {
        setHotels(data.hotels ?? []);
      })
      .catch(() => setHotels([]))
      .finally(() => setLoading(false));
  }, []);

  const visibleHotels = hotels.filter((h) => searchCity === "all" || String(h.city.id) === searchCity);
  const featuredHotels = hotels.filter((h) => h.featured);

  const openDetail = (hotel: Hotel) => router.push(`/hotel/${hotel.id}`);

  const openBooking = (hotel: Hotel) => setSelectedHotel(hotel);
  const closeBooking = () => setSelectedHotel(null);

  return (
    <div className="bir-app" dir={dir} lang={lang}>
      <SiteHeader lang={lang} onLangChange={setLang} t={t} />
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400, color: "var(--ink-soft)", fontSize: 14 }}>{t("loading_text")}</div>
      ) : (
        <>
          <Hero t={t} />
          <AvailabilityPulse hotels={hotels} lang={lang} t={t} />
          <CityFilter cities={hotels.map((h) => h.city)} lang={lang} current={searchCity} onChange={setSearchCity} t={t} />
          <HotelGrid
            hotels={visibleHotels}
            featured={featuredHotels}
            lang={lang}
            t={t}
            onSelect={openDetail}
            onBook={openBooking}
          />
          {selectedHotel && (
            <BookingDrawer
              hotel={selectedHotel}
              lang={lang}
              t={t}
              onClose={closeBooking}
            />
          )}
        </>
      )}
      <SiteFooter t={t} />
    </div>
  );
}
