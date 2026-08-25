import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

export default function HeroButtons() {
  const { t } = useTranslation();

  return (
    <section className="flex gap-4">
      <Link to={"/portfolio"}>
        <Button className="bg-button-gradient text-amber-50 p-2 sm:p-6 font-bold text-sm sm:text-xl">
          {t("home.hero.buttons.portfolio")}
        </Button>
      </Link>

      <Link to={"/contact"}>
        <Button
          variant="outline"
          className="text-span p-2 sm:p-6 font-bold text-sm sm:text-xl border-span"
        >
          {t("home.hero.buttons.startProject")}
        </Button>
      </Link>
    </section>
  );
}
