import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { ChangeEvent } from "react";
import type { Category, ProjectFormData } from "../../pages/admin/types";

type ProjectBasicInfoProps = {
  formData: ProjectFormData;
  categories: Category[];
  techInput: string;
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onCategoryChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  onTechInputChange: (value: string) => void;
  onAddTechStack: () => void;
  onRemoveTechStack: (index: number) => void;
  imagePreview: string;
  onImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export default function ProjectBasicInfo({
  formData,
  categories,
  techInput,
  onChange,
  onCategoryChange,
  onTechInputChange,
  onAddTechStack,
  onRemoveTechStack,
  imagePreview,
  onImageChange,
}: ProjectBasicInfoProps) {
  const { t } = useTranslation();
  const [selectedImageName, setSelectedImageName] = useState("");

  return (
    <section className="space-y-6 rounded-xl border-2 border-border p-5">
      <h2 className="text-xl font-semibold">
        {t("dashboard.basicInformation")}
      </h2>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            {t("dashboard.projectName")}
          </label>

          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={onChange}
            required
            className="w-full rounded-lg border-2 border-border bg-background px-3 py-2"
            placeholder={t("dashboard.projectNamePlaceholder")}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="category_id" className="text-sm font-medium">
            {t("dashboard.category")}
          </label>

          <select
            id="category_id"
            name="category_id"
            value={formData.category_id}
            onChange={onCategoryChange}
            required
            className="w-full rounded-lg border-2 border-border bg-background px-3 py-2"
          >
            <option value="">{t("dashboard.categoryPlaceholder")}</option>

            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
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
            type="text"
            value={formData.technology}
            onChange={onChange}
            className="w-full rounded-lg border-2 border-border bg-background px-3 py-2"
            placeholder={t("dashboard.technologyPlaceholder")}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="overview_button_link" className="text-sm font-medium">
            {t("dashboard.overviewButtonLink")}
          </label>

          <input
            id="overview_button_link"
            name="overview_button_link"
            type="url"
            value={formData.overview_button_link}
            onChange={onChange}
            className="w-full rounded-lg border-2 border-border bg-background px-3 py-2"
            placeholder="https://example.com"
          />
        </div>
      </div>

      <div className="space-y-3">
        <label htmlFor="project-image" className="text-sm font-medium">
          {t("dashboard.projectCoverImage")}
        </label>

        {imagePreview && (
          <div className="max-w-md overflow-hidden rounded-lg border-2 border-border">
            <img
              src={imagePreview}
              alt={t("dashboard.projectCoverImage")}
              className="h-auto max-h-64 w-full object-contain"
            />
          </div>
        )}

        <div className="flex w-full max-w-md flex-wrap items-center gap-3">
          <label
            htmlFor="project-image"
            className="cursor-pointer rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground hover:bg-muted"
          >
            {t("dashboard.chooseImage")}
          </label>

          <span className="min-w-0 truncate text-sm text-muted-foreground">
            {selectedImageName || t("dashboard.noImageSelected")}
          </span>
        </div>

        <input
          id="project-image"
          type="file"
          accept="image/*"
          onChange={(event) => {
            setSelectedImageName(event.target.files?.[0]?.name ?? "");
            onImageChange(event);
          }}
          className="sr-only"
        />

        <p className="text-xs text-muted-foreground">
          {imagePreview
            ? t("dashboard.changeImageHint")
            : t("dashboard.uploadImageHint")}
        </p>
      </div>

      <div className="space-y-3">
        <label htmlFor="tech-stack-input" className="text-sm font-medium">
          {t("dashboard.techStack")}
        </label>

        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id="tech-stack-input"
            type="text"
            value={techInput}
            onChange={(event) => onTechInputChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                onAddTechStack();
              }
            }}
            className="min-w-0 flex-1 rounded-lg border-2 border-border bg-background px-3 py-2"
            placeholder={t("dashboard.techStackHint")}
          />

          <button
            type="button"
            onClick={onAddTechStack}
            className="rounded-lg border-2 border-border px-4 py-2 transition hover:bg-muted"
          >
            {t("dashboard.addTechnology")}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {formData.tech_stack.map((technology, index) => (
            <span
              key={`${technology}-${index}`}
              className="flex items-center gap-2 rounded-full border-2 border-border px-3 py-1.5 text-sm"
            >
              {technology}

              <button
                type="button"
                onClick={() => onRemoveTechStack(index)}
                aria-label={t("dashboard.removeTechnology", {
                  technology,
                })}
                className="text-muted-foreground transition hover:text-destructive"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
