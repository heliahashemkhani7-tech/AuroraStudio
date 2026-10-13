import { useEffect, useState } from "react";
import { FolderKanban, FileText, Layers3 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Skeleton } from "@/components/ui/skeleton";
import { getDashboardStats } from "@/features/api";

type DashboardStats = {
  projects: number;
  blogs: number;
  categories: number;
};

function DashboardLoadingSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="rounded-xl border border-border bg-background/50 p-5"
        >
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-5 w-5 rounded-md" />
          </div>

          <Skeleton className="mt-4 h-9 w-20" />
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const { t } = useTranslation();

  const [stats, setStats] = useState<DashboardStats>({
    projects: 0,
    blogs: 0,
    categories: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      try {
        setLoading(true);
        setError(null);

        const data = await getDashboardStats();

        if (!cancelled) {
          setStats(data);
        }
      } catch (error) {
        console.error("Error loading dashboard stats:", error);

        if (!cancelled) {
          setError(t("dashboard.statsError"));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadStats();

    return () => {
      cancelled = true;
    };
  }, [t]);

  const cards = [
    {
      title: t("dashboard.totalProjects"),
      value: stats.projects,
      icon: FolderKanban,
    },
    {
      title: t("dashboard.totalBlogs"),
      value: stats.blogs,
      icon: FileText,
    },
    {
      title: t("dashboard.totalCategories"),
      value: stats.categories,
      icon: Layers3,
    },
  ];

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">
          {t("dashboard.dashboard")}
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          {t("dashboard.dashboardDescription")}
        </p>
      </div>

      {loading ? (
        <DashboardLoadingSkeleton />
      ) : error ? (
        <div role="alert" className="text-red-500">
          {error}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="rounded-xl border border-border bg-background/50 p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {card.title}
                  </p>

                  <Icon size={20} className="text-muted-foreground" />
                </div>

                <p className="mt-4 text-3xl font-semibold">
                  {card.value}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
