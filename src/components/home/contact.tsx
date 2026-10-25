import { SectionHeading } from "@/components/section-heading";

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="py-16 sm:py-24"
    >
      <SectionHeading id="contact-heading">Contact</SectionHeading>
      <p className="mt-2 max-w-prose text-muted">
        Always looking for the next challenge. The best way to reach me is by
        email.
      </p>
      <a
        href="mailto:contact@davidaguirre.tech"
        className="mt-6 inline-block font-display text-xl font-semibold break-all text-accent hover:underline sm:text-2xl"
      >
        contact@davidaguirre.tech
      </a>
    </section>
  );
}
