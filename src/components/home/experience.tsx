import { credentials, roles } from "@/content/experience";

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
        {roles.map((role) => (
          <li
            key={`${role.year}-${role.title}`}
            className="relative pb-8 pl-6 last:pb-0"
          >
            <span
              aria-hidden="true"
              className="absolute top-1.5 -left-1.5 size-3 rounded-full border-2 border-bg bg-accent"
            />
            <p className="font-mono text-xs text-muted">{role.year}</p>
            <h3 className="font-medium">{role.title}</h3>
            <p className="text-sm text-muted">{role.company}</p>
            <p className="mt-2 max-w-prose text-sm">{role.highlight}</p>
          </li>
        ))}
      </ol>

      <h3 className="mt-12 font-display text-lg font-semibold">
        Education and certifications
      </h3>
      <ul className="mt-4 divide-y divide-border">
        {credentials.map((credential) => (
          <li
            key={credential.title}
            className="flex items-baseline justify-between gap-4 py-3"
          >
            <div>
              <p className="text-sm font-medium">{credential.title}</p>
              <p className="text-sm text-muted">{credential.issuer}</p>
            </div>
            <span className="font-mono text-xs text-muted">
              {credential.year}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
