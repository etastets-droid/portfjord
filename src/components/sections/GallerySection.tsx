import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Play, Image as ImageIcon, X } from "lucide-react";

interface GallerySectionProps {
  language: 'en' | 'es';
}

const translations = {
  en: {
    title: "Gallery",
    subtitle: "Explore the beauty of Patagonia through our lens",
    photos: "Photos",
    videos: "Videos",
    viewFull: "View Full Size",
    close: "Close",
  },
  es: {
    title: "Galería",
    subtitle: "Explora la belleza de la Patagonia a través de nuestro lente",
    photos: "Fotos",
    videos: "Videos",
    viewFull: "Ver Tamaño Completo",
    close: "Cerrar",
  }
};

const GallerySection = ({ language }: GallerySectionProps) => {
  const t = translations[language];
  const [selectedMedia, setSelectedMedia] = useState<{ type: 'image' | 'video', url: string } | null>(null);

  // Sample gallery items - replace with actual data from Supabase if needed
  const galleryItems: Array<{ type: 'image' | 'video', url: string, thumbnail: string }> = [
    { type: 'image', url: '/lovable-uploads/2d1e29bb-846b-4904-8073-1223c4c4198e.png', thumbnail: '/lovable-uploads/2d1e29bb-846b-4904-8073-1223c4c4198e.png' },
    { type: 'image', url: '/lovable-uploads/70bb7ae7-217c-4eba-91a3-45ccc3760b16.png', thumbnail: '/lovable-uploads/70bb7ae7-217c-4eba-91a3-45ccc3760b16.png' },
    { type: 'image', url: '/lovable-uploads/0aff0d40-a153-4c10-8d90-894daddd609a.png', thumbnail: '/lovable-uploads/0aff0d40-a153-4c10-8d90-894daddd609a.png' },
    { type: 'image', url: '/lovable-uploads/140fd2e0-65fc-4262-99e3-ab71f4ab1b68.png', thumbnail: '/lovable-uploads/140fd2e0-65fc-4262-99e3-ab71f4ab1b68.png' },
    { type: 'image', url: '/lovable-uploads/c09c8416-c052-4bd1-88cd-5cbb6ffadbd5.png', thumbnail: '/lovable-uploads/c09c8416-c052-4bd1-88cd-5cbb6ffadbd5.png' },
    { type: 'image', url: '/lovable-uploads/6962d84d-6c9f-4103-a0b9-a584a9149463.png', thumbnail: '/lovable-uploads/6962d84d-6c9f-4103-a0b9-a584a9149463.png' },
    { type: 'image', url: '/lovable-uploads/cb6e4cfa-f304-4f2f-b856-87a7b7ff6d75.png', thumbnail: '/lovable-uploads/cb6e4cfa-f304-4f2f-b856-87a7b7ff6d75.png' },
    { type: 'image', url: '/lovable-uploads/8f96ad03-30fd-406a-b41d-5744095159b4.png', thumbnail: '/lovable-uploads/8f96ad03-30fd-406a-b41d-5744095159b4.png' },
  ];

  return (
    <section id="gallery" className="py-24 bg-gradient-to-b from-background to-background/80">
      <div className="container px-4 mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {t.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {galleryItems.map((item, index) => (
            <Dialog key={index}>
              <DialogTrigger asChild>
                <Card className="group relative overflow-hidden cursor-pointer hover:shadow-glow transition-all duration-300 aspect-square">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                  
                  <img
                    src={item.thumbnail}
                    alt={`Gallery item ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    {item.type === 'video' ? (
                      <div className="bg-primary/90 rounded-full p-4">
                        <Play className="w-8 h-8 text-primary-foreground" />
                      </div>
                    ) : (
                      <div className="bg-primary/90 rounded-full p-4">
                        <ImageIcon className="w-8 h-8 text-primary-foreground" />
                      </div>
                    )}
                  </div>

                  <Badge 
                    variant="secondary" 
                    className="absolute top-4 right-4 z-20 bg-background/90"
                  >
                    {item.type === 'video' ? t.videos : t.photos}
                  </Badge>
                </Card>
              </DialogTrigger>
              
              <DialogContent className="max-w-5xl w-full p-0 bg-black/95 border-0">
                <div className="relative">
                  {item.type === 'image' ? (
                    <img
                      src={item.url}
                      alt={`Gallery item ${index + 1}`}
                      className="w-full h-auto max-h-[85vh] object-contain"
                    />
                  ) : (
                    <video
                      src={item.url}
                      controls
                      className="w-full h-auto max-h-[85vh]"
                      autoPlay
                    />
                  )}
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>

        {/* Optional: Carousel for featured items */}
        <div className="max-w-4xl mx-auto">
          <Carousel className="w-full">
            <CarouselContent>
              {galleryItems.slice(0, 4).map((item, index) => (
                <CarouselItem key={index}>
                  <Card className="overflow-hidden">
                    <img
                      src={item.thumbnail}
                      alt={`Featured ${index + 1}`}
                      className="w-full h-96 object-cover"
                    />
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;