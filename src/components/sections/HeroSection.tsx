import { Button } from "@/components/ui/button";
import { MapPin, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import puertoFjordLogo from "@/assets/puerto-fjord-logo-new.png";
const heroImages = ["/lovable-uploads/8f96ad03-30fd-406a-b41d-5744095159b4.png", "/lovable-uploads/d1a96e69-1766-4e4b-8806-c2769640ce1d.png", "/lovable-uploads/c09c8416-c052-4bd1-88cd-5cbb6ffadbd5.png", "/lovable-uploads/7d18abe5-d372-4a27-94b7-d2a39f1d5206.png", "/lovable-uploads/91c5ba44-ef47-4b82-99f2-d833f69dbd76.png"];
interface HeroSectionProps {
  language: 'en' | 'es';
}
const translations = {
  en: {
    title: "Puerto Fjord",
    subtitle: "Adventure Retreat & Marina",
    description: "Discover unparalleled luxury in the heart of Patagonia. Nestled along pristine fjords, our five exclusive residences blend world class comfort with breathtaking views. Wake up to majestic landscapes, indulge in refined amenities, and embark on unforgettable adventures.",
    location: "Puerto Natales, Patagonia",
    bookNow: "Book Your Experience",
    viewHouses: "View Houses",
    coordinates: "51°35'32.4\"S 72°39'52.7\"W"
  },
  es: {
    title: "Puerto Fjord",
    subtitle: "Adventure Retreat & Marina",
    description: "Experimenta lujo incomparable en la naturaleza prístina de la Patagonia. Cinco casas exclusivas que ofrecen vistas impresionantes a los fiordos, amenities de clase mundial y aventuras inolvidables.",
    location: "Puerto Natales, Patagonia",
    bookNow: "Reserva tu Experiencia",
    viewHouses: "Ver Casas",
    coordinates: "51°35'32.4\"S 72°39'52.7\"W"
  }
};
export function HeroSection({
  language
}: HeroSectionProps) {
  const t = translations[language];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1);
    }, 4000); // Cambia cada 4 segundos

    return () => clearInterval(interval);
  }, []);
  const goToPrevious = () => {
    setCurrentImageIndex(prevIndex => prevIndex === 0 ? heroImages.length - 1 : prevIndex - 1);
  };
  const goToNext = () => {
    setCurrentImageIndex(prevIndex => prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1);
  };
  return <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Images with Auto-rotate */}
      <div className="absolute inset-0 w-full h-full">
        {heroImages.map((image, index) => <img key={index} src={image} alt={language === 'es' ? 'Fiordos y montañas de la Patagonia' : 'Patagonian fjords and mountains'} className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`} style={{
        objectPosition: '50% 35%'
      }} />)}
      </div>

      {/* Navigation Controls */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20">
        <Button variant="outline" size="icon" onClick={goToPrevious} className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm">
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20">
        <Button variant="outline" size="icon" onClick={goToNext} className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Image Indicators */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {heroImages.map((_, index) => <button key={index} onClick={() => setCurrentImageIndex(index)} className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentImageIndex ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/70'}`} />)}
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-[1]" style={{
      background: 'var(--gradient-hero)'
    }} />
      
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          {/* Puerto Fjord Logo */}
          <div className="mb-6">
            <img 
              src={puertoFjordLogo} 
              alt="Puerto Fjord Logo" 
              className="mx-auto h-24 md:h-32 w-auto brightness-0 invert opacity-90"
            />
          </div>
          
          {/* Location Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/20">
            <MapPin className="h-4 w-4" />
            <span className="text-sm font-medium">{t.location}</span>
          </div>
          
          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
            {t.title}
            <span className="block text-accent font-light text-4xl">{t.subtitle}</span>
          </h1>
          
          {/* Description */}
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            {t.description}
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button variant="hero" size="lg" onClick={() => document.getElementById('experiences')?.scrollIntoView({
              behavior: 'smooth'
            })} className="text-lg px-8 py-6">
              <Calendar className="h-5 w-5 mr-2" />
              {t.bookNow}
            </Button>
            <Button variant="hero" size="lg" onClick={() => document.getElementById('houses')?.scrollIntoView({
              behavior: 'smooth'
            })} className="text-lg px-8 py-6">
              {t.viewHouses}
            </Button>
          </div>
          
          {/* Coordinates */}
          <div className="text-white/70 text-sm font-mono">
            {t.coordinates}
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>;
}