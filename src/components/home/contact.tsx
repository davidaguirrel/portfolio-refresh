export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="border-t border-border py-16"
    >
      <h2 id="contact-heading" className="font-display text-2xl font-semibold">
        Contact
      </h2>
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
