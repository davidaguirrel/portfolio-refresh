import type { Metadata } from "next";

import { Hero } from "@/components/home/hero";
import { Projects } from "@/components/home/projects";
import { Experience } from "@/components/home/experience";
import { Contact } from "@/components/home/contact";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />
      <Projects />
      <Experience />
      <Contact />
    </>
  );
}
