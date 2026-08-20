import { Card, CardContent } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import ElectricBorder from "../animiations/ElectricBorder";

type Project = {
  title: string;
  category: string;
  technology: string;
  description: string;
};

type Props = {
  project: Project;
};

export default function ProjectCard({ project }: Props) {

  return (
    <ElectricBorder
      className="cursor-pointer transition-transform duration-500 hover:-translate-y-2"
      color="var(--primary)"
      chaos={0}
    >
      <Card className="max-w-xs max-h-80 ">
        <div className="h-80  relative">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwjMTxAzp6X7Hu75T-OPdiDym2bLRYAjIJbiKJddfNvPr8BMC34b4NTAy7JHcYedxJT5IlvYPyfcm5i41YHUWvImU7ps3B8N7z630rW7eOXfkJcMctBz9Ei_kSs7wwcLc7WTVWbCeR3v59y6EUTJY9hdpE5Yai2UXRiTaQ3Na6tS8XRa9LLbISWuy4g-Mf8cwX4E8Ge_5TZDFcOE5r21NY65nUHtBhPvv8pBsCRMLvXrLMyYD2r_nd"
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          <div className="absolute inset-0  from-background/80 to-transparent" />
        </div>

        <CardContent className="relative z-10 -mt-16 p-8">
          <div className="flex gap-2 mb-4">
            <Badge>{project.category}</Badge>

            <Badge variant="secondary">{project.technology}</Badge>
          </div>

          <h3 className="text-xl font-semibold text-text mb-2 group-hover:text-primary transition-colors">
            {project.title}
          </h3>

          <p className="text-sm">{project.description}</p>
        </CardContent>
      </Card>
    </ElectricBorder>
  );
}
