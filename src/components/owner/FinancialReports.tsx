import { useState, useEffect } from "react";
import { TrendingUp, DollarSign, Calendar, PieChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FinancialData {
  totalRevenue: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  reservationsCount: number;
  averageBookingValue: number;
  occupancyRate: number;
}

interface MonthlyData {
  month: string;
  revenue: number;
  reservations: number;
}

export function FinancialReports() {
  const [financialData, setFinancialData] = useState<FinancialData>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    yearlyRevenue: 0,
    reservationsCount: 0,
    averageBookingValue: 0,
    occupancyRate: 0,
  });
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { toast } = useToast();

  useEffect(() => {
    loadFinancialData();
  }, [selectedYear]);

  const loadFinancialData = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data: owner } = await supabase
        .from('owners')
        .select('id')
        .eq('user_id', user.user.id)
        .single();

      if (!owner) return;

      // Get reservations data
      const { data: reservations, error } = await supabase
        .from('reservations')
        .select(`
          *,
          properties!inner (
            owner_id
          )
        `)
        .eq('properties.owner_id', owner.id)
        .in('status', ['confirmed', 'completed']);

      if (error) throw error;

      // Calculate financial metrics
      const currentYear = selectedYear;
      const currentMonth = new Date().getMonth();
      
      const yearlyReservations = reservations.filter(r => 
        new Date(r.created_at).getFullYear() === currentYear
      );
      
      const monthlyReservations = yearlyReservations.filter(r => 
        new Date(r.created_at).getMonth() === currentMonth
      );

      const totalRevenue = reservations.reduce((sum, r) => sum + Number(r.total_amount), 0);
      const yearlyRevenue = yearlyReservations.reduce((sum, r) => sum + Number(r.total_amount), 0);
      const monthlyRevenue = monthlyReservations.reduce((sum, r) => sum + Number(r.total_amount), 0);

      // Calculate monthly breakdown
      const monthlyBreakdown: MonthlyData[] = [];
      for (let month = 0; month < 12; month++) {
        const monthReservations = yearlyReservations.filter(r => 
          new Date(r.created_at).getMonth() === month
        );
        const monthRevenue = monthReservations.reduce((sum, r) => sum + Number(r.total_amount), 0);
        
        monthlyBreakdown.push({
          month: new Date(2024, month, 1).toLocaleDateString('es-ES', { month: 'short' }),
          revenue: monthRevenue,
          reservations: monthReservations.length
        });
      }

      setFinancialData({
        totalRevenue,
        monthlyRevenue,
        yearlyRevenue,
        reservationsCount: reservations.length,
        averageBookingValue: reservations.length > 0 ? totalRevenue / reservations.length : 0,
        occupancyRate: 0, // This would need more complex calculation based on available days
      });

      setMonthlyData(monthlyBreakdown);
    } catch (error) {
      console.error('Error loading financial data:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos financieros",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Cargando reportes financieros...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reportes Financieros</h1>
          <p className="text-muted-foreground">Análisis de ingresos y rentabilidad</p>
        </div>
        
        <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(Number(value))}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
            <SelectItem value="2022">2022</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financialData.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              Desde el inicio
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos {selectedYear}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financialData.yearlyRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              Este año
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio por Reserva</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financialData.averageBookingValue)}</div>
            <p className="text-xs text-muted-foreground">
              Valor promedio
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reservas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financialData.reservationsCount}</div>
            <p className="text-xs text-muted-foreground">
              Reservas confirmadas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Ingresos Mensuales {selectedYear}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyData.map((month, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="font-medium w-12">{month.month}</div>
                  <div className="text-sm text-muted-foreground">
                    {month.reservations} reservas
                  </div>
                </div>
                <div className="font-semibold">{formatCurrency(month.revenue)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Resumen del Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Ingresos del mes:</span>
                <span className="font-semibold">{formatCurrency(financialData.monthlyRevenue)}</span>
              </div>
              <div className="flex justify-between">
                <span>Reservas del mes:</span>
                <span className="font-semibold">
                  {monthlyData[new Date().getMonth()]?.reservations || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Proyección Anual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Proyección {selectedYear}:</span>
                <span className="font-semibold">
                  {formatCurrency(financialData.monthlyRevenue * 12)}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                Basado en el promedio mensual actual
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}