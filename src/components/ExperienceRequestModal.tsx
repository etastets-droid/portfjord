import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

interface ExperienceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'es';
}

const experienceRequestSchema = z.object({
  guest_name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  guest_email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  guest_phone: z.string().trim().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format").optional().or(z.literal("")),
  experience_type: z.string().min(1, "Experience type is required").max(100, "Experience type must be less than 100 characters"),
  preferred_dates: z.string().max(200, "Preferred dates must be less than 200 characters").optional(),
  special_requirements: z.string().max(2000, "Special requirements must be less than 2000 characters").optional(),
  message: z.string().max(2000, "Message must be less than 2000 characters").optional(),
  group_size: z.number().min(1, "At least 1 person required").max(50, "Maximum 50 people allowed"),
});

const translations = {
  en: {
    title: "Request Your Tailor-Made Experience",
    guestName: "Full Name",
    guestEmail: "Email Address",
    guestPhone: "Phone Number",
    experienceType: "Type of Experience",
    groupSize: "Group Size",
    preferredDates: "Preferred Dates",
    specialRequirements: "Special Requirements",
    message: "Additional Message",
    messagePlaceholder: "Tell us about your perfect Patagonian adventure...",
    submit: "Send Request",
    cancel: "Cancel",
    selectExperience: "Select experience type",
    experienceTypes: {
      adventure: "Adventure & Trekking",
      wildlife: "Wildlife & Nature",
      cultural: "Cultural Immersion",
      photography: "Photography Tour",
      luxury: "Luxury Experience",
      family: "Family Adventure",
      custom: "Custom Experience"
    },
    requestSuccess: "Your experience request has been sent! We'll contact you soon.",
    requestError: "Error sending request. Please try again.",
    requiredFields: "Please fill in all required fields."
  },
  es: {
    title: "Solicita tu Experiencia Personalizada",
    guestName: "Nombre Completo",
    guestEmail: "Dirección de Email",
    guestPhone: "Número de Teléfono",
    experienceType: "Tipo de Experiencia",
    groupSize: "Tamaño del Grupo",
    preferredDates: "Fechas Preferidas",
    specialRequirements: "Requerimientos Especiales",
    message: "Mensaje Adicional",
    messagePlaceholder: "Cuéntanos sobre tu aventura patagónica perfecta...",
    submit: "Enviar Solicitud",
    cancel: "Cancelar",
    selectExperience: "Selecciona tipo de experiencia",
    experienceTypes: {
      adventure: "Aventura y Trekking",
      wildlife: "Vida Silvestre y Naturaleza",
      cultural: "Inmersión Cultural",
      photography: "Tour Fotográfico",
      luxury: "Experiencia de Lujo",
      family: "Aventura Familiar",
      custom: "Experiencia Personalizada"
    },
    requestSuccess: "¡Tu solicitud de experiencia ha sido enviada! Te contactaremos pronto.",
    requestError: "Error al enviar la solicitud. Inténtalo de nuevo.",
    requiredFields: "Por favor completa todos los campos requeridos."
  }
};

export function ExperienceRequestModal({ isOpen, onClose, language }: ExperienceRequestModalProps) {
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [experienceType, setExperienceType] = useState("");
  const [groupSize, setGroupSize] = useState("");
  const [preferredDates, setPreferredDates] = useState("");
  const [specialRequirements, setSpecialRequirements] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  const t = translations[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data with zod schema
    try {
      experienceRequestSchema.parse({
        guest_name: guestName,
        guest_email: guestEmail,
        guest_phone: guestPhone || "",
        experience_type: experienceType,
        preferred_dates: preferredDates || "",
        special_requirements: specialRequirements || "",
        message: message || "",
        group_size: parseInt(groupSize) || 1,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
        return;
      }
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('experience_requests')
        .insert({
          guest_name: guestName,
          guest_email: guestEmail,
          guest_phone: guestPhone || null,
          experience_type: experienceType,
          group_size: parseInt(groupSize),
          preferred_dates: preferredDates || null,
          special_requirements: specialRequirements || null,
          message: message || null,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: t.requestSuccess,
      });

      // Reset form and close modal
      setGuestName("");
      setGuestEmail("");
      setGuestPhone("");
      setExperienceType("");
      setGroupSize("");
      setPreferredDates("");
      setSpecialRequirements("");
      setMessage("");
      onClose();

    } catch (error) {
      console.error('Experience request error:', error);
      toast({
        title: "Error",
        description: t.requestError,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center">
            <Sparkles className="h-6 w-6 mr-2 text-primary" />
            {t.title}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Guest Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t.guestName} *</Label>
              <Input
                id="name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t.guestEmail} *</Label>
              <Input
                id="email"
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{t.guestPhone}</Label>
            <Input
              id="phone"
              type="tel"
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
            />
          </div>

          {/* Experience Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="experience-type">{t.experienceType} *</Label>
              <Select value={experienceType} onValueChange={setExperienceType}>
                <SelectTrigger>
                  <SelectValue placeholder={t.selectExperience} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="adventure">{t.experienceTypes.adventure}</SelectItem>
                  <SelectItem value="wildlife">{t.experienceTypes.wildlife}</SelectItem>
                  <SelectItem value="cultural">{t.experienceTypes.cultural}</SelectItem>
                  <SelectItem value="photography">{t.experienceTypes.photography}</SelectItem>
                  <SelectItem value="luxury">{t.experienceTypes.luxury}</SelectItem>
                  <SelectItem value="family">{t.experienceTypes.family}</SelectItem>
                  <SelectItem value="custom">{t.experienceTypes.custom}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="group-size">{t.groupSize} *</Label>
              <Input
                id="group-size"
                type="number"
                min="1"
                max="20"
                value={groupSize}
                onChange={(e) => setGroupSize(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dates">{t.preferredDates}</Label>
            <Input
              id="dates"
              placeholder="e.g., December 2024 or specific dates"
              value={preferredDates}
              onChange={(e) => setPreferredDates(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">{t.specialRequirements}</Label>
            <Textarea
              id="requirements"
              placeholder="Dietary restrictions, accessibility needs, etc."
              value={specialRequirements}
              onChange={(e) => setSpecialRequirements(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">{t.message}</Label>
            <Textarea
              id="message"
              placeholder={t.messagePlaceholder}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              {t.cancel}
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-fjord hover:opacity-90"
            >
              {isLoading ? "..." : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  {t.submit}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}