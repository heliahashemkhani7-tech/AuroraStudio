import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "../ui/separator";
import { useTranslation } from "react-i18next";
import ElectricBorder from "../animiations/ElectricBorder";

export default function HeroStats() {
  const { t } = useTranslation();

  const stats = t("home.stats", { returnObjects: true }) as {
    value: string;
    label: string;
  }[];

  return (
    <ElectricBorder color="var(--primary)" className="mt-25 md:mt-0">
      <Card className="mx-auto">
        <CardContent className="flex items-center ltr:pl-10 rtl:pr-10">
          {stats.map((item, index) => (
            <div key={index} className="flex flex-1 items-center">
              {index !== 0 && (
                <Separator
                  orientation="vertical"
                  className="hidden md:block h-20 w-0.5 bg-seprator mr-6"
                />
              )}

              <div className="ltr:text-left rtl:text-right rtl:pr-4">
                <span className="text-span text-xs sm:text-2xl md:text-2xl lg:text-3xl">
                  {item.value}
                </span>

                <p className="text-text text-[9px] sm:text-xs md:text-xl">
                  {item.label}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </ElectricBorder>
  );
}
