export function Hero() {
  return (
    <section className="py-20 sm:py-28">
      <p className="font-mono text-sm text-accent">
        Senior Frontend Engineer · Málaga
      </p>
      <h1 className="...">
        Hi, I’m David. I build React and TypeScript apps that teams rely on.
      </h1>
      <p className="mt-6 max-w-prose text-lg text-muted">
        I’ve spent 14 years in tech, the last 5+ as a frontend engineer building
        enterprise React and TypeScript apps, most recently as a Senior Software
        Engineer at Caterpillar. I lead projects across product, data and
        engineering, and I use AI tools to ship faster and help my team do the
        same. Before that, I spent 8 years engineering large-scale telecom
        systems at AT&T.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href="#projects"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-bg transition-opacity hover:opacity-90"
        >
          See my projects
        </a>
        <a
          href="#contact"
          className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-surface"
        >
          Get in touch
        </a>
      </div>
    </section>
  );
}
