import type { Metadata } from "next";

import { Hero } from "@/components/home/hero";
import { Projects } from "@/components/home/projects";
import { Experience } from "@/components/home/experience";
import { Contact } from "@/components/home/contact";
import { PersonJsonLd } from "@/components/person-json-ld";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <PersonJsonLd />
      <Hero />
      <Projects />
      <Experience />
      <Contact />
    </>
  );
}
