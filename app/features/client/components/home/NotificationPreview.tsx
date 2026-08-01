import { Mail, MessageCircle, X } from "lucide-react";
import { T } from "@/types";

export interface NotificationMessages {
  ownerEmailSubject?: string;
  ownerEmailBody?: string;
  ownerWhatsapp?: string;
  guestEmailSubject?: string;
  guestEmailBody?: string;
  guestWhatsapp?: string;
}

export type NotificationKind = "new_request" | "confirmed" | "declined";

export interface NotificationData {
  kind: NotificationKind;
  messages: NotificationMessages;
}

interface NotificationPreviewProps {
  data: NotificationData | null;
  onClose: () => void;
  t: T;
}

export default function NotificationPreview({ data, onClose, t }: NotificationPreviewProps) {
  if (!data) return null;
  const { kind, messages } = data;
  const title =
    kind === "new_request" ? t("notif_title_new") : kind === "confirmed" ? t("notif_title_confirmed") : t("notif_title_declined");

  return (
    <div
      className="bir-toast bir-card"
      style={{
        position: "fixed",
        top: 16,
        insetInlineStart: "50%",
        transform: "translateX(-50%)",
        zIndex: 60,
        width: "min(92vw, 480px)",
        padding: 16,
        boxShadow: "0 12px 32px rgba(28,38,32,0.18)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <div className="bir-display" style={{ fontWeight: 700, fontSize: 15 }}>
            {title}
          </div>
          <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>{t("notif_sub")}</div>
        </div>
        <button type="button" className="bir-btn" onClick={onClose} style={{ background: "transparent", padding: 4 }} aria-label="close">
          <X size={18} color="var(--ink-soft)" />
        </button>
      </div>

      {messages.ownerEmailBody && (
        <div style={{ background: "var(--bg)", borderRadius: 10, padding: 10, marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "var(--primary-dark)", marginBottom: 4 }}>
            <Mail size={14} /> {t("email_to_owner")}
          </div>
          <div style={{ fontSize: 12, color: "var(--ink-soft)", marginBottom: 2 }}>{messages.ownerEmailSubject}</div>
          <div style={{ fontSize: 13 }}>{messages.ownerEmailBody}</div>
        </div>
      )}
      {messages.ownerWhatsapp && (
        <div style={{ background: "#E9F7EF", borderRadius: 10, padding: 10, marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "#1B8A50", marginBottom: 4 }}>
            <MessageCircle size={14} /> {t("whatsapp_to_owner")}
          </div>
          <div style={{ fontSize: 13, whiteSpace: "pre-line" }}>{messages.ownerWhatsapp}</div>
        </div>
      )}
      {messages.guestEmailBody && (
        <div style={{ background: "var(--bg)", borderRadius: 10, padding: 10, marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "var(--primary-dark)", marginBottom: 4 }}>
            <Mail size={14} /> {t("email_to_guest")}
          </div>
          <div style={{ fontSize: 12, color: "var(--ink-soft)", marginBottom: 2 }}>{messages.guestEmailSubject}</div>
          <div style={{ fontSize: 13 }}>{messages.guestEmailBody}</div>
        </div>
      )}
      {messages.guestWhatsapp && (
        <div style={{ background: "#E9F7EF", borderRadius: 10, padding: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "#1B8A50", marginBottom: 4 }}>
            <MessageCircle size={14} /> {t("whatsapp_to_guest")}
          </div>
          <div style={{ fontSize: 13, whiteSpace: "pre-line" }}>{messages.guestWhatsapp}</div>
        </div>
      )}
    </div>
  );
}
