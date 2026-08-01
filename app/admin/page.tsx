"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { SEED_HOTELS, SEED_CITIES } from "@/lib/constants";
import { dirOf, getTranslator } from "@/lib/i18n";
import { Booking, City, Hotel, HotelFormValues, Lang, CityFormValues } from "@/types";

import BrandMark from "../shared/BrandMark";
import IdentityGate from "../features/admin/components/IdentityGate";
import DashboardHeader, { OwnerTab } from "../features/admin/components/DashboardHeader";
import HotelsList from "../features/admin/components/HotelsList";
import HotelForm from "../features/admin/components/HotelForm";
import BookingsList from "../features/admin/components/BookingsList";
import CitiesList from "../features/admin/components/CitiesList";
import CityForm from "../features/admin/components/CityForm";
import ResetDataButton from "../features/admin/components/ResetDataButton";

const emptyHotelForm = (): HotelFormValues => ({
  nameAr: "", nameEn: "", nameTr: "", nameUr: "",
  cityId: 0,
  price: "",
  totalRooms: "",
  descriptionAr: "", descriptionEn: "", descriptionTr: "", descriptionUr: "",
  image: "",
  gallery: [],
  imageFiles: [],
  locationUrl: "",
  checkInTime: "",
  checkOutTime: "",
  roomTypes: [],
  amenities: [],
  featured: false,
});

const emptyCityForm = (): CityFormValues => ({
  nameAr: "", nameEn: "", nameTr: "", nameUr: "",
});

const TOKEN_KEY = "admin_token";
const LANG_KEY = "admin_lang";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function apiFetch(path: string, options?: RequestInit) {
  const token = getToken();
  const lang = (typeof window !== "undefined" && localStorage.getItem(LANG_KEY)) || "ar";
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-lang": lang,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options?.headers as Record<string, string> || {}),
  };
  const res = await fetch(path, { ...options, headers });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export default function AdminDashboardPage() {
  const [lang, setLang] = useState<Lang>("ar");
  const dir = dirOf(lang);
  const t = getTranslator(lang);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  const [ownerTab, setOwnerTab] = useState<OwnerTab>("hotels");

  // Hotels
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [hotelsLoading, setHotelsLoading] = useState(false);
  const [hotelForm, setHotelForm] = useState<HotelFormValues>(emptyHotelForm());
  const [editingHotelId, setEditingHotelId] = useState<number | null>(null);
  const [hotelFormError, setHotelFormError] = useState<string | undefined>();

  // Cities
  const [cities, setCities] = useState<City[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [cityForm, setCityForm] = useState<CityFormValues>(emptyCityForm());
  const [editingCityId, setEditingCityId] = useState<number | null>(null);
  const [cityFormError, setCityFormError] = useState<string | undefined>();
  const [citySubmitting, setCitySubmitting] = useState(false);

  // Bookings
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const pendingCount = bookings.filter((b) => b.status === "pending").length;

  // Restore language
  useEffect(() => {
    const saved = localStorage.getItem(LANG_KEY) as Lang | null;
    if (saved && ["ar", "en", "tr", "ur"].includes(saved)) {
      setLang(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LANG_KEY, lang);
  }, [lang]);

  // Auto-login on mount
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setAuthLoading(false);
      return;
    }
    apiFetch("/api/auth/me")
      .then(() => setIsAuthenticated(true))
      .catch(() => clearToken())
      .finally(() => setAuthLoading(false));
  }, []);

  // Data loading
  const loadHotels = useCallback(async () => {
    setHotelsLoading(true);
    setApiError(null);
    try {
      const data = await apiFetch("/api/hotels");
      setHotels(data.hotels);
    } catch (err) {
      setHotels(SEED_HOTELS);
      setApiError((err as Error).message);
    } finally {
      setHotelsLoading(false);
    }
  }, []);

  const loadCities = useCallback(async () => {
    setCitiesLoading(true);
    try {
      const data = await apiFetch("/api/cities");
      setCities(data.cities);
    } catch {
      setCities(SEED_CITIES);
    } finally {
      setCitiesLoading(false);
    }
  }, []);

  const loadBookings = useCallback(async () => {
    setBookingsLoading(true);
    try {
      const data = await apiFetch("/api/bookings");
      setBookings(data.bookings);
    } catch {
      setBookings([]);
    } finally {
      setBookingsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadHotels();
      loadCities();
      loadBookings();
    }
  }, [isAuthenticated, loadHotels, loadCities, loadBookings]);

  // Auth
  const handleLogin = async (email: string, password: string) => {
    setLoginLoading(true);
    setLoginError(null);
    try {
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setToken(data.token);
      setIsAuthenticated(true);
    } catch (err) {
      setLoginError((err as Error).message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    clearToken();
    setIsAuthenticated(false);
    setHotels([]);
    setCities([]);
    setBookings([]);
    setHotelsLoading(false);
    setCitiesLoading(false);
    setBookingsLoading(false);
    setOwnerTab("hotels");
    setEditingHotelId(null);
    setEditingCityId(null);
    setHotelForm(emptyHotelForm());
    setCityForm(emptyCityForm());
    setHotelFormError(undefined);
    setCityFormError(undefined);
  };

  // Tab navigation
  const handleTabChange = (tab: OwnerTab) => {
    setOwnerTab(tab);
    setEditingHotelId(null);
    setEditingCityId(null);
    setHotelFormError(undefined);
    setCityFormError(undefined);

    if (tab === "add") {
      setHotelForm(emptyHotelForm());
    } else if (tab === "cities") {
      setCityForm(emptyCityForm());
    } else {
      setHotelForm(emptyHotelForm());
      setCityForm(emptyCityForm());
    }
  };

  // Hotel CRUD
  const startEditHotel = (hotel: Hotel) => {
    setEditingHotelId(hotel.id);
    setHotelForm({
      nameAr: hotel.name.ar || "",
      nameEn: hotel.name.en || "",
      nameTr: hotel.name.tr || "",
      nameUr: hotel.name.ur || "",
      cityId: hotel.city.id,
      price: String(hotel.price),
      totalRooms: String(hotel.totalRooms),
      descriptionAr: hotel.description.ar || "",
      descriptionEn: hotel.description.en || "",
      descriptionTr: hotel.description.tr || "",
      descriptionUr: hotel.description.ur || "",
      image: hotel.image,
      gallery: hotel.gallery,
      locationUrl: hotel.locationUrl,
      checkInTime: hotel.checkInTime,
      checkOutTime: hotel.checkOutTime,
      roomTypes: hotel.roomTypes,
      amenities: hotel.amenities,
      featured: hotel.featured,
      imageFiles: [],
    });
    setHotelFormError(undefined);
    setOwnerTab("add");
  };

  const handleSaveHotel = async () => {
    const f = hotelForm;
    if (
      !f.nameAr.trim() || !f.nameEn.trim() || !f.nameTr.trim() || !f.nameUr.trim() ||
      !f.descriptionAr.trim() || !f.descriptionEn.trim() || !f.descriptionTr.trim() || !f.descriptionUr.trim() ||
      !f.price || !f.totalRooms || !f.cityId
    ) {
      setHotelFormError(t("hotel_error_required"));
      return;
    }
    const price = Number(f.price);
    const rooms = Number(f.totalRooms);
    if (price <= 0 || rooms <= 0) {
      setHotelFormError(t("hotel_error_positive"));
      return;
    }

    const currentHotel = editingHotelId ? hotels.find((h) => h.id === editingHotelId) : null;
    const availableRooms = currentHotel ? Math.min(currentHotel.availableRooms, rooms) : rooms;

    const hasFiles = f.imageFiles.length > 0;

    const buildFormData = () => {
      const fd = new FormData();
      fd.set("cityId", String(f.cityId));
      fd.set("nameAr", f.nameAr);
      fd.set("nameEn", f.nameEn);
      fd.set("nameTr", f.nameTr);
      fd.set("nameUr", f.nameUr);
      fd.set("price", String(price));
      fd.set("totalRooms", String(rooms));
      fd.set("availableRooms", String(availableRooms));
      fd.set("descriptionAr", f.descriptionAr);
      fd.set("descriptionEn", f.descriptionEn);
      fd.set("descriptionTr", f.descriptionTr);
      fd.set("descriptionUr", f.descriptionUr);
      fd.set("locationUrl", f.locationUrl);
      fd.set("checkInTime", f.checkInTime);
      fd.set("checkOutTime", f.checkOutTime);
      fd.set("featured", String(f.featured));
      fd.set("roomTypes", JSON.stringify(f.roomTypes));
      fd.set("amenities", JSON.stringify(f.amenities));
      fd.set("gallery", JSON.stringify(f.gallery));

      f.imageFiles.forEach((file) => fd.append("imageFiles", file));
      fd.set("image", f.image);

      return fd;
    };

    setSubmitting(true);
    setHotelFormError(undefined);
    setApiError(null);

    try {
      const token = getToken();
      const headers: Record<string, string> = { "x-lang": lang };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      if (editingHotelId) {
        const res = await fetch(`/api/hotels/${editingHotelId}`, {
          method: "PUT",
          headers: hasFiles ? { ...headers } : { ...headers, "Content-Type": "application/json" },
          body: hasFiles ? buildFormData() : JSON.stringify({
            cityId: f.cityId,
            nameAr: f.nameAr,
            nameEn: f.nameEn,
            nameTr: f.nameTr,
            nameUr: f.nameUr,
            price,
            totalRooms: rooms,
            availableRooms,
            descriptionAr: f.descriptionAr,
            descriptionEn: f.descriptionEn,
            descriptionTr: f.descriptionTr,
            descriptionUr: f.descriptionUr,
            image: f.image,
            gallery: f.gallery,
            roomTypes: f.roomTypes,
            amenities: f.amenities,
            locationUrl: f.locationUrl,
            checkInTime: f.checkInTime,
            checkOutTime: f.checkOutTime,
            featured: f.featured,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
        setHotels((prev) => prev.map((h) => (h.id === editingHotelId ? data.hotel : h)));
      } else {
        const res = await fetch("/api/hotels", {
          method: "POST",
          headers: hasFiles ? { ...headers } : { ...headers, "Content-Type": "application/json" },
          body: hasFiles ? buildFormData() : JSON.stringify({
            cityId: f.cityId,
            nameAr: f.nameAr,
            nameEn: f.nameEn,
            nameTr: f.nameTr,
            nameUr: f.nameUr,
            price,
            totalRooms: rooms,
            availableRooms,
            descriptionAr: f.descriptionAr,
            descriptionEn: f.descriptionEn,
            descriptionTr: f.descriptionTr,
            descriptionUr: f.descriptionUr,
            image: f.image,
            gallery: f.gallery,
            roomTypes: f.roomTypes,
            amenities: f.amenities,
            locationUrl: f.locationUrl,
            checkInTime: f.checkInTime,
            checkOutTime: f.checkOutTime,
            featured: f.featured,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
        setHotels((prev) => [data.hotel, ...prev]);
      }
      setOwnerTab("hotels");
      setEditingHotelId(null);
      setHotelForm(emptyHotelForm());
    } catch (err) {
      setApiError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteHotel = async (hotelId: number) => {
    if (!confirm(t("reset_confirm_text"))) return;
    try {
      await apiFetch(`/api/hotels/${hotelId}`, { method: "DELETE" });
      setHotels((prev) => prev.filter((h) => h.id !== hotelId));
    } catch (err) {
      setApiError((err as Error).message);
    }
  };

  // City CRUD
  const startEditCity = (city: City) => {
    setEditingCityId(city.id);
    setCityForm({
      nameAr: city.name.ar || "",
      nameEn: city.name.en || "",
      nameTr: city.name.tr || "",
      nameUr: city.name.ur || "",
    });
    setCityFormError(undefined);
  };

  const handleSaveCity = async () => {
    const f = cityForm;
    if (!f.nameAr.trim() || !f.nameEn.trim() || !f.nameTr.trim() || !f.nameUr.trim()) {
      setCityFormError(t("city_error_required"));
      return;
    }

    setCitySubmitting(true);
    setCityFormError(undefined);
    setApiError(null);

    try {
      if (editingCityId) {
        const data = await apiFetch(`/api/cities/${editingCityId}`, {
          method: "PUT",
          body: JSON.stringify(f),
        });
        setCities((prev) => prev.map((c) => (c.id === editingCityId ? data.city : c)));
      } else {
        const data = await apiFetch("/api/cities", {
          method: "POST",
          body: JSON.stringify(f),
        });
        setCities((prev) => [data.city, ...prev]);
      }
      setEditingCityId(null);
      setCityForm(emptyCityForm());
    } catch (err) {
      setApiError((err as Error).message);
    } finally {
      setCitySubmitting(false);
    }
  };

  const handleDeleteCity = async (cityId: number) => {
    if (!confirm(t("reset_confirm_text"))) return;
    try {
      await apiFetch(`/api/cities/${cityId}`, { method: "DELETE" });
      setCities((prev) => prev.filter((c) => c.id !== cityId));
    } catch (err) {
      setApiError((err as Error).message);
    }
  };

  // Bookings
  const handleConfirmBooking = async (booking: Booking) => {
    try {
      const data = await apiFetch(`/api/bookings/${booking.id}`, {
        method: "PUT",
        body: JSON.stringify({ status: "confirmed" }),
      });
      setBookings((prev) => prev.map((b) => (b.id === booking.id ? data.booking : b)));
    } catch (err) {
      setApiError((err as Error).message);
    }
  };

  const handleDeclineBooking = async (booking: Booking) => {
    try {
      const data = await apiFetch(`/api/bookings/${booking.id}`, {
        method: "PUT",
        body: JSON.stringify({ status: "declined" }),
      });
      setBookings((prev) => prev.map((b) => (b.id === booking.id ? data.booking : b)));
    } catch (err) {
      setApiError((err as Error).message);
    }
  };

  const handleResetData = () => {
    setHotels(SEED_HOTELS);
    setCities(SEED_CITIES);
    setBookings([]);
  };

  if (authLoading) {
    return (
      <div className="bir-app" dir={dir} lang={lang}>
        <div style={{ maxWidth: 900, margin: "40px auto", padding: "32px 20px", textAlign: "center", color: "var(--ink-soft)" }}>
          {t("loading_text")}
        </div>
      </div>
    );
  }

  return (
    <div className="bir-app" dir={dir} lang={lang}>
      <div style={{ borderBottom: "1px solid var(--line)", background: "var(--surface)" }}>
        <div
          style={{
            maxWidth: 1080,
            margin: "0 auto",
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <BrandMark t={t} />
          <Link
            href="/"
            className="bir-btn bir-btn-ghost"
            style={{ padding: "8px 16px", borderRadius: 999, fontSize: 13, textDecoration: "none" }}
          >
            {t("nav_guest")}
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px 60px" }}>
        {!isAuthenticated ? (
          <IdentityGate t={t} onLogin={handleLogin} error={loginError} loading={loginLoading} />
        ) : (
          <>
            <DashboardHeader
              t={t}
              activeTab={ownerTab}
              isEditing={!!editingHotelId}
              pendingCount={pendingCount}
              hotelCount={hotels.length}
              cityCount={cities.length}
              onTabChange={handleTabChange}
              onLogout={handleLogout}
            />

            {apiError && (
              <div
                className="bir-card"
                style={{ padding: "10px 16px", marginBottom: 16, fontSize: 13, color: "var(--danger)", background: "var(--danger-tint)" }}
              >
                {apiError}
              </div>
            )}

            {ownerTab === "hotels" && (
              <HotelsList hotels={hotels} lang={lang} t={t} onEdit={startEditHotel} onDelete={handleDeleteHotel} loading={hotelsLoading} />
            )}

            {ownerTab === "add" && (
              <HotelForm
                lang={lang}
                t={t}
                values={hotelForm}
                onChange={setHotelForm}
                cities={cities}
                isEditing={!!editingHotelId}
                errorMessage={hotelFormError}
                onSubmit={handleSaveHotel}
                uploading={submitting}
              />
            )}

            {ownerTab === "bookings" && (
              <BookingsList bookings={bookings} lang={lang} t={t} onConfirm={handleConfirmBooking} onDecline={handleDeclineBooking} loading={bookingsLoading} />
            )}

            {ownerTab === "cities" && (
              <>
                <CityForm
                  t={t}
                  values={cityForm}
                  onChange={setCityForm}
                  errorMessage={cityFormError}
                  isEditing={!!editingCityId}
                  onSubmit={handleSaveCity}
                  submitting={citySubmitting}
                />
                <div style={{ marginTop: 20 }}>
                  <CitiesList cities={cities} lang={lang} t={t} onEdit={startEditCity} onDelete={handleDeleteCity} loading={citiesLoading} />
                </div>
              </>
            )}

            {ownerTab !== "cities" && <ResetDataButton t={t} onConfirmReset={handleResetData} />}
          </>
        )}
      </div>
    </div>
  );
}
