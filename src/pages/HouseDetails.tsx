import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingModal } from "@/components/BookingModal";
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

const housesData = {
  "cliff-house": {
    name: "The Cliff House",
    capacity: 8,
    bedrooms: 4,
    bathrooms: 3,
    price: 450,
    features: {
      en: ["Ocean Views", "Private Hot Tub", "Chef's Kitchen", "Fireplace", "WiFi", "Parking"],
      es: ["Vistas al Océano", "Jacuzzi Privado", "Cocina de Chef", "Chimenea", "WiFi", "Estacionamiento"]
    },
    description: {
      en: "Perched dramatically on coastal cliffs with panoramic fjord views. This architectural masterpiece combines luxury with nature, featuring floor-to-ceiling windows, a private hot tub overlooking the ocean, and a chef's kitchen perfect for entertaining. The house seamlessly blends modern comfort with the raw beauty of Patagonia.",
      es: "Ubicada dramáticamente en acantilados costeros con vistas panorámicas del fiordo. Esta obra maestra arquitectónica combina lujo con naturaleza, con ventanas de piso a techo, jacuzzi privado con vista al océano, y cocina de chef perfecta para entretenimiento. La casa combina perfectamente comodidad moderna con la belleza salvaje de la Patagonia."
    },
    available: true,
    images: [
      "/lovable-uploads/658a7807-c55f-457e-bbd7-157d3cf08f66.png",
      "/lovable-uploads/c5e7ccaf-ffd9-401f-bc65-d26f8c97f2b9.png",
      "/lovable-uploads/7c73e2bf-2738-449d-8d1e-31c47d8bb826.png"
    ],
    floorPlan: "/lovable-uploads/eb3c7203-9636-4aa6-96b0-b0f772fcdd04.png"
  },
  "nest-house": {
    name: "Nest House", 
    capacity: 6,
    bedrooms: 3,
    bathrooms: 2,
    price: 380,
    features: {
      en: ["Tree Canopy Views", "Suspended Design", "Glass Walls", "Eco-Friendly", "WiFi", "Hiking Trails"],
      es: ["Vistas del Dosel", "Diseño Suspendido", "Paredes de Cristal", "Eco-Amigable", "WiFi", "Senderos"]
    },
    description: {
      en: "Elevated retreat nestled among ancient trees with intimate forest views. This unique suspended structure offers an immersive nature experience while maintaining luxury comfort. Wake up to birds singing and fall asleep to the gentle rustle of leaves in this architectural marvel.",
      es: "Refugio elevado entre árboles antiguos con vistas íntimas del bosque. Esta estructura suspendida única ofrece una experiencia inmersiva en la naturaleza manteniendo comodidad de lujo. Despierta con el canto de los pájaros y duerme con el suave susurro de las hojas en esta maravilla arquitectónica."
    },
    available: false,
    images: [
      "/lovable-uploads/c5e7ccaf-ffd9-401f-bc65-d26f8c97f2b9.png",
      "/lovable-uploads/658a7807-c55f-457e-bbd7-157d3cf08f66.png"
    ],
    floorPlan: "/lovable-uploads/d595f609-fd89-411c-af90-5e08d32837f3.png"
  },
  "fjord-house": {
    name: "Fjord House",
    capacity: 10, 
    bedrooms: 5,
    bathrooms: 4,
    price: 580,
    features: {
      en: ["Waterfront Access", "Private Marina", "Panoramic Deck", "Boat Included", "WiFi", "Fishing Gear"],
      es: ["Acceso Marítimo", "Marina Privada", "Terraza Panorámica", "Bote Incluido", "WiFi", "Equipo de Pesca"]
    },
    description: {
      en: "Waterfront sanctuary with direct fjord access and private boat dock. Perfect for large groups seeking adventure and luxury. The expansive deck provides stunning sunset views while the private marina offers easy access to fjord exploration.",
      es: "Santuario costero con acceso directo al fiordo y muelle privado. Perfecto para grupos grandes que buscan aventura y lujo. La amplia terraza ofrece vistas impresionantes del atardecer mientras la marina privada permite fácil acceso a explorar el fiordo."
    },
    available: true,
    images: [
      "/lovable-uploads/7c73e2bf-2738-449d-8d1e-31c47d8bb826.png",
      "/lovable-uploads/658a7807-c55f-457e-bbd7-157d3cf08f66.png"
    ],
    floorPlan: "/lovable-uploads/5f799eb3-4541-4035-8877-a2835e042144.png"
  },
  "valley-house": {
    name: "The Valley House",
    capacity: 4,
    bedrooms: 2, 
    bathrooms: 2,
    price: 320,
    features: {
      en: ["Mountain Views", "Private Garden", "Cozy Fireplace", "Hot Tub", "WiFi", "Organic Garden"],
      es: ["Vistas de Montaña", "Jardín Privado", "Chimenea Acogedora", "Jacuzzi", "WiFi", "Jardín Orgánico"]
    },
    description: {
      en: "Intimate valley setting surrounded by towering mountain peaks. This cozy retreat offers the perfect romantic getaway with its private garden, mountain views, and intimate atmosphere. Ideal for couples seeking tranquility and natural beauty.",
      es: "Entorno íntimo de valle rodeado de imponentes picos montañosos. Este refugio acogedor ofrece la escapada romántica perfecta con su jardín privado, vistas de montaña y atmósfera íntima. Ideal para parejas que buscan tranquilidad y belleza natural."
    },
    available: true,
    images: [
      "/lovable-uploads/5fccdd0b-83a4-4e3e-b3f9-bec2c5139eeb.png",
      "/lovable-uploads/658a7807-c55f-457e-bbd7-157d3cf08f66.png"
    ],
    floorPlan: "/lovable-uploads/08b74d86-2681-410b-aa81-9a19bb942530.png"
  },
  "woods-house": {
    name: "The Woods House",
    capacity: 6,
    bedrooms: 3,
    bathrooms: 2, 
    price: 400,
    features: {
      en: ["Forest Immersion", "Wildlife Viewing", "Sustainable Design", "Solar Power", "WiFi", "Nature Trails"],
      es: ["Inmersión Forestal", "Observación Fauna", "Diseño Sustentable", "Energía Solar", "WiFi", "Senderos Naturales"]
    },
    description: {
      en: "Deep forest hideaway designed for complete nature immersion. This eco-friendly retreat runs on solar power and offers unparalleled wildlife viewing opportunities. Perfect for nature enthusiasts seeking an authentic Patagonian experience.",
      es: "Refugio en el bosque profundo diseñado para inmersión total en la naturaleza. Este refugio eco-amigable funciona con energía solar y ofrece oportunidades incomparables de observación de fauna. Perfecto para entusiastas de la naturaleza que buscan una experiencia patagónica auténtica."
    },
    available: true,
    images: [
      "/lovable-uploads/09c0e326-5d72-4c1a-95d0-32513b39dfb6.png",
      "/lovable-uploads/658a7807-c55f-457e-bbd7-157d3cf08f66.png"
    ],
    floorPlan: "/lovable-uploads/09c0e326-5d72-4c1a-95d0-32513b39dfb6.png"
  }
};

const HouseDetails = () => {
  const { id } = useParams();
  const [language] = useState<'en' | 'es'>('en'); // You can connect this to your language state
  const [selectedImage, setSelectedImage] = useState(0);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  
  const house = housesData[id as keyof typeof housesData];
  const t = translations[language];

  if (!house) {
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
                  src={house.images[selectedImage]} 
                  alt={house.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Thumbnail Images */}
              <div className="grid grid-cols-3 gap-2">
                {house.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`h-24 bg-muted rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`${house.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:w-1/3">
            <Card className="sticky top-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">{house.name}</CardTitle>
                  <Badge variant={house.available ? "default" : "secondary"}>
                    {house.available ? t.available : t.unavailable}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {house.capacity} {t.guests}
                  </div>
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-1" />
                    {house.bedrooms} {t.bedrooms}
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-4 w-4 mr-1" />
                    {house.bathrooms} {t.bathrooms}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="text-3xl font-bold text-foreground">
                    ${house.price}
                    <span className="text-lg font-normal text-muted-foreground ml-2">
                      {t.pricePerNight}
                    </span>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-gradient-fjord hover:opacity-90 transition-opacity"
                  disabled={!house.available}
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
                      {house.description[language]}
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
                    {house.features[language].map((feature, index) => (
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
                      <p className="text-sm">Puerto Natales, Patagonia, Chile</p>
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
                      src={house.floorPlan} 
                      alt={`${house.name} floor plan`}
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
          id: id || '',
          name: house.name,
          capacity: house.capacity,
          price: house.price
        }}
        language={language}
      />
    </div>
  );
};

export default HouseDetails;