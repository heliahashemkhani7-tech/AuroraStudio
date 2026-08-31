import { Button } from "../ui/button";
import type { Project } from "../portfolio/ProjectCard";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

type Props = {
  project: Project;
};
export default function ProjectOverview({ project }: Props) {
  return (
    <section className="flex flex-col md:flex-row py-4 gap-4 justify-between">
      <div className="flex flex-col items-start gap-5">
        <h3 className="text-2xl md:text-3xl text-span font-bold">
          {project.overview.title}
        </h3>
        <p className="md:leading-7 text-text max-w-xl md:text-[15px] text-xs">{project.overview.paragraphs}</p>
        <Button className="text-white">{project.overview.button.text}</Button>
      </div>

      <Card className="ring-0 border-2 border-span text-text bg-glass-bg justify-around">
        {project.card.map((item) => (
          <CardContent className="flex flex-col text-text gap-2">
            <span className="text-span">{item.label}</span>
            <p className="text-text">{item.value}</p>
          </CardContent>
        ))}

        <CardContent className="flex flex-col gap-2">
          <span>{project.techStack.label}</span>

          <div className="flex flex-wrap gap-2">
            {project.techStack.items.map((item) => (
              <Badge variant="outline" key={item}>
                {item}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
