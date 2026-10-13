import { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";
import { useTranslation } from "react-i18next";

type ConfirmDialogProps = {
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmText,
  cancelText,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, loading, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) {
          onCancel();
        }
      }}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        className="w-full max-w-md rounded-2xl border border-border bg-background p-6 text-text shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
              <AlertTriangle size={22} />
            </div>

            <h2 id="confirm-dialog-title" className="text-lg font-semibold">
              {title ?? t("dashboard.confirmDeleteTitle")}
            </h2>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            aria-label={t("dashboard.cancel")}
            className="rounded-lg p-2 text-muted-foreground transition hover:bg-border disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <p
          id="confirm-dialog-description"
          className="mt-4 text-sm leading-7 text-muted-foreground"
        >
          {description ?? t("dashboard.confirmDeleteDescription")}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition hover:bg-border disabled:opacity-50"
          >
            {cancelText ?? t("dashboard.cancel")}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? t("dashboard.deleting")
              : confirmText ?? t("dashboard.delete")}
          </button>
        </div>
      </section>
    </div>
  );
}
