import { localized } from "@/lib/display";
import { Hotel, Lang, T } from "@/types";

interface AvailabilityPulseProps {
  hotels: Hotel[];
  lang: Lang;
  t: T;
}

export default function AvailabilityPulse({ hotels, lang, t }: AvailabilityPulseProps) {
  const cities = hotels
    .reduce<{ id: number; name: string; rooms: number }[]>((acc, h) => {
      const existing = acc.find((c) => c.id === h.city.id);
      if (existing) {
        existing.rooms += Number(h.availableRooms) || 0;
      } else {
        acc.push({
          id: h.city.id,
          name: localized(h.city.name, lang),
          rooms: Number(h.availableRooms) || 0,
        });
      }
      return acc;
    }, [])
    .filter((c) => c.rooms > 0);

  if (cities.length === 0) return null;

  const loop = [...cities, ...cities];

  return (
    <div
      style={{
        overflow: "hidden",
        borderTop: "1px solid var(--line)",
        borderBottom: "1px solid var(--line)",
        background: "var(--surface)",
      }}
    >
      <div className="bir-marquee-track" style={{ padding: "10px 0" }}>
        {loop.map((c, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "4px 18px",
              borderInlineEnd: "1px solid var(--line)",
              whiteSpace: "nowrap",
            }}
          >
            <span className="bir-pulse-dot" />
            <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>{c.name}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--primary-dark)" }}>
              {c.rooms} {t("pulse_suffix")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
