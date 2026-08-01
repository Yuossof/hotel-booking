import { BedDouble } from "lucide-react";
import { T } from "@/types";
import Image from "next/image";

export default function BrandMark({ t }: { t: T }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }} className="">
      <Image
        src="/logo/logo.png"
        width={60}
        height={60}
        alt="tawaf"
        style={{
          transform: "scale(1.9)",
          transformOrigin: "center",
        }}
      />
    </div>
  );
}
