import { useTranslation } from "react-i18next";
import ParticleText from "../animiations/ParticleText";

export default function HeroContent() {
  const { t } = useTranslation();

  const spanColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--primary")
    .trim();

  return (
    <section className="flex flex-col mt-20 gap-10">
      <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl text-text">
        <span className="block font-bold ps-6">
          {t("home.hero.title.before")}
        </span>

        <ParticleText
          className="
          w-43
          h-12
          translate-y-3
          lg:h-30
          sm:w-60
          md:translate-y-6
          ltr:md:w-90
          md:h-20
          ltr:lg:w-140
          ltr:lg:h-35
          ltr:lg:translate-y-8
          rtl:lg:w-100
        "
          text={t("home.hero.title.highlight")}
          particleSize={2}
          density={0.1}
          color={spanColor}
          scatter={150}
          gatherDuration={1000}
          stagger={100}
          pointerRepel={40}
          repelRadius={15}
          idleDrift={0.8}
          trigger="mount"
          fontWeight={500}
          glow={false}
        />

        <span>{t("home.hero.title.after")}</span>
      </h1>

      <p className=" w-full sm:max-w-md md:max-w-2xl text-hero-description">
        {t("home.hero.description")}
      </p>
    </section>
  );
}
