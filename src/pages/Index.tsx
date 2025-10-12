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
    console.log('=== INDEX PAGE LOADED ===');
    console.log('Current hash:', location.hash);
    console.log('Current pathname:', location.pathname);
    
    if (location.hash) {
      const id = location.hash.replace('#', '');
      console.log('Attempting to scroll to section:', id);
      
      // Delay to ensure DOM is fully ready
      const timer = setTimeout(() => {
        const element = document.getElementById(id);
        console.log('Element found for', id, ':', !!element);
        
        if (element) {
          console.log('Scrolling to element:', id);
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 500);
      
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
