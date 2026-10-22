import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { findProject, getProjects } from "@/lib/projects";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await findProject(slug);
  if (!project) return {};
  return { title: project.title, description: project.summary };
}

export default function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  return (
    <Suspense>
      <Project params={params} />
    </Suspense>
  );
}

async function Project({
  params,
}: Pick<PageProps<"/projects/[slug]">, "params">) {
  const { slug } = await params;
  const project = await findProject(slug);
  if (!project) notFound();

  const { default: Content } = await import(`@/content/projects/${slug}.mdx`);

  return (
    <article className="py-16">
      <Link href="/#projects" className="text-sm text-muted hover:text-fg">
        ← All projects
      </Link>
      <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight">
        {project.title}
      </h1>
      <p className="mt-3 text-lg text-muted">{project.summary}</p>
      <p className="mt-6 font-mono text-sm text-muted">
        {project.year} · {project.stack.join(", ")}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={project.links.code}
          className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-surface"
        >
          View code
        </a>
        {project.links.demo && (
          <a
            href={project.links.demo}
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-bg transition-opacity hover:opacity-90"
          >
            Live demo
          </a>
        )}
      </div>
      <div className="mt-10 border-t border-border pt-2">
        <Content />
      </div>
    </article>
  );
}
