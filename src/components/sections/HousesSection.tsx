import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Eye, Calendar } from "lucide-react";

interface HousesSectionProps {
  language: 'en' | 'es';
}

const translations = {
  en: {
    title: "Exclusive Houses",
    subtitle: "Five unique luxury retreats, each offering distinct experiences in pristine Patagonian wilderness",
    viewDetails: "View Details",
    bookNow: "Book Now",
    guests: "guests",
    available: "Available",
    unavailable: "Booked"
  },
  es: {
    title: "Casas Exclusivas", 
    subtitle: "Cinco refugios de lujo únicos, cada uno ofreciendo experiencias distintas en la naturaleza prístina de la Patagonia",
    viewDetails: "Ver Detalles",
    bookNow: "Reservar",
    guests: "huéspedes",
    available: "Disponible",
    unavailable: "Reservada"
  }
};

const houses = [
  {
    id: "cliff-house",
    name: "The Cliff House",
    capacity: 8,
    features: {
      en: ["Ocean Views", "Private Hot Tub", "Chef's Kitchen"],
      es: ["Vistas al Océano", "Jacuzzi Privado", "Cocina de Chef"]
    },
    description: {
      en: "Perched dramatically on coastal cliffs with panoramic fjord views",
      es: "Ubicada dramáticamente en acantilados costeros con vistas panorámicas del fiordo"
    },
    available: true,
    imageId: 1
  },
  {
    id: "nest-house", 
    name: "Nest House",
    capacity: 6,
    features: {
      en: ["Tree Canopy Views", "Suspended Design", "Glass Walls"],
      es: ["Vistas del Dosel", "Diseño Suspendido", "Paredes de Cristal"]
    },
    description: {
      en: "Elevated retreat nestled among ancient trees with intimate forest views",
      es: "Refugio elevado entre árboles antiguos con vistas íntimas del bosque"
    },
    available: false,
    imageId: 2
  },
  {
    id: "fjord-house",
    name: "Fjord House", 
    capacity: 10,
    features: {
      en: ["Waterfront Access", "Private Marina", "Panoramic Deck"],
      es: ["Acceso Marítimo", "Marina Privada", "Terraza Panorámica"]
    },
    description: {
      en: "Waterfront sanctuary with direct fjord access and private boat dock",
      es: "Santuario costero con acceso directo al fiordo y muelle privado"
    },
    available: true,
    imageId: 3
  },
  {
    id: "valley-house",
    name: "The Valley House",
    capacity: 4,
    features: {
      en: ["Mountain Views", "Private Garden", "Cozy Fireplace"],
      es: ["Vistas de Montaña", "Jardín Privado", "Chimenea Acogedora"]
    },
    description: {
      en: "Intimate valley setting surrounded by towering mountain peaks",
      es: "Entorno íntimo de valle rodeado de imponentes picos montañosos"
    },
    available: true,
    imageId: 4
  },
  {
    id: "woods-house",
    name: "The Woods House",
    capacity: 6,
    features: {
      en: ["Forest Immersion", "Wildlife Viewing", "Sustainable Design"],
      es: ["Inmersión Forestal", "Observación Fauna", "Diseño Sustentable"]
    },
    description: {
      en: "Deep forest hideaway designed for complete nature immersion",
      es: "Refugio en el bosque profundo diseñado para inmersión total en la naturaleza"
    },
    available: true,
    imageId: 5
  }
];

export function HousesSection({ language }: HousesSectionProps) {
  const t = translations[language];

  return (
    <section id="houses" className="py-24 bg-muted/30">
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

        {/* Houses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {houses.map((house, index) => (
            <Card key={house.id} className="group overflow-hidden border-0 shadow-card hover:shadow-luxury transition-all duration-500 hover:scale-[1.02]">
              <div className="relative h-64 bg-gradient-to-r from-stone-light to-cedar-light overflow-hidden">
                {/* House image */}
                {house.imageId === 1 ? (
                  <img 
                    src="/lovable-uploads/658a7807-c55f-457e-bbd7-157d3cf08f66.png" 
                    alt={house.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : house.imageId === 2 ? (
                  <img 
                    src="/lovable-uploads/c5e7ccaf-ffd9-401f-bc65-d26f8c97f2b9.png" 
                    alt={house.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : house.imageId === 3 ? (
                  <img 
                    src="/lovable-uploads/5f799eb3-4541-4035-8877-a2835e042144.png" 
                    alt={house.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Eye className="h-12 w-12 mx-auto mb-2 opacity-70" />
                      <p className="text-sm opacity-80">House Image {house.imageId}</p>
                    </div>
                  </div>
                )}
                
                {/* Availability Badge */}
                <div className="absolute top-4 right-4">
                  <Badge variant={house.available ? "default" : "secondary"} className="bg-white/90 text-foreground">
                    {house.available ? t.available : t.unavailable}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {house.name}
                  </h3>
                  <div className="flex items-center text-muted-foreground">
                    <Users className="h-4 w-4 mr-1" />
                    <span className="text-sm">{house.capacity} {t.guests}</span>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {house.description[language]}
                </p>
                
                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {house.features[language].map((feature, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
                
                {/* Actions */}
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1">
                    {t.viewDetails}
                  </Button>
                  <Button 
                    className="flex-1 bg-gradient-fjord hover:opacity-90 transition-opacity"
                    disabled={!house.available}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    {t.bookNow}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}