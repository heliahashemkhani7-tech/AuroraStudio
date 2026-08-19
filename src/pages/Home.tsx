import Hero from "@/components/home/HomeHero";
import Nav from "@/components/layout/Nav";

function Home() {
  return (
    <main className="bg-hero-background h-screen flex flex-col items-center justify-center">
      <Nav />
      <Hero />
    </main>
  );
}

export default Home;
