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
      if (!id) {
        setLoading(false);
        return;
      }
      
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

  // Static floor plan mapping for each house
  const getFloorPlanImage = (propertyId: string) => {
    const floorPlanMap: { [key: string]: string } = {
      'f854966e-2dfe-42f8-a7c7-b6e9f24e91fb': '/lovable-uploads/c24e6f57-34df-4e54-a66d-f2efc64762fb.png',
      'a1b2c3d4-e5f6-7890-abcd-ef1234567890': '/lovable-uploads/e8ef856c-36ca-4f82-bfd4-0c1dbd92b574.png',
      'b2c3d4e5-f6g7-8901-bcde-f12345678901': '/lovable-uploads/5f799eb3-4541-4035-8877-a2835e042144.png',
      'c3d4e5f6-g7h8-9012-cdef-123456789012': '/lovable-uploads/7c73e2bf-2738-449d-8d1e-31c47d8bb826.png',
      'default': '/lovable-uploads/c24e6f57-34df-4e54-a66d-f2efc64762fb.png'
    };
    
    return floorPlanMap[propertyId] || floorPlanMap.default;
  };

  // Static image gallery mapping for each house
  const getHouseImages = (propertyId: string) => {
    const fjordImages: string[] = [
      '/lovable-uploads/659a3b5d-b708-40b4-b1e9-38cd5c57db7f.png',
      '/lovable-uploads/ff2919d1-55af-4a22-98a5-dde2ab8eb4ec.png',
      '/lovable-uploads/b4a8c260-828e-4b21-be2b-9190d959bf43.png',
      '/lovable-uploads/a2a1cc54-1618-482f-bf78-e1fbe3b30f42.png',
      '/lovable-uploads/b501e720-d0a3-4945-9bb8-d169d38901e5.png',
      '/lovable-uploads/82de9304-8a9f-4fb2-9075-45227e8d67b8.png',
      '/lovable-uploads/9d574bb2-45bb-4e24-a1e2-a0ebf532631b.png',
      '/lovable-uploads/f3d0cdd0-a755-49af-b716-18ad435b188e.png',
      '/lovable-uploads/a4122e07-21b1-4f05-b165-67dfef26e578.png',
      '/lovable-uploads/813a5dd0-b086-4e17-acc6-657d9c0f0560.png',
      '/lovable-uploads/9b881fa3-5578-4f76-85ec-1c5bf200f199.png',
      '/lovable-uploads/c952ac40-25cb-4843-b552-44cb3c9476e7.png',
      '/lovable-uploads/6973eb9d-c871-46a6-b6ee-bc100dc0f370.png',
      // Nuevas exteriores añadidas
      '/lovable-uploads/954746cd-b00a-4d31-b3d5-96df75b0a9f5.png',
      '/lovable-uploads/2bc8dcdb-f746-46d2-91a2-07a31f3f24ad.png',
      '/lovable-uploads/c8dd0d7f-fd4c-467f-916e-d487c9ee830a.png',
      '/lovable-uploads/d083c4c5-5043-4f7e-95d9-ed4342f016b4.png',
      // Nuevas interiores añadidas ahora
      '/lovable-uploads/9787d25e-9cc3-4e3e-8d8a-4c289f905705.png',
      '/lovable-uploads/914fa924-7ddc-48d2-b08c-5ef6cc78219b.png',
      '/lovable-uploads/0b0fde2b-8193-4136-afe5-09ac7039ca9a.png',
      '/lovable-uploads/1ea933a1-cecb-4ebc-a61c-e5cd1c003fd6.png',
      '/lovable-uploads/ef9b15ab-9362-4a44-bb31-d80ba88947d3.png',
      '/lovable-uploads/c209115e-d552-44a6-9ab7-53ca9efc814e.png',
      '/lovable-uploads/8ab3933a-00cc-41bc-aa36-d8e3a59475e1.png',
      '/lovable-uploads/caa0059c-5c02-4c1a-a16a-297f389d0346.png'
    ];

    const imageMap: { [key: string]: string[] } = {
      // Fjord House (ID conocido) y el ID de la ruta actual apuntan a la misma galería
      'f854966e-2dfe-42f8-a7c7-b6e9f24e91fb': fjordImages,
      'bd37ba86-11cd-4b70-936d-c192f6bf0b0d': fjordImages,
      '88179db7-4dc8-44ac-a623-fa48c516e8c1': [
        '/lovable-uploads/edb62099-11a5-42e4-98c5-b1d722711bc3.png',
        '/lovable-uploads/26f30d1b-66be-4751-ae27-1130fd6c5093.png',
        '/lovable-uploads/b5150852-88e3-47aa-9903-36686f21cd6e.png',
        '/lovable-uploads/fb4012a8-ce68-43ce-9d33-0210035cf1f2.png',
        '/lovable-uploads/fa190b68-4595-4eaa-a6e8-55b2c147c83f.png',
        '/lovable-uploads/04762c2f-56d0-43cc-a98d-3d83002373ea.png',
        '/lovable-uploads/dec079c6-006a-4a36-9d82-963bfe7964bb.png',
        '/lovable-uploads/d8a9c36c-7a30-4272-abfe-9296aa0b680a.png',
        '/lovable-uploads/6af8cb45-a90e-4af9-89ef-d1cc61dbd844.png',
        '/lovable-uploads/ab618131-d578-4437-82d8-1950a3ddf561.png',
        '/lovable-uploads/2d7ee075-9f9d-4826-bd4a-8ce9bdad60dd.png',
        '/lovable-uploads/70bb7ae7-217c-4eba-91a3-45ccc3760b16.png'
      ],
      'a1b2c3d4-e5f6-7890-abcd-ef1234567890': [
        '/lovable-uploads/5fccdd0b-83a4-4e3e-b3f9-bec2c5139eeb.png',
        '/lovable-uploads/63e495eb-27aa-4961-9a03-680d6a0e8b50.png',
        '/lovable-uploads/658a7807-c55f-457e-bbd7-157d3cf08f66.png',
        '/lovable-uploads/c5e7ccaf-ffd9-401f-bc65-d26f8c97f2b9.png'
      ],
      'b2c3d4e5-f6g7-8901-bcde-f12345678901': [
        '/lovable-uploads/d595f609-fd89-411c-af90-5e08d32837f3.png',
        '/lovable-uploads/e0936169-fe06-4541-83f4-a9431fd2b0ca.png',
        '/lovable-uploads/eb3c7203-9636-4aa6-96b0-b0f772fcdd04.png',
        '/lovable-uploads/f50e3bae-ea93-499e-9898-ab3a1f232536.png'
      ],
      'default': [
        '/lovable-uploads/08b74d86-2681-410b-aa81-9a19bb942530.png',
        '/lovable-uploads/09c0e326-5d72-4c1a-95d0-32513b39dfb6.png'
      ]
    };
    
    return imageMap[propertyId] || imageMap.default;
  };

  const houseImages = getHouseImages(property.id);

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
                  src={houseImages[selectedImage] || '/placeholder.svg'} 
                  alt={property.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Thumbnail Images */}
              {houseImages.length > 1 && (
                <div className="grid grid-cols-3 gap-2">
                  {houseImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`h-36 bg-muted rounded-lg overflow-hidden border-2 transition-colors ${
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
                      src={getFloorPlanImage(property.id)} 
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