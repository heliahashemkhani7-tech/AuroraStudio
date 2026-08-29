import HeroContent from "./HomeHeroContent";
import HeroButtons from "./HomeHeroButtons";
import HeroStats from "./HomeHeroStats";

function Hero() {
  return (
    <section className="min-h-screen w-full overflow-hidden pb-8 pl-5">
     

      <div className="relative z-10 flex w-full flex-col gap-10 px-5 sm:px-8 justify-center sm:justify-end h-full">
        <HeroContent />

        <HeroButtons />

        <HeroStats />
      </div>
    </section>
  );
}

export default Hero;
