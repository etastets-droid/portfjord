import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
interface ContactSectionProps {
  language: 'en' | 'es';
}
const translations = {
  en: {
    title: "Get in Touch",
    subtitle: "Ready to experience luxury in Patagonia? Contact us to plan your perfect retreat.",
    form: {
      name: "Full Name",
      email: "Email Address",
      phone: "Phone Number",
      inquiry: "Inquiry Type",
      inquiryOptions: {
        reservation: "House Reservation",
        owner: "Owner Portal Access",
        general: "General Information",
        partnership: "Partnership Opportunities"
      },
      message: "Message",
      messagePlaceholder: "Tell us about your ideal Patagonian experience...",
      send: "Send Message",
      sending: "Sending..."
    },
    contact: {
      title: "Contact Information",
      email: "gustavo@puertofjord.com",
      phone: "+56 999 447 999",
      address: "Puerto Natales, Patagonia, Chile"
    },
    success: "Message sent successfully! We'll get back to you within 24 hours.",
    error: "Error sending message. Please try again."
  },
  es: {
    title: "Ponte en Contacto",
    subtitle: "¿Listo para experimentar el lujo en la Patagonia? Contáctanos para planear tu refugio perfecto.",
    form: {
      name: "Nombre Completo",
      email: "Dirección de Email",
      phone: "Número de Teléfono",
      inquiry: "Tipo de Consulta",
      inquiryOptions: {
        reservation: "Reserva de Casa",
        owner: "Acceso Portal Propietarios",
        general: "Información General",
        partnership: "Oportunidades de Asociación"
      },
      message: "Mensaje",
      messagePlaceholder: "Cuéntanos sobre tu experiencia patagónica ideal...",
      send: "Enviar Mensaje",
      sending: "Enviando..."
    },
    contact: {
      title: "Información de Contacto",
      email: "gustavo@puertofjord.com",
      phone: "+56 999 447 999",
      address: "Puerto Natales, Patagonia, Chile"
    },
    success: "¡Mensaje enviado exitosamente! Te responderemos dentro de 24 horas.",
    error: "Error al enviar el mensaje. Por favor intenta de nuevo."
  }
};
export function ContactSection({
  language
}: ContactSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "",
    message: ""
  });
  const {
    toast
  } = useToast();
  const t = translations[language];
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Success",
        description: t.success
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        inquiryType: "",
        message: ""
      });
    } catch (error) {
      toast({
        title: "Error",
        description: t.error,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  return <section id="contact" className="py-24 bg-muted/30">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-luxury border-0">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t.form.name}</Label>
                      <Input id="name" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} required className="border-border/50 focus:border-primary" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t.form.email}</Label>
                      <Input id="email" type="email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} required className="border-border/50 focus:border-primary" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t.form.phone}</Label>
                      <Input id="phone" type="tel" value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} className="border-border/50 focus:border-primary" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inquiry">{t.form.inquiry}</Label>
                      <Select value={formData.inquiryType} onValueChange={value => handleInputChange('inquiryType', value)}>
                        <SelectTrigger className="border-border/50 focus:border-primary">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="reservation">{t.form.inquiryOptions.reservation}</SelectItem>
                          <SelectItem value="owner">{t.form.inquiryOptions.owner}</SelectItem>
                          <SelectItem value="general">{t.form.inquiryOptions.general}</SelectItem>
                          <SelectItem value="partnership">{t.form.inquiryOptions.partnership}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">{t.form.message}</Label>
                    <Textarea id="message" value={formData.message} onChange={e => handleInputChange('message', e.target.value)} placeholder={t.form.messagePlaceholder} className="min-h-32 border-border/50 focus:border-primary resize-none" required />
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-fjord hover:opacity-90 transition-opacity shadow-luxury text-lg py-6">
                    <Send className="h-5 w-5 mr-2" />
                    {isSubmitting ? t.form.sending : t.form.send}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-xl text-foreground">
                  {t.contact.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Email</p>
                    <p className="text-muted-foreground">{t.contact.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Phone</p>
                    <p className="text-muted-foreground">{t.contact.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Location</p>
                    <p className="text-muted-foreground">{t.contact.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA Card */}
            <Card className="bg-gradient-fjord text-white shadow-luxury border-0">
              
            </Card>
          </div>
        </div>
      </div>
    </section>;
}