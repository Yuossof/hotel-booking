"use client";

import { useState } from "react";
import { Check, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { Lang, T } from "@/types";

export interface OptionItem {
  id: number;
  name: { ar: string; en: string; tr: string; ur: string };
}

interface Names {
  ar: string;
  en: string;
  tr: string;
  ur: string;
}

type OptionKind = "roomTypes" | "amenities";

interface OptionsManagerProps {
  roomTypes: OptionItem[];
  amenities: OptionItem[];
  lang: Lang;
  t: T;
  onAdd: (kind: OptionKind, names: Names) => Promise<void>;
  onUpdate: (kind: OptionKind, id: number, names: Names) => Promise<void>;
  onDelete: (kind: OptionKind, id: number) => Promise<void>;
}

const LANGS: { code: "ar" | "en" | "tr" | "ur"; label: string }[] = [
  { code: "ar", label: "AR" },
  { code: "en", label: "EN" },
  { code: "tr", label: "TR" },
  { code: "ur", label: "UR" },
];

const emptyNames = (): Names => ({ ar: "", en: "", tr: "", ur: "" });

function LanguageField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      className="bir-input"
      style={{ width: "100%" }}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function OptionEditor({
  initial,
  saving,
  submitLabel,
  onSubmit,
  onCancel,
  t,
}: {
  initial: Names;
  saving: boolean;
  submitLabel: string;
  onSubmit: (names: Names) => void;
  onCancel: () => void;
  t: T;
}) {
  const [names, setNames] = useState<Names>(initial);
  const [activeLang, setActiveLang] = useState<"ar" | "en" | "tr" | "ur">("ar");
  const valid = LANGS.every((l) => names[l.code].trim().length > 0);

  return (
    <div
      className="bir-card"
      style={{
        marginTop: 8,
        padding: 14,
        background: "var(--bg)",
        border: "1px solid var(--line)",
        borderRadius: 10,
      }}
    >
      <div style={{ display: "flex", gap: 4, marginBottom: 10, flexWrap: "wrap" }}>
        {LANGS.map((l) => (
          <button
            key={l.code}
            type="button"
            className="bir-btn"
            onClick={() => setActiveLang(l.code)}
            style={{
              padding: "5px 12px",
              borderRadius: 8,
              fontSize: 11.5,
              fontWeight: 700,
              background: activeLang === l.code ? "var(--primary)" : "var(--surface)",
              color: activeLang === l.code ? "#fff" : "var(--ink-soft)",
              border: "1px solid var(--line)",
            }}
          >
            {l.label}
          </button>
        ))}
      </div>

      <LanguageField
        value={names[activeLang]}
        onChange={(v) => setNames((prev) => ({ ...prev, [activeLang]: v }))}
      />

      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <button
          type="button"
          className="bir-btn bir-btn-primary"
          style={{ padding: "8px 14px", borderRadius: 8, fontSize: 12.5, display: "flex", alignItems: "center", gap: 6 }}
          onClick={() => valid && onSubmit(names)}
          disabled={saving || !valid}
        >
          {saving && <Loader2 size={13} className="bir-spin" />}
          <Check size={13} /> {submitLabel}
        </button>
        <button
          type="button"
          className="bir-btn"
          onClick={onCancel}
          style={{ padding: "8px 14px", borderRadius: 8, fontSize: 12.5, display: "flex", alignItems: "center", gap: 6 }}
        >
          <X size={13} /> {t("reset_cancel")}
        </button>
      </div>
    </div>
  );
}

function OptionSection({
  title,
  items,
  lang,
  t,
  savingId,
  onAdd,
  onUpdate,
  onDelete,
}: {
  title: string;
  items: OptionItem[];
  lang: Lang;
  t: T;
  savingId: number | null;
  onAdd: (names: Names) => Promise<void>;
  onUpdate: (id: number, names: Names) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (names: Names) => {
    setSaving(true);
    try {
      if (editingId !== null) {
        await onUpdate(editingId, names);
        setEditingId(null);
      } else {
        await onAdd(names);
        setAdding(false);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontSize: 13.5, fontWeight: 800 }}>{title}</span>
        <button
          type="button"
          className="bir-btn bir-btn-ghost"
          onClick={() => setAdding(true)}
          style={{ padding: "7px 14px", borderRadius: 999, fontSize: 12.5, fontWeight: 600, display: "flex", alignItems: "center", gap: 4, border: "1px dashed var(--line)" }}
        >
          <Plus size={14} /> {t("add_option_btn")}
        </button>
      </div>

      {adding && (
        <OptionEditor
          initial={emptyNames()}
          saving={saving}
          submitLabel={t("add_option_btn")}
          onSubmit={handleSubmit}
          onCancel={() => setAdding(false)}
          t={t}
        />
      )}

      {items.length === 0 ? (
        <div style={{ padding: 16, textAlign: "center", color: "var(--ink-soft)", fontSize: 13, background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 10 }}>
          {t("options_empty")}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {items.map((o) => (
            <div key={o.id}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "9px 12px",
                  background: "var(--surface)",
                  border: "1px solid var(--line)",
                  borderRadius: 10,
                }}
              >
                <div style={{ flex: 1, minWidth: 0, fontSize: 13 }}>
                  {o.name[lang] || `ID ${o.id}`}
                  <span style={{ fontSize: 11, color: "var(--ink-soft)", marginInlineStart: 8 }}>
                    AR: {o.name.ar || "—"} · EN: {o.name.en || "—"} · TR: {o.name.tr || "—"} · UR: {o.name.ur || "—"}
                  </span>
                </div>
                <button
                  type="button"
                  className="bir-btn"
                  onClick={() => setEditingId(o.id)}
                  style={{ padding: "6px 10px", borderRadius: 8, display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}
                >
                  <Pencil size={13} /> {t("edit")}
                </button>
                <button
                  type="button"
                  className="bir-btn"
                  onClick={() => onDelete(o.id)}
                  disabled={savingId === o.id}
                  style={{ padding: "6px 10px", borderRadius: 8, display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--danger)" }}
                >
                  {savingId === o.id ? <Loader2 size={13} className="bir-spin" /> : <Trash2 size={13} />} {t("delete")}
                </button>
              </div>

              {editingId === o.id && (
                <OptionEditor
                  initial={{ ar: o.name.ar, en: o.name.en, tr: o.name.tr, ur: o.name.ur }}
                  saving={saving}
                  submitLabel={t("save_changes")}
                  onSubmit={handleSubmit}
                  onCancel={() => setEditingId(null)}
                  t={t}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OptionsManager({ roomTypes, amenities, lang, t, onAdd, onUpdate, onDelete }: OptionsManagerProps) {
  const [savingId, setSavingId] = useState<number | null>(null);

  const wrapDelete = async (kind: OptionKind, id: number) => {
    if (!confirm(t("options_delete_confirm"))) return;
    setSavingId(id);
    try {
      await onDelete(kind, id);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="bir-card" style={{ padding: 24, maxWidth: 640, border: "1px solid var(--line)", borderRadius: 14 }}>
      <OptionSection
        title={t("options_room_types")}
        items={roomTypes}
        lang={lang}
        t={t}
        savingId={savingId}
        onAdd={(names) => onAdd("roomTypes", names)}
        onUpdate={(id, names) => onUpdate("roomTypes", id, names)}
        onDelete={(id) => wrapDelete("roomTypes", id)}
      />

      <div style={{ height: 1, background: "var(--line)", margin: "20px 0" }} />

      <OptionSection
        title={t("options_amenities")}
        items={amenities}
        lang={lang}
        t={t}
        savingId={savingId}
        onAdd={(names) => onAdd("amenities", names)}
        onUpdate={(id, names) => onUpdate("amenities", id, names)}
        onDelete={(id) => wrapDelete("amenities", id)}
      />
    </div>
  );
}
