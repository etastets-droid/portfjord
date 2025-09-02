import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface Reservation {
  id: string;
  property_id: string;
  guest_name: string;
  check_in: string;
  check_out: string;
  status: string;
  properties: {
    name: string;
  };
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  reservations: Reservation[];
}

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadReservations();
  }, [currentDate]);

  const loadReservations = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data: owner } = await supabase
        .from('owners')
        .select('id')
        .eq('user_id', user.user.id)
        .single();

      if (!owner) return;

      // Get reservations for the current month and adjacent months
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0);

      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          properties (
            name
          )
        `)
        .eq('properties.owner_id', owner.id)
        .gte('check_in', startOfMonth.toISOString().split('T')[0])
        .lte('check_out', endOfMonth.toISOString().split('T')[0]);

      if (error) throw error;
      setReservations(data || []);
    } catch (error) {
      console.error('Error loading reservations:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las reservas del calendario",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days: CalendarDay[] = [];
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 41); // 6 weeks
    
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const dayReservations = reservations.filter(reservation => {
        const checkIn = new Date(reservation.check_in);
        const checkOut = new Date(reservation.check_out);
        const currentDay = new Date(date);
        
        return currentDay >= checkIn && currentDay <= checkOut;
      });
      
      days.push({
        date: new Date(date),
        isCurrentMonth: date.getMonth() === month,
        reservations: dayReservations
      });
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('es-ES', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const days = getDaysInMonth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Cargando calendario...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calendario de Reservas</h1>
          <p className="text-muted-foreground">Vista general de las reservas por fecha</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2" />
              {formatMonthYear(currentDate)}
            </CardTitle>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date())}
              >
                Hoy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {/* Day headers */}
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
              <div key={day} className="p-2 text-center font-medium text-muted-foreground">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {days.map((day, index) => (
              <div
                key={index}
                className={`min-h-24 p-1 border rounded-lg ${
                  day.isCurrentMonth 
                    ? 'border-border' 
                    : 'border-muted bg-muted/30'
                } ${
                  day.date.toDateString() === new Date().toDateString()
                    ? 'bg-primary/10 border-primary'
                    : ''
                }`}
              >
                <div className={`text-sm font-medium ${
                  day.isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {day.date.getDate()}
                </div>
                
                <div className="space-y-1 mt-1">
                  {day.reservations.slice(0, 2).map((reservation) => (
                    <div
                      key={reservation.id}
                      className={`text-xs p-1 rounded truncate ${getStatusColor(reservation.status)}`}
                      title={`${reservation.guest_name} - ${reservation.properties?.name}`}
                    >
                      {reservation.guest_name}
                    </div>
                  ))}
                  {day.reservations.length > 2 && (
                    <div className="text-xs text-muted-foreground">
                      +{day.reservations.length - 2} más
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Leyenda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-100 border rounded"></div>
              <span className="text-sm">Confirmada</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-100 border rounded"></div>
              <span className="text-sm">Pendiente</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-100 border rounded"></div>
              <span className="text-sm">Completada</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-100 border rounded"></div>
              <span className="text-sm">Cancelada</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}