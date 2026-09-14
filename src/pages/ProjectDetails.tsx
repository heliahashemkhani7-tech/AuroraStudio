import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import type { Project } from "@/components/portfolio/ProjectCard";

import Container from "@/components/layout/Container";
import ProjectHero from "@/components/projectDetails/ProjectHero";
import ProjectOverview from "@/components/projectDetails/ProjectOverview";
import ProjectHighlights from "@/components/projectDetails/ProjectHighlights";

import {
  getProjectBySlug,
  getProjectImage,
  getProjectTitles,
  getProjectCard,
} from "@/features/api";
import ProjectDetailsSkeleton from "@/components/skeleton/ProjectDetailsSkeleton";
import { useTranslation } from "react-i18next";

type ProjectTranslation = {
  id: number;
  project_id: number;
  language_id: number;
  description: string;
  detail: string;
  overview_paragraphs: string;
};

type CategoryTranslation = {
  id: number;
  category_id: number;
  language_id: number;
  name: string;
};

export default function ProjectDetails() {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const { i18n } = useTranslation();

  const [project, setProject] = useState<Project | null>(null);
  useEffect(() => {
    async function loadProject() {
      if (!slug) return;

      setLoading(true);

      try {
        const data = await getProjectBySlug(slug);

        const languageId = i18n.language === "fa" ? 2 : 1;

        const titles = await getProjectTitles(languageId);
        const card = await getProjectCard(data.id, languageId);

        const translation = data.project_translations?.find(
          (item: ProjectTranslation) => item.language_id === languageId
        );

        const categoryTranslation =
          data.categories?.category_translations?.find(
            (item: CategoryTranslation) => item.language_id === languageId
          );

        const formattedProject: Project = {
          id: data.id,
          slug: data.slug,
          title: data.name,
          description: translation?.description ?? "",
          detail: translation?.detail ?? "",
          category: categoryTranslation?.name ?? "",
          technology: data.technology,
          link: getProjectImage(data.live_url),

          card: card.map((item) => ({
            label: item.label,
            value: item.value,
          })),

          client: card.find((item) => item.label === "CLIENT")?.value ?? "",

          role: card.find((item) => item.label === "ROLE")?.value ?? "",

          year: card.find((item) => item.label === "YEAR")?.value ?? "",

          techStack: {
            label: titles.tech_stack_label,
            items: data.tech_stack ?? [],
          },

          overview: {
            title: titles.overview_title,
            paragraphs: translation?.overview_paragraphs ?? "",
            button: {
              text: titles.overview_button_text,
            },
          },

          highlights: {
            title: titles.highlight_title,
            links: data.highlight_links ?? [],
          },
        };

        setProject(formattedProject);
      } catch (error) {
        console.error("Error loading project:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [slug, i18n.language]);

  if (loading) {
    return <ProjectDetailsSkeleton />;
  }

  if (!project) {
    return (
      <Container className="h-50 flex justify-center z-4 items-center">
        <p className="text-2xl text-text">Project not found</p>
      </Container>
    );
  }

  return (
    <Container className="z-4 mt-30 flex flex-col gap-8 md:gap-20 overflow-hidden">
      <ProjectHero project={project} />
      <ProjectOverview project={project} />
      <ProjectHighlights project={project} />
    </Container>
  );
}
