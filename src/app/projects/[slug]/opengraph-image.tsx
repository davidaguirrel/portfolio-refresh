import { ImageResponse } from "next/og";

import { OgCard, ogSize } from "@/components/og-card";
import { findProject, getProjects } from "@/lib/projects";

export const alt = "Project preview";
export const size = ogSize;
export const contentType = "image/png";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await findProject(slug);

  return new ImageResponse(
    <OgCard
      title={project?.title ?? "Project"}
      subtitle={project?.summary ?? ""}
    />,
    size,
  );
}
