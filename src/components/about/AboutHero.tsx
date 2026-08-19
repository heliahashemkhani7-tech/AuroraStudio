import { useTranslation } from "react-i18next";
import StrokeText from "../animiations/StrokeText";
import i18n from "@/i18n";
import { Badge } from "../ui/badge";
import TiltedCard from "../ui/TiltedCard";

export default function AboutHero() {
  const { t } = useTranslation();
  const isPersian = i18n.language === "fa";

  return (
    <section className="md:grid flex flex-col justify-center gap-20 mt-5 h-screen items-center overflow-hidden md:gap-30 md:grid-cols-2">
      {/* Text */}
      <div className="flex flex-col items-start">
        <Badge className="text-span" variant="outline">
          {t("about.hero.eyebrow")}
        </Badge>

        <div className="w-fit max-w-xs md:max-w-3xl  md:h-30 rtl:h-20 md:rtl:h-35 h-10 items-center flex">
          <StrokeText
            text={t("about.hero.title")}
            drawDuration={1.6}
            fillDelay={0.2}
            stagger={0.05}
            ease="power2.out"
            trigger="mount"
            fillMode="wipe"
            fontSize={isPersian ? 150 : 96}
            fontWeight={800}
            letterSpacing={5}
            reverse={false}
          />
        </div>

        <p className="mt-4 max-w-3xl  text-xs lg:text-xl text-text">
          {t("about.hero.description")}
        </p>
      </div>

      {/* Image */}

      <div className="w-full flex justify-center float-animation ">
        <TiltedCard
          imageSrc="/imgs/ChatGPT Image Aug 19, 2026, 12_01_14 PM.png"
          containerWidth="min(85vw, 400px)"
          containerHeight="min(50vw, 400px)"
          imageWidth="min(85vw, 500px)"
          imageHeight="min(30vw, 500px)"
          rotateAmplitude={20}
          scaleOnHover={1.05}
          showMobileWarning={true}
        />
      </div>
    </section>
  );
}
