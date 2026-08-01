"use client";

import { useState } from "react";
import { T } from "@/types";

interface IdentityGateProps {
  t: T;
  onLogin: (email: string, password: string) => Promise<void>;
  error?: string | null;
  loading?: boolean;
}

export default function IdentityGate({ t, onLogin, error, loading }: IdentityGateProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    if (!email.trim() || !password.trim() || loading) return;
    onLogin(email.trim(), password.trim());
  };

  return (
    <div className="bir-card" style={{ padding: 28, maxWidth: 420, margin: "40px auto" }}>
      <div className="bir-display" style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>
        {t("admin_login_title")}
      </div>
      <p style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 16 }}>{t("admin_login_sub")}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <input
          className="bir-input"
          placeholder={t("admin_username_ph")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          disabled={loading}
          autoComplete="email"
        />
        <input
          className="bir-input"
          type="password"
          placeholder={t("admin_password_ph")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          disabled={loading}
          autoComplete="current-password"
        />
        {error && <div style={{ color: "var(--danger)", fontSize: 12.5 }}>{error}</div>}
        <button
          type="button"
          className="bir-btn bir-btn-primary"
          style={{ padding: "11px 16px", borderRadius: 10 }}
          disabled={!email.trim() || !password.trim() || loading}
          onClick={handleSubmit}
        >
          {loading ? t("loading_text") : t("admin_login_btn")}
        </button>
      </div>
    </div>
  );
}
