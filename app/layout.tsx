import type { Metadata } from "next";
import "@/styles/muqam.css";

export const metadata: Metadata = {
  title: "مقام | Muqam",
  description: "Hotel booking UI prototype",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
