import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { Project } from "@/lib/projects";

import { ProjectCard } from "./project-card";

const project: Project = {
  slug: "my-reads",
  title: "My Reads",
  summary: "A bookshelf app.",
  year: 2018,
  stack: ["React", "JavaScript"],
  links: {
    code: "https://github.com/example/my-reads",
    demo: "https://example.com/my-reads",
  },
  archived: true,
};

describe("ProjectCard", () => {
  it("links the title to the project page", () => {
    render(<ProjectCard project={project} />);

    expect(screen.getByRole("link", { name: "My Reads" })).toHaveAttribute(
      "href",
      "/projects/my-reads",
    );
  });

  it("lists the tech stack", () => {
    render(<ProjectCard project={project} />);

    const stack = screen.getByRole("list", { name: "Tech stack" });
    expect(stack).toHaveTextContent("React");
    expect(stack).toHaveTextContent("JavaScript");
  });

  it("names the code and demo links after the project", () => {
    render(<ProjectCard project={project} />);

    expect(
      screen.getByRole("link", { name: /code.*my reads/i }),
    ).toHaveAttribute("href", project.links.code);
    expect(
      screen.getByRole("link", { name: /live demo.*my reads/i }),
    ).toHaveAttribute("href", project.links.demo);
  });

  it("hides the demo link when there is no demo", () => {
    render(
      <ProjectCard
        project={{ ...project, links: { code: project.links.code } }}
      />,
    );

    expect(screen.queryByRole("link", { name: /Live demo/ })).toBeNull();
  });
});
