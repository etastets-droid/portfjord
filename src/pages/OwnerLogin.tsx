import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function OwnerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
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

      // Check if user is registered as an owner
      const { data: owner, error: ownerError } = await supabase
        .from("owners")
        .select("*")
        .eq("user_id", data.user.id)
        .single();

      if (ownerError || !owner) {
        await supabase.auth.signOut();
        toast({
          title: "Acceso denegado",
          description: "No tienes permisos para acceder al portal de propietarios.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Bienvenido",
        description: `¡Hola ${owner.name}! Has iniciado sesión exitosamente.`
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Portal Propietarios</CardTitle>
          <CardDescription className="text-center">
            Accede a tu dashboard de gestión de propiedades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Iniciar Sesión
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => navigate("/")}
              className="text-sm text-muted-foreground"
            >
              ← Volver al sitio principal
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}