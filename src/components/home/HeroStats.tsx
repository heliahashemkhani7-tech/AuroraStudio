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
    <ElectricBorder color="var(--primary)" className="mt-25 md:mt-0 ">
      {" "}
      <Card className="mx-auto">
        <CardContent className="flex items-center justify-around">
          {stats.map((item, index) => (
            <div
              key={index}
              className="flex items-end sm:gap-6 p-0"
            >
              <div className="text-center min-w-24">
                <span className="text-span text-xs sm:text-2xl md:text-2xl lg:text-3xl">
                  {item.value}
                </span>

                <p className="text-text text-[9px] sm:text-xs md:text-xl">
                  {item.label}
                </p>
              </div>

              {index !== stats.length - 1 && (
                <Separator
                  orientation="vertical"
                  className="hidden md:block h-20 w-0.5 bg-seprator "
                />
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </ElectricBorder>
  );
}
