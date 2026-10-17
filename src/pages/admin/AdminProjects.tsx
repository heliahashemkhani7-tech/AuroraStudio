import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ProjectsLoadingSkeleton from "@/components/skeleton/ProjectsLoadingSkeleton";
import PortfolioFilter from "@/components/portfolio/PortfolioFilter";
import { deleteAdminProject, getAdminProjects } from "@/features/api";

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
    liveWebsite: isPersian ? "وب‌سایت زنده" : "Live website",
    projectOverview: isPersian ? "معرفی پروژه" : "Project overview",
    highlights: isPersian ? "ویژگی‌های طراحی" : "Design highlights",
    noLink: isPersian ? "ثبت نشده" : "Not provided",
    noTechnologies: isPersian
      ? "تکنولوژی‌ای ثبت نشده"
      : "No technologies added",
    openLink: isPersian ? "مشاهده لینک" : "Open link",
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
          (project) => String(project.category_id) === activeFilter
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
        previous.filter((project) => project.id !== id)
      );

      setPendingDeleteId(null);
      toast.success(
        isPersian ? "پروژه با موفقیت حذف شد." : "Project deleted successfully."
      );
    } catch (error) {
      console.error("Failed to delete project:", error);
      toast.error(t("dashboard.deleteError"));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section dir={isPersian ? "rtl" : "ltr"} className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            {t("dashboard.projects")}
          </h1>

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
          className="overflow-hidden rounded-xl border border-border"
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
              {isPersian
                ? "پروژه‌ای در این دسته‌بندی وجود ندارد."
                : "No projects in this category."}
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredProjects.map((project) => {
                const techStack = Array.isArray(project.tech_stack)
                  ? project.tech_stack
                  : [];

                const highlightLinks = Array.isArray(project.highlight_links)
                  ? project.highlight_links
                  : [];

                return (
                  <article
                    key={project.id}
                    className="p-4 transition-colors duration-200 hover:bg-dashboard-bg sm:p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-base font-semibold">
                            {project.name}
                          </h2>

                          <span className="rounded-full border border-border px-2 py-1 text-xs text-muted-foreground">
                            ID: {project.id}
                          </span>
                        </div>

                        <p className="text-sm text-muted-foreground">
                          {project.technology || labels.noTechnologies}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="rounded-full border border-border px-2 py-1">
                            {labels.category}: {project.category_id}
                          </span>

                          <span className="rounded-full px-2 py-1 text-text">
                            {techStack.length} {labels.technologies}
                          </span>

                          <span className="rounded-full px-2 py-1 text-text">
                            {highlightLinks.length} {labels.highlights}
                          </span>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2 self-end sm:self-start">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/dashboard/projects/${project.id}/edit`
                            )
                          }
                          className="rounded-md p-2 transition-colors hover:bg-border"
                          aria-label={t("dashboard.editProject")}
                          title={t("dashboard.editProject")}
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          type="button"
                          className="rounded-md p-2 text-red-500 transition-colors hover:bg-red-500/10 disabled:opacity-50"
                          aria-label={t("dashboard.deleteProject")}
                          title={t("dashboard.deleteProject")}
                          disabled={deleting}
                          onClick={() => setPendingDeleteId(project.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">
                          {labels.technologies}
                        </h3>

                        {techStack.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {techStack.map((technology, index) => (
                              <span
                                key={`${technology}-${index}`}
                                className="rounded-md border border-border px-2 py-1 text-xs"
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