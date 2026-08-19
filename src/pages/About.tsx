import AboutStory from "@/components/about/AboutStory";
import AboutHero from "../components/about/AboutHero";
import AboutProcess from "@/components/about/AboutProcess";
import { Separator } from "@/components/ui/separator";

export default function About() {
  return (
    <main className="relative overflow-hidden text-text flex items-center px-5">
      <div className="relative z-10 flex flex-col gap-5">
        <AboutHero />
        <Separator className="max-x-full h-0.5 bg-separator" />
        <AboutStory />
        <Separator className="max-x-full h-0.5 bg-separator" />
        <AboutProcess />
      </div>
    </main>
  );
}
