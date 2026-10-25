import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import { getProjects } from "@/lib/projects";

export async function Projects() {
  const projects = await getProjects();
  const featured = projects.filter((project) => !project.archived);
  const archive = projects.filter((project) => project.archived);

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="py-16 sm:py-24"
    >
      <SectionHeading id="projects-heading">Projects</SectionHeading>
      <p className="mt-2 text-muted">
        Recent work from my day job and this site’s rebuild.
      </p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {featured.map((project) => (
          <li key={project.slug} className="flex">
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>

      <h3 className="mt-12 font-display text-lg font-semibold">Archive</h3>
      <p className="mt-2 text-muted">
        Earlier projects from my move into frontend.
      </p>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {archive.map((project) => (
          <li key={project.slug} className="flex">
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
    </section>
  );
}
