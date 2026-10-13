import { useEffect, useState } from "react";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  deleteAdminBlog,
  getAdminBlogs,
  getBlogImage,
  type AdminBlog as AdminBlogType,
} from "@/features/api";

function BlogLoadingSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="divide-y divide-border">
        {Array.from({ length: 5 }).map((_, index) => (
          <article
            key={index}
            className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
          >
            <Skeleton className="h-24 w-full shrink-0 rounded-lg sm:w-36" />

            <div className="min-w-0 flex-1 space-y-3">
              <Skeleton className="h-5 w-3/4 max-w-72" />

              <div className="flex flex-wrap items-center gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Skeleton className="h-9 w-9 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-md" />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default function AdminBlog() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const isPersian = i18n.language.startsWith("fa");
  const languageId = isPersian ? 2 : 1;

  const [blogs, setBlogs] = useState<AdminBlogType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [pendingDelete, setPendingDelete] =
    useState<AdminBlogType | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadBlogs() {
      try {
        setLoading(true);
        setError(null);

        const data = await getAdminBlogs();

        if (!cancelled) {
          setBlogs(data);
        }
      } catch (error) {
        console.error("Error loading admin blogs:", error);

        if (!cancelled) {
          setError(t("dashboard.loadError"));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadBlogs();

    return () => {
      cancelled = true;
    };
  }, [t]);

  const handleDelete = async (blog: AdminBlogType) => {
    try {
      setDeletingId(blog.id);

      await deleteAdminBlog(blog.id);

      setBlogs((previous) =>
        previous.filter((item) => item.id !== blog.id)
      );

      toast.success(t("dashboard.blogDeleted"));
    } catch (error) {
      console.error("Failed to delete blog:", error);
      toast.error(t("dashboard.deleteError"));
    } finally {
      setDeletingId(null);
      setPendingDelete(null);
    }
  };

  const formatDate = (date: string) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "—";

    return new Intl.DateTimeFormat(isPersian ? "fa-IR" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(parsedDate);
  };

  const pendingTranslation = pendingDelete?.blog_translations.find(
    (item) => item.language_id === languageId
  );

  const pendingTitle =
    pendingTranslation?.title ||
    pendingDelete?.blog_translations[0]?.title ||
    pendingDelete?.slug ||
    "";

  return (
    <section dir={isPersian ? "rtl" : "ltr"} className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            {t("dashboard.title")}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            {t("dashboard.description")}
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/dashboard/blog/new")}
          className="flex items-center gap-2 rounded-lg bg-border px-4 py-2 text-sm font-medium text-text"
        >
          <Plus size={18} />
          {t("dashboard.add")}
        </button>
      </div>

      {loading ? (
        <BlogLoadingSkeleton />
      ) : error ? (
        <div role="alert" className="text-red-500">
          {error}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          {blogs.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              {t("dashboard.empty")}
            </div>
          ) : (
            <div className="divide-y divide-border">
              {blogs.map((blog) => {
                const translation = blog.blog_translations.find(
                  (item) => item.language_id === languageId
                );

                const fallbackTranslation = blog.blog_translations[0];

                const title =
                  translation?.title ||
                  fallbackTranslation?.title ||
                  blog.slug;

                const categoryTranslations =
                  blog.blog_categories?.blog_category_translations ?? [];

                const category =
                  categoryTranslations.find(
                    (item) => item.language_id === languageId
                  )?.name ||
                  categoryTranslations.find(
                    (item) => item.language_id !== languageId
                  )?.name ||
                  t("dashboard.uncategorized");

                return (
                  <article
                    key={blog.id}
                    className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
                  >
                    <div className="h-24 w-full shrink-0 overflow-hidden rounded-lg bg-border sm:w-36">
                      {blog.cover_image ? (
                        <img
                          src={getBlogImage(blog.cover_image)}
                          alt={title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                          {t("dashboard.noImage")}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1 space-y-2">
                      <h2 className="font-medium">{title}</h2>

                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="rounded-full border border-border px-2 py-1">
                          {category}
                        </span>

                        <span>
                          {t("dashboard.author")}: {blog.author || "—"}
                        </span>

                        <span className="text-muted-foreground">
                          {formatDate(blog.published_at)}
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => navigate(`/blog/${blog.slug}`)}
                        className="rounded-md p-2"
                        aria-label={t("dashboard.view")}
                        title={t("dashboard.view")}
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/dashboard/blog/${blog.id}/edit`)
                        }
                        className="rounded-md p-2"
                        aria-label={t("dashboard.edit")}
                        title={t("dashboard.edit")}
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        type="button"
                        onClick={() => setPendingDelete(blog)}
                        disabled={deletingId === blog.id}
                        className="rounded-md p-2 text-red-500 disabled:opacity-50"
                        aria-label={t("dashboard.delete")}
                        title={t("dashboard.delete")}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        loading={
          pendingDelete !== null && deletingId === pendingDelete.id
        }
        title={t("dashboard.confirmDeleteTitle")}
        description={t("dashboard.confirmDelete", {
          title: pendingTitle,
        })}
        onCancel={() => {
          if (deletingId === null) {
            setPendingDelete(null);
          }
        }}
        onConfirm={() => {
          if (pendingDelete && deletingId === null) {
            void handleDelete(pendingDelete);
          }
        }}
      />
    </section>
  );
}
