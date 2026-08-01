"use client";

import { localized } from "@/lib/display";
import { City, Lang, T } from "@/types";

interface CityFilterProps {
  cities: City[];
  lang: Lang;
  current: string;
  onChange: (cityKey: string) => void;
  t: T;
}

export default function CityFilter({ cities, lang, current, onChange, t }: CityFilterProps) {
  const unique = cities.filter((c, i, a) => a.findIndex((x) => x.id === c.id) === i);

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "20px 20px 0", display: "flex", gap: 8, flexWrap: "wrap" }}>
      <button
        type="button"
        className="bir-btn"
        onClick={() => onChange("all")}
        style={{
          padding: "8px 18px",
          borderRadius: 999,
          fontSize: 13,
          border: "1px solid var(--line)",
          background: current === "all" ? "var(--primary)" : "transparent",
          color: current === "all" ? "#fff" : "var(--ink)",
        }}
      >
        {t("city_all")}
      </button>
      {unique.map((c) => (
        <button
          key={c.id}
          type="button"
          className="bir-btn"
          onClick={() => onChange(String(c.id))}
          style={{
            padding: "8px 18px",
            borderRadius: 999,
            fontSize: 13,
            border: "1px solid var(--line)",
            background: current === String(c.id) ? "var(--primary)" : "transparent",
            color: current === String(c.id) ? "#fff" : "var(--ink)",
          }}
        >
          {localized(c.name, lang)}
        </button>
      ))}
    </div>
  );
}
