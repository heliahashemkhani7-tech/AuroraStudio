import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { getAdminProjects } from "@/features/api";

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

  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await getAdminProjects();
        setProjects(data as AdminProject[]);
      } catch (error) {
        console.error(error);
        setError(t("dashboard.projectsError"));
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, [t]);

  if (loading) {
    return <div className="text-text">{t("dashboard.projectsLoading")}</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t("dashboard.projects")}</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            {t("dashboard.manageProjects")}
          </p>
        </div>

        <button
          type="button"
          className="flex items-center gap-2 rounded-lg bg-border px-4 py-2 text-sm font-medium text-text"
        >
          <Plus size={18} />
          {t("dashboard.addProject")}
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        {projects.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
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

                  <p className="mt-1 text-sm ">
                    {project.technology}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded-md p-2 hover:bg-muted"
                    aria-label={t("dashboard.editProject")}
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    type="button"
                    className="rounded-md p-2 text-red-500"
                    aria-label={t("dashboard.deleteProject")}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
