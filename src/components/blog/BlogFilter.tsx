import { useEffect, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useTranslation } from "react-i18next";
import { getAdminBlogCategories } from "@/features/api";

type Props = {
  activeFilter: string;
  setActiveFilter: (value: string) => void;
};

type Filter = {
  category_blog_id: number;
  label: string;
};

export default function BlogFilter({
  activeFilter,
  setActiveFilter,
}: Props) {
  const { i18n } = useTranslation();
  const [filters, setFilters] = useState<Filter[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        const categories = await getAdminBlogCategories();
        const languageId = i18n.language.startsWith("fa") ? 2 : 1;

        const translatedFilters: Filter[] = categories.map((category) => {
          const translations = category.blog_category_translations ?? [];

          const translation =
            translations.find((item) => item.language_id === languageId) ??
            translations.find((item) => item.language_id === 1) ??
            translations[0];

          return {
            category_blog_id: category.id,
            label: translation?.name ?? category.slug,
          };
        });

        if (!cancelled) {
          setFilters(translatedFilters);
        }
      } catch (error) {
        console.error("Failed to load blog categories:", error);
      }
    }

    void loadCategories();

    return () => {
      cancelled = true;
    };
  }, [i18n.language]);

  const isPersian = i18n.language.startsWith("fa");

  return (
    <div className="flex w-full justify-center">
      <ToggleGroup
        variant="outline"
        value={[activeFilter]}
        onValueChange={(value) => {
          if (value.length > 0) {
            setActiveFilter(value[0]);
          }
        }}
        className="flex w-full flex-wrap justify-center gap-2"
      >
        <ToggleGroupItem
          value="all"
          className="rounded-xl px-5 py-2 data-[pressed]:bg-border data-[pressed]:text-text data-[pressed]:border-border"
        >
          {isPersian ? "همه" : "All"}
        </ToggleGroupItem>

        {filters.map((filter) => (
          <ToggleGroupItem
            key={filter.category_blog_id}
            value={String(filter.category_blog_id)}
            className="rounded-xl px-5 py-2 data-[pressed]:bg-border data-[pressed]:text-text data-[pressed]:border-border"
          >
            {filter.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
