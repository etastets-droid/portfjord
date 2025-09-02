import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { SidebarProvider } from "@/components/ui/sidebar";
import { OwnerSidebar } from "@/components/owner/OwnerSidebar";
import { OwnerDashboard } from "@/components/owner/OwnerDashboard";
import { useToast } from "@/hooks/use-toast";

export default function OwnerPortal() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        navigate("/owner-login");
        return;
      }

      // Check if user is registered as an owner
      const { data: owner, error: ownerError } = await supabase
        .from("owners")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (ownerError || !owner) {
        toast({
          title: "Acceso denegado",
          description: "No tienes permisos para acceder al portal de propietarios.",
          variant: "destructive"
        });
        navigate("/");
        return;
      }

      setUser(user);
    } catch (error) {
      console.error("Error checking user:", error);
      navigate("/owner-login");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <OwnerSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
        <main className="flex-1 overflow-auto">
          {activeSection === "dashboard" && <OwnerDashboard />}
          {activeSection === "reservations" && <div className="p-6">Módulo de Reservas (próximamente)</div>}
          {activeSection === "finances" && <div className="p-6">Módulo Financiero (próximamente)</div>}
          {activeSection === "messages" && <div className="p-6">Mensajería (próximamente)</div>}
          {activeSection === "contracts" && <div className="p-6">Contratos (próximamente)</div>}
        </main>
      </div>
    </SidebarProvider>
  );
}