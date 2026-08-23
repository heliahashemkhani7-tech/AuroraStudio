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
      className={`my-2 md:w-90 cursor-pointer transition-transform duration-500 hover:-scale-x-100 max-w-xs mx-5  md:max-w-xl ${
        index % 2 === 0 ? "md:h-[330px]" : "md:h-[300px]"
      }`}
      color="var(--border)"
      chaos={0.03}
    >
      <Card
        className={`flex justify-between [--card-spacing:0] relative  h-[250px] 
        ${index % 2 === 0 ? "md:h-[330px]" : "md:h-[300px]"}`}
      >
        <div className="relative">
          <img
            src={project.link}
            alt={project.title}
            className="w-full object-contain transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        <CardContent
          className={` top-35  md:top-45  absolute pl-5 ltr:left-3 rtl:right-3 lex flex-col gap-2 w-full`}
        >
          <div className="flex gap-2 text-white w-full" dir="ltr">
            <Badge dir="ltr" className="text-badge-text">{project.category}</Badge>

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
