import { useTranslation } from "react-i18next";
import ElectricBorder from "../animiations/ElectricBorder";
import { Card, CardContent } from "../ui/card";

export default function AboutStory() {
  const { t } = useTranslation();
  const paragraphs = t("about.story.paragraphs", {
    returnObjects: true,
  }) as string[];

  return (
    <section className="h-screen flex flex-col  md:flex-row justify-center items-center gap-20 overflow-hidden">
      <h2 className="text-span  text-2xl md:text-5xl max-w-xl">
        {t("about.story.title")}
      </h2>
      <ElectricBorder
        color="var(--primary)"
        speed={5}
        chaos={0.08}
      >
        <Card className="mx-auto">
          <CardContent>
            <div className="flex flex-col text-xs md:text-[15px] max-w-xl gap-15 py-5">
              {paragraphs.map((paragraph, index) => (
                <p key={index} className="text-text">
                  {paragraph}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      </ElectricBorder>
    </section>
  );
}
