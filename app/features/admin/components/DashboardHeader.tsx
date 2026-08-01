"use client";

import { LogOut } from "lucide-react";
import { T } from "@/types";

export type OwnerTab = "hotels" | "add" | "bookings" | "cities";

interface DashboardHeaderProps {
  t: T;
  activeTab: OwnerTab;
  isEditing: boolean;
  pendingCount: number;
  hotelCount: number;
  cityCount: number;
  onTabChange: (tab: OwnerTab) => void;
  onLogout: () => void;
}

export default function DashboardHeader({
  t,
  activeTab,
  isEditing,
  pendingCount,
  hotelCount,
  cityCount,
  onTabChange,
  onLogout,
}: DashboardHeaderProps) {
  const tabs: { key: OwnerTab; label: string }[] = [
    { key: "hotels", label: `${t("tab_my_hotels")} (${hotelCount})` },
    { key: "cities", label: `${t("tab_cities")} (${cityCount})` },
    { key: "add", label: isEditing ? t("tab_edit_hotel") : t("tab_add_hotel") },
    { key: "bookings", label: `${t("tab_bookings")} (${pendingCount})` },
  ];

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
      <div>
        <div className="bir-display" style={{ fontSize: 20, fontWeight: 800 }}>
          {t("admin_dashboard_title")}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <div style={{ display: "flex", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 999, padding: 4, gap: 4, flexWrap: "wrap" }}>
          {tabs.map((tb) => (
            <button
              key={tb.key}
              type="button"
              className="bir-btn"
              onClick={() => onTabChange(tb.key)}
              style={{
                padding: "8px 14px",
                borderRadius: 999,
                fontSize: 12.5,
                background: activeTab === tb.key ? "var(--primary)" : "transparent",
                color: activeTab === tb.key ? "#fff" : "var(--ink-soft)",
              }}
            >
              {tb.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="bir-btn bir-btn-ghost"
          onClick={onLogout}
          style={{ padding: "8px 12px", borderRadius: 8, fontSize: 12.5, display: "flex", alignItems: "center", gap: 4 }}
        >
          <LogOut size={13} /> {t("admin_logout")}
        </button>
      </div>
    </div>
  );
}
