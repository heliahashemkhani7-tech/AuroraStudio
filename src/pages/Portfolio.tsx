import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import PortfolioFilter from "@/components/portfolio/PortfolioFilter";
import PortfolioHero from "@/components/portfolio/PortfolioHero";
import ProjectCard from "@/components/portfolio/ProjectCard";
import Container from "@/components/layout/Container";

import { getProjects, getProjectImage } from "@/features/api";
import PortfolioSkeleton from "@/components/skeleton/PortfolioSkeleton";

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

type SupabaseProject = {
  id: number;
  slug: string;
  category_id: number;
  live_url: string;
  name: string;
  technology: string;
  highlit_links: string[];
  tech_stack: string[];
  overview_button_link: string;

  description: string;
  detail: string;
  category: string;

  project_translations: ProjectTranslation[];

  categories?: {
    id: number;
    slug: string;
    category_translations: CategoryTranslation[];
  };
};

export default function Portfolio() {
  const [loading, setLoading] = useState(true);

  const { i18n } = useTranslation();

  const [activeFilter, setActiveFilter] = useState("all");

  const [supabaseProjects, setSupabaseProjects] = useState<SupabaseProject[]>(
    []
  );

  useEffect(() => {
    async function loadProjects() {
      setLoading(true);

      try {
        const data = await getProjects();

        const languageId = i18n.language === "fa" ? 2 : 1;

        const translatedProjects: SupabaseProject[] = data.map((project) => {
          const translation = project.project_translations?.find(
            (item: ProjectTranslation) => item.language_id === languageId
          );

          const categoryTranslation =
            project.categories?.category_translations?.find(
              (item: CategoryTranslation) => item.language_id === languageId
            );

          return {
            ...project,
            description: translation?.description ?? "",
            detail: translation?.detail ?? "",
            category: categoryTranslation?.name ?? "",
          };
        });

        setSupabaseProjects(translatedProjects);
      } catch (error) {
        console.error("Error loading projects:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, [i18n.language]);

  if (loading) {
    return <PortfolioSkeleton />;
  }

  return (
    <Container className="flex items-center">
      <div className="z-10 text-text flex flex-col w-screen overflow-hidden mt-10">
        <PortfolioHero />

        <PortfolioFilter
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />

        <section className="grid grid-cols-1 md:grid-cols-3 gap-y-7 p-4 gap-x-0 overflow-hidden justify-items-center mt-8 w-full mx-auto items-center">
          {supabaseProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={{
                id: project.id,
                slug: project.slug,
                title: project.name,
                description: project.description,
                detail: project.detail,
                category: project.category,
                technology: project.technology,
                link: getProjectImage(project.live_url),
                card: [],

                client: "",
                role: "",
                year: "",

                techStack: {
                  label: "",
                  items: project.tech_stack ?? [],
                },

                overview: {
                  title: "",
                  paragraphs: [],
                  button: {
                    text: "",
                  },
                },

                highlights: {
                  title: "",
                  links: project.highlit_links ?? [],
                },
              }}
              index={index}
            />
          ))}
        </section>
      </div>
    </Container>
  );
}
