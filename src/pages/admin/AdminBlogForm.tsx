import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { ArrowLeft, ImagePlus, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import {
  createAdminBlog,
  getAdminBlogById,
  getAdminBlogCategories,
  getBlogImage,
  updateAdminBlog,
  uploadBlogImage,
  type AdminBlogCategory,
} from "@/features/api";

import { slugify } from "@/hooks/lib/slugify";
import BlogEditor from "../../components/ui/BlogEditor";

type TranslationForm = {
  title: string;
  excerpt: string;
  content: string;
};

type BlogFormData = {
  slug: string;
  author: string;
  category_blog_id: string;
  published_at: string;
  translations: {
    en: TranslationForm;
    fa: TranslationForm;
  };
};

const emptyTranslation: TranslationForm = {
  title: "",
  excerpt: "",
  content: "",
};

const initialFormData: BlogFormData = {
  slug: "",
  author: "",
  category_blog_id: "",
  published_at: "",
  translations: {
    en: { ...emptyTranslation },
    fa: { ...emptyTranslation },
  },
};

function toDateTimeLocal(value: string) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const pad = (number: number) => String(number).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function hasContent(html: string) {
  const text = html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();

  return text.length > 0;
}

export default function AdminBlogForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t, i18n } = useTranslation();

  const isPersian = i18n.language.startsWith("fa");
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<BlogFormData>(initialFormData);
  const [categories, setCategories] = useState<AdminBlogCategory[]>([]);

  const [coverImagePath, setCoverImagePath] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const imagePreview = useMemo(() => {
    if (!imageFile) return "";
    return URL.createObjectURL(imageFile);
  }, [imageFile]);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  useEffect(() => {
    let cancelled = false;

    async function loadForm() {
      setInitialLoading(true);
      setErrorMessage("");

      try {
        const categoryData = await getAdminBlogCategories();

        if (cancelled) return;

        setCategories(categoryData);

        if (!isEditMode || !id) return;

        const blog = await getAdminBlogById(Number(id));

        if (cancelled) return;

        const english = blog.blog_translations.find(
          (translation) => translation.language_id === 1
        );

        const persian = blog.blog_translations.find(
          (translation) => translation.language_id === 2
        );

        setFormData({
          slug: blog.slug ?? "",
          author: blog.author ?? "",
          category_blog_id: String(blog.category_blog_id ?? ""),
          published_at: toDateTimeLocal(blog.published_at ?? ""),
          translations: {
            en: {
              title: english?.title ?? "",
              excerpt: english?.excerpt ?? "",
              content: english?.content ?? "",
            },
            fa: {
              title: persian?.title ?? "",
              excerpt: persian?.excerpt ?? "",
              content: persian?.content ?? "",
            },
          },
        });

        setCoverImagePath(blog.cover_image ?? "");
        setSlugManuallyEdited(true);
      } catch (error) {
        console.error("Error loading blog form:", error);

        if (!cancelled) {
          const message = isPersian
            ? "بارگذاری اطلاعات مقاله با خطا مواجه شد."
            : "Failed to load blog post details.";

          setErrorMessage(message);
          toast.error(message);
        }
      } finally {
        if (!cancelled) {
          setInitialLoading(false);
        }
      }
    }

    void loadForm();

    return () => {
      cancelled = true;
    };
  }, [id, isEditMode, isPersian]);

  function handleFieldChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleTitleChange(language: "en" | "fa", value: string) {
    setFormData((previous) => ({
      ...previous,
      translations: {
        ...previous.translations,
        [language]: {
          ...previous.translations[language],
          title: value,
        },
      },
      ...(language === "en" && !slugManuallyEdited
        ? { slug: slugify(value) }
        : {}),
    }));
  }

  function handleTranslationChange(
    language: "en" | "fa",
    field: "excerpt" | "content",
    value: string
  ) {
    setFormData((previous) => ({
      ...previous,
      translations: {
        ...previous.translations,
        [language]: {
          ...previous.translations[language],
          [field]: value,
        },
      },
    }));
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      const message = isPersian
        ? "لطفاً یک فایل تصویری معتبر انتخاب کنید."
        : "Please select a valid image file.";

      setErrorMessage(message);
      toast.error(message);
      event.target.value = "";
      return;
    }

    setErrorMessage("");
    setImageFile(file);
  }


  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (loading) return;

    const english = formData.translations.en;
    const persian = formData.translations.fa;

    if (
      !formData.slug.trim() ||
      !formData.author.trim() ||
      !formData.category_blog_id ||
      !formData.published_at
    ) {
      const message = isPersian
        ? "لطفاً تمام اطلاعات ضروری مقاله را وارد کنید."
        : "Please fill in all required blog fields.";

      setErrorMessage(message);
      toast.error(message);
      return;
    }

    if (!coverImagePath && !imageFile) {
      const message = isPersian
        ? "لطفاً تصویر کاور مقاله را انتخاب کنید."
        : "Please select a cover image.";

      setErrorMessage(message);
      toast.error(message);
      return;
    }

    if (
      !english.title.trim() ||
      !english.excerpt.trim() ||
      !hasContent(english.content) ||
      !persian.title.trim() ||
      !persian.excerpt.trim() ||
      !hasContent(persian.content)
    ) {
      const message = isPersian
        ? "لطفاً عنوان، خلاصه و محتوای مقاله را به هر دو زبان وارد کنید."
        : "Please provide the title, excerpt, and content in both languages.";

      setErrorMessage(message);
      toast.error(message);
      return;
    }

    setLoading(true);

    try {
      let imagePath = coverImagePath;

      if (imageFile) {
        const uploadedImage = await uploadBlogImage(
          imageFile,
          formData.slug.trim()
        );

        imagePath = uploadedImage.path;
      }

      const blogData = {
        slug: formData.slug.trim(),
        cover_image: imagePath,
        author: formData.author.trim(),
        published_at: new Date(formData.published_at).toISOString(),
        category_blog_id: Number(formData.category_blog_id),
        translations: {
          en: {
            title: english.title.trim(),
            excerpt: english.excerpt.trim(),
            content: english.content,
          },
          fa: {
            title: persian.title.trim(),
            excerpt: persian.excerpt.trim(),
            content: persian.content,
          },
        },
      };

      if (isEditMode && id) {
        await updateAdminBlog(Number(id), blogData);

        toast.success(
          isPersian
            ? "مقاله با موفقیت ویرایش شد."
            : "Blog post updated successfully."
        );
      } else {
        await createAdminBlog(blogData);

        toast.success(
          isPersian
            ? "مقاله با موفقیت ایجاد شد."
            : "Blog post created successfully."
        );
      }

      navigate("/dashboard/blog");
    } catch (error) {
      console.error("Error saving blog:", error);

      const message = isPersian
        ? isEditMode
          ? "ویرایش مقاله با خطا مواجه شد."
          : "ایجاد مقاله با خطا مواجه شد."
        : isEditMode
        ? "Failed to update blog post."
        : "Failed to create blog post.";

      setErrorMessage(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  const currentImageUrl = imageFile
    ? imagePreview
    : coverImagePath
    ? getBlogImage(coverImagePath)
    : "";

  if (initialLoading) {
    return (
      <div dir={isPersian ? "rtl" : "ltr"} className="animate-pulse space-y-4">
        <div className="h-8 w-56 rounded bg-muted" />
        <div className="h-48 rounded-xl bg-muted" />
        <div className="h-48 rounded-xl bg-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-6" dir={isPersian ? "rtl" : "ltr"}>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/dashboard/blog")}
          className="rounded-lg border-2 border-border p-2"
          aria-label={t("dashboard.blogForm.backToBlog")}
        >
          <ArrowLeft size={18} />
        </button>

        <div>
          <h1 className="text-2xl font-semibold">
            {t(
              isEditMode
                ? "dashboard.blogForm.editTitle"
                : "dashboard.blogForm.addTitle"
            )}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            {t(
              isEditMode
                ? "dashboard.blogForm.editDescription"
                : "dashboard.blogForm.addDescription"
            )}
          </p>
        </div>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm"
        >
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic information */}
        <section className="space-y-5 rounded-xl border border-border p-5">
          <h2 className="text-lg font-semibold">
            {t("dashboard.blogForm.basicInformation")}
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="block text-sm font-medium">
                {t("dashboard.blogForm.author")} *
              </span>

              <input
                name="author"
                value={formData.author}
                onChange={handleFieldChange}
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5"
                placeholder={t("dashboard.blogForm.authorPlaceholder")}
              />
            </label>

            <label className="space-y-2">
              <span className="block text-sm font-medium">
                {t("dashboard.blogForm.category")} *
              </span>

              <select
                name="category_blog_id"
                value={formData.category_blog_id}
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    category_blog_id: event.target.value,
                  }))
                }
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5"
              >
                <option value="">
                  {t("dashboard.blogForm.categoryPlaceholder")}
                </option>

                {categories.map((category) => {
                  const categoryName =
                    category.blog_category_translations.find(
                      (translation) =>
                        translation.language_id === (isPersian ? 2 : 1)
                    )?.name ||
                    category.blog_category_translations.find(
                      (translation) =>
                        translation.language_id === (isPersian ? 1 : 2)
                    )?.name ||
                    category.slug;

                  return (
                    <option key={category.id} value={category.id}>
                      {categoryName}
                    </option>
                  );
                })}
              </select>
            </label>

            <label className="space-y-2">
              <span className="block text-sm font-medium">
                {t("dashboard.blogForm.slug")} *
              </span>

              <input
                name="slug"
                value={formData.slug}
                onChange={(event) => {
                  setSlugManuallyEdited(true);

                  setFormData((previous) => ({
                    ...previous,
                    slug: slugify(event.target.value),
                  }));
                }}
                required
                dir="ltr"
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5"
                placeholder="my-blog-post"
              />

              <span className="block text-xs text-muted-foreground">
                {t("dashboard.blogForm.slugHint")}
              </span>
            </label>

            <label className="space-y-2">
              <span className="block text-sm font-medium">
                {t("dashboard.blogForm.publishedAt")} *
              </span>

              <input
                type="datetime-local"
                name="published_at"
                value={formData.published_at}
                onChange={handleFieldChange}
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5"
              />
            </label>
          </div>

          {/* Cover image */}
          <div className="space-y-3">
            <span className="block text-sm font-medium">
              {t("dashboard.blogForm.coverImage")} *
            </span>

            {currentImageUrl ? (
              <div className="relative max-w-xl overflow-hidden rounded-xl border border-border">
                <img
                  src={currentImageUrl}
                  alt={t("dashboard.blogForm.previewAlt")}
                  className="aspect-video w-full object-cover"
                />

                <div className="flex flex-wrap items-center justify-between gap-3 p-3">
                  <span className="text-sm text-muted-foreground" dir="auto">
                    {imageFile?.name || coverImagePath}
                  </span>

                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted">
                      {t("dashboard.blogForm.changeImage")}

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>

                    {imageFile && (
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setErrorMessage("");
                        }}
                        className="rounded-lg border border-border p-2"
                        aria-label={t("dashboard.blogForm.cancelImage")}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <label className="flex min-h-36 max-w-xl cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border p-6 text-center hover:bg-muted/40">
                <ImagePlus size={28} />

                <span className="text-sm">
                  {t("dashboard.blogForm.selectImage")}
                </span>

                <span className="text-xs text-muted-foreground">
                  {t("dashboard.blogForm.imageUploadHint")}
                </span>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </section>

        {/* English content */}
        <section
          dir="ltr"
          className="space-y-5 rounded-xl border border-border p-5"
        >
          <h2 className="text-lg font-semibold">
            {t("dashboard.blogForm.englishContent")}
          </h2>

          <label className="block space-y-2">
            <span className="text-sm font-medium">
              {t("dashboard.blogForm.englishTitle")} *
            </span>

            <input
              value={formData.translations.en.title}
              onChange={(event) => handleTitleChange("en", event.target.value)}
              required
              dir="ltr"
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5"
              placeholder={t("dashboard.blogForm.englishTitlePlaceholder")}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium">
              {t("dashboard.blogForm.englishExcerpt")} *
            </span>

            <textarea
              value={formData.translations.en.excerpt}
              onChange={(event) =>
                handleTranslationChange("en", "excerpt", event.target.value)
              }
              required
              rows={3}
              dir="ltr"
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5"
              placeholder={t("dashboard.blogForm.englishExcerptPlaceholder")}
            />
          </label>

          <div className="space-y-2">
            <span className="block text-sm font-medium">
              {t("dashboard.blogForm.englishBody")} *
            </span>

            <div dir="ltr">
              <BlogEditor
                value={formData.translations.en.content}
                onChange={(html) =>
                  handleTranslationChange("en", "content", html)
                }
                placeholder={t("dashboard.blogForm.englishBodyPlaceholder")}
                disabled={loading}
              />
            </div>
          </div>
        </section>

        {/* Persian content */}
        <section
          dir="rtl"
          className="space-y-5 rounded-xl border border-border p-5"
        >
          <h2 className="text-lg font-semibold">
            {t("dashboard.blogForm.persianContent")}
          </h2>

          <label className="block space-y-2">
            <span className="text-sm font-medium">
              {t("dashboard.blogForm.persianTitle")} *
            </span>

            <input
              value={formData.translations.fa.title}
              onChange={(event) => handleTitleChange("fa", event.target.value)}
              required
              dir="rtl"
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5"
              placeholder={t("dashboard.blogForm.persianTitlePlaceholder")}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium">
              {t("dashboard.blogForm.persianExcerpt")} *
            </span>

            <textarea
              value={formData.translations.fa.excerpt}
              onChange={(event) =>
                handleTranslationChange("fa", "excerpt", event.target.value)
              }
              required
              rows={3}
              dir="rtl"
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5"
              placeholder={t("dashboard.blogForm.persianExcerptPlaceholder")}
            />
          </label>

          <div className="space-y-2">
            <span className="block text-sm font-medium">
              {t("dashboard.blogForm.persianBody")} *
            </span>

            <div dir="rtl">
              <BlogEditor
                value={formData.translations.fa.content}
                onChange={(html) =>
                  handleTranslationChange("fa", "content", html)
                }
                placeholder={t("dashboard.blogForm.persianBodyPlaceholder")}
                disabled={loading}
              />
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/dashboard/blog")}
            disabled={loading}
            className="rounded-lg border border-border px-5 py-2.5 disabled:opacity-50"
          >
            {t("dashboard.blogForm.cancel")}
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-primary px-5 py-2.5 text-primary-foreground disabled:opacity-50"
          >
            {loading
              ? t("dashboard.blogForm.saving")
              : t(
                  isEditMode
                    ? "dashboard.blogForm.saveChanges"
                    : "dashboard.blogForm.create"
                )}
          </button>
        </div>
      </form>
    </div>
  );
}
