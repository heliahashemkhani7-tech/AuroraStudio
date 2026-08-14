import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";

export default function HeroButtons() {
  const { t } = useTranslation();

  return (
    <section className="flex gap-4 ps-6">
      <Button className="bg-button-gradient text-amber-50 p-2 sm:p-6 font-bold text-sm sm:text-xl">
        {t("home.hero.buttons.portfolio")}
      </Button>

      <Button
        variant="outline"
        className="text-span p-2 sm:p-6 font-bold text-sm sm:text-xl border-span"
      >
        {t("home.hero.buttons.startProject")}
      </Button>
    </section>
  );
}
