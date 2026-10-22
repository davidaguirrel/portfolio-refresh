import { ProjectCard } from "@/components/project-card";
import { getProjects } from "@/lib/projects";

export async function Projects() {
  const projects = await getProjects();

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="border-t border-border py-16"
    >
      <h2 id="projects-heading" className="font-display text-2xl font-semibold">
        Projects
      </h2>
      <p className="mt-2 text-muted">
        Earlier work from my move into frontend. Newer projects are on the way.
      </p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {projects.map((project) => (
          <li key={project.slug} className="flex">
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
    </section>
  );
}
