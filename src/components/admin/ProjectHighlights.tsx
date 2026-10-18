import { useEffect, useMemo } from "react";
import { ImagePlus, Plus, Trash2, Upload, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { getProjectImage } from "@/features/api";
import type { ProjectFormData } from "../../pages/admin/types";

type ProjectHighlightsProps = {
  formData: ProjectFormData;
  highlightFiles: (File | null)[];
  onAddHighlight: () => void;
  onRemoveHighlight: (index: number) => void;
  onHighlightImageChange: (index: number, file: File | null) => void;
};

export default function ProjectHighlights({
  formData,
  highlightFiles,
  onAddHighlight,
  onRemoveHighlight,
  onHighlightImageChange,
}: ProjectHighlightsProps) {
  const { t, i18n } = useTranslation();
  const isPersian = i18n.language.startsWith("fa");

  const previews = useMemo(
    () => highlightFiles.map((file) => (file ? URL.createObjectURL(file) : "")),
    [highlightFiles]
  );

  useEffect(() => {
    return () => {
      previews.forEach((preview) => {
        if (preview) URL.revokeObjectURL(preview);
      });
    };
  }, [previews]);

  function handleFileChange(
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) {
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

    onHighlightImageChange(index, file);
    event.target.value = "";
  }

  return (
    <div className="space-y-6 rounded-xl border-2 border-border p-6">
      <div>
        <h2 className="text-lg font-semibold">
          {t("admin.projects.form.projectHighlights.title")}
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          {t("admin.projects.form.projectHighlights.description")}
        </p>
      </div>

      <button
        type="button"
        onClick={onAddHighlight}
        className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm transition-colors hover:bg-dashboard-bg"
      >
        <Plus size={18} />
        {isPersian ? "افزودن تصویر هایلایت" : "Add highlight image"}
      </button>

      {formData.highlight_links.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {formData.highlight_links.map((link, index) => {
            const file = highlightFiles[index] ?? null;
            const preview = previews[index];
            const savedImage = link ? getProjectImage(link) : "";
            const imageSrc = preview || savedImage;

            return (
              <div
                key={`highlight-${index}`}
                className="min-w-0 space-y-3 rounded-xl border border-border/50 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">
                    {isPersian
                      ? `تصویر هایلایت ${index + 1}`
                      : `Highlight image ${index + 1}`}
                  </span>

                  <button
                    type="button"
                    onClick={() => onRemoveHighlight(index)}
                    className="rounded-md p-2 text-red-500 transition-colors hover:bg-red-500/10"
                    aria-label={
                      isPersian
                        ? `حذف تصویر ${index + 1}`
                        : `Remove image ${index + 1}`
                    }
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <label className="group relative flex aspect-[4/3] cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-dashboard-bg transition-colors hover:border-primary">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={
                        isPersian
                          ? `پیش‌نمایش هایلایت ${index + 1}`
                          : `Highlight preview ${index + 1}`
                      }
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 p-4 text-center text-muted-foreground">
                      <ImagePlus size={30} />
                      <span className="text-sm">
                        {isPersian
                          ? "برای انتخاب عکس کلیک کنید"
                          : "Click to select an image"}
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="flex items-center gap-2 text-sm text-white">
                      <Upload size={17} />
                      {isPersian
                        ? "انتخاب یا تغییر تصویر"
                        : "Choose or replace image"}
                    </span>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(event) => handleFileChange(index, event)}
                    aria-label={
                      isPersian
                        ? `انتخاب تصویر هایلایت ${index + 1}`
                        : `Choose highlight image ${index + 1}`
                    }
                  />
                </label>

                {file && (
                  <div className="flex min-w-0 items-center justify-between gap-2 text-xs text-muted-foreground">
                    <span className="min-w-0 truncate" title={file.name}>
                      {file.name}
                    </span>

                    <button
                      type="button"
                      onClick={() => onHighlightImageChange(index, null)}
                      className="shrink-0 rounded-md p-1 hover:text-foreground"
                      aria-label={
                        isPersian ? "لغو انتخاب عکس" : "Cancel image selection"
                      }
                      title={
                        isPersian
                          ? "لغو انتخاب عکس جدید"
                          : "Cancel new image selection"
                      }
                    >
                      <X size={15} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
