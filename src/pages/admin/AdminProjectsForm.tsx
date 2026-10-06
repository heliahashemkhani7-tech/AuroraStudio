import { useEffect, useState } from "react";

import { ArrowLeft, Plus, Trash2 } from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import { useTranslation } from "react-i18next";

import { createAdminProject, getAdminCategories } from "@/features/api";

type Category = {
  category_id: number;
  name: string;
};

type ProjectFormData = {
  name: string;
  category_id: string;
  technology: string;
  live_url: string;
  tech_stack: string[];
  overview_button_link: string;
  description_en: string;
  detail_en: string;
  overview_paragraphs_en: string;
  client_en: string;
  role_en: string;
  year_en: string;
  description_fa: string;
  detail_fa: string;
  overview_paragraphs_fa: string;
  client_fa: string;
  role_fa: string;
  year_fa: string;
  highlight_links: string[];
};

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

  useEffect(() => {
    async function loadCategories() {
      try {
        const languageId = i18n.language === "fa" ? 2 : 1;
        const data = await getAdminCategories(languageId);

        setCategories(
          data.map((category) => ({
            category_id: category.category_id,
            name: category.name,
          }))
        );
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    }

    loadCategories();
  }, [i18n.language]);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleCategoryChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setFormData((prev) => ({
      ...prev,
      category_id: event.target.value,
    }));
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
      tech_stack: prev.tech_stack.filter((_, i) => i !== index),
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
      highlight_links: prev.highlight_links.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoading(true);

      await createAdminProject({
        category_id: Number(formData.category_id),
        name: formData.name,
        technology: formData.technology,
        live_url: formData.live_url,
        tech_stack: formData.tech_stack,
        overview_button_link: formData.overview_button_link,
        highlight_links: formData.highlight_links,
      });

      navigate("/dashboard/projects");
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/dashboard/projects")}
          className="rounded-md p-2 hover:bg-muted"
          aria-label={t("dashboard.backToProjects")}
        >
          <ArrowLeft size={20} />
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

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6 rounded-xl border border-border p-6">
          <div>
            <h2 className="text-lg font-semibold">Project Information</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Basic information about the project.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                {t("dashboard.projectName")}
              </label>

              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t("dashboard.projectNamePlaceholder")}
                className="w-full rounded-lg border border-border bg-transparent px-3 py-2 outline-none focus:border-primary"
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label htmlFor="category_id" className="text-sm font-medium">
                {t("dashboard.category")}
              </label>

              <select
                id="category_id"
                value={formData.category_id}
                onChange={handleCategoryChange}
                className="w-full rounded-lg border border-border bg-transparent px-3 py-2 outline-none focus:border-primary"
                required
              >
                <option value="">{t("dashboard.categoryPlaceholder")}</option>

                {categories.map((category) => (
                  <option
                    key={category.category_id}
                    value={category.category_id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="technology" className="text-sm font-medium">
                {t("dashboard.technology")}
              </label>

              <input
                id="technology"
                name="technology"
                value={formData.technology}
                onChange={handleChange}
                placeholder={t("dashboard.technologyPlaceholder")}
                className="w-full rounded-lg border border-border bg-transparent px-3 py-2 outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="live_url" className="text-sm font-medium">
                {t("dashboard.liveUrl")}
              </label>

              <input
                id="live_url"
                name="live_url"
                type="url"
                value={formData.live_url}
                onChange={handleChange}
                placeholder="https://example.com"
                className="w-full rounded-lg border border-border bg-transparent px-3 py-2 outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Overview Link */}
          <div className="space-y-2">
            <label
              htmlFor="overview_button_link"
              className="text-sm font-medium"
            >
              {t("dashboard.overviewButtonLink")}
            </label>

            <input
              id="overview_button_link"
              name="overview_button_link"
              type="url"
              value={formData.overview_button_link}
              onChange={handleChange}
              placeholder="https://example.com"
              className="w-full rounded-lg border border-border bg-transparent px-3 py-2 outline-none focus:border-primary"
            />
          </div>

          {/* Tech Stack */}
          <div className="space-y-3">
            <label className="text-sm font-medium">
              {t("dashboard.techStack")}
            </label>

            <div className="flex gap-2">
              <input
                value={techInput}
                onChange={(event) => setTechInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addTechStack();
                  }
                }}
                placeholder="React"
                className="flex-1 rounded-lg border border-border bg-transparent px-3 py-2 outline-none focus:border-primary"
              />

              <button
                type="button"
                onClick={addTechStack}
                className="rounded-lg border border-border px-3"
              >
                <Plus size={18} />
              </button>
            </div>

            {formData.tech_stack.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tech_stack.map((tech, index) => (
                  <div
                    key={`${tech}-${index}`}
                    className="flex items-center gap-2 rounded-full border border-border px-3 py-1 text-sm"
                  >
                    <span>{tech}</span>

                    <button
                      type="button"
                      onClick={() => removeTechStack(index)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6 rounded-xl border border-border p-6">
          <div>
            <h2 className="text-lg font-semibold">English Content</h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="description_en" className="text-sm font-medium">
                Description
              </label>

              <textarea
                id="description_en"
                name="description_en"
                value={formData.description_en}
                onChange={handleChange}
                rows={3}
                className="w-full resize-none rounded-lg border border-border bg-transparent px-3 py-2 outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="detail_en" className="text-sm font-medium">
                Detail
              </label>

              <textarea
                id="detail_en"
                name="detail_en"
                value={formData.detail_en}
                onChange={handleChange}
                rows={5}
                className="w-full resize-none rounded-lg border border-border bg-transparent px-3 py-2 outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="overview_paragraphs_en"
                className="text-sm font-medium"
              >
                Overview Paragraphs
              </label>

              <textarea
                id="overview_paragraphs_en"
                name="overview_paragraphs_en"
                value={formData.overview_paragraphs_en}
                onChange={handleChange}
                rows={6}
                className="w-full resize-none rounded-lg border border-border bg-transparent px-3 py-2 outline-none focus:border-primary"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <input
                name="client_en"
                value={formData.client_en}
                onChange={handleChange}
                placeholder="Client"
                className="rounded-lg border border-border bg-transparent px-3 py-2 outline-none focus:border-primary"
              />

              <input
                name="role_en"
                value={formData.role_en}
                onChange={handleChange}
                placeholder="Role"
                className="rounded-lg border border-border bg-transparent px-3 py-2 outline-none focus:border-primary"
              />

              <input
                name="year_en"
                value={formData.year_en}
                onChange={handleChange}
                placeholder="Year"
                className="rounded-lg border border-border bg-transparent px-3 py-2 outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6 rounded-xl border border-border p-6">
          <div>
            <h2 className="text-lg font-semibold">Persian Content</h2>
          </div>

          <div className="space-y-6" dir="rtl">
            <div className="space-y-2">
              <label htmlFor="description_fa" className="text-sm font-medium">
                توضیح کوتاه
              </label>

              <textarea
                id="description_fa"
                name="description_fa"
                value={formData.description_fa}
                onChange={handleChange}
                rows={3}
                className="w-full resize-none rounded-lg border border-border bg-transparent px-3 py-2 outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="detail_fa" className="text-sm font-medium">
                جزئیات
              </label>

              <textarea
                id="detail_fa"
                name="detail_fa"
                value={formData.detail_fa}
                onChange={handleChange}
                rows={5}
                className="w-full resize-none rounded-lg border border-border bg-transparent px-3 py-2 outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="overview_paragraphs_fa"
                className="text-sm font-medium"
              >
                پاراگراف‌های معرفی
              </label>

              <textarea
                id="overview_paragraphs_fa"
                name="overview_paragraphs_fa"
                value={formData.overview_paragraphs_fa}
                onChange={handleChange}
                rows={6}
                className="w-full resize-none rounded-lg border border-border bg-transparent px-3 py-2 outline-none focus:border-primary"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <input
                name="client_fa"
                value={formData.client_fa}
                onChange={handleChange}
                placeholder="مشتری"
                className="rounded-lg border border-border bg-transparent px-3 py-2 outline-none focus:border-primary"
              />

              <input
                name="role_fa"
                value={formData.role_fa}
                onChange={handleChange}
                placeholder="نقش"
                className="rounded-lg border border-border bg-transparent px-3 py-2 outline-none focus:border-primary"
              />

              <input
                name="year_fa"
                value={formData.year_fa}
                onChange={handleChange}
                placeholder="سال"
                className="rounded-lg border border-border bg-transparent px-3 py-2 outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6 rounded-xl border border-border p-6">
          <div>
            <h2 className="text-lg font-semibold">Project Highlights</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Add highlight image paths or links.
            </p>
          </div>

          <div className="flex gap-2">
            <input
              value={highlightInput}
              onChange={(event) => setHighlightInput(event.target.value)}
              placeholder="nexus/nexus-highlight-1.png"
              className="flex-1 rounded-lg border border-border bg-transparent px-3 py-2 outline-none focus:border-primary"
            />

            <button
              type="button"
              onClick={addHighlight}
              className="rounded-lg border border-border px-3"
            >
              <Plus size={18} />
            </button>
          </div>

          {formData.highlight_links.length > 0 && (
            <div className="space-y-2">
              {formData.highlight_links.map((link, index) => (
                <div
                  key={`${link}-${index}`}
                  className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
                >
                  <span className="truncate">{link}</span>

                  <button type="button" onClick={() => removeHighlight(index)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-border pt-6">
          <button
            type="button"
            onClick={() => navigate("/dashboard/projects")}
            className="rounded-lg border border-border px-4 py-2 text-sm"
          >
            {t("dashboard.cancel")}
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            {loading
              ? t("dashboard.saving")
              : isEditMode
              ? t("dashboard.updateProject")
              : t("dashboard.createProject")}
          </button>
        </div>
      </form>
    </section>
  );
}
