import { milestones } from "@/content/experience";

export function Experience() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="border-t border-border py-16"
    >
      <h2
        id="experience-heading"
        className="font-display text-2xl font-semibold"
      >
        Experience
      </h2>
      <ol className="mt-8 border-l border-border">
        {milestones.map((milestone) => (
          <li
            key={`${milestone.year}-${milestone.title}`}
            className="relative pb-8 pl-6 last:pb-0"
          >
            <span
              aria-hidden="true"
              className="absolute top-1.5 -left-1.5 size-3 rounded-full border-2 border-bg bg-accent"
            />
            <p className="font-mono text-xs text-muted">{milestone.year}</p>
            <h3 className="font-medium">{milestone.title}</h3>
            <p className="text-sm text-muted">{milestone.place}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
