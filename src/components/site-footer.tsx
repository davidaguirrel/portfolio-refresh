const links = [
  { href: "https://github.com/davidaguirrel", label: "GitHub" },
  {
    href: "https://www.linkedin.com/in/david-aguirre-lopez/",
    label: "LinkedIn",
  },
  { href: "mailto:contact@davidaguirre.tech", label: "Email" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-4 px-6 py-6 text-sm text-muted">
        <p>David Aguirre</p>
        <ul className="flex gap-4">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="transition-colors hover:text-fg">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
