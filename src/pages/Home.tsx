import Aurora from "@/components/animiations/Aurora";
import HomeHero from "@/components/home/HomeHero";
import Container from "@/components/layout/Container";

function Home() {
  return (
    <main className="bg-hero-background h-screen">
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
      <Container className="flex items-cente justify-center">
        <HomeHero />
      </Container>
    </main>
  );
}

export default Home;
