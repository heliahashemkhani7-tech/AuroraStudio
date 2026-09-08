import HeroContent from "./HomeHeroContent";
import HeroButtons from "./HomeHeroButtons";
import HeroStats from "./HomeHeroStats";

function HomeHero() {
  return (
    <section className="min-h-screen w-full overflow-hidden pb-8">
     

      <div className="relative z-10 flex w-full flex-col gap-10  sm:px-8 justify-center sm:justify-end h-full">
        <HeroContent />

        <HeroButtons />

        <HeroStats />
      </div>
    </section>
  );
}

export default HomeHero;
