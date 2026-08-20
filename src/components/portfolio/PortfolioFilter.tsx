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
    <ToggleGroup
      value={[activeFilter]}
      onValueChange={(value) => {
        if (value.length > 0) {
          setActiveFilter(value[0]);
        }
      }}
    >
      {filters.map((filter) => (
        <ToggleGroupItem key={filter.value} value={filter.value}>
          {filter.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
