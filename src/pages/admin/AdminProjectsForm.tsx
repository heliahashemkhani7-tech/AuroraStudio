import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  createAdminProject,
  getAdminCategories,
  getAdminProjectById,
  updateAdminProject,
} from "@/features/api";

import ProjectBasicInfo from "./ProjectBasicInfo";
import ProjectContent from "./ProjectContent";
import ProjectHighlights from "./ProjectHighlights";
import type { Category, ProjectFormData } from "./types";

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

  // -------------------------
  // Categories
  // -------------------------

  useEffect(() => {
    async function loadCategories() {
      try {
        const languageId = i18n.language === "fa" ? 2 : 1;

        const data = await getAdminCategories(languageId);

        setCategories(
          data.map((category) => ({
            category_id: category.category_id,
            name: category.label,
          }))
        );
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    }

    loadCategories();
  }, [i18n.language]);

  // -------------------------
  // Edit project
  // -------------------------

  useEffect(() => {
    if (!isEditMode || !id) return;

    async function loadProject() {
      try {
        setLoading(true);

        const project = await getAdminProjectById(Number(id));

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

        const getCardValue = (cards: typeof englishCards, label: string) => {
          return (
            cards.find(
              (card) => card.label.toLowerCase() === label.toLowerCase()
            )?.value ?? ""
          );
        };

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
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [id, isEditMode]);

  // -------------------------
  // Input handlers
  // -------------------------

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

  // -------------------------
  // Tech stack
  // -------------------------

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

  // -------------------------
  // Highlights
  // -------------------------

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

  // -------------------------
  // Submit
  // -------------------------

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoading(true);

      const projectData = {
        category_id: Number(formData.category_id),
        name: formData.name,
        technology: formData.technology,
        live_url: formData.live_url,
        tech_stack: formData.tech_stack,
        overview_button_link: formData.overview_button_link,
        highlight_links: formData.highlight_links,
      };

      if (isEditMode && id) {
        await updateAdminProject(Number(id), projectData);
      } else {
        await createAdminProject(projectData);
      }

      navigate("/dashboard/projects");
    } catch (error) {
      console.error(
        isEditMode ? "Error updating project:" : "Error creating project:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  // -------------------------
  // Render
  // -------------------------

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/dashboard/projects")}
          className="rounded-lg border border-border p-2"
        >
          <ArrowLeft size={18} />
        </button>

        <div>
          <h1 className="text-2xl font-semibold">
            {isEditMode
              ? t("admin.projects.form.editTitle")
              : t("admin.projects.form.createTitle")}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            {isEditMode
              ? t("admin.projects.form.editDescription")
              : t("admin.projects.form.createDescription")}
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
            {t("common.cancel")}
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-primary px-5 py-2.5 text-primary-foreground disabled:opacity-50"
          >
            {loading
              ? t("common.saving")
              : isEditMode
              ? t("common.update")
              : t("common.create")}
          </button>
        </div>
      </form>
    </div>
  );
}
