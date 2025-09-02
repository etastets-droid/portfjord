import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Database, Settings } from "lucide-react";

export default function OwnerPortal() {
  const [showInstructions, setShowInstructions] = useState(true);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Portal de Propietarios
          </h1>
          <p className="text-xl text-muted-foreground">
            Sistema de gestión para propiedades en Patagonia
          </p>
        </div>

        {showInstructions && (
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Configuración Requerida:</strong> Para usar el portal de propietarios, 
              necesitas configurar la integración de Supabase correctamente.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Setup Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Pasos de Configuración
              </CardTitle>
              <CardDescription>
                Sigue estos pasos para activar el portal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                    1
                  </span>
                  <div>
                    <p className="font-medium">Conectar Supabase</p>
                    <p className="text-sm text-muted-foreground">
                      Haz clic en el botón verde de Supabase en la esquina superior derecha
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                    2
                  </span>
                  <div>
                    <p className="font-medium">Configurar Base de Datos</p>
                    <p className="text-sm text-muted-foreground">
                      Ejecutar las migraciones SQL para crear las tablas necesarias
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                    3
                  </span>
                  <div>
                    <p className="font-medium">Crear Usuarios</p>
                    <p className="text-sm text-muted-foreground">
                      Agregar propietarios y propiedades de ejemplo
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Funcionalidades del Portal
              </CardTitle>
              <CardDescription>
                Lo que podrás gestionar una vez configurado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Dashboard con métricas en tiempo real</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Gestión de reservas y calendario</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Control financiero e ingresos</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Sistema de mensajería interna</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Gestión de contratos</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SQL Migration Code */}
        <Card>
          <CardHeader>
            <CardTitle>Script SQL para la Base de Datos</CardTitle>
            <CardDescription>
              Ejecuta este script en tu panel de Supabase para crear las tablas necesarias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg overflow-x-auto">
              <pre className="text-sm">
{`-- Create owners table
CREATE TABLE public.owners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create properties table  
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES public.owners(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  max_guests INTEGER DEFAULT 1,
  price_per_night DECIMAL(10,2),
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create reservations table
CREATE TABLE public.reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  total_amount DECIMAL(10,2),
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "owners_own_data" ON public.owners
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "owners_own_properties" ON public.properties
  FOR ALL USING (
    owner_id IN (
      SELECT id FROM public.owners WHERE user_id = auth.uid()
    )
  );`}
              </pre>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button onClick={() => window.location.href = "/"} variant="outline">
            ← Volver al Sitio Principal
          </Button>
        </div>
      </div>
    </div>
  );
}