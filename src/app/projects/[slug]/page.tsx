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
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${slug}` },
  };
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
    <article className="max-w-3xl py-16">
      <Link href="/#projects" className="text-sm text-muted hover:text-fg">
        ← All projects
      </Link>
      <h1 className="mt-6 w-fit text-gradient font-display text-5xl font-bold tracking-tight sm:text-6xl">
        {project.title}
      </h1>
      <p className="mt-3 text-lg text-muted">{project.summary}</p>
      <p className="mt-6 font-mono text-sm text-muted">
        {project.company && `${project.company} · `}
        {project.year} · {project.stack.join(", ")}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        {project.links.code && (
          <a
            href={project.links.code}
            className="rounded-full border border-border px-6 py-2.5 font-semibold transition-colors hover:border-accent hover:text-accent"
          >
            View code
          </a>
        )}
        {project.links.demo && (
          <a
            href={project.links.demo}
            className="rounded-full bg-linear-to-r from-violet-600 to-cyan-700 px-6 py-2.5 font-semibold text-white shadow-lg shadow-violet-600/25 transition hover:brightness-110"
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
