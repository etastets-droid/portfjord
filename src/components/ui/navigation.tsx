import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import puertoFjordLogo from "@/assets/puerto-fjord-logo.png";
interface NavigationProps {
  language: 'en' | 'es';
  onLanguageChange: (lang: 'en' | 'es') => void;
}
const translations = {
  en: {
    home: "Home",
    houses: "Houses",
    experiences: "Experiences",
    location: "Location",
    contact: "Contact",
    ownerPortal: "Owner Portal",
    bookNow: "Book Now"
  },
  es: {
    home: "Inicio",
    houses: "Casas",
    experiences: "Experiencias",
    location: "Ubicación",
    contact: "Contacto",
    ownerPortal: "Portal Propietarios",
    bookNow: "Reservar Ahora"
  }
};
export function Navigation({
  language,
  onLanguageChange
}: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const t = translations[language];

  // Detect scroll for background effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    console.log('Navigation clicked:', id, 'Current path:', location.pathname);
    setIsOpen(false);
    
    // If we're not on the home page, navigate to home with hash
    if (location.pathname !== '/') {
      console.log('Navigating to home with hash:', `/#${id}`);
      navigate(`/#${id}`);
    } else {
      // If we're on home page, just scroll to the element
      console.log('Already on home, scrolling to:', id);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        console.log('Element not found:', id);
      }
    }
  };

  return <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/80 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <button onClick={() => handleNavClick('home')} className="text-foreground hover:text-primary transition-colors">
              {t.home}
            </button>
            <button onClick={() => handleNavClick('houses')} className="text-foreground hover:text-primary transition-colors">
              {t.houses}
            </button>
            <button onClick={() => handleNavClick('experiences')} className="text-foreground hover:text-primary transition-colors">
              {t.experiences}
            </button>
            <button onClick={() => handleNavClick('location')} className="text-foreground hover:text-primary transition-colors">
              {t.location}
            </button>
            <button onClick={() => handleNavClick('contact')} className="text-foreground hover:text-primary transition-colors">
              {t.contact}
            </button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/owner-login">{t.ownerPortal}</Link>
            </Button>
          </div>

          {/* Language Selector & CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Globe className="h-4 w-4 mr-2" />
                  {language.toUpperCase()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onLanguageChange('en')}>
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onLanguageChange('es')}>
                  Español
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button className="bg-gradient-fjord hover:opacity-90 transition-opacity shadow-luxury" onClick={() => handleNavClick('houses')}>
              {t.bookNow}
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && <div className="lg:hidden py-6 px-4 bg-background/95 backdrop-blur-lg border-t border-border/50 shadow-lg animate-slide-in-right">
            <div className="flex flex-col space-y-5">
              <button onClick={() => handleNavClick('home')} className="text-foreground hover:text-primary transition-colors text-left text-lg py-2 font-medium">
                {t.home}
              </button>
              <button onClick={() => handleNavClick('houses')} className="text-foreground hover:text-primary transition-colors text-left text-lg py-2 font-medium">
                {t.houses}
              </button>
              <button onClick={() => handleNavClick('experiences')} className="text-foreground hover:text-primary transition-colors text-left text-lg py-2 font-medium">
                {t.experiences}
              </button>
              <button onClick={() => handleNavClick('location')} className="text-foreground hover:text-primary transition-colors text-left text-lg py-2 font-medium">
                {t.location}
              </button>
              <button onClick={() => handleNavClick('contact')} className="text-foreground hover:text-primary transition-colors text-left text-lg py-2 font-medium">
                {t.contact}
              </button>
              
              <div className="pt-4 border-t border-border/30 space-y-4">
                <Button variant="outline" size="lg" className="w-full justify-start" asChild>
                  <Link to="/owner-login">{t.ownerPortal}</Link>
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="lg" className="w-full justify-start">
                      <Globe className="h-5 w-5 mr-2" />
                      {language.toUpperCase()}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => onLanguageChange('en')}>
                      English
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onLanguageChange('es')}>
                      Español
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button className="w-full bg-gradient-fjord hover:opacity-90 transition-opacity shadow-luxury" size="lg" onClick={() => handleNavClick('houses')}>
                  {t.bookNow}
                </Button>
              </div>
            </div>
          </div>}
      </div>
    </nav>;
}