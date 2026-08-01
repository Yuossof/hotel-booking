"use client";

import Link from "next/link";
import { Lang, T } from "@/types";
import BrandMark from "@/app/shared/BrandMark";
import LangSwitcher from "@/app/shared/LangSwitcher";

interface SiteHeaderProps {
  lang: Lang;
  onLangChange: (lang: Lang) => void;
  t: T;
}

export default function SiteHeader({ lang, onLangChange, t }: SiteHeaderProps) {
  return (
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
        <Link href="/">
          <BrandMark t={t} />
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <LangSwitcher lang={lang} onChange={onLangChange} />
        </div>
      </div>
    </div>
  );
}
