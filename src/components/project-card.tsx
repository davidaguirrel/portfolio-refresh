import Link from "next/link";
import type { Project } from "@/lib/projects";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group relative flex flex-1 flex-col rounded-2xl border border-border bg-surface p-6 shadow-card transition hover:border-accent/60 motion-safe:hover:-translate-y-1 motion-safe:active:scale-[0.98]">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-display text-xl font-semibold">
          <Link
            href={`/projects/${project.slug}`}
            className="transition-colors group-hover:text-accent after:absolute after:inset-0 after:rounded-2xl"
          >
            {project.title}
          </Link>
        </h3>
        <span className="shrink-0 font-mono text-xs text-muted">
          {project.company && `${project.company} · `}
          {project.year}
        </span>
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
      <div className="mt-auto flex flex-wrap items-center gap-4 pt-5 text-sm font-medium">
        <span aria-hidden="true" className="text-accent">
          Read case study{" "}
          <span className="inline-block transition-transform motion-safe:group-hover:translate-x-1">
            →
          </span>
        </span>
        {project.links.code && (
          <a
            href={project.links.code}
            className="relative z-10 text-accent hover:underline"
          >
            Code<span className="sr-only"> for {project.title}</span>
          </a>
        )}
        {project.links.demo && (
          <a
            href={project.links.demo}
            className="relative z-10 text-accent hover:underline"
          >
            Live demo<span className="sr-only"> of {project.title}</span>
          </a>
        )}
      </div>
    </article>
  );
}
