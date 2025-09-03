import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingModal } from "@/components/BookingModal";
import { supabase } from "@/lib/supabase";
import { 
  ArrowLeft, 
  MapPin, 
  Users, 
  Bed, 
  Bath, 
  Calendar, 
  Star,
  Wifi,
  Car,
  Coffee,
  Mountain,
  Waves,
  TreePine,
  Home,
  ImageIcon
} from "lucide-react";

const translations = {
  en: {
    backToHomes: "Back to Houses",
    bookNow: "Book Now",
    guests: "guests",
    bedrooms: "bedrooms", 
    bathrooms: "bathrooms",
    available: "Available",
    unavailable: "Booked",
    overview: "Overview",
    amenities: "Amenities",
    location: "Location",
    floorPlan: "Floor Plan",
    reviews: "Reviews",
    pricePerNight: "per night",
    description: "Description",
    houseRules: "House Rules",
    checkIn: "Check-in: 3:00 PM",
    checkOut: "Check-out: 11:00 AM",
    noSmoking: "No smoking",
    noPets: "No pets allowed",
    maxGuests: "Maximum guests as specified",
    quietHours: "Quiet hours: 10 PM - 8 AM"
  },
  es: {
    backToHomes: "Volver a Casas",
    bookNow: "Reservar",
    guests: "huéspedes",
    bedrooms: "habitaciones",
    bathrooms: "baños", 
    available: "Disponible",
    unavailable: "Reservada",
    overview: "Descripción",
    amenities: "Amenidades",
    location: "Ubicación",
    floorPlan: "Plano",
    reviews: "Reseñas",
    pricePerNight: "por noche",
    description: "Descripción",
    houseRules: "Reglas de la Casa",
    checkIn: "Check-in: 3:00 PM",
    checkOut: "Check-out: 11:00 AM", 
    noSmoking: "No fumar",
    noPets: "No se permiten mascotas",
    maxGuests: "Máximo de huéspedes según especificado",
    quietHours: "Horas de silencio: 10 PM - 8 AM"
  }
};

interface Property {
  id: string;
  name: string;
  description: string;
  price_per_night: number;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
  status: string;
  address: string;
  available_for_booking: boolean;
}

const HouseDetails = () => {
  const { id } = useParams();
  const [language] = useState<'en' | 'es'>('en');
  const [selectedImage, setSelectedImage] = useState(0);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (error) throw error;
        setProperty(data);
      } catch (error) {
        console.error('Error fetching property:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);
  const t = translations[language];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">House not found</h1>
          <Link to="/">
            <Button>{t.backToHomes}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const amenityIcons = {
    'WiFi': Wifi,
    'Parking': Car,
    'Kitchen': Coffee,
    'Mountain Views': Mountain,
    'Ocean Views': Waves,
    'Forest': TreePine,
    'Hot Tub': Bath,
    'Default': Home
  };

  const getAmenityIcon = (feature: string) => {
    const IconComponent = amenityIcons[feature as keyof typeof amenityIcons] || amenityIcons.Default;
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t.backToHomes}
          </Button>
        </Link>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Images Section */}
          <div className="lg:w-2/3">
            <div className="grid grid-cols-1 gap-4">
              {/* Main Image */}
              <div className="relative h-96 bg-muted rounded-lg overflow-hidden">
                <img 
                  src={property.images?.[selectedImage] || '/placeholder.svg'} 
                  alt={property.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Thumbnail Images */}
              {property.images && property.images.length > 1 && (
                <div className="grid grid-cols-3 gap-2">
                  {property.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`h-24 bg-muted rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === index ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <img 
                        src={image} 
                        alt={`${property.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:w-1/3">
            <Card className="sticky top-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">{property.name}</CardTitle>
                  <Badge variant={property.available_for_booking ? "default" : "secondary"}>
                    {property.available_for_booking ? t.available : t.unavailable}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {property.max_guests} {t.guests}
                  </div>
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-1" />
                    {property.bedrooms} {t.bedrooms}
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-4 w-4 mr-1" />
                    {property.bathrooms} {t.bathrooms}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="text-3xl font-bold text-foreground">
                    ${property.price_per_night}
                    <span className="text-lg font-normal text-muted-foreground ml-2">
                      {t.pricePerNight}
                    </span>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-gradient-fjord hover:opacity-90 transition-opacity"
                  disabled={!property.available_for_booking}
                  onClick={() => setIsBookingModalOpen(true)}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  {t.bookNow}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">{t.overview}</TabsTrigger>
              <TabsTrigger value="amenities">{t.amenities}</TabsTrigger>
              <TabsTrigger value="location">{t.location}</TabsTrigger>
              <TabsTrigger value="floorplan">{t.floorPlan}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>{t.description}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {property.description}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>{t.houseRules}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• {t.checkIn}</li>
                      <li>• {t.checkOut}</li>
                      <li>• {t.noSmoking}</li>
                      <li>• {t.noPets}</li>
                      <li>• {t.maxGuests}</li>
                      <li>• {t.quietHours}</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="amenities" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t.amenities}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.amenities && property.amenities.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                        {getAmenityIcon(feature)}
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="location" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    {t.location}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Interactive map will be displayed here</p>
                      <p className="text-sm">{property.address}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="floorplan" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    {t.floorPlan}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative bg-muted rounded-lg overflow-hidden">
                    <img 
                      src={property.images?.[0] || '/placeholder.svg'} 
                      alt={`${property.name} floor plan`}
                      className="w-full h-auto"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        house={{
          id: property.id,
          name: property.name,
          capacity: property.max_guests,
          price: property.price_per_night
        }}
        language={language}
      />
    </div>
  );
};

export default HouseDetails;