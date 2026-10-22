import { getProjects } from "@/lib/projects";
import { Hero } from "@/components/home/hero";

export default async function Home() {
  const projects = await getProjects();

  return (
    <>
      <Hero />

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
