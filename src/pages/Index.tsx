import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      // Delay to ensure DOM is fully ready
      const timer = setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [location.hash, location.pathname]);

  return (
    <div className="min-h-screen bg-background">
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
