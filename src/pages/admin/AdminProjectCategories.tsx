import { useCallback, useEffect, useState } from "react";
import { Pencil, Trash2, X, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategoriesWithTranslations,
  updateAdminCategory,
  type AdminCategory,
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

function CategoriesLoadingSkeleton() {
  return (
    <div className="divide-y divide-border">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-5 w-40 max-w-full" />
            <Skeleton className="h-4 w-56 max-w-full" />
            <Skeleton className="h-3 w-32 max-w-full" />
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

export default function AdminProjectCategories() {
  const { i18n } = useTranslation();
  const isPersian = i18n.language.startsWith("fa");

  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminCategory | null>(
    null
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CategoryForm>(emptyForm);

  const loadCategories = useCallback(
    async (showLoading = true) => {
      if (showLoading) {
        setLoading(true);
      }

      try {
        const data = await getAdminCategoriesWithTranslations();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load project categories:", err);

        toast.error(
          isPersian
            ? "دریافت دسته‌بندی‌ها ناموفق بود."
            : "Failed to load categories."
        );
      } finally {
        if (showLoading) {
          setLoading(false);
        }
      }
    },
    [isPersian]
  );

  useEffect(() => {
    let cancelled = false;

    async function loadInitialCategories() {
      try {
        const data = await getAdminCategoriesWithTranslations();

        if (!cancelled) {
          setCategories(data);
        }
      } catch (err) {
        console.error("Failed to load project categories:", err);

        if (!cancelled) {
          toast.error(
            isPersian
              ? "دریافت دسته‌بندی‌ها ناموفق بود."
              : "Failed to load categories."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadInitialCategories();

    return () => {
      cancelled = true;
    };
  }, [isPersian]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setSuccess("");
  };

  const handleEdit = (category: AdminCategory) => {
    const english = category.category_translations.find(
      (item) => item.language_id === 1
    );
    const persian = category.category_translations.find(
      (item) => item.language_id === 2
    );

    setEditingId(category.id);
    setForm({
      slug: category.slug,
      nameEn: english?.name ?? "",
      nameFa: persian?.name ?? "",
    });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const slug = form.slug.trim().toLowerCase();
    const nameEn = form.nameEn.trim();
    const nameFa = form.nameFa.trim();

    if (!slug || !nameEn || !nameFa) {
      setError(
        isPersian ? "همه فیلدها الزامی هستند." : "All fields are required."
      );
      return;
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      setError(
        isPersian
          ? "اسلاگ باید انگلیسی و شامل حروف کوچک، عدد و خط تیره باشد."
          : "Slug must use lowercase English letters, numbers, and hyphens."
      );
      return;
    }

    setSaving(true);

    try {
      const isCreating = editingId === null;

      if (isCreating) {
        await createAdminCategory({ slug, nameEn, nameFa });
      } else {
        await updateAdminCategory({
          id: editingId,
          slug,
          nameEn,
          nameFa,
        });
      }

      resetForm();

      toast.success(
        isPersian
          ? isCreating
            ? "دسته‌بندی با موفقیت اضافه شد."
            : "دسته‌بندی با موفقیت ویرایش شد."
          : isCreating
          ? "Category created successfully."
          : "Category updated successfully."
      );

      await loadCategories(false);
    } catch (err) {
      console.error("Failed to save project category:", err);

      toast.error(
        isPersian
          ? "ذخیره دسته‌بندی ناموفق بود. اسلاگ تکراری یا خطای دسترسی را بررسی کن."
          : "Could not save category. Check for a duplicate slug or a permission error."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (category: AdminCategory) => {
    if (deletingId !== null) return;

    setDeletingId(category.id);

    try {
      await deleteAdminCategory(category.id);

      setCategories((previous) =>
        previous.filter((item) => item.id !== category.id)
      );

      if (editingId === category.id) {
        resetForm();
      }

      setPendingDelete(null);

      toast.success(
        isPersian
          ? "دسته‌بندی با موفقیت حذف شد."
          : "Category deleted successfully."
      );
    } catch (err) {
      console.error("Failed to delete project category:", err);

      toast.error(
        err instanceof Error && err.message === "CATEGORY_HAS_PROJECTS"
          ? isPersian
            ? "این دسته‌بندی به پروژه متصل است؛ ابتدا دسته‌بندی پروژه را تغییر بده."
            : "This category is assigned to projects. Reassign them before deleting it."
          : isPersian
          ? "حذف دسته‌بندی ناموفق بود."
          : "Failed to delete category."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const pendingDeleteName = pendingDelete
    ? pendingDelete.category_translations.find(
        (item) => item.language_id === (isPersian ? 2 : 1)
      )?.name ?? pendingDelete.slug
    : "";

  return (
    <section className="space-y-6 text-text">
      <div>
        <h1 className="text-2xl font-semibold">
          {isPersian ? "دسته‌بندی پروژه‌ها" : "Project Categories"}
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          {isPersian
            ? "دسته‌بندی‌ها و نام فارسی و انگلیسی آن‌ها را مدیریت کن."
            : "Manage project categories and their English and Persian names."}
        </p>
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

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-border p-5"
      >
        <h2 className="font-semibold">
          {editingId === null
            ? isPersian
              ? "افزودن دسته‌بندی"
              : "Add Category"
            : isPersian
            ? "ویرایش دسته‌بندی"
            : "Edit Category"}
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="space-y-2 text-sm">
            <span>Slug</span>
            <input
              value={form.slug}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  slug: event.target.value,
                }))
              }
              placeholder="e.g. websites"
              dir="ltr"
              required
              className="w-full rounded-lg border border-border bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
            />
          </label>

          <label className="space-y-2 text-sm">
            <span>English name</span>
            <input
              value={form.nameEn}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  nameEn: event.target.value,
                }))
              }
              placeholder="e.g. Websites"
              dir="ltr"
              required
              className="w-full rounded-lg border border-border bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
            />
          </label>

          <label className="space-y-2 text-sm">
            <span>نام فارسی</span>
            <input
              value={form.nameFa}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  nameFa: event.target.value,
                }))
              }
              placeholder="مثلاً وب‌سایت‌ها"
              dir="rtl"
              required
              className="w-full rounded-lg border border-border bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50"
          >
            <Check size={16} />
            {saving
              ? isPersian
                ? "در حال ذخیره..."
                : "Saving..."
              : editingId === null
              ? isPersian
                ? "افزودن"
                : "Add"
              : isPersian
              ? "ذخیره تغییرات"
              : "Save Changes"}
          </button>

          {editingId !== null && (
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm"
            >
              <X size={16} />
              {isPersian ? "انصراف" : "Cancel"}
            </button>
          )}
        </div>
      </form>

      <div className="overflow-hidden rounded-xl border border-border">
        {loading ? (
          <CategoriesLoadingSkeleton />
        ) : categories.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground">
            {isPersian ? "دسته‌بندی‌ای وجود ندارد." : "No categories found."}
          </p>
        ) : (
          <div className="divide-y divide-border">
            {categories.map((category) => {
              const english = category.category_translations.find(
                (item) => item.language_id === 1
              )?.name;

              const persian = category.category_translations.find(
                (item) => item.language_id === 2
              )?.name;

              return (
                <div
                  key={category.id}
                  className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 space-y-1">
                    <p className="font-medium">
                      {isPersian ? persian || english : english || persian}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {english || "—"} / {persian || "—"}
                    </p>

                    <p dir="ltr" className="text-xs text-muted-foreground">
                      {category.slug} · ID: {category.id}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(category)}
                      aria-label={isPersian ? "ویرایش" : "Edit"}
                      className="rounded-md border border-border p-2 hover:bg-muted"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setPendingDelete(category)}
                      disabled={deletingId !== null}
                      aria-label={isPersian ? "حذف" : "Delete"}
                      className="rounded-md border border-border p-2 text-red-500 hover:bg-red-500/10 disabled:opacity-50"
                    >
                      <Trash2 size={17} />
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
        title={isPersian ? "تأیید حذف دسته‌بندی" : "Confirm category deletion"}
        description={
          isPersian
            ? `دسته‌بندی «${pendingDeleteName}» حذف شود؟`
            : `Delete category "${pendingDeleteName}"?`
        }
        confirmText={isPersian ? "حذف" : "Delete"}
        cancelText={isPersian ? "انصراف" : "Cancel"}
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
