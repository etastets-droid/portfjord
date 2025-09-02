import { useState, useEffect } from "react";
import { Save, User, Mail, Phone, Bell, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Separator } from "@/components/ui/separator";

interface OwnerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface NotificationSettings {
  emailReservations: boolean;
  emailMessages: boolean;
  emailPayments: boolean;
  pushNotifications: boolean;
}

export function ProfileSettings() {
  const [profile, setProfile] = useState<OwnerProfile>({
    id: "",
    name: "",
    email: "",
    phone: "",
  });
  
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailReservations: true,
    emailMessages: true,
    emailPayments: true,
    pushNotifications: false,
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data: owner, error } = await supabase
        .from('owners')
        .select('*')
        .eq('user_id', user.user.id)
        .single();

      if (error) throw error;
      
      if (owner) {
        setProfile({
          id: owner.id,
          name: owner.name,
          email: owner.email,
          phone: owner.phone || "",
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar el perfil",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('owners')
        .update({
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
        })
        .eq('id', profile.id);

      if (error) throw error;
      
      toast({
        title: "Éxito",
        description: "Perfil actualizado correctamente"
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    // In a real implementation, you'd save to a user_preferences table
    toast({
      title: "Éxito",
      description: "Configuración de notificaciones guardada"
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Cargando configuración...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configuración del Perfil</h1>
        <p className="text-muted-foreground">Gestiona tu información personal y preferencias</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Información Personal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre Completo</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                placeholder="Tu nombre completo"
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
                placeholder="tu@email.com"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => setProfile({...profile, phone: e.target.value})}
                placeholder="+54 11 1234-5678"
              />
            </div>
            
            <Button onClick={handleSaveProfile} disabled={saving} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Configuración de Notificaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-reservations" className="text-base">Nuevas Reservas</Label>
                  <p className="text-sm text-muted-foreground">Recibir emails cuando lleguen nuevas reservas</p>
                </div>
                <Switch
                  id="email-reservations"
                  checked={notifications.emailReservations}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, emailReservations: checked})
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-messages" className="text-base">Mensajes</Label>
                  <p className="text-sm text-muted-foreground">Notificaciones de nuevos mensajes de huéspedes</p>
                </div>
                <Switch
                  id="email-messages"
                  checked={notifications.emailMessages}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, emailMessages: checked})
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-payments" className="text-base">Pagos</Label>
                  <p className="text-sm text-muted-foreground">Confirmaciones de pagos recibidos</p>
                </div>
                <Switch
                  id="email-payments"
                  checked={notifications.emailPayments}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, emailPayments: checked})
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-notifications" className="text-base">Notificaciones Push</Label>
                  <p className="text-sm text-muted-foreground">Notificaciones en tiempo real en el navegador</p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={notifications.pushNotifications}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, pushNotifications: checked})
                  }
                />
              </div>
            </div>
            
            <Button onClick={handleSaveNotifications} variant="outline" className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Guardar Preferencias
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Configuración de Seguridad
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Cambiar Contraseña</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Actualiza tu contraseña para mantener tu cuenta segura
              </p>
              <Button variant="outline" size="sm">
                Cambiar Contraseña
              </Button>
            </div>
            
            <div>
              <Label>Verificación en Dos Pasos</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Agrega una capa extra de seguridad a tu cuenta
              </p>
              <Button variant="outline" size="sm">
                Configurar 2FA
              </Button>
            </div>
          </div>
          
          <Separator />
          
          <div className="bg-destructive/10 p-4 rounded-lg">
            <h4 className="font-medium text-destructive mb-2">Zona de Peligro</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Una vez que elimines tu cuenta, no podrás recuperar tus datos. Esta acción es permanente.
            </p>
            <Button variant="destructive" size="sm">
              Eliminar Cuenta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}