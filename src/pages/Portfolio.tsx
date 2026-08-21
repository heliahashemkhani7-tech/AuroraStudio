import { useState } from "react";
import { useTranslation } from "react-i18next";

import PortfolioFilter from "@/components/portfolio/PortfolioFilter";
import PortfolioHero from "@/components/portfolio/PortfolioHero";
import ProjectCard from "@/components/portfolio/ProjectCard";

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
  }[];

  const filteredProjects =
    activeFilter === "all"
      ? projects
      : projects.filter((project) => project.category === activeFilter);

  return (
    <main className="z-10 text-text flex flex-col overflow-hidden">
      <PortfolioHero />

      <PortfolioFilter
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />

      <section className="grid grid-cols-1 md:grid-cols-2 gap-y-8 justify-items-center mt-8 w-full max-w-4xl mx-auto items-end">
        {" "}
        {filteredProjects.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </section>
    </main>
  );
}
