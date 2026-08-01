"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { dirOf, getTranslator } from "@/lib/i18n";
import { Hotel, Lang } from "@/types";

import SiteHeader from "@/app/features/client/components/home/SiteHeader";
import HotelDetailPage from "@/app/features/client/components/home/HotelDetailPage";
import BookingDrawer from "@/app/features/client/components/home/BookingDrawer";
import SiteFooter from "@/app/features/client/components/home/SiteFooter";

export default function HotelDetailRoute() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [lang, setLang] = useState<Lang>("ar");
  const dir = dirOf(lang);
  const t = getTranslator(lang);

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/hotels/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setHotel(data.hotel ?? null);
      })
      .catch(() => setHotel(null))
      .finally(() => setLoading(false));
  }, [id]);

  const openBooking = (h: Hotel) => setSelectedHotel(h);
  const closeBooking = () => setSelectedHotel(null);

  if (loading) {
    return (
      <div className="bir-app" dir={dir} lang={lang}>
        <SiteHeader lang={lang} onLangChange={setLang} t={t} />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300, color: "var(--ink-soft)", fontSize: 14 }}>{t("loading_text")}</div>
        <SiteFooter t={t} />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="bir-app" dir={dir} lang={lang}>
        <SiteHeader lang={lang} onLangChange={setLang} t={t} />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300, color: "var(--ink-soft)", fontSize: 14 }}>Hotel not found</div>
        <SiteFooter t={t} />
      </div>
    );
  }

  const backToList = () => router.push("/");

  return (
    <div className="bir-app" dir={dir} lang={lang}>
      <SiteHeader lang={lang} onLangChange={setLang} t={t} />
      <HotelDetailPage hotel={hotel} lang={lang} t={t} onBack={backToList} onBook={openBooking} />
      {selectedHotel && (
        <BookingDrawer hotel={selectedHotel} lang={lang} t={t} onClose={closeBooking} />
      )}
      <SiteFooter t={t} />
    </div>
  );
}
