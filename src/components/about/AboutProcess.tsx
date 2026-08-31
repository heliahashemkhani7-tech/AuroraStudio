import { useTranslation } from "react-i18next";
import { Badge } from "../ui/badge";
import AboutProcessCard from "./AboutProcessCard";

export default function AboutProcess() {
  
  const { t } = useTranslation();

  return (
    <section className="flex flex-col  justify-center gap-10 overflow-hidden p-2">
      <div className="flex flex-col gap-5 px-5">
        <Badge className="text-span" variant="outline">
          {t("about.process.eyebrow")}
        </Badge>{" "}
        <h2 className="text-span text-4xl md:text-5xl">{t("about.process.title")}</h2>
      </div>

      <div>
        <AboutProcessCard />
      </div>
    </section>
  );
}
