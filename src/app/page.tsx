import Image from "next/image";

export default function Home() {
  return (
    <section className="py-24">
      <h1 className="font-display text-4xl font-semibold tracking-tight">
        Hi, I&apos;m David.
      </h1>
      <p className="mt-4 max-w-prose text-lg text-muted">
        Frontend engineer. This page gets its real content in PR 5.
      </p>
    </section>
  );
}
