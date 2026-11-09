// Builds src/content/twin/projects.ts from the project MDX files, so the
// twin knows every project on the site without copying text by hand.
// Run it after you add or edit a project: pnpm twin:projects
// The test in src/lib/twin/projects-knowledge.test.ts fails if you forget.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

const siteUrl = "https://davidaguirre.tech";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const projectsDir = path.join(root, "src/content/projects");
export const outputFile = path.join(root, "src/content/twin/projects.ts");

type Frontmatter = {
  title: string;
  year: number;
  company?: string;
  stack: string[];
  links?: { code?: string; demo?: string };
  archived?: boolean;
};

type Project = Frontmatter & { slug: string; body: string };

function readProject(file: string): Project {
  const source = readFileSync(path.join(projectsDir, file), "utf8");
  const match = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(source);
  if (!match) throw new Error(`${file} has no frontmatter`);

  return {
    ...(parse(match[1]) as Frontmatter),
    slug: file.replace(/\.mdx$/, ""),
    // Demote headings so each project's sections sit under its own heading
    body: match[2].trim().replace(/^## /gm, "### "),
  };
}

function describeProject(project: Project): string {
  const heading = [project.year, project.company].filter(Boolean).join(", ");
  const lines = [
    `## ${project.title} (${heading})`,
    "",
    `- Page: ${siteUrl}/projects/${project.slug}`,
    `- Stack: ${project.stack.join(", ")}`,
  ];
  if (project.links?.code) lines.push(`- Code: ${project.links.code}`);
  if (project.links?.demo) lines.push(`- Demo: ${project.links.demo}`);
  if (project.archived) lines.push("- An older project, listed in the archive");
  lines.push("", project.body);
  return lines.join("\n");
}

// Returns the full text of src/content/twin/projects.ts
export function buildProjectsFile(): string {
  const projects = readdirSync(projectsDir)
    .filter((file) => file.endsWith(".mdx"))
    .map(readProject)
    .sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));

  const knowledge = projects
    .map(describeProject)
    .join("\n\n")
    // Keep the text safe inside a template string
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$\{/g, "\\${");

  return [
    "// Every project on the site, generated from src/content/projects.",
    "// Don't edit by hand: change the MDX files, then run pnpm twin:projects",
    `export const projectsKnowledge = \`\n${knowledge}\n\`.trim();`,
    "",
  ].join("\n");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  writeFileSync(outputFile, buildProjectsFile());
  console.log(`Wrote ${path.relative(root, outputFile)}`);
}
