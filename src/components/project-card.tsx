import Link from "next/link";
import type { Project } from "@/lib/projects";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="flex flex-1 flex-col rounded-xl border border-border bg-surface p-5">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-display text-lg font-semibold">
          <Link
            href={`/projects/${project.slug}`}
            className="transition-colors hover:text-accent"
          >
            {project.title}
          </Link>
        </h3>
        <span className="font-mono text-xs text-muted">{project.year}</span>
      </div>
      <p className="mt-2 text-sm text-muted">{project.summary}</p>
      <ul aria-label="Tech stack" className="mt-4 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <li
            key={tech}
            className="rounded-full border border-border px-2.5 py-0.5 text-xs"
          >
            {tech}
          </li>
        ))}
      </ul>
      <div className="mt-auto flex gap-4 pt-5 text-sm font-medium">
        <a href={project.links.code} className="text-accent hover:underline">
          Code<span className="sr-only"> for {project.title}</span>
        </a>
        {project.links.demo && (
          <a href={project.links.demo} className="text-accent hover:underline">
            Live demo<span className="sr-only"> of {project.title}</span>
          </a>
        )}
      </div>
    </article>
  );
}
