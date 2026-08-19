import { useTranslation } from "react-i18next";
import ElectricBorder from "../animiations/ElectricBorder";
import { Card, CardContent } from "../ui/card";
import { Compass, Palette, Code2, Rocket, type LucideIcon } from "lucide-react";

export default function AboutProcessCard() {
  const { t } = useTranslation();

  const icons: Record<string, LucideIcon> = {
    explore: Compass,
    design_services: Palette,
    code_blocks: Code2,
    rocket_launch: Rocket,
  };

  const steps = t("about.process.steps", {
    returnObjects: true,
  }) as {
    title: string;
    description: string;
    icon: string;
  }[];

  return (
    <div className="grid gap-5 grid-cols-2 md:flex md:flex-row md:justify-around">
      {steps.map((step, index) => {
        const Icon = icons[step.icon];

        return (
          <ElectricBorder
            key={index}
            className="h-50 md:max-w-80"
            color="var(--primary)"
            speed={5}
            chaos={0}
          >
            <Card className="h-50 md:max-w-80">
              <CardContent className="h-full">
                <div className="flex h-full max-w-xs flex-col justify-around">
                  <Icon
                    className="
    size-9
    rounded-full
    border-border
    border-2
    bg-glass-bg
    p-2
    text-span
  "
                  />
                  <h3 className="text-2xl text-text">{step.title}</h3>

                  <p>{step.description}</p>
                </div>
              </CardContent>
            </Card>
          </ElectricBorder>
        );
      })}
    </div>
  );
}
