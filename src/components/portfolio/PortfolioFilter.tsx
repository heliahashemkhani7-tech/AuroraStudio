import { useEffect, useState } from "react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { useTranslation } from "react-i18next";

import { getCategories } from "@/features/api";

type Props = {
  activeFilter: string;
  setActiveFilter: (value: string) => void;
};

type Filter = {
  category_id: number;
  label: string;
  categories: {
    slug: string;
  }[];
};

export default function PortfolioFilter({
  activeFilter,
  setActiveFilter,
}: Props) {
  const { i18n } = useTranslation();

  const [filters, setFilters] = useState<Filter[]>([]);

  useEffect(() => {
    const languageId = i18n.language === "fa" ? 2 : 1;

    getCategories(languageId).then((data) => {
      setFilters(data);
    });
  }, [i18n.language]);

  return (
    <div className="flex  justify-center w-full">
      <ToggleGroup
        variant="outline"
        value={[activeFilter]}
        onValueChange={(value) => {
          if (value.length > 0) {
            setActiveFilter(value[0]);
          }
        }}
        className="flex flex-row-reverse flex-wrap justify-center gap-2 w-full max-w-2xl mx-auto"
      >
        {filters.map((filter) => (
          <ToggleGroupItem
            className="rounded-xl px-5 py-2 data-[pressed]:bg-border data-[pressed]:text-text data-[pressed]:border-border"
            key={filter.category_id}
            value={filter.categories[0]?.slug ?? ""}
          >
            {filter.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
