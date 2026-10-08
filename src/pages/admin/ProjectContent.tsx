import type { ChangeEvent } from "react";

import type { ProjectFormData } from "./types";

type ProjectContentProps = {
  formData: ProjectFormData;
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
};

export default function ProjectContent({
  formData,
  onChange,
}: ProjectContentProps) {
  return (
    <>
      {/* English Content */}
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
              onChange={onChange}
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
              onChange={onChange}
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
              onChange={onChange}
              rows={6}
              className="w-full resize-none rounded-lg border border-border bg-transparent px-3 py-2 outline-none focus:border-primary"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <input
              name="client_en"
              value={formData.client_en}
              onChange={onChange}
              placeholder="Client"
              className="rounded-lg border border-border bg-transparent px-3 py-2 outline-none focus:border-primary"
            />

            <input
              name="role_en"
              value={formData.role_en}
              onChange={onChange}
              placeholder="Role"
              className="rounded-lg border border-border bg-transparent px-3 py-2 outline-none focus:border-primary"
            />

            <input
              name="year_en"
              value={formData.year_en}
              onChange={onChange}
              placeholder="Year"
              className="rounded-lg border border-border bg-transparent px-3 py-2 outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Persian Content */}
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
              onChange={onChange}
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
              onChange={onChange}
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
              onChange={onChange}
              rows={6}
              className="w-full resize-none rounded-lg border border-border bg-transparent px-3 py-2 outline-none focus:border-primary"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <input
              name="client_fa"
              value={formData.client_fa}
              onChange={onChange}
              placeholder="مشتری"
              className="rounded-lg border border-border bg-transparent px-3 py-2 outline-none focus:border-primary"
            />

            <input
              name="role_fa"
              value={formData.role_fa}
              onChange={onChange}
              placeholder="نقش"
              className="rounded-lg border border-border bg-transparent px-3 py-2 outline-none focus:border-primary"
            />

            <input
              name="year_fa"
              value={formData.year_fa}
              onChange={onChange}
              placeholder="سال"
              className="rounded-lg border border-border bg-transparent px-3 py-2 outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>
    </>
  );
}
