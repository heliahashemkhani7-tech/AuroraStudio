import type { Project } from "../portfolio/ProjectCard";
import SpotlightCard from "../ui/SpotlightCard";

type Props = {
  project: Project;
};

export default function ProjectHighlights({ project }: Props) {
  return (
    <section className="flex flex-col gap-5">
      <h3 className="text-2xl md:text-3xl text-span font-bold">
        {project.highlights.title}
      </h3>

      <div className="flex sm:flex-row flex-col  gap-4 justify-between w-full">
        {project.highlights.links.map((link) => (
          <SpotlightCard
            key={link}
            className="bg-none w-full overflow-hidden rounded-2xl"
          >
            <img
              src={link}
              className="w-full h-full object-cover border rounded-2xl"
              alt=""
            />
          </SpotlightCard>
        ))}
      </div>
    </section>
  );
}
