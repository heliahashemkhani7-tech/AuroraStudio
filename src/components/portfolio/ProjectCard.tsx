import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ElectricBorder from "../animiations/ElectricBorder";

type Project = {
  title: string;
  category: string;
  technology: string;
  description: string;
  link: string;
};

type Props = {
  project: Project;
  index: number;
};

export default function ProjectCard({ project, index }: Props) {
  const columns = 3;

  const row = Math.floor(index / columns);
  const positionInRow = index % columns;

  const getHeight = () => {
    if (row % 2 === 0) {
      return positionInRow === 1 ? "lg:h-[290px]" : "lg:h-[350px]";
    }
    return positionInRow === 1 ? "lg:h-[350px]" : "lg:h-[290px]";
  };
  return (
    <ElectricBorder
      className={`my-2 cursor-pointer  transition-transform duration-500 hover:-scale-x-100 max-w-xs  mx-5 md:max-w-xl ${getHeight()}`}
      color="var(--border)"
      chaos={0.03}
    >
      <Card
        className={`flex justify-between [--card-spacing:0]  h-[250px] ${getHeight()}`}
      >
        <div>
          <img
            src={project.link}
            alt={project.title}
            className="w-full object-contain transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        <CardContent
          className={`top-35 md:top-30 lg:top-45 absolute pl-5  rtl:right-3 flex flex-col gap-2 w-full`}
        >
          <div className="flex gap-2 text-white w-full mb-2" dir="ltr">
            <Badge dir="ltr" className="text-badge-text">
              {project.category}
            </Badge>

            <Badge className="bg-badge-dark">{project.technology}</Badge>
          </div>

          <h3 className="text-xl font-semibold text-text mb-2" dir="ltr">
            {project.title}
          </h3>

          <p className="text-sm">{project.description}</p>
        </CardContent>
      </Card>
    </ElectricBorder>
  );
}
