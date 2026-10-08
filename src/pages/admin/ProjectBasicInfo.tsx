import { Plus, Trash2 } from "lucide-react";
import type { ChangeEvent } from "react";
import type { Category, ProjectFormData } from "./types";


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
}: ProjectBasicInfoProps) {
  return (
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
            Project Name
          </label>

          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={onChange}
            placeholder="Project name"
            className="w-full rounded-lg border border-border px-3 py-2 outline-none focus:border-primary"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="category_id" className="text-sm font-medium">
            Category
          </label>

          <select
            id="category_id"
            value={formData.category_id}
            onChange={onCategoryChange}
            className="w-full rounded-lg border border-border px-3 py-2 outline-none focus:border-primary"
            required
          >
            <option value="">Select category</option>

            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="technology" className="text-sm font-medium">
            Technology
          </label>

          <input
            id="technology"
            name="technology"
            value={formData.technology}
            onChange={onChange}
            placeholder="React"
            className="w-full rounded-lg border border-border bg-transparent px-3 py-2 outline-none focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="live_url" className="text-sm font-medium">
            Live URL
          </label>

          <input
            id="live_url"
            name="live_url"
            type="url"
            value={formData.live_url}
            onChange={onChange}
            placeholder="https://example.com"
            className="w-full rounded-lg border border-border bg-transparent px-3 py-2 outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="overview_button_link" className="text-sm font-medium">
          Overview Button Link
        </label>

        <input
          id="overview_button_link"
          name="overview_button_link"
          type="url"
          value={formData.overview_button_link}
          onChange={onChange}
          placeholder="https://example.com"
          className="w-full rounded-lg border border-border bg-transparent px-3 py-2 outline-none focus:border-primary"
        />
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">Tech Stack</label>

        <div className="flex gap-2">
          <input
            value={techInput}
            onChange={(event) => onTechInputChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                onAddTechStack();
              }
            }}
            placeholder="React"
            className="flex-1 rounded-lg border border-border bg-transparent px-3 py-2 outline-none focus:border-primary"
          />

          <button
            type="button"
            onClick={onAddTechStack}
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

                <button type="button" onClick={() => onRemoveTechStack(index)}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
