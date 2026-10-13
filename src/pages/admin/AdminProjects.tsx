import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { deleteAdminProject, getAdminProjects } from "@/features/api";
import ProjectsLoadingSkeleton from "@/components/skeleton/ProjectsLoadingSkeleton";

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
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

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
      toast.success(t("dashboard.projectDeleted"));
    } catch (error) {
      console.error("Failed to delete project:", error);
      toast.error(t("dashboard.projectDeleteError"));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="space-y-6">
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
          className="flex items-center gap-2 rounded-lg bg-border px-4 py-2 text-sm font-medium text-text"
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
          className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-500"
        >
          {error}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          {projects.length === 0 ? (
            <div className="p-8 text-center">
              {t("dashboard.noProjects")}
            </div>
          ) : (
            <div className="divide-y divide-border">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between gap-4 p-4"
                >
                  <div className="min-w-0">
                    <h2 className="font-medium">{project.name}</h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {project.technology}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/dashboard/projects/${project.id}/edit`)
                      }
                      className="rounded-md p-2 hover:bg-border"
                      aria-label={t("dashboard.editProject")}
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      type="button"
                      className="rounded-md p-2 text-red-500 hover:bg-red-500/10 disabled:opacity-50"
                      aria-label={t("dashboard.deleteProject")}
                      disabled={deleting}
                      onClick={() => setPendingDeleteId(project.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
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
