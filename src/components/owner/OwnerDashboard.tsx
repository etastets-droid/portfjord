import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Home, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface DashboardStats {
  totalProperties: number;
  activeReservations: number;
  monthlyIncome: number;
  pendingReservations: number;
}

export function OwnerDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    activeReservations: 0,
    monthlyIncome: 0,
    pendingReservations: 0
  });
  const [recentReservations, setRecentReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Use centralized secure owner verification
      const { data: owner, error: ownerError } = await supabase
        .rpc('get_current_owner')
        .single();

      if (ownerError || !owner) return;

      // Get properties count
      const { count: propertiesCount } = await supabase
        .from("properties")
        .select("*", { count: 'exact', head: true })
        .eq("owner_id", owner.id)
        .eq("status", "active");

      // Get active reservations
      const { count: activeReservationsCount } = await supabase
        .from("reservations")
        .select("*", { count: 'exact', head: true })
        .eq("status", "confirmed")
        .gte("check_out", new Date().toISOString().split('T')[0]);

      // Get pending reservations
      const { count: pendingReservationsCount } = await supabase
        .from("reservations")
        .select("*", { count: 'exact', head: true })
        .eq("status", "pending");

      // Monthly income calculation is not implemented yet (no financial_transactions table)
      const monthlyIncome = 0;

      // Get recent reservations
      const { data: reservations } = await supabase
        .from("reservations")
        .select(`
          *,
          properties (name)
        `)
        .order("created_at", { ascending: false })
        .limit(5);

      setStats({
        totalProperties: propertiesCount || 0,
        activeReservations: activeReservationsCount || 0,
        monthlyIncome,
        pendingReservations: pendingReservationsCount || 0
      });

      setRecentReservations(reservations || []);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      completed: "bg-blue-100 text-blue-800"
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <Badge variant="outline">Portal Propietario</Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Propiedades</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProperties}</div>
            <p className="text-xs text-muted-foreground">Propiedades activas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservas Activas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeReservations}</div>
            <p className="text-xs text-muted-foreground">Confirmadas este mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.monthlyIncome.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">USD este mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReservations}</div>
            <p className="text-xs text-muted-foreground">Reservas por aprobar</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reservations */}
      <Card>
        <CardHeader>
          <CardTitle>Reservas Recientes</CardTitle>
          <CardDescription>Las últimas reservas registradas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentReservations.length > 0 ? (
              recentReservations.map((reservation: any) => (
                <div key={reservation.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{reservation.guest_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {reservation.properties?.name} • {reservation.check_in} - {reservation.check_out}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">${reservation.total_amount}</span>
                    <Badge className={getStatusBadge(reservation.status)}>
                      {reservation.status}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No hay reservas registradas aún
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}