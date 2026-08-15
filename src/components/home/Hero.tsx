import Aurora from "../animiations/Aurora";
import HeroContent from "./HeroContent";
import HeroButtons from "./HeroButtons";
import HeroStats from "./HeroStats";

function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden pb-8 pl-5">
      <div className="absolute inset-0 z-10">
        <Aurora
          colorStops={[
            "var(--aurora-purple)",
            "var(--aurora-white)",
            "var(--aurora-blue)",
          ]}
          blend={5}
          amplitude={1}
          speed={0.9}
        />
      </div>

      <div className="relative z-10 flex w-full flex-col gap-10 px-5 sm:px-8 justify-center sm:justify-end h-full">
        <HeroContent />

        <HeroButtons />

        <HeroStats />
      </div>
    </section>
  );
}

export default Hero;
