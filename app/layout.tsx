import type { Metadata } from "next";
import "@/styles/muqam.css";

export const metadata: Metadata = {
  title: "طواف | Tawaf",
  description: "شركة طواف لخدمات الحج والعمرة",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
