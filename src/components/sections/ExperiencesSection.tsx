import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Star, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ExperienceRequestModal } from "@/components/ExperienceRequestModal";
interface ExperiencesSectionProps {
  language: 'en' | 'es';
}
interface Experience {
  id: string;
  name: string;
  description: string;
  image_url: string;
  duration: string;
  difficulty_level: string;
  price_range: string;
  included_items: string[];
  updated_at?: string;
}
const translations = {
  en: {
    title: "Unforgettable Experiences",
    subtitle: "Discover the magic of Patagonia through our curated collection of authentic adventures",
    duration: "Duration",
    difficulty: "Difficulty",
    included: "Included",
    bookExperience: "Book Experience",
    tailorMade: "Request Tailor-Made Experience",
    tailorMadeSubtitle: "Create your perfect Patagonian adventure",
    loading: "Loading experiences..."
  },
  es: {
    title: "Experiencias Inolvidables",
    subtitle: "Descubre la magia de la Patagonia a través de nuestra colección de aventuras auténticas",
    duration: "Duración",
    difficulty: "Dificultad",
    included: "Incluye",
    bookExperience: "Reservar Experiencia",
    tailorMade: "Solicitar Experiencia Personalizada",
    tailorMadeSubtitle: "Crea tu aventura patagónica perfecta",
    loading: "Cargando experiencias..."
  }
};
const difficultyColors = {
  'Easy': 'bg-green-100 text-green-800 border-green-200',
  'Intermediate': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Advanced': 'bg-red-100 text-red-800 border-red-200',
  'Fácil': 'bg-green-100 text-green-800 border-green-200',
  'Intermedio': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Avanzado': 'bg-red-100 text-red-800 border-red-200'
};
export function ExperiencesSection({
  language
}: ExperiencesSectionProps) {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const t = translations[language];

  // Mapa de imágenes locales por experiencia (no depende de BD)
  const experienceImageMap: Record<string, string> = {
    // Bird Watching – Torres del Paine Full Day
    '51660a40-7675-4287-90bb-4335cf5f8500': '/lovable-uploads/140fd2e0-65fc-4262-99e3-ab71f4ab1b68.png',
    // BASE TORRES HIKE
    '0b1655cf-929c-41d4-a388-13fa725b4b6b': '/lovable-uploads/e0936169-fe06-4541-83f4-a9431fd2b0ca.png',
    // ICE HIKE Grey Glacier
    '06083852-e92d-4891-b88e-9363f3f9d451': '/lovable-uploads/f50e3bae-ea93-499e-9898-ab3a1f232536.png',
    // FRENCH VALLEY TREK
    '00a35a8c-76eb-470d-991b-98711d7ef20f': '/lovable-uploads/63e495eb-27aa-4961-9a03-680d6a0e8b50.png',
    // STAND UP PADDLE Eberhard Fjord
    'df84f147-d7df-4e76-aa71-36d24d2374b3': '/lovable-uploads/e8ef856c-36ca-4f82-bfd4-0c1dbd92b574.png',
    // Kayak Trip Eberhard Fjord Half Day (versión 1)
    '2c3b9f42-b91b-4245-8053-8de870d7b2eb': '/lovable-uploads/5292bc2e-3671-4ee1-9bca-789c2be8c56a.png',
    // Kayak Trip Eberhard Fjord Half Day (versión 2 sin archivo original) => usar imagen existente
    '696f2ae9-3bb2-4eb8-ba5d-16fa0c6c918c': '/lovable-uploads/658a7807-c55f-457e-bbd7-157d3cf08f66.png'
  };
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('experiences')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: true });
        
        if (error) {
          console.error('Supabase error:', error);
          setExperiences([]);
          setLoading(false);
          return;
        }
        
        setExperiences(data || []);
      } catch (error) {
        console.error('Error fetching experiences:', error);
        setExperiences([]);
      } finally {
        setLoading(false);
      }
    };

    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 10000); // 10 second timeout

    fetchExperiences();

    return () => clearTimeout(timeoutId);
  }, []);
  if (loading) {
    return <section id="experiences" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t.loading}</p>
          </div>
        </div>
      </section>;
  }
  return <section id="experiences" className="py-24 bg-background">
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

        {/* Experiences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {experiences.map(experience => <Card key={experience.id} className="group overflow-hidden border-0 shadow-card hover:shadow-luxury transition-all duration-500 hover:scale-[1.02]">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={failedImages[experience.id]
                    ? '/placeholder.svg'
                    : (experienceImageMap[experience.id] || '/placeholder.svg')}
                  alt={`${experience.name} - Patagonia experience`}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={() => setFailedImages(prev => ({ ...prev, [experience.id]: true }))}
                />
                <div className="absolute top-4 right-4">
                  <Badge className={`${difficultyColors[experience.difficulty_level as keyof typeof difficultyColors] || 'bg-gray-100 text-gray-800'} border`}>
                    {experience.difficulty_level}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {experience.name}
                </h3>
                
                <p className="text-muted-foreground mb-4 leading-relaxed text-sm">
                  {experience.description}
                </p>
                
                {/* Duration and Price */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-sm">{experience.duration}</span>
                  </div>
                  
                </div>
                
                {/* Included Items */}
                <div className="mb-6">
                  <p className="text-sm font-medium text-foreground mb-2">{t.included}:</p>
                  <div className="flex flex-wrap gap-1">
                    {experience.included_items.slice(0, 3).map((item, index) => <Badge key={index} variant="outline" className="text-xs">
                        {item}
                      </Badge>)}
                    {experience.included_items.length > 3 && <Badge variant="outline" className="text-xs">
                        +{experience.included_items.length - 3} more
                      </Badge>}
                  </div>
                </div>
                
                {/* Book Button */}
                <Button 
                  className="w-full bg-gradient-fjord hover:opacity-90 transition-opacity"
                  onClick={() => setIsRequestModalOpen(true)}
                >
                  <Star className="h-4 w-4 mr-2" />
                  {t.bookExperience}
                </Button>
              </CardContent>
            </Card>)}
        </div>

        {/* Tailor-Made Experience CTA */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="p-8">
              <div className="flex items-center justify-center mb-4">
                <Sparkles className="h-8 w-8 text-primary mr-3" />
                <h3 className="text-2xl font-bold text-foreground">
                  {t.tailorMade}
                </h3>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {t.tailorMadeSubtitle}
              </p>
              <Button size="lg" className="bg-gradient-fjord hover:opacity-90 transition-opacity" onClick={() => setIsRequestModalOpen(true)}>
                <Sparkles className="h-5 w-5 mr-2" />
                {t.tailorMade}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tailor-Made Experience Request Modal */}
      <ExperienceRequestModal isOpen={isRequestModalOpen} onClose={() => setIsRequestModalOpen(false)} language={language} />
    </section>;
}