import { Button } from "@/components/ui/button";
import { MapPin, Calendar } from "lucide-react";
const heroImage = "/lovable-uploads/08b74d86-2681-410b-aa81-9a19bb942530.png";

interface HeroSectionProps {
  language: 'en' | 'es';
}

const translations = {
  en: {
    title: "Luxury Adventure Retreat",
    subtitle: "in the Heart of Patagonia",
    description: "Experience unparalleled luxury in pristine Patagonian wilderness. Five exclusive houses offering breathtaking fjord views, world-class amenities, and unforgettable adventures.",
    location: "Puerto Natales, Patagonia",
    bookNow: "Book Your Experience",
    viewHouses: "View Houses",
    coordinates: "51°35'32.4\"S 72°39'52.7\"W"
  },
  es: {
    title: "Refugio de Aventura de Lujo",
    subtitle: "en el Corazón de la Patagonia",
    description: "Experimenta lujo incomparable en la naturaleza prístina de la Patagonia. Cinco casas exclusivas que ofrecen vistas impresionantes a los fiordos, amenities de clase mundial y aventuras inolvidables.",
    location: "Puerto Natales, Patagonia",
    bookNow: "Reserva tu Experiencia",
    viewHouses: "Ver Casas",
    coordinates: "51°35'32.4\"S 72°39'52.7\"W"
  }
};

export function HeroSection({ language }: HeroSectionProps) {
  const t = translations[language];

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{ 
          backgroundImage: `url(${heroImage})`,
          backgroundPosition: '50% 65%'
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          {/* Location Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/20">
            <MapPin className="h-4 w-4" />
            <span className="text-sm font-medium">{t.location}</span>
          </div>
          
          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
            {t.title}
            <span className="block text-accent font-light">{t.subtitle}</span>
          </h1>
          
          {/* Description */}
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            {t.description}
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              size="lg" 
              className="bg-gradient-fjord hover:opacity-90 transition-all duration-300 shadow-luxury text-lg px-8 py-6 rounded-lg"
            >
              <Calendar className="h-5 w-5 mr-2" />
              {t.bookNow}
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm text-lg px-8 py-6 rounded-lg transition-all duration-300"
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
    </section>
  );
}