import { ImageResponse } from "next/og";

import { OgCard, ogSize } from "@/components/og-card";
import { site } from "@/lib/site";

export const alt = `${site.name}, ${site.jobTitle}`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <OgCard
      title="I build React and TypeScript apps that teams rely on."
      subtitle={site.description}
    />,
    size,
  );
}
