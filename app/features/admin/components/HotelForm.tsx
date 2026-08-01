"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, X } from "lucide-react";
import { localized } from "@/lib/display";
import { City, HotelFormValues, Lang, T } from "@/types";
import ImageUploader from "./ImageUploader";

interface OptionItem {
  id: number;
  name: { ar: string; en: string; tr: string; ur: string };
}

function LangBlock({
  label,
  values,
  onChange,
  type = "input",
  placeholder,
}: {
  label: string;
  values: { ar: string; en: string; tr: string; ur: string };
  onChange: (lang: string, value: string) => void;
  type?: "input" | "textarea";
  placeholder?: string;
}) {
  const langs = [
    { key: "Ar", code: "ar", label: "AR" },
    { key: "En", code: "en", label: "EN" },
    { key: "Tr", code: "tr", label: "TR" },
    { key: "Ur", code: "ur", label: "UR" },
  ];

  return (
    <div>
      <label
        style={{
          fontSize: 12.5,
          fontWeight: 700,
          color: "var(--ink)",
          display: "block",
          marginBottom: 8,
        }}
      >
        {label}
      </label>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {langs.map((l) => (
          <div key={l.key} style={{ display: "flex", gap: 8, alignItems: type === "textarea" ? "flex-start" : "center" }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "var(--ink-soft)",
                minWidth: 30,
                textAlign: "center",
                background: "var(--bg)",
                border: "1px solid var(--line)",
                borderRadius: 6,
                padding: "6px 0",
                marginTop: type === "textarea" ? 2 : 0,
              }}
            >
              {l.label}
            </span>
            {type === "textarea" ? (
              <textarea
                className="bir-input"
                placeholder={placeholder ? `${placeholder} (${l.label})` : undefined}
                rows={2}
                value={(values as Record<string, string>)[l.code] || ""}
                onChange={(e) => onChange(l.code, e.target.value)}
                style={{ flex: 1, resize: "vertical" }}
              />
            ) : (
              <input
                className="bir-input"
                placeholder={placeholder ? `${placeholder} (${l.label})` : undefined}
                value={(values as Record<string, string>)[l.code] || ""}
                onChange={(e) => onChange(l.code, e.target.value)}
                style={{ flex: 1 }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface OptionPickerProps {
  label: string;
  options: OptionItem[];
  selected: string[];
  lang: Lang;
  t: T;
  onToggle: (id: number) => void;
  onAdd: (option: { nameAr: string; nameEn: string; nameTr: string; nameUr: string }) => Promise<void>;
}

function OptionPicker({ label, options, selected, lang, t, onToggle, onAdd }: OptionPickerProps) {
  const [adding, setAdding] = useState(false);
  const [newNames, setNewNames] = useState({ ar: "", en: "", tr: "", ur: "" });
  const [saving, setSaving] = useState(false);

  const langs = [
    { key: "Ar", code: "ar", label: "AR" },
    { key: "En", code: "en", label: "EN" },
    { key: "Tr", code: "tr", label: "TR" },
    { key: "Ur", code: "ur", label: "UR" },
  ];

  const handleAdd = async () => {
    if (!newNames.ar.trim() || !newNames.en.trim() || !newNames.tr.trim() || !newNames.ur.trim()) return;
    setSaving(true);
    await onAdd({ nameAr: newNames.ar, nameEn: newNames.en, nameTr: newNames.tr, nameUr: newNames.ur });
    setNewNames({ ar: "", en: "", tr: "", ur: "" });
    setAdding(false);
    setSaving(false);
  };

  return (
    <div>
      <label style={{ fontSize: 12.5, fontWeight: 700, color: "var(--ink)", display: "block", marginBottom: 8 }}>
        {label}
      </label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {options.map((o) => {
          const isSelected = selected.includes(String(o.id));
          return (
            <button
              key={o.id}
              type="button"
              className="bir-btn"
              onClick={() => onToggle(o.id)}
              style={{
                padding: "7px 14px",
                borderRadius: 999,
                fontSize: 12.5,
                fontWeight: 600,
                border: "1px solid " + (isSelected ? "var(--primary)" : "var(--line)"),
                background: isSelected ? "var(--primary)" : "var(--bg)",
                color: isSelected ? "#fff" : "var(--ink-soft)",
                transition: "all .15s ease",
              }}
            >
              {o.name[lang] || String(o.id)}
            </button>
          );
        })}
        <button
          type="button"
          className="bir-btn bir-btn-ghost"
          onClick={() => setAdding(true)}
          style={{
            padding: "7px 14px",
            borderRadius: 999,
            fontSize: 12.5,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 4,
            border: "1px dashed var(--line)",
          }}
        >
          <Plus size={14} /> {t("add_option_btn")}
        </button>
      </div>

      {adding && (
        <div
          className="bir-card"
          style={{
            marginTop: 10,
            padding: 14,
            background: "var(--bg)",
            border: "1px solid var(--line)",
            borderRadius: 10,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 12.5, fontWeight: 700 }}>{label}</span>
            <button
              type="button"
              className="bir-btn"
              onClick={() => setAdding(false)}
              style={{ background: "transparent", padding: 4, borderRadius: 6 }}
            >
              <X size={16} />
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 8 }}>
            {langs.map((l) => (
              <div key={l.code} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--ink-soft)",
                    minWidth: 30,
                    textAlign: "center",
                    background: "#fff",
                    border: "1px solid var(--line)",
                    borderRadius: 6,
                    padding: "6px 0",
                  }}
                >
                  {l.label}
                </span>
                <input
                  className="bir-input"
                  placeholder={`Name (${l.label})`}
                  value={(newNames as Record<string, string>)[l.code] || ""}
                  onChange={(e) => setNewNames((prev) => ({ ...prev, [l.code]: e.target.value }))}
                  style={{ flex: 1 }}
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            className="bir-btn bir-btn-primary"
            style={{
              padding: "9px 16px",
              borderRadius: 8,
              fontSize: 12.5,
              display: "flex",
              alignItems: "center",
              gap: 6,
              width: "100%",
              justifyContent: "center",
            }}
            onClick={handleAdd}
            disabled={saving}
          >
            {saving && <Loader2 size={14} className="bir-spin" />}
            {t("add_option_btn")}
          </button>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        paddingBottom: 18,
        marginBottom: 18,
        borderBottom: "1px solid var(--line)",
      }}
    >
      {title && (
        <h3 style={{ fontSize: 13.5, fontWeight: 800, color: "var(--ink)", margin: 0 }}>
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

interface HotelFormProps {
  lang: Lang;
  t: T;
  values: HotelFormValues;
  onChange: (values: HotelFormValues) => void;
  cities: City[];
  errorMessage?: string;
  isEditing: boolean;
  onSubmit: () => void;
  uploading?: boolean;
}

export default function HotelForm({ lang, t, values, onChange, cities, errorMessage, isEditing, onSubmit, uploading }: HotelFormProps) {
  const set = (patch: Partial<HotelFormValues>) => onChange({ ...values, ...patch });

  const [roomTypes, setRoomTypes] = useState<OptionItem[]>([]);
  const [amenities, setAmenities] = useState<OptionItem[]>([]);

  const fetchOptions = () => {
    fetch("/api/room-types", { headers: { "x-lang": lang } })
      .then((r) => r.json())
      .then((d) => { if (d.roomTypes) setRoomTypes(d.roomTypes); })
      .catch(() => {});
    fetch("/api/amenities", { headers: { "x-lang": lang } })
      .then((r) => r.json())
      .then((d) => { if (d.amenities) setAmenities(d.amenities); })
      .catch(() => {});
  };

  useEffect(() => { fetchOptions(); }, []);

  const handleNameChange = (code: string, value: string) => {
    const key = `name${code === "ar" ? "Ar" : code === "en" ? "En" : code === "tr" ? "Tr" : "Ur"}` as keyof HotelFormValues;
    set({ [key]: value } as Record<string, unknown> as Partial<HotelFormValues>);
  };

  const handleDescChange = (code: string, value: string) => {
    const key = `description${code === "ar" ? "Ar" : code === "en" ? "En" : code === "tr" ? "Tr" : "Ur"}` as keyof HotelFormValues;
    set({ [key]: value } as Record<string, unknown> as Partial<HotelFormValues>);
  };

  const handleCheckInChange = (code: string, value: string) => {
    const key = `checkInTime${code === "ar" ? "Ar" : code === "en" ? "En" : code === "tr" ? "Tr" : "Ur"}` as keyof HotelFormValues;
    set({ [key]: value } as Record<string, unknown> as Partial<HotelFormValues>);
  };

  const handleCheckOutChange = (code: string, value: string) => {
    const key = `checkOutTime${code === "ar" ? "Ar" : code === "en" ? "En" : code === "tr" ? "Tr" : "Ur"}` as keyof HotelFormValues;
    set({ [key]: value } as Record<string, unknown> as Partial<HotelFormValues>);
  };

  const toggleRoomType = (id: number) => {
    const key = String(id);
    set({ roomTypes: values.roomTypes.includes(key) ? values.roomTypes.filter((k) => k !== key) : [...values.roomTypes, key] });
  };

  const toggleAmenity = (id: number) => {
    const key = String(id);
    set({ amenities: values.amenities.includes(key) ? values.amenities.filter((k) => k !== key) : [...values.amenities, key] });
  };

  const addRoomType = async (opt: { nameAr: string; nameEn: string; nameTr: string; nameUr: string }) => {
    const token = getToken();
    const res = await fetch("/api/room-types", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-lang": lang, ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(opt),
    });
    const data = await res.json();
    if (data.roomType) {
      setRoomTypes((prev) => [...prev, data.roomType]);
      toggleRoomType(data.roomType.id);
    }
  };

  const addAmenity = async (opt: { nameAr: string; nameEn: string; nameTr: string; nameUr: string }) => {
    const token = getToken();
    const res = await fetch("/api/amenities", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-lang": lang, ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(opt),
    });
    const data = await res.json();
    if (data.amenity) {
      setAmenities((prev) => [...prev, data.amenity]);
      toggleAmenity(data.amenity.id);
    }
  };

  const handleMainImageChange = (path: string) => set({ image: path });
  const handleGalleryChange = (imgs: string[]) => set({ gallery: imgs });
  const handleFilesChange = (files: File[]) => set({ imageFiles: files });

  return (
    <div className="bir-card" style={{ padding: 24, maxWidth: 640, border: "1px solid var(--line)", borderRadius: 14 }}>
      <Section title={t("hotel_name_ph")}>
        <LangBlock label={t("hotel_name_ph")} values={{ ar: values.nameAr, en: values.nameEn, tr: values.nameTr, ur: values.nameUr }} onChange={handleNameChange} />

        <div>
          <label style={{ fontSize: 12.5, fontWeight: 700, color: "var(--ink)", display: "block", marginBottom: 8 }}>{t("city_label")}</label>
          <select className="bir-input" value={values.cityId || ""} onChange={(e) => set({ cityId: Number(e.target.value) })}>
            <option value="">— {t("select_city")} —</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>{localized(c.name, lang)}</option>
            ))}
          </select>
        </div>
      </Section>

      <Section title={t("price_sar")}>
        <input type="number" className="bir-input" placeholder={t("price_sar")} value={values.price} onChange={(e) => set({ price: e.target.value })} />
        <input type="number" className="bir-input" placeholder={t("rooms_ph")} value={values.totalRooms} onChange={(e) => set({ totalRooms: e.target.value })} />
      </Section>

      <Section>
        <LangBlock label={t("description_ph")} values={{ ar: values.descriptionAr, en: values.descriptionEn, tr: values.descriptionTr, ur: values.descriptionUr }} onChange={handleDescChange} type="textarea" />
      </Section>

        <Section>
          <ImageUploader
            images={values.gallery}
            mainImage={values.image}
            onImagesChange={handleGalleryChange}
            onMainImageChange={handleMainImageChange}
            files={values.imageFiles}
            onFilesChange={handleFilesChange}
            uploading={!!uploading}
            t={t}
          />
        </Section>

      <Section>
        <input className="bir-input" placeholder={t("location_ph")} value={values.locationUrl} onChange={(e) => set({ locationUrl: e.target.value })} />
        <LangBlock label={t("checkin_time_ph")} values={{ ar: values.checkInTimeAr, en: values.checkInTimeEn, tr: values.checkInTimeTr, ur: values.checkInTimeUr }} onChange={handleCheckInChange} />
        <LangBlock label={t("checkout_time_ph")} values={{ ar: values.checkOutTimeAr, en: values.checkOutTimeEn, tr: values.checkOutTimeTr, ur: values.checkOutTimeUr }} onChange={handleCheckOutChange} />
      </Section>

      <Section>
        <OptionPicker label={t("room_types_label")} options={roomTypes} selected={values.roomTypes} lang={lang} t={t} onToggle={toggleRoomType} onAdd={addRoomType} />
        <OptionPicker label={t("amenities_label")} options={amenities} selected={values.amenities} lang={lang} t={t} onToggle={toggleAmenity} onAdd={addAmenity} />
      </Section>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
          <input type="checkbox" checked={values.featured} onChange={(e) => set({ featured: e.target.checked })} />
          {t("featured_label")}
        </label>

        {errorMessage && (
          <div style={{ color: "var(--danger)", fontSize: 12.5, padding: "8px 12px", background: "rgba(220,38,38,0.08)", borderRadius: 8 }}>
            {errorMessage}
          </div>
        )}

        <button
          type="button"
          className="bir-btn bir-btn-primary"
          style={{ padding: "12px 16px", borderRadius: 10, fontWeight: 700, fontSize: 14 }}
          onClick={onSubmit}
          disabled={uploading}
        >
          {isEditing ? t("save_changes") : t("publish_hotel")}
        </button>
      </div>
    </div>
  );
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try { return localStorage.getItem("admin_token"); } catch { return null; }
}
