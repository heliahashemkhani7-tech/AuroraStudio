import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useTranslation } from "react-i18next";

type Props = {
  activeFilter: string;
  setActiveFilter: (value: string) => void;
};

type Filter = {
  label: string;
  value: string;
};

export default function PortfolioFilter({
  activeFilter,
  setActiveFilter,
}: Props) {
  const { t } = useTranslation();

  const filters = Object.values(
    t("portfolio.filters", {
      returnObjects: true,
    })
  ) as Filter[];

  return (
    <div className="flex justify-center w-full">
      <ToggleGroup
        variant={"outline"}
        value={[activeFilter]}
        onValueChange={(value) => {
          if (value.length > 0) {
            setActiveFilter(value[0]);
          }
        }}
        className="flex flex-wrap justify-center gap-2 w-full max-w-2xl mx-auto"
      >
        {filters.map((filter) => (
          <ToggleGroupItem
            className="rounded-xl px-5 py-2 data-[pressed]:bg-border data-[pressed]:text-text data-[pressed]:border-border"
            key={filter.value}
            value={filter.value}
          >
            {filter.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
