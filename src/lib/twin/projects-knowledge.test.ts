// @vitest-environment node
import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  buildProjectsFile,
  outputFile,
  projectsDir,
} from "../../../scripts/build-twin-projects";
import { projectsKnowledge } from "@/content/twin/projects";

describe("projectsKnowledge", () => {
  it("is up to date with the project MDX files", () => {
    expect(
      readFileSync(outputFile, "utf8"),
      "A project changed: run pnpm twin:projects",
    ).toBe(buildProjectsFile());
  });

  it("links every project page", () => {
    for (const file of readdirSync(projectsDir)) {
      const slug = file.replace(/\.mdx$/, "");
      expect(projectsKnowledge).toContain(
        `https://davidaguirre.tech/projects/${slug}`,
      );
    }
  });
});
