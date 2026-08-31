import type { Project } from "../portfolio/ProjectCard";
import { Badge } from "../ui/badge";

type Props = {
  project: Project;
};

export default function ProjectHero({ project }: Props) {
  return (
    <main className="relative w-full h-50 md:h-120 text-white">
      <img
        className="w-full h-full object-cover"
        src={project.link}
        alt={project.title}
      />

      <div className="absolute top-30 md:top-90 md:left-10 flex w-full flex-col gap-3  md:gap-5" dir="ltr">
        <Badge className="text-xs bg-badge-dark">{project.category}</Badge>

        <h3 className="text-2xl md:text-5xl">{project.title}</h3>
      </div>
    </main>
  );
}
