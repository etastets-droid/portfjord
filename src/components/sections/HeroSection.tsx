import { Button } from "@/components/ui/button";
import { MapPin, Calendar } from "lucide-react";
import { FjordLogo } from "@/components/ui/FjordLogo";
import { useEffect, useState } from "react";

const heroImages = [
  "/lovable-uploads/d595f609-fd89-411c-af90-5e08d32837f3.png",
  "/lovable-uploads/26f30d1b-66be-4751-ae27-1130fd6c5093.png",
  "/lovable-uploads/94227c44-31e7-4567-8030-807e2de9b181.png",
  "/lovable-uploads/c974ef80-9246-42d6-97c2-8066235501fb.png",
  "/lovable-uploads/ae303e6f-02ca-4ab5-876a-586e41c7a41e.png",
  "/lovable-uploads/f9185dfa-cad9-420e-bd1b-745546600b19.png",
  "/lovable-uploads/b45a7ffb-5864-40af-8f0c-c768df53b37b.png",
  "/lovable-uploads/1b9dee42-9805-44e8-aad1-501abeb15a41.png",
  "/lovable-uploads/d72b8862-868b-4ff7-a778-2fa079c15e3a.png"
];
interface HeroSectionProps {
  language: 'en' | 'es';
}
const translations = {
  en: {
    title: "Puerto Fjord",
    subtitle: "Adventure Retreat & Marina",
    description: "Experience unparalleled luxury in pristine Patagonian wilderness. Five exclusive houses offering breathtaking fjord views, world-class amenities, and unforgettable adventures.",
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
      setCurrentImageIndex((prevIndex) => {
        // Se detiene después de mostrar todas las imágenes una vez
        if (prevIndex === heroImages.length - 1) {
          return prevIndex; // Se queda en la última imagen
        }
        return prevIndex + 1;
      });
    }, 4000); // Cambia cada 4 segundos

    return () => clearInterval(interval);
  }, []);

  return <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Images with Auto-rotate */}
      <div className="absolute inset-0 w-full h-full">
        {heroImages.map((image, index) => (
          <img 
            key={index}
            src={image} 
            alt={language === 'es' ? 'Fiordos y montañas de la Patagonia' : 'Patagonian fjords and mountains'} 
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ objectPosition: '50% 35%' }}
          />
        ))}
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
            <div className="transform scale-x-150">
              <FjordLogo className="text-white mx-auto" size={120} />
            </div>
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
            <Button size="lg" className="bg-gradient-fjord hover:opacity-90 transition-all duration-300 shadow-luxury text-lg px-8 py-6 rounded-lg">
              <Calendar className="h-5 w-5 mr-2" />
              {t.bookNow}
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white/50 backdrop-blur-sm text-lg px-8 py-6 transition-all duration-300 hover:border-white text-slate-400 rounded-sm bg-black/[0.09]"
              onClick={() => document.getElementById('houses')?.scrollIntoView({ behavior: 'smooth' })}
            >
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