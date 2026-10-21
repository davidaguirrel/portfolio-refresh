// remark-mdx-frontmatter adds this export to every .mdx file.
// It's `unknown` on purpose: Zod checks it in src/lib/projects.ts.
declare module "*.mdx" {
  export const frontmatter: unknown;
}
