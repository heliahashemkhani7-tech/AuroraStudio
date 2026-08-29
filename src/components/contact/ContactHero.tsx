import { useTranslation } from "react-i18next";
import FoldText from "../ui/FoldText";

export default function ContactHero() {
  const { t } = useTranslation();
  return (
    <div className="flex text-text flex-col gap-5">
      <FoldText
        splitBy="word"
        trigger="mount"
        text={t("contact.hero.title")}
        hinge="top"
        duration={0.65}
        stagger={0.045}
        ease="power3.out"
        perspective={700}
        creaseShading={0.55}
        fontSize="clamp(1.5rem, 5vw, 4rem)"
        fontWeight={800}
      />
      <p className="text-xs sm:text-xl max-w-2xl">{t("contact.hero.description")}</p>
    </div>
  );
}
