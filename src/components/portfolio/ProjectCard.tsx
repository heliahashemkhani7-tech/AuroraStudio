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
  return (
    <ElectricBorder
      className={` w-96  cursor-pointer transition-transform duration-500 hover:-scale-x-100 msx-w-xs md:max-w-xl ${
        index % 2 === 0 ? "h-[350px]" : "h-[300px]"
      }`}
      color="var(--primary)"
      chaos={0}
    >
      <Card
        className={`flex justify-between [--card-spacing:0] relative w-full
        ${index % 2 === 0 ? "h-[350px]" : "h-[300px]"}`}
      >
        <div className="relative">
          <img
            src={project.link}
            alt={project.title}
            className="w-full object-contain transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        <CardContent className={`  ${index % 2 === 0 ? "top-45" : "top-50"} absolute ltr:left-3 rtl:right- flex flex-col gap-2`}>
          <div className="flex gap-2 text-white">
            <Badge className="text-badge-text">{project.category}</Badge>

            <Badge className="bg-badge-dark">{project.technology}</Badge>
          </div>

          <h3 className="text-xl font-semibold text-text mb-2">
            {project.title}
          </h3>

          <p className="text-sm">{project.description}</p>
        </CardContent>
      </Card>
    </ElectricBorder>
  );
}
