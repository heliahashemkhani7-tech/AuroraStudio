
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pencil, Plus, Trash2, X, Save } from "lucide-react";
import { toast } from "sonner";

import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  createAdminBlogCategory,
  deleteAdminBlogCategory,
  getAdminBlogCategories,
  updateAdminBlogCategory,
  type AdminBlogCategory,
} from "@/features/api";

type CategoryForm = {
  slug: string;
  nameEn: string;
  nameFa: string;
};

const emptyForm: CategoryForm = {
  slug: "",
  nameEn: "",
  nameFa: "",
};

function getErrorKey(error: unknown): string {
  if (error instanceof Error) {
    switch (error.message) {
      case "BLOG_CATEGORY_FIELDS_REQUIRED":
        return "fieldsRequired";
      case "BLOG_CATEGORY_HAS_POSTS":
        return "hasPosts";
      default:
        return "genericError";
    }
  }

  return "genericError";
}

function BlogCategoriesLoadingSkeleton() {
  return (
    <div className="divide-y divide-border">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-5 w-40 max-w-full" />
            <Skeleton className="h-4 w-32 max-w-full" />
            <Skeleton className="h-3 w-28 max-w-full" />
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminBlogCategories() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language.startsWith("fa");

  const [categories, setCategories] = useState<AdminBlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [pendingDelete, setPendingDelete] =
    useState<AdminBlogCategory | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CategoryForm>(emptyForm);
  const [formOpen, setFormOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const tr = (key: string, options?: Record<string, string>) =>
    t(`dashboard.blogCategoriesManagement.${key}`, options);

  async function loadCategories(showLoading = true) {
    if (showLoading) {
      setLoading(true);
    }

    try {
      const data = await getAdminBlogCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to load blog categories:", error);
      toast.error(tr("genericError"));
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function fetchCategories() {
      try {
        const data = await getAdminBlogCategories();

        if (!cancelled) {
          setCategories(data);
        }
      } catch (error) {
        console.error("Failed to load blog categories:", error);

        if (!cancelled) {
          toast.error(tr("genericError"));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchCategories();

    return () => {
      cancelled = true;
    };
    // Initial load only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
    setSuccess(null);
    setFormOpen(true);
  }

  function startEdit(category: AdminBlogCategory) {
    const english = category.blog_category_translations.find(
      (item) => item.language_id === 1
    );
    const persian = category.blog_category_translations.find(
      (item) => item.language_id === 2
    );

    setEditingId(category.id);
    setForm({
      slug: category.slug,
      nameEn: english?.name ?? "",
      nameFa: persian?.name ?? "",
    });
    setError(null);
    setSuccess(null);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      if (editingId !== null) {
        await updateAdminBlogCategory({
          id: editingId,
          ...form,
        });
        toast.success(tr("updated"));
      } else {
        await createAdminBlogCategory(form);
        toast.success(tr("created"));
      }

      closeForm();
      await loadCategories(false);
    } catch (error) {
      console.error("Failed to save blog category:", error);
      toast.error(tr(getErrorKey(error)));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(category: AdminBlogCategory) {
    if (deletingId !== null) return;

    setDeletingId(category.id);

    try {
      await deleteAdminBlogCategory(category.id);

      setCategories((previous) =>
        previous.filter((item) => item.id !== category.id)
      );

      setPendingDelete(null);
      toast.success(tr("deleted"));
    } catch (error) {
      console.error("Failed to delete blog category:", error);
      toast.error(tr(getErrorKey(error)));
    } finally {
      setDeletingId(null);
    }
  }

  const pendingDeleteName = pendingDelete
    ? pendingDelete.blog_category_translations.find(
        (item) => item.language_id === (isRtl ? 2 : 1)
      )?.name ?? pendingDelete.slug
    : "";

  return (
    <section dir={isRtl ? "rtl" : "ltr"} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{tr("title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {tr("description")}
          </p>
        </div>

        <button
          type="button"
          onClick={startCreate}
          className="flex items-center justify-center gap-2 rounded-lg bg-border px-4 py-2 text-sm font-medium text-text"
        >
          <Plus size={18} />
          {tr("add")}
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-600"
        >
          {success}
        </div>
      )}

      {formOpen && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-border p-5"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">
              {editingId !== null ? tr("edit") : tr("addNew")}
            </h2>

            <button
              type="button"
              onClick={closeForm}
              disabled={saving}
              aria-label={tr("closeForm")}
              className="rounded-md p-2"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span>{tr("nameEn")}</span>
              <input
                required
                value={form.nameEn}
                onChange={(event) =>
                  setForm({ ...form, nameEn: event.target.value })
                }
                placeholder={tr("placeholderEn")}
                dir="ltr"
                className="w-full rounded-lg border border-border bg-transparent px-3 py-2"
              />
            </label>

            <label className="space-y-2 text-sm">
              <span>{tr("nameFa")}</span>
              <input
                required
                value={form.nameFa}
                onChange={(event) =>
                  setForm({ ...form, nameFa: event.target.value })
                }
                placeholder={tr("placeholderFa")}
                dir="rtl"
                className="w-full rounded-lg border border-border bg-transparent px-3 py-2"
              />
            </label>

            <label className="space-y-2 text-sm md:col-span-2">
              <span>{tr("slug")}</span>
              <input
                required
                value={form.slug}
                onChange={(event) =>
                  setForm({ ...form, slug: event.target.value })
                }
                placeholder="web-design"
                dir="ltr"
                className="w-full rounded-lg border border-border bg-transparent px-3 py-2"
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-border px-4 py-2 text-sm font-medium disabled:opacity-50"
            >
              <Save size={16} />
              {saving
                ? tr("saving")
                : editingId !== null
                  ? tr("save")
                  : tr("create")}
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={closeForm}
              className="rounded-lg px-4 py-2 text-sm"
            >
              {tr("cancel")}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-xl border border-border">
        {loading ? (
          <BlogCategoriesLoadingSkeleton />
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-sm">{tr("empty")}</div>
        ) : (
          <div className="divide-y divide-border">
            {categories.map((category) => {
              const english =
                category.blog_category_translations.find(
                  (item) => item.language_id === 1
                )?.name ?? "—";

              const persian =
                category.blog_category_translations.find(
                  (item) => item.language_id === 2
                )?.name ?? "—";

              const displayName = isRtl ? persian : english;

              return (
                <div
                  key={category.id}
                  className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 space-y-1">
                    <h2 className="font-medium">{displayName}</h2>
                    <p className="text-sm text-muted-foreground">
                      {isRtl ? english : persian}
                    </p>
                    <p
                      dir="ltr"
                      className="break-all text-xs text-muted-foreground"
                    >
                      {category.slug}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(category)}
                      aria-label={tr("editLabel", { name: displayName })}
                      className="rounded-md p-2 hover:bg-border"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setPendingDelete(category)}
                      disabled={deletingId !== null}
                      aria-label={tr("deleteLabel", { name: displayName })}
                      className="rounded-md p-2 text-red-500 hover:bg-red-500/10 disabled:opacity-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        loading={pendingDelete !== null && deletingId === pendingDelete.id}
        title={t("dashboard.confirmDeleteTitle")}
        description={tr("confirmDelete", { name: pendingDeleteName })}
        confirmText={t("dashboard.delete")}
        cancelText={t("dashboard.cancel")}
        onCancel={() => {
          if (deletingId === null) {
            setPendingDelete(null);
          }
        }}
        onConfirm={() => {
          if (pendingDelete !== null && deletingId === null) {
            void handleDelete(pendingDelete);
          }
        }}
      />
    </section>
  );
}
