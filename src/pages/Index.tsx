import { useState } from "react";
import { ScrollToHashElement } from "@cascadia-code/scroll-to-hash-element";
import { Navigation } from "@/components/ui/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { HousesSection } from "@/components/sections/HousesSection";
import { ExperiencesSection } from "@/components/sections/ExperiencesSection";
import GallerySection from "@/components/sections/GallerySection";
import { LocationSection } from "@/components/sections/LocationSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { VideoSection } from "@/components/sections/VideoSection";

const Index = () => {
  const [language, setLanguage] = useState<'en' | 'es'>('en');

  return (
    <div className="min-h-screen bg-background">
      <ScrollToHashElement />
      <Navigation language={language} onLanguageChange={setLanguage} />
      <main>
        <div id="home">
          <HeroSection language={language} />
        </div>
        <div id="houses">
          <HousesSection language={language} />
        </div>
        <div id="experiences">
          <ExperiencesSection language={language} />
        </div>
        <VideoSection language={language} />
        <GallerySection language={language} />
        <div id="location">
          <LocationSection language={language} />
        </div>
        <div id="contact">
          <ContactSection language={language} />
        </div>
      </main>
    </div>
  );
};

export default Index;
