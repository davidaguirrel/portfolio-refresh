import { Hero } from "@/components/home/hero";
import { Projects } from "@/components/home/projects";
import { Experience } from "@/components/home/experience";
import { Contact } from "@/components/home/contact";

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
