import type { MDXComponents } from "mdx/types";

// Styles for the Markdown in project write-ups
const components: MDXComponents = {
  h2: (props) => (
    <h2 className="mt-10 font-display text-2xl font-semibold" {...props} />
  ),
  h3: (props) => <h3 className="mt-8 text-lg font-semibold" {...props} />,
  p: (props) => <p className="mt-4 leading-7" {...props} />,
  ul: (props) => <ul className="mt-4 list-disc space-y-2 pl-6" {...props} />,
  ol: (props) => <ol className="mt-4 list-decimal space-y-2 pl-6" {...props} />,
  a: (props) => (
    <a
      className="text-accent underline underline-offset-4 hover:no-underline"
      {...props}
    />
  ),
  code: (props) => (
    <code
      className="rounded bg-surface px-1.5 py-0.5 font-mono text-sm"
      {...props}
    />
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
