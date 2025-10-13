import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Navigation } from "@/components/ui/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingModal } from "@/components/BookingModal";
import { supabase } from "@/lib/supabase";
import { 
  ArrowLeft, 
  ArrowRight,
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
  ImageIcon,
  ChevronLeft,
  ChevronRight
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
  const navigate = useNavigate();
  const [language, setLanguage] = useState<'en' | 'es'>('en');
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
          <a href="/#houses">
            <Button>
              {t.backToHomes}
            </Button>
          </a>
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
      'f854966e-2dfe-42f8-a7c7-b6e9f24e91fb': '/lovable-uploads/valley-house-floorplan-new.png',
      'a1b2c3d4-e5f6-7890-abcd-ef1234567890': '/lovable-uploads/e8ef856c-36ca-4f82-bfd4-0c1dbd92b574.png',
      'b2c3d4e5-f6g7-8901-bcde-f12345678901': '/lovable-uploads/5f799eb3-4541-4035-8877-a2835e042144.png',
      'c3d4e5f6-g7h8-9012-cdef-123456789012': '/lovable-uploads/7c73e2bf-2738-449d-8d1e-31c47d8bb826.png',
      '602aa52d-547f-4ae6-8efa-e75508b47afe': '/lovable-uploads/cliff-house-floorplan.jpg',
      'bd37ba86-11cd-4b70-936d-c192f6bf0b0d': '/lovable-uploads/fjord-house-floorplan.jpg',
      '9c83de44-dbf7-4b7c-a5c0-b6934a867d81': '/lovable-uploads/woods-house-floorplan.jpg',
      'b26a2595-5958-4cb1-a8c2-f7740e3ad9c0': '/lovable-uploads/chillout-house-floorplan.jpg',
      'default': '/lovable-uploads/c24e6f57-34df-4e54-a66d-f2efc64762fb.png'
    };
    
    return floorPlanMap[propertyId] || floorPlanMap.default;
  };

  // Static image gallery mapping for each house
  const getHouseImages = (propertyId: string) => {
    const fjordImages: string[] = [
      '/lovable-uploads/dca1d4b2-f06b-4306-8227-05cfc258688e.png',
      '/lovable-uploads/2a80d552-093f-4931-82d2-df469d15a9dc.png',
      '/lovable-uploads/c9e06990-019e-41bd-a040-06cc5f7b98a8.png',
      '/lovable-uploads/4c1dab20-e27f-4f5b-883e-3941ca0be8f6.png',
      '/lovable-uploads/2d1e29bb-846b-4904-8073-1223c4c4198e.png',
      '/lovable-uploads/9ba8c519-f883-4c3f-9ade-506276899faf.png',
      '/lovable-uploads/0b5abd9d-ab6f-421c-8467-490b5f6d564f.png',
      '/lovable-uploads/ed0d3a57-a363-429e-a17a-b3be64a36abc.png',
      '/lovable-uploads/0aff0d40-a153-4c10-8d90-894daddd609a.png',
      '/lovable-uploads/ce960d92-7661-47b2-ab1c-2e464d7fcea6.png',
      '/lovable-uploads/6adcdfb8-3db6-4df1-a0a3-7c62b52fe042.png'
    ];

    // New images specifically for The Valley House
    const valleyHouseImages: string[] = [
      '/lovable-uploads/a00f0342-a6b7-4578-8a20-59d5ff9a7120.png',
      '/lovable-uploads/3c9874e6-c6da-45f9-8c15-cf4ccac7e791.png',
      '/lovable-uploads/f999e61c-9f1e-4fb5-a3d5-435bb4804fa8.png',
      '/lovable-uploads/0704c8fc-70b4-426f-b7a9-72f08c7fe02c.png',
      '/lovable-uploads/7b446477-6ac5-4262-bd91-fe932054c840.png',
      '/lovable-uploads/cb6e4cfa-f304-4f2f-b856-87a7b7ff6d75.png',
      '/lovable-uploads/0ec87913-fca2-4f0e-a043-c79ef90c8e72.png',
      '/lovable-uploads/133ae580-313a-49d1-8693-67dfc552ee5a.png',
      '/lovable-uploads/7220e1d8-c778-41b4-a333-1ecf820077f1.png',
      '/lovable-uploads/8ed02ef6-4a94-428f-aa21-fcfc7e1a15fb.png'
    ];

    // Images for The Woods House
    const woodsHouseImages: string[] = [
      '/lovable-uploads/woods-house-new.jpg',
      '/lovable-uploads/woods-house-interior-1.jpg',
      '/lovable-uploads/woods-house-interior-2.jpg'
    ];

    const imageMap: { [key: string]: string[] } = {
      // The Woods House
      '9c83de44-dbf7-4b7c-a5c0-b6934a867d81': woodsHouseImages,
      // The Valley House - now with its own specific images
      'f854966e-2dfe-42f8-a7c7-b6e9f24e91fb': valleyHouseImages,
      // Fjord House (other ID) keeps the original fjordImages
      'bd37ba86-11cd-4b70-936d-c192f6bf0b0d': fjordImages,
      // The Cliff House
      '602aa52d-547f-4ae6-8efa-e75508b47afe': [
        '/lovable-uploads/c2211a1c-9054-4e0d-b583-bda2a4342df0.png',
        '/lovable-uploads/f5f5b351-37c6-47b0-91b4-46dabb01a9fd.png',
        '/lovable-uploads/97b354fd-4261-4f82-9843-b06abd8867f6.png',
        '/lovable-uploads/c0cbb8a9-d761-473b-8d3b-fae0e46b02ea.png',
        '/lovable-uploads/71eeacf2-4845-45ea-b220-0f2d8075d9ac.png',
        '/lovable-uploads/9666142c-626b-4168-beea-1faa4d1ab619.png',
        '/lovable-uploads/e4a1c558-ea16-4c0a-98f0-f7e32e10bc8d.png'
      ],
      '88179db7-4dc8-44ac-a623-fa48c516e8c1': [
        '/lovable-uploads/94227c44-31e7-4567-8030-807e2de9b181.png',
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
        '/lovable-uploads/casa-nest-terraza.jpg'
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
      // Chill Out House
      'b26a2595-5958-4cb1-a8c2-f7740e3ad9c0': [
        '/lovable-uploads/c974ef80-9246-42d6-97c2-8066235501fb.png',
        '/lovable-uploads/ae303e6f-02ca-4ab5-876a-586e41c7a41e.png',
        '/lovable-uploads/8db2f189-b749-45f5-9e7f-96d764cc49fd.png',
        '/lovable-uploads/d12936f6-0d9a-4c46-873a-d1dc585ea9f2.png',
        '/lovable-uploads/f34914c1-7a99-437c-af7c-517fed06bd46.png',
        '/lovable-uploads/e0e46d61-9380-43ef-ba7c-22032c9b10d7.png',
        '/lovable-uploads/6962d84d-6c9f-4103-a0b9-a584a9149463.png',
        '/lovable-uploads/fec027c8-650e-4291-a83d-43719b48f7fe.png',
        '/lovable-uploads/bee68107-eae8-4858-8a8c-bd06b8c0e78c.png'
      ],
      'default': [
        '/lovable-uploads/08b74d86-2681-410b-aa81-9a19bb942530.png',
        '/lovable-uploads/09c0e326-5d72-4c1a-95d0-32513b39dfb6.png'
      ]
    };
    
    return imageMap[propertyId] || imageMap.default;
  };

  const houseImages = getHouseImages(property.id);

  const handlePreviousImage = () => {
    setSelectedImage((prev) => (prev === 0 ? houseImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev === houseImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation language={language} onLanguageChange={setLanguage} />
      {/* Header */}
      <div className="container mx-auto px-4 pt-24 pb-6">
        <a href="/#houses" className="inline-block">
          <Button 
            variant="ghost" 
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t.backToHomes}
          </Button>
        </a>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Images Section */}
          <div className="lg:w-2/3">
            <div className="grid grid-cols-1 gap-4">
              {/* Main Image */}
              <div className="relative h-[32rem] bg-muted rounded-lg overflow-hidden group">
                <img 
                  src={houseImages[selectedImage] || '/placeholder.svg'} 
                  alt={property.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation Buttons */}
                {houseImages.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm hover:bg-background/90"
                      onClick={handlePreviousImage}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm hover:bg-background/90"
                      onClick={handleNextImage}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                    
                    {/* Image Counter */}
                    <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                      {selectedImage + 1} / {houseImages.length}
                    </div>
                  </>
                )}
              </div>
              
              {/* Thumbnail Images */}
              {houseImages.length > 1 && (
                <div className="grid grid-cols-3 gap-2">
                  {houseImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`h-48 bg-muted rounded-lg overflow-hidden border-2 transition-colors ${
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
                      <li>• SHOES: We ask that you remove shoes in the house. Please use slippers.</li>
                      <li>• Other useful information can be found in the information book.</li>
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
                  {property.id === '88179db7-4dc8-44ac-a623-fa48c516e8c1' ? (
                    <div className="space-y-4">
                      <img 
                        src="/lovable-uploads/location-nest.jpg" 
                        alt="Nest House Location Map"
                        className="w-full h-auto rounded-lg"
                      />
                      <p className="text-sm text-muted-foreground">{property.address}</p>
                    </div>
                  ) : property.id === '602aa52d-547f-4ae6-8efa-e75508b47afe' ? (
                    <div className="space-y-4">
                      <img 
                        src="/lovable-uploads/location-cliff.jpg" 
                        alt="The Cliff House Location Map"
                        className="w-full h-auto rounded-lg"
                      />
                      <p className="text-sm text-muted-foreground">{property.address}</p>
                    </div>
                  ) : property.id === 'bd37ba86-11cd-4b70-936d-c192f6bf0b0d' ? (
                    <div className="space-y-4">
                      <img 
                        src="/lovable-uploads/location-fjord.jpg" 
                        alt="Fjord House Location Map"
                        className="w-full h-auto rounded-lg"
                      />
                      <p className="text-sm text-muted-foreground">{property.address}</p>
                    </div>
                  ) : property.id === 'f854966e-2dfe-42f8-a7c7-b6e9f24e91fb' ? (
                    <div className="space-y-4">
                      <img 
                        src="/lovable-uploads/location-valley.jpg" 
                        alt="The Valley House Location Map"
                        className="w-full h-auto rounded-lg"
                      />
                      <p className="text-sm text-muted-foreground">{property.address}</p>
                    </div>
                  ) : property.id === '9c83de44-dbf7-4b7c-a5c0-b6934a867d81' ? (
                    <div className="space-y-4">
                      <img 
                        src="/lovable-uploads/location-woods.jpg" 
                        alt="The Woods House Location Map"
                        className="w-full h-auto rounded-lg"
                      />
                      <p className="text-sm text-muted-foreground">{property.address}</p>
                    </div>
                  ) : property.id === 'b26a2595-5958-4cb1-a8c2-f7740e3ad9c0' ? (
                    <div className="space-y-4">
                      <img 
                        src="/lovable-uploads/location-chillout.jpg" 
                        alt="Chill Out House Location Map"
                        className="w-full h-auto rounded-lg"
                      />
                      <p className="text-sm text-muted-foreground">{property.address}</p>
                    </div>
                  ) : (
                    <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Interactive map will be displayed here</p>
                        <p className="text-sm">{property.address}</p>
                      </div>
                    </div>
                  )}
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