import ExhibitPro from "@/components/landingpage/exhibit";
import Hero from "@/components/landingpage/hero";
import LogoTicker from "@/components/landingpage/logoticker";
import MuseumShowcase from "@/components/landingpage/museumshowcase"

export default function Home() {
  return (
   <>
    <Hero />
    <LogoTicker />
    <MuseumShowcase />
    <ExhibitPro />
   </>
  );
}
