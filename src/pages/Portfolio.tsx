import { useState } from "react";
import { useTranslation } from "react-i18next";

import PortfolioFilter from "@/components/portfolio/PortfolioFilter";
import PortfolioHero from "@/components/portfolio/PortfolioHero";
import ProjectCard from "@/components/portfolio/ProjectCard";
import Container from "@/components/layout/Container";

export default function Portfolio() {
  const { t } = useTranslation();

  const [activeFilter, setActiveFilter] = useState("all");

  const projects = t("portfolio.projects", {
    returnObjects: true,
  }) as {
    title: string;
    category: string;
    technology: string;
    description: string;
    link: string;
    detail:string;
    id: number;
  }[];

  const filteredProjects =
    activeFilter === "all"
      ? projects
      : projects.filter((project) => project.category === activeFilter);

  return (
    <Container className="flex items-center">
      <div className="z-10 text-text flex flex-col w-screen overflow-hidden mt-10">
        <PortfolioHero />

        <PortfolioFilter
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />

        <section className="grid grid-cols-1 md:grid-cols-3 gap-y-7 p-4 gap-x-0 overflow-hidden justify-items-center mt-8 w-full mx-auto items-center">
          {" "}
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </section>
      </div>
    </Container>
  );
}
