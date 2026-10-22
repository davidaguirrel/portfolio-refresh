import { getProjects } from "@/lib/projects";

export default async function Home() {
  const projects = await getProjects();

  return (
    <>
      <section className="py-24">
        <h1 className="font-display text-4xl font-semibold tracking-tight">
          Hi, I&apos;m David.
        </h1>
        <p className="mt-4 max-w-prose text-lg text-muted">
          Frontend engineer. This page gets its real content in PR 5.
        </p>
      </section>

      <section id="projects" className="pb-24">
        <h2 className="font-display text-2xl font-semibold">Projects</h2>
        <ul className="mt-6 space-y-4">
          {projects.map((project) => (
            <li key={project.slug}>
              <h3 className="font-medium">
                {project.title}{" "}
                <span className="text-sm text-muted">({project.year})</span>
              </h3>
              <p className="text-muted">{project.summary}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
