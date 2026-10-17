import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import {
  createAdminProject,
  getAdminCategories,
  getAdminProjectById,
  updateAdminProject,
  uploadProjectImage,
  getProjectImage,
} from "@/features/api";

import ProjectBasicInfo from "../../components/admin/ProjectBasicInfo";
import ProjectContent from "../../components/admin/ProjectContent";
import ProjectHighlights from "../../components/admin/ProjectHighlights";
import type { Category, ProjectFormData } from "./types";
import { slugify } from "@/hooks/lib/slugify";

const initialFormData: ProjectFormData = {
  name: "",
  category_id: "",
  technology: "",
  live_url: "",
  tech_stack: [],
  overview_button_link: "",

  description_en: "",
  detail_en: "",
  overview_paragraphs_en: "",
  client_en: "",
  role_en: "",
  year_en: "",

  description_fa: "",
  detail_fa: "",
  overview_paragraphs_fa: "",
  client_fa: "",
  role_fa: "",
  year_fa: "",

  highlight_links: [],
};

export default function AdminProjectsForm() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData);

  const [techInput, setTechInput] = useState("");
  const [highlightInput, setHighlightInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const isPersian = i18n.language.startsWith("fa");

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        const languageId = isPersian ? 2 : 1;
        const data = await getAdminCategories(languageId);

        if (!cancelled) {
          setCategories(
            data.map((category) => ({
              category_id: category.category_id,
              name: category.name,
            }))
          );
        }
      } catch (error) {
        console.error("Error loading categories:", error);

        if (!cancelled) {
          toast.error(
            isPersian
              ? "بارگذاری دسته‌بندی‌ها با خطا مواجه شد."
              : "Failed to load categories."
          );
        }
      }
    }

    void loadCategories();

    return () => {
      cancelled = true;
    };
  }, [i18n.language, isPersian]);

  useEffect(() => {
    if (!isEditMode || !id) return;

    let cancelled = false;

    async function loadProject() {
      setLoading(true);

      try {
        const project = await getAdminProjectById(Number(id));

        if (cancelled) return;

        const englishTranslation = project.project_translations.find(
          (translation) => translation.language_id === 1
        );

        const persianTranslation = project.project_translations.find(
          (translation) => translation.language_id === 2
        );

        const englishCards = project.project_card.filter(
          (card) => card.language_id === 1
        );

        const persianCards = project.project_card.filter(
          (card) => card.language_id === 2
        );

        const getCardValue = (cards: typeof englishCards, label: string) =>
          cards.find((card) => card.label.toLowerCase() === label.toLowerCase())
            ?.value ?? "";

        setFormData({
          name: project.name ?? "",
          category_id: String(project.category_id ?? ""),
          technology: project.technology ?? "",
          live_url: project.live_url ?? "",

          tech_stack:
            Array.isArray(project.tech_stack) &&
            project.tech_stack.every(
              (item): item is string => typeof item === "string"
            )
              ? project.tech_stack
              : [],

          overview_button_link: project.overview_button_link ?? "",

          description_en: englishTranslation?.description ?? "",
          detail_en: englishTranslation?.detail ?? "",
          overview_paragraphs_en: englishTranslation?.overview_paragraphs ?? "",

          client_en: getCardValue(englishCards, "CLIENT"),
          role_en: getCardValue(englishCards, "ROLE"),
          year_en: getCardValue(englishCards, "YEAR"),

          description_fa: persianTranslation?.description ?? "",
          detail_fa: persianTranslation?.detail ?? "",
          overview_paragraphs_fa: persianTranslation?.overview_paragraphs ?? "",

          client_fa: getCardValue(persianCards, "مشتری"),
          role_fa: getCardValue(persianCards, "نقش"),
          year_fa: getCardValue(persianCards, "سال"),

          highlight_links:
            Array.isArray(project.highlight_links) &&
            project.highlight_links.every(
              (item): item is string => typeof item === "string"
            )
              ? project.highlight_links
              : [],
        });
      } catch (error) {
        console.error("Error loading project:", error);

        if (!cancelled) {
          toast.error(
            isPersian
              ? "بارگذاری اطلاعات پروژه با خطا مواجه شد."
              : "Failed to load project details."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadProject();

    return () => {
      cancelled = true;
    };
  }, [id, isEditMode, isPersian]);

  const imagePreview = useMemo(() => {
    if (!imageFile) return "";

    return URL.createObjectURL(imageFile);
  }, [imageFile]);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleCategoryChange(event: ChangeEvent<HTMLSelectElement>) {
    setFormData((prev) => ({
      ...prev,
      category_id: event.target.value,
    }));
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(
        isPersian
          ? "لطفاً یک فایل تصویری معتبر انتخاب کنید."
          : "Please select a valid image file."
      );

      event.target.value = "";
      return;
    }

    setImageFile(file);
  }

  function addTechStack() {
    const value = techInput.trim();

    if (!value) return;

    setFormData((prev) => ({
      ...prev,
      tech_stack: [...prev.tech_stack, value],
    }));

    setTechInput("");
  }

  function removeTechStack(index: number) {
    setFormData((prev) => ({
      ...prev,
      tech_stack: prev.tech_stack.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  function addHighlight() {
    const value = highlightInput.trim();

    if (!value) return;

    setFormData((prev) => ({
      ...prev,
      highlight_links: [...prev.highlight_links, value],
    }));

    setHighlightInput("");
  }

  function removeHighlight(index: number) {
    setFormData((prev) => ({
      ...prev,
      highlight_links: prev.highlight_links.filter(
        (_, itemIndex) => itemIndex !== index
      ),
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    if (!formData.category_id || !formData.name.trim()) {
      toast.error(
        isPersian
          ? "لطفاً نام پروژه و دسته‌بندی را وارد کنید."
          : "Please enter the project name and select a category."
      );
      return;
    }

    setLoading(true);

    try {
      let imagePath = formData.live_url;

      if (imageFile) {
        const uploadedImage = await uploadProjectImage(
          imageFile,
          slugify(formData.name) || "projects"
        );

        imagePath = uploadedImage.path;
      }

      const projectData = {
        slug: slugify(formData.name),
        category_id: Number(formData.category_id),
        name: formData.name,
        technology: formData.technology,
        live_url: imagePath,
        tech_stack: formData.tech_stack,
        overview_button_link: formData.overview_button_link,
        highlight_links: formData.highlight_links,
      };

      if (isEditMode && id) {
        await updateAdminProject(Number(id), projectData);

        toast.success(
          isPersian
            ? "پروژه با موفقیت ویرایش شد."
            : "Project updated successfully."
        );
      } else {
        await createAdminProject(projectData);

        toast.success(
          isPersian
            ? "پروژه با موفقیت ایجاد شد."
            : "Project created successfully."
        );
      }

      navigate("/dashboard/projects");
    } catch (error) {
      console.error(
        isEditMode ? "Error updating project:" : "Error creating project:",
        error
      );

      toast.error(
        isEditMode
          ? isPersian
            ? "ویرایش پروژه با خطا مواجه شد."
            : "Failed to update project."
          : isPersian
          ? "ایجاد پروژه با خطا مواجه شد."
          : "Failed to create project."
      );
    } finally {
      setLoading(false);
    }
  }

  const currentImageUrl = formData.live_url
    ? getProjectImage(formData.live_url)
    : "";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/dashboard/projects")}
          className="rounded-lg border-2 border-border p-2"
          aria-label={isPersian ? "بازگشت به پروژه‌ها" : "Back to projects"}
        >
          <ArrowLeft size={18} />
        </button>

        <div>
          <h1 className="text-2xl font-semibold">
            {isEditMode
              ? t("dashboard.editProject")
              : t("dashboard.addProject")}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            {isEditMode
              ? t("dashboard.editProjectDescription")
              : t("dashboard.addProjectDescription")}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <ProjectBasicInfo
          formData={formData}
          categories={categories}
          techInput={techInput}
          onChange={handleChange}
          onCategoryChange={handleCategoryChange}
          onTechInputChange={setTechInput}
          onAddTechStack={addTechStack}
          onRemoveTechStack={removeTechStack}
          imagePreview={imagePreview || currentImageUrl}
          onImageChange={handleImageChange}
        />

        <ProjectContent formData={formData} onChange={handleChange} />

        <ProjectHighlights
          formData={formData}
          highlightInput={highlightInput}
          onHighlightInputChange={setHighlightInput}
          onAddHighlight={addHighlight}
          onRemoveHighlight={removeHighlight}
        />

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/dashboard/projects")}
            className="rounded-lg border border-border px-5 py-2.5"
          >
            {t("dashboard.cancel")}
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-primary px-5 py-2.5 text-primary-foreground disabled:opacity-50"
          >
            {loading
              ? t("dashboard.saving")
              : isEditMode
              ? t("dashboard.updateProject")
              : t("dashboard.createProject")}
          </button>
        </div>
      </form>
    </div>
  );
}
