import { useState } from "react";
import { Navigation } from "@/components/ui/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { HousesSection } from "@/components/sections/HousesSection";
import { ExperiencesSection } from "@/components/sections/ExperiencesSection";
import { LocationSection } from "@/components/sections/LocationSection";
import { ContactSection } from "@/components/sections/ContactSection";

const Index = () => {
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  console.count('Index render');

  return (
    <div className="min-h-screen bg-background">
      <Navigation language={language} onLanguageChange={setLanguage} />
      <main>
        <HeroSection language={language} />
        <HousesSection language={language} />
        <ExperiencesSection language={language} />
        <LocationSection language={language} />
        <ContactSection language={language} />
      </main>
    </div>
  );
};

export default Index;
