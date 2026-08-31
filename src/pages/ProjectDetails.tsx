import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import type { Project } from "@/components/portfolio/ProjectCard";

import Container from "@/components/layout/Container";
import ProjectHero from "@/components/projectDetails/ProjectHero";
import ProjectOverview from "@/components/projectDetails/ProjectOverview";
import ProjectHighlights from "@/components/projectDetails/ProjectHighlights";

export default function ProjectDetails() {
  const { slug } = useParams<{ slug: string }>();

  const { t } = useTranslation();

  const projects = t("portfolio.projects", {
    returnObjects: true,
  }) as Project[];

  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return (
      <Container className="flex">
        <p>Project not found</p>
      </Container>
    );
  }

  return (
    <Container className="z-4 mt-30 flex flex-col gap-8 md:gap-20 overflow-hidden">
      <ProjectHero project={project} />

      <ProjectOverview project={project} />

      <ProjectHighlights  project={project}/>
    </Container>
  );
}
