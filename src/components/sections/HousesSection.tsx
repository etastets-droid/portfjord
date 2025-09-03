import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Eye, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";

interface HousesSectionProps {
  language: 'en' | 'es';
}

interface Property {
  id: string;
  name: string;
  description: string;
  price_per_night: number;
  max_guests: number;
  amenities: string[];
  images: string[];
  status: string;
}

const translations = {
  en: {
    title: "Exclusive Houses",
    subtitle: "Five unique luxury retreats, each offering distinct experiences in pristine Patagonian wilderness",
    viewDetails: "View Details",
    bookNow: "Book Now",
    guests: "guests",
    available: "Available",
    unavailable: "Booked",
    loading: "Loading properties..."
  },
  es: {
    title: "Casas Exclusivas", 
    subtitle: "Cinco refugios de lujo únicos, cada uno ofreciendo experiencias distintas en la naturaleza prístina de la Patagonia",
    viewDetails: "Ver Detalles",
    bookNow: "Reservar",
    guests: "huéspedes",
    available: "Disponible",
    unavailable: "Reservada",
    loading: "Cargando propiedades..."
  }
};

export function HousesSection({ language }: HousesSectionProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const t = translations[language];

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) throw error;
        setProperties(data || []);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

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

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t.loading}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {properties.map((property) => (
              <Card key={property.id} className="group overflow-hidden border-0 shadow-card hover:shadow-luxury transition-all duration-500 hover:scale-[1.02]">
                <div className="relative h-64 bg-gradient-to-r from-stone-light to-cedar-light overflow-hidden">
                  {/* Property image */}
                  {property.images && property.images.length > 0 ? (
                    <img 
                      src={property.images[0]} 
                      alt={property.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Eye className="h-12 w-12 mx-auto mb-2 opacity-70" />
                        <p className="text-sm opacity-80">{property.name}</p>
                      </div>
                    </div>
                  )}
                
                  {/* Availability Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge variant={property.status === 'active' ? "default" : "secondary"} className="bg-white/90 text-foreground">
                      {property.status === 'active' ? t.available : t.unavailable}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {property.name}
                    </h3>
                    <div className="flex items-center text-muted-foreground">
                      <Users className="h-4 w-4 mr-1" />
                      <span className="text-sm">{property.max_guests} {t.guests}</span>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {property.description}
                  </p>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {property.amenities && property.amenities.slice(0, 3).map((amenity, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-3">
                    <Link to={`/house/${property.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        {t.viewDetails}
                      </Button>
                    </Link>
                    <Button 
                      className="flex-1 bg-gradient-fjord hover:opacity-90 transition-opacity"
                      disabled={property.status !== 'active'}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      {t.bookNow}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}