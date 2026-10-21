import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { href: "/#projects", label: "Projects" },
  { href: "/#experience", label: "Experience" },
  { href: "/#contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-display text-lg font-semibold whitespace-nowrap"
        >
          David Aguirre
        </Link>
        <div className="flex items-center gap-1">
          {/* Hidden on phones for now; a mobile menu comes later */}
          <nav aria-label="Main" className="hidden sm:block">
            <ul className="flex gap-1">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="rounded-md px-3 py-2 text-sm text-muted transition-colors hover:text-fg"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
