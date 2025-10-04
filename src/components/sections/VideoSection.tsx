interface VideoSectionProps {
  language: 'en' | 'es';
}

const translations = {
  en: {
    title: "Experience Patagonia",
    subtitle: "Watch our video to discover the magic of Puerto Fjord",
  },
  es: {
    title: "Experimenta la Patagonia",
    subtitle: "Mira nuestro video para descubrir la magia de Puerto Fjord",
  },
};

export const VideoSection = ({ language }: VideoSectionProps) => {
  const t = translations[language];
  
  return (
    <section id="video" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {t.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>
        
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-xl shadow-2xl"
            src="https://www.youtube.com/embed/YGJXwOkUP_w"
            title="Puerto Fjord Patagonia Experience"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
};
