"use client";

import { Lang } from "@/types";

const LANGS: Lang[] = ["ar", "en", "tr", "ur"];

interface LangSwitcherProps {
  lang: Lang;
  onChange: (lang: Lang) => void;
}

export default function LangSwitcher({ lang, onChange }: LangSwitcherProps) {
  return (
    <div style={{ display: "flex", background: "var(--bg)", borderRadius: 999, padding: 4, gap: 2 }}>
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          className="bir-btn"
          onClick={() => onChange(l)}
          style={{
            padding: "6px 10px",
            borderRadius: 999,
            fontSize: 12,
            background: lang === l ? "var(--primary)" : "transparent",
            color: lang === l ? "#fff" : "var(--ink-soft)",
          }}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
