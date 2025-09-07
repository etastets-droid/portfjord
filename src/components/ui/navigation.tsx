import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import puertoFjordLogo from "@/assets/puerto-fjord-logo.png";
import { Link } from "react-router-dom";
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
  const t = translations[language];

  const handleNavClick = (id: string) => {
    setIsOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
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
        {isOpen && <div className="lg:hidden py-4 border-t border-border/50">
            <div className="flex flex-col space-y-4">
              <button onClick={() => handleNavClick('home')} className="text-foreground hover:text-primary transition-colors text-left">
                {t.home}
              </button>
              <button onClick={() => handleNavClick('houses')} className="text-foreground hover:text-primary transition-colors text-left">
                {t.houses}
              </button>
              <button onClick={() => handleNavClick('experiences')} className="text-foreground hover:text-primary transition-colors text-left">
                {t.experiences}
              </button>
              <button onClick={() => handleNavClick('location')} className="text-foreground hover:text-primary transition-colors text-left">
                {t.location}
              </button>
              <button onClick={() => handleNavClick('contact')} className="text-foreground hover:text-primary transition-colors text-left">
                {t.contact}
              </button>
              <Button variant="outline" size="sm" className="self-start" asChild>
                <Link to="/owner-login">{t.ownerPortal}</Link>
              </Button>
              <div className="flex items-center space-x-2">
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
                <Button className="bg-gradient-fjord hover:opacity-90 transition-opacity" onClick={() => handleNavClick('houses')}>
                  {t.bookNow}
                </Button>
              </div>
            </div>
          </div>}
      </div>
    </nav>;
}