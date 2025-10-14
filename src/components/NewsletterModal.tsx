import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail } from "lucide-react";

interface NewsletterModalProps {
  language?: 'en' | 'es';
}

const translations = {
  en: {
    title: "Stay Connected",
    description: "Get the latest updates about our luxury houses and exclusive experiences in Patagonia.",
    namePlaceholder: "Your name",
    emailPlaceholder: "Your email",
    submitButton: "Subscribe",
    successTitle: "Thank you!",
    successMessage: "You've been successfully subscribed to our newsletter.",
    errorTitle: "Error",
    errorMessage: "There was an error subscribing. Please try again.",
    alreadySubscribed: "This email is already subscribed."
  },
  es: {
    title: "Mantente Conectado",
    description: "Recibe las últimas novedades sobre nuestras casas de lujo y experiencias exclusivas en Patagonia.",
    namePlaceholder: "Tu nombre",
    emailPlaceholder: "Tu email",
    submitButton: "Suscribirse",
    successTitle: "¡Gracias!",
    successMessage: "Te has suscrito exitosamente a nuestro newsletter.",
    errorTitle: "Error",
    errorMessage: "Hubo un error al suscribirse. Por favor intenta de nuevo.",
    alreadySubscribed: "Este email ya está suscrito."
  }
};

export function NewsletterModal({ language = 'es' }: NewsletterModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const t = translations[language];

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      // Check if user has already subscribed (email stored in localStorage)
      const subscribedEmail = localStorage.getItem('newsletter_subscribed_email');
      
      if (subscribedEmail) {
        // Verify the email still exists in the database
        const { data, error } = await supabase
          .from('newsletter_subscribers')
          .select('email')
          .eq('email', subscribedEmail)
          .eq('status', 'active')
          .maybeSingle();
        
        if (!error && data) {
          // User is subscribed, don't show modal
          return;
        } else {
          // Email not found or inactive, remove from localStorage
          localStorage.removeItem('newsletter_subscribed_email');
        }
      }
      
      // Show modal after 15 seconds if not subscribed
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 15000);

      return () => clearTimeout(timer);
    };

    checkSubscriptionStatus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([
          {
            name: name.trim(),
            email: email.trim().toLowerCase()
          }
        ]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: t.errorTitle,
            description: t.alreadySubscribed,
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: t.successTitle,
          description: t.successMessage,
        });
        
        // Save subscribed email to prevent showing modal again
        localStorage.setItem('newsletter_subscribed_email', email.trim().toLowerCase());
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      toast({
        title: t.errorTitle,
        description: t.errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Just close the modal without marking as seen
    // This allows it to show again on next visit until user subscribes
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">{t.title}</DialogTitle>
          <DialogDescription className="text-center">
            {t.description}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Input
              type="text"
              placeholder={t.namePlaceholder}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          <div>
            <Input
              type="email"
              placeholder={t.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "..." : t.submitButton}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}