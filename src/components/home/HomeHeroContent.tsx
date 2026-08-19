import { useTranslation } from "react-i18next";
import ParticleText from "../animiations/ParticleText";

export default function HeroContent() {
  const { t } = useTranslation();

  const spanColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--primary")
    .trim();

  return (
    <section className="flex flex-col gap-5 md:gap-10">
      <h1 className="text-2xl sm:text-5xl lg:text-7xl text-text">
        <span className="block font-bold">{t("home.hero.title.before")}</span>

        <ParticleText
          className="
          w-46
          h-10
          translate-y-3
          rtl:w-30
          sm:w-60
          md:h-20
          md:translate-y-6
          ltr:md:w-80
          rtl:md:w-80
          lg:h-20
          ltr:lg:w-100
          ltr:lg:h-20
          rtl:lg:w-80
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

      <p className="w-full text-xs lg:text-xl sm:max-w-md md:max-w-3xl text-hero-description">
        {t("home.hero.description")}
      </p>
    </section>
  );
}
