import AboutStory from "@/components/about/AboutStory";
import AboutHero from "../components/about/AboutHero";
import AboutProcess from "@/components/about/AboutProcess";
import { Separator } from "@/components/ui/separator";
import Container from "@/components/layout/Container";

export default function About() {
  return (
    <main className="relative overflow-hidden text-text">
      <Container className="relative z-10 w-full flex flex-col gap-5 py-8">
            <AboutHero />
            <Separator className="w-full h-0.5 bg-separator" />
            <AboutStory />
            <Separator className="w-full h-0.5 bg-separator" />
            <AboutProcess />
      </Container>
    </main>
  );
}
