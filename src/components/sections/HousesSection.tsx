import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Eye, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { BookingModal } from "@/components/BookingModal";

interface HousesSectionProps {
  language: 'en' | 'es';
}

interface Property {
  id: string;
  name: string;
  name_es: string | null;
  description: string;
  description_es: string | null;
  price_per_night: number;
  max_guests: number;
  amenities: string[];
  images: string[];
  status: string;
  available_for_booking: boolean;
}

const translations = {
  en: {
    title: "Exclusive Houses",
    subtitle: "Five unique luxury retreats, and one chill out house, each offering distinct experiences in pristine Patagonian wilderness",
    viewDetails: "View Details",
    bookNow: "Book Now",
    guests: "guests",
    available: "Available",
    unavailable: "Booked",
    underConstruction: "Under Construction",
    availableFromApril: "Available from April 2026",
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
    underConstruction: "En Construcción",
    availableFromApril: "Disponible desde abril 2026",
    loading: "Cargando propiedades..."
  }
};

export function HousesSection({ language }: HousesSectionProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const t = translations[language];

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase error:', error);
          setProperties([]);
          setLoading(false);
          return;
        }
        
        // Sort properties in specific order: Nest House, The Cliff House, The Valley House, Fjord House, others, Chill Out House last
        const sortedData = (data || []).sort((a, b) => {
          const order: { [key: string]: number } = {
            "Nest House": 1,
            "The Cliff House": 2,
            "The Valley House": 3,
            "Fjord House": 4,
            "Chill Out House": 999
          };
          
          const orderA = order[a.name] || 500;
          const orderB = order[b.name] || 500;
          
          return orderA - orderB;
        });
        
        setProperties(sortedData);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 10000); // 10 second timeout

    fetchProperties();

    return () => clearTimeout(timeoutId);
  }, []);

  const handleBookNow = (property: Property) => {
    setSelectedProperty(property);
    setIsBookingModalOpen(true);
  };

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
              <Card key={property.id} className="group overflow-hidden border-0 shadow-card hover:shadow-luxury transition-all duration-500 hover:scale-[1.02] flex flex-col h-full">
                <div className="relative h-64 bg-gradient-to-r from-stone-light to-cedar-light overflow-hidden">
                  {/* Property image */}
                  {(() => {
                    // Use specific image for The Woods House
                    if (property.name === "The Woods House") {
                      return (
                        <img 
                          src="/lovable-uploads/woods-house-new.jpg" 
                          alt={property.name}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      );
                    }
                    // Use specific image for Chill Out House
                    if (property.name === "Chill Out House" || property.id === "b26a2595-5958-4cb1-a8c2-f7740e3ad9c0") {
                      return (
                        <img 
                          src="/lovable-uploads/c974ef80-9246-42d6-97c2-8066235501fb.png" 
                          alt={property.name}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      );
                    }
                    // Default behavior for other properties
                    if (property.images && property.images.length > 0) {
                      return (
                        <img 
                          src={property.images[0]} 
                          alt={property.name}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      );
                    }
                    // Fallback for properties without images
                    return (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Eye className="h-12 w-12 mx-auto mb-2 opacity-70" />
                          <p className="text-sm opacity-80">{property.name}</p>
                        </div>
                      </div>
                    );
                  })()}
                
                  {/* Availability Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge variant={property.name === "The Woods House" ? "secondary" : (property.available_for_booking ? "default" : "secondary")} className="bg-white/90 text-foreground">
                      {property.name === "The Woods House" ? t.underConstruction : (property.available_for_booking ? t.available : t.unavailable)}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-6 flex flex-col flex-grow">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {language === 'es' && property.name_es ? property.name_es : property.name}
                    </h3>
                    <div className="flex items-center text-muted-foreground">
                      <Users className="h-4 w-4 mr-1" />
                      <span className="text-sm">{property.max_guests} {t.guests}</span>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {language === 'es' && property.description_es ? property.description_es : property.description}
                    {property.name === "The Woods House" && (
                      <span className="block mt-2 text-sm font-semibold text-primary">
                        {t.availableFromApril}
                      </span>
                    )}
                  </p>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {property.amenities && property.amenities.map((amenity, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-3 mt-auto">
                    <Link to={`/house/${property.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        {t.viewDetails}
                      </Button>
                    </Link>
                    <Button 
                      className="flex-1 bg-gradient-fjord hover:opacity-90 transition-opacity"
                      disabled={!property.available_for_booking}
                      onClick={() => handleBookNow(property)}
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

      {/* Booking Modal */}
      {selectedProperty && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false);
            setSelectedProperty(null);
          }}
          house={{
            id: selectedProperty.id,
            name: selectedProperty.name,
            capacity: selectedProperty.max_guests,
            price: selectedProperty.price_per_night
          }}
          language={language}
        />
      )}
    </section>
  );
}