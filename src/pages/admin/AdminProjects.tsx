import { useEffect, useState } from "react";
import { ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ProjectsLoadingSkeleton from "@/components/skeleton/ProjectsLoadingSkeleton";
import PortfolioFilter from "@/components/portfolio/PortfolioFilter";

import {
  deleteAdminProject,
  getAdminProjects,
  getProjectImage,
} from "@/features/api";

type AdminProject = {
  id: number;
  category_id: number;
  name: string;
  technology: string;
  live_url: string;
  tech_stack: string[];
  overview_button_link: string;
  highlight_links: string[];
};

export default function AdminProjects() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const isPersian = i18n.language.startsWith("fa");

  const labels = {
    category: isPersian ? "دسته‌بندی" : "Category",
    technologies: isPersian ? "تکنولوژی‌ها" : "Technologies",
    highlights: isPersian ? "ویژگی‌های طراحی" : "Design highlights",
    noLink: isPersian ? "ثبت نشده" : "Not provided",
    noTechnologies: isPersian
      ? "تکنولوژی‌ای ثبت نشده"
      : "No technologies added",
    openLink: isPersian ? "مشاهده وب‌سایت" : "View website",
    noImage: isPersian ? "تصویری ثبت نشده" : "No image available",
    emptyCategory: isPersian
      ? "پروژه‌ای در این دسته‌بندی وجود ندارد."
      : "No projects in this category.",
  };

  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredProjects =
    activeFilter === "all"
      ? projects
      : projects.filter(
          (project) => String(project.category_id) === activeFilter,
        );

  useEffect(() => {
    let cancelled = false;

    async function loadProjects() {
      setLoading(true);
      setError(null);

      try {
        const data = await getAdminProjects();

        if (!cancelled) {
          setProjects(data as AdminProject[]);
        }
      } catch (error) {
        console.error("Failed to load projects:", error);

        if (!cancelled) {
          setError(t("dashboard.projectsError"));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadProjects();

    return () => {
      cancelled = true;
    };
  }, [t]);

  const handleDelete = async (id: number) => {
    if (deleting) return;

    setDeleting(true);

    try {
      await deleteAdminProject(id);

      setProjects((previous) =>
        previous.filter((project) => project.id !== id),
      );

      setPendingDeleteId(null);

      toast.success(
        isPersian ? "پروژه با موفقیت حذف شد." : "Project deleted successfully.",
      );
    } catch (error) {
      console.error("Failed to delete project:", error);
      toast.error(t("dashboard.deleteError"));
    } finally {
      setDeleting(false);
    }
  };

  const getImageUrl = (path: string | null | undefined) => {
    if (!path) return "";

    if (/^https?:\/\//i.test(path)) {
      return path;
    }

    return getProjectImage(path);
  };

  return (
    <section dir={isPersian ? "rtl" : "ltr"} className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t("dashboard.projects")}</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            {t("dashboard.manageProjects")}
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/dashboard/projects/new")}
          className="flex items-center gap-2 rounded-lg bg-border px-4 py-2 text-sm font-medium text-text transition-colors hover:bg-dashboard-bg"
        >
          <Plus size={18} />
          {t("dashboard.addProject")}
        </button>
      </div>

      {loading ? (
        <ProjectsLoadingSkeleton />
      ) : error ? (
        <div
          role="alert"
          className="rounded-xl border border-red-500/30 p-4 text-sm text-red-500"
        >
          {error}
        </div>
      ) : (
        <div
          className="overflow-hidden rounded-xl border border-border/40"
          style={{
            boxShadow: "0 8px 30px rgba(117, 67, 200, 0.12)",
          }}
        >
          {projects.length > 0 && (
            <div className="border-b border-border/30 p-4">
              <PortfolioFilter
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
              />
            </div>
          )}

          {projects.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              {t("dashboard.noProjects")}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              {labels.emptyCategory}
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {filteredProjects.map((project) => {
                const techStack = Array.isArray(project.tech_stack)
                  ? project.tech_stack
                  : [];

                const highlightLinks = Array.isArray(project.highlight_links)
                  ? project.highlight_links
                  : [];

                // تصویر کارت Portfolio از همین فیلد دریافت می‌شود.
                const imageUrl = getImageUrl(project.live_url);

                return (
                  <article
                    key={project.id}
                    className="group transition-colors duration-300 hover:bg-muted/20"
                  >
                    <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:p-5">
                      {/* Project cover image */}
                      <div className="h-44 w-full shrink-0 overflow-hidden rounded-lg border border-border/30 bg-muted sm:h-32 sm:w-48 md:h-36 md:w-56">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={project.name}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(event) => {
                              event.currentTarget.style.visibility = "hidden";
                            }}
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center px-3 text-center text-xs text-muted-foreground">
                            {labels.noImage}
                          </div>
                        )}
                      </div>

                      {/* Project information */}
                      <div className="min-w-0 flex-1 space-y-3">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <h2 className="break-words text-base font-semibold">
                                {project.name}
                              </h2>

                              <span className="rounded-full border border-border/50 bg-background/40 px-2 py-1 text-xs text-muted-foreground">
                                ID: {project.id}
                              </span>
                            </div>

                            <p className="break-words text-sm text-muted-foreground">
                              {project.technology || labels.noTechnologies}
                            </p>

                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              <span className="rounded-full border border-border/50 bg-background/40 px-2 py-1">
                                {labels.category}: {project.category_id}
                              </span>

                              <span className="rounded-full border border-border/30 bg-background/30 px-2 py-1">
                                {techStack.length} {labels.technologies}
                              </span>

                              <span className="rounded-full border border-border/30 bg-background/30 px-2 py-1">
                                {highlightLinks.length} {labels.highlights}
                              </span>
                            </div>

                            {project.live_url ? (
                              <a
                                href={
                                  /^https?:\/\//i.test(project.live_url)
                                    ? project.live_url
                                    : getProjectImage(project.live_url)
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(event) => event.stopPropagation()}
                                className="inline-flex max-w-full items-center gap-1.5 break-all pt-1 text-xs text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-text"
                              >
                                <ExternalLink size={13} className="shrink-0" />
                                {labels.openLink}
                              </a>
                            ) : (
                              <p className="pt-1 text-xs text-muted-foreground">
                                {labels.noLink}
                              </p>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex shrink-0 items-center gap-2 self-end sm:self-start">
                            <button
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/dashboard/projects/${project.id}/edit`,
                                )
                              }
                              className="rounded-md border border-border/30 bg-background/40 p-2 transition-colors hover:bg-border"
                              aria-label={t("dashboard.editProject")}
                              title={t("dashboard.editProject")}
                            >
                              <Pencil size={18} />
                            </button>

                            <button
                              type="button"
                              className="rounded-md border border-red-500/20 bg-background/40 p-2 text-red-500 transition-colors hover:bg-red-500/10 disabled:opacity-50"
                              aria-label={t("dashboard.deleteProject")}
                              title={t("dashboard.deleteProject")}
                              disabled={deleting}
                              onClick={() => setPendingDeleteId(project.id)}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>

                        {/* Technologies */}
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium">
                            {labels.technologies}
                          </h3>

                          {techStack.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {techStack.map((technology, index) => (
                                <span
                                  key={`${technology}-${index}`}
                                  className="max-w-full break-words rounded-md border border-border/40 bg-background/40 px-2 py-1 text-xs"
                                >
                                  {technology}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-muted-foreground">
                              {labels.noTechnologies}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        open={pendingDeleteId !== null}
        loading={deleting}
        onCancel={() => {
          if (!deleting) {
            setPendingDeleteId(null);
          }
        }}
        onConfirm={() => {
          if (pendingDeleteId !== null && !deleting) {
            void handleDelete(pendingDeleteId);
          }
        }}
      />
    </section>
  );
}