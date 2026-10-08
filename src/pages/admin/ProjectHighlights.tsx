import { Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { ProjectFormData } from "./types";

type ProjectHighlightsProps = {
  formData: ProjectFormData;
  highlightInput: string;
  onHighlightInputChange: (value: string) => void;
  onAddHighlight: () => void;
  onRemoveHighlight: (index: number) => void;
};

export default function ProjectHighlights({
  formData,
  highlightInput,
  onHighlightInputChange,
  onAddHighlight,
  onRemoveHighlight,
}: ProjectHighlightsProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 rounded-xl border border-border p-6">
      <div>
        <h2 className="text-lg font-semibold">
          {t("admin.projects.form.projectHighlights.title")}
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          {t("admin.projects.form.projectHighlights.description")}
        </p>
      </div>

      <div className="flex gap-2">
        <input
          value={highlightInput}
          onChange={(event) => onHighlightInputChange(event.target.value)}
          placeholder={t("admin.projects.form.projectHighlights.placeholder")}
          className="flex-1 rounded-lg border border-border bg-transparent px-3 py-2 outline-none focus:border-primary"
        />

        <button
          type="button"
          onClick={onAddHighlight}
          className="rounded-lg border border-border px-3"
          aria-label={t("admin.projects.form.projectHighlights.add")}
        >
          <Plus size={18} />
        </button>
      </div>

      {formData.highlight_links.length > 0 && (
        <div className="space-y-2">
          {formData.highlight_links.map((link, index) => (
            <div
              key={`${link}-${index}`}
              className="flex items-start justify-between gap-3 rounded-lg border border-border px-3 py-2 text-sm"
            >
              <span className="min-w-0 break-words whitespace-normal">
                {link}
              </span>

              <button
                type="button"
                onClick={() => onRemoveHighlight(index)}
                className="shrink-0"
                aria-label={t("admin.projects.form.projectHighlights.remove")}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
