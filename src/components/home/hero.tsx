import { HeroAnimation } from "./hero-animation";

export function Hero() {
  return (
    <section className="relative isolate py-20 sm:py-32">
      <HeroAnimation className="absolute top-1/2 -right-32 -z-10 hidden w-[36rem] -translate-y-1/2 text-fg lg:block" />
      <p className="font-mono text-sm text-accent">
        Senior Frontend Engineer · Málaga
      </p>
      <h1 className="mt-4 max-w-3xl text-gradient font-display text-5xl leading-[1.05] font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl">
        Hi, I’m David. I build React and TypeScript apps that teams rely on.
      </h1>
      <p className="mt-8 max-w-2xl text-lg text-muted sm:text-xl sm:leading-relaxed">
        I’ve spent 14 years in tech, the last 5+ as a frontend engineer building
        enterprise React and TypeScript apps, most recently as a Senior Software
        Engineer at Caterpillar. I lead projects across product, data and
        engineering, and I use AI tools to ship faster and help my team do the
        same. Before that, I spent 8 years engineering large-scale telecom
        systems at AT&T.
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <a
          href="#projects"
          className="rounded-full bg-linear-to-r from-violet-600 to-cyan-700 px-7 py-3 font-semibold text-white shadow-lg shadow-violet-600/25 transition hover:brightness-110 motion-safe:hover:-translate-y-0.5"
        >
          See my projects
        </a>
        <a
          href="#contact"
          className="rounded-full border border-border px-7 py-3 font-semibold transition-colors hover:border-accent hover:text-accent"
        >
          Get in touch
        </a>
      </div>
    </section>
  );
}
