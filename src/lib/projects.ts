import { readdir } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

const projectSchema = z.object({
  title: z.string().min(1),
  summary: z.string().max(160),
  year: z.number().int().min(2010),
  stack: z.array(z.string()).min(1),
  links: z.object({
    code: z.url(),
    demo: z.url().optional(),
  }),
  archived: z.boolean().default(false),
});

export type Project = z.infer<typeof projectSchema> & { slug: string };

const projectsDir = path.join(process.cwd(), "src/content/projects");

export async function getProject(slug: string): Promise<Project> {
  const { frontmatter } = await import(`@/content/projects/${slug}.mdx`);
  const result = projectSchema.safeParse(frontmatter);

  if (!result.success) {
    throw new Error(
      `Invalid frontmatter in ${slug}.mdx:\n${z.prettifyError(result.error)}`,
    );
  }

  return { slug, ...result.data };
}

export async function getProjects(): Promise<Project[]> {
  "use cache";

  const files = await readdir(projectsDir);
  const slugs = files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
  const projects = await Promise.all(slugs.map(getProject));

  return projects.sort((a, b) => b.year - a.year);
}

export async function findProject(slug: string): Promise<Project | undefined> {
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug);
}
