import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Plane, Clock, Mountain, Waves, TreePine } from "lucide-react";
import { GoogleMap } from "@/components/GoogleMap";

interface LocationSectionProps {
  language: 'en' | 'es';
}

const translations = {
  en: {
    title: "Pristine Patagonian Location",
    subtitle: "Strategically positioned for both accessibility and complete wilderness immersion",
    coordinates: "Coordinates",
    access: "Access & Transportation",
    airport: "15 minutes from Puerto Natales Airport",
    downtown: "20 minutes to Puerto Natales downtown",
    environment: "Natural Environment",
    fjords: "Pristine Fjord Views",
    mountains: "Towering Mountain Peaks", 
    wildlife: "Abundant Patagonian Wildlife",
    privacy: "Complete Privacy & Exclusivity",
    description: "Located at the coordinates -51.592324626389164, -72.6646527857463, our retreat sits in one of Patagonia's most spectacular and pristine locations. The strategic positioning provides easy access to Puerto Natales while maintaining the isolation and exclusivity our guests seek.",
    features: [
      "Unparalleled fjord and mountain vistas",
      "Private access to untouched wilderness", 
      "World-class stargazing opportunities",
      "Sustainable luxury in harmony with nature"
    ]
  },
  es: {
    title: "Ubicación Prístina en la Patagonia",
    subtitle: "Estratégicamente posicionado para accesibilidad e inmersión completa en la naturaleza",
    coordinates: "Coordenadas",
    access: "Acceso y Transporte",
    airport: "15 minutos del Aeropuerto de Puerto Natales",
    downtown: "20 minutos al centro de Puerto Natales",
    environment: "Entorno Natural",
    fjords: "Vistas Prístinas de Fiordos",
    mountains: "Imponentes Picos Montañosos",
    wildlife: "Abundante Fauna Patagónica", 
    privacy: "Privacidad y Exclusividad Completa",
    description: "Ubicado en las coordenadas -51.592324626389164, -72.6646527857463, nuestro refugio se sitúa en una de las ubicaciones más espectaculares y prístinas de la Patagonia. El posicionamiento estratégico proporciona fácil acceso a Puerto Natales mientras mantiene el aislamiento y exclusividad que buscan nuestros huéspedes.",
    features: [
      "Vistas incomparables de fiordos y montañas",
      "Acceso privado a naturaleza virgen",
      "Oportunidades de observación estelar de clase mundial", 
      "Lujo sustentable en armonía con la naturaleza"
    ]
  }
};

export function LocationSection({ language }: LocationSectionProps) {
  const t = translations[language];

  return (
    <section id="location" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t.title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Map Placeholder & Info */}
          <div className="space-y-6">
            {/* Map */}
            <Card className="overflow-hidden shadow-card">
              <div className="relative">
                <GoogleMap language={language} />
                {/* Coordinates Badge */}
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="font-mono text-xs bg-white/90 text-foreground">
                    {t.coordinates}: -51.592°, -72.665°
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Access Information */}
            <Card className="shadow-card">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                  <Plane className="h-5 w-5 mr-2 text-primary" />
                  {t.access}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-3 text-accent" />
                    <span>{t.airport}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-3 text-accent" />
                    <span>{t.downtown}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Environment & Features */}
          <div className="space-y-6">
            {/* Description */}
            <Card className="shadow-card">
              <CardContent className="p-6">
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {t.description}
                </p>
                
                <div className="space-y-4">
                  {t.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Environment Features */}
            <Card className="shadow-card">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  {t.environment}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Waves className="h-5 w-5 text-primary" />
                    <span className="text-sm text-muted-foreground">{t.fjords}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mountain className="h-5 w-5 text-stone" />
                    <span className="text-sm text-muted-foreground">{t.mountains}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <TreePine className="h-5 w-5 text-cedar" />
                    <span className="text-sm text-muted-foreground">{t.wildlife}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-accent" />
                    <span className="text-sm text-muted-foreground">{t.privacy}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}