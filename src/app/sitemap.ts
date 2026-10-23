import type { MetadataRoute } from "next";

import { getProjects } from "@/lib/projects";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();

  return [
    { url: site.url },
    ...projects.map((project) => ({
      url: `${site.url}/projects/${project.slug}`,
    })),
  ];
}
