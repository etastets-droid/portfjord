import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function OwnerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Error de autenticación",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      const user = data.user;
      if (!user) {
        toast({
          title: "Error de autenticación",
          description: "No se pudo obtener el usuario.",
          variant: "destructive"
        });
        return;
      }

      const { data: owner, error: ownerError } = await supabase
        .from("owners")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (ownerError) {
        console.error("Owner fetch error:", ownerError);
      }

      let ownerRecord = owner;
      if (!ownerRecord) {
        const meta = (user as any).user_metadata || {};
        const ownerName = meta.name ?? (user.email?.split("@")[0] ?? "Propietario");
        const ownerPhone = meta.phone ?? null;

        const { data: inserted, error: createErr } = await supabase
          .from("owners")
          .insert({
            user_id: user.id,
            name: ownerName,
            email: user.email!,
            phone: ownerPhone
          })
          .select("*")
          .single();

        if (createErr) {
          toast({
            title: "No se pudo crear tu perfil",
            description: createErr.message,
            variant: "destructive"
          });
        } else {
          ownerRecord = inserted;
        }
      }

      toast({
        title: "Bienvenido",
        description: `¡Hola ${ownerRecord?.name ?? user.email}! Has iniciado sesión exitosamente.`
      });

      navigate("/owner-portal");

    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al iniciar sesión.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: { name, phone }
        }
      });

      if (error) {
        toast({
          title: "Error de registro",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      if (data.user) {
        toast({
          title: "Registro iniciado",
          description: "Revisa tu correo para confirmar tu cuenta. Luego inicia sesión."
        });

        // Cambiar a modo login
        setIsSignUp(false);
        setName("");
        setPhone("");
      }
    } catch (error) {
      console.error("SignUp error:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al registrarte.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            {isSignUp ? "Registro Propietarios" : "Portal Propietarios"}
          </CardTitle>
          <CardDescription className="text-center">
            {isSignUp 
              ? "Crea tu cuenta para gestionar tus propiedades" 
              : "Accede a tu dashboard de gestión de propiedades"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4">
            {isSignUp && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Tu nombre completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono (opcional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+56 9 1234 5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu-email@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder={isSignUp ? "Mínimo 6 caracteres" : ""}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSignUp ? "Crear Cuenta" : "Iniciar Sesión"}
            </Button>
          </form>
          
          <div className="mt-4 space-y-2">
            <div className="text-center">
              <Button
                variant="link"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setEmail("");
                  setPassword("");
                  setName("");
                  setPhone("");
                }}
                className="text-sm"
              >
                {isSignUp 
                  ? "¿Ya tienes cuenta? Inicia sesión" 
                  : "¿No tienes cuenta? Regístrate"
                }
              </Button>
            </div>
            <div className="text-center">
              <Button
                variant="link"
                onClick={() => navigate("/")}
                className="text-sm text-muted-foreground"
              >
                ← Volver al sitio principal
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}