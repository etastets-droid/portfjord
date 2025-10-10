import { useState, useEffect } from "react";
import { Check, X, Eye, Filter, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Reservation {
  id: string;
  property_id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in: string;
  check_out: string;
  guests_count: number;
  total_amount: number;
  status: string;
  special_requests: string;
  properties: {
    name: string;
  };
}

export function ReservationsManagement() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      // Use centralized secure owner verification
      const { data: owner, error: ownerError } = await supabase
        .rpc('get_current_owner')
        .single();

      if (ownerError || !owner) return;

      // First get properties owned by this owner
      const { data: properties, error: propertiesError } = await supabase
        .from('properties')
        .select('id')
        .eq('owner_id', owner.id);

      if (propertiesError) throw propertiesError;

      const propertyIds = properties?.map(p => p.id) || [];

      if (propertyIds.length === 0) {
        setReservations([]);
        return;
      }

      // Then get reservations for those properties
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          properties (
            name
          )
        `)
        .in('property_id', propertyIds)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReservations(data || []);
    } catch (error) {
      console.error('Error loading reservations:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las reservas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateReservationStatus = async (reservationId: string, newStatus: string) => {
    try {
      if (newStatus === 'confirmed') {
        // Use the new RPC function for atomic confirmation
        const { error } = await supabase.rpc('confirm_reservation', {
          p_reservation_id: reservationId
        });

        if (error) throw error;
      } else {
        // For other status updates (like cancellation)
        const { error } = await supabase
          .from('reservations')
          .update({ status: newStatus })
          .eq('id', reservationId);

        if (error) throw error;
      }
      
      toast({
        title: "Éxito",
        description: `Reserva ${newStatus === 'confirmed' ? 'confirmada' : 'cancelada'} correctamente`
      });
      loadReservations();
    } catch (error: any) {
      console.error('Error updating reservation:', error);
      toast({
        title: "Error",
        description: `No se pudo actualizar la reserva: ${error.message || error}`,
        variant: "destructive"
      });
    }
  };

  const deleteReservation = async (reservationId: string) => {
    if (!confirm('¿Deseas eliminar esta reserva de forma permanente?')) return;
    try {
      const { error } = await supabase
        .from('reservations')
        .delete()
        .eq('id', reservationId);

      if (error) throw error;

      toast({
        title: 'Reserva eliminada',
        description: 'La reserva ha sido eliminada correctamente.'
      });
      loadReservations();
    } catch (error: any) {
      console.error('Error deleting reservation:', error);
      toast({
        title: 'Error',
        description: `No se pudo eliminar la reserva: ${error.message || error}`,
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500">Confirmada</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pendiente</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelada</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500">Completada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredReservations = reservations.filter(reservation => 
    statusFilter === "all" || reservation.status === statusFilter
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Cargando reservas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Reservas</h1>
          <p className="text-muted-foreground">Administra las reservas de tus propiedades</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="pending">Pendientes</SelectItem>
              <SelectItem value="confirmed">Confirmadas</SelectItem>
              <SelectItem value="completed">Completadas</SelectItem>
              <SelectItem value="cancelled">Canceladas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredReservations.map((reservation) => (
          <Card key={reservation.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-4">
                    <h3 className="font-semibold text-lg">{reservation.guest_name}</h3>
                    {getStatusBadge(reservation.status)}
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p><strong>Propiedad:</strong> {reservation.properties?.name}</p>
                    <p><strong>Check-in:</strong> {formatDate(reservation.check_in)} | <strong>Check-out:</strong> {formatDate(reservation.check_out)}</p>
                    <p><strong>Huéspedes:</strong> {reservation.guests_count} | <strong>Total:</strong> ${reservation.total_amount}</p>
                    <p><strong>Email:</strong> {reservation.guest_email}</p>
                    {reservation.guest_phone && <p><strong>Teléfono:</strong> {reservation.guest_phone}</p>}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" onClick={() => setSelectedReservation(reservation)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Detalles de la Reserva</DialogTitle>
                        <DialogDescription>
                          Información completa de la reserva de {reservation.guest_name}
                        </DialogDescription>
                      </DialogHeader>
                      
                      {selectedReservation && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="font-medium">Huésped</p>
                              <p className="text-sm text-muted-foreground">{selectedReservation.guest_name}</p>
                            </div>
                            <div>
                              <p className="font-medium">Estado</p>
                              {getStatusBadge(selectedReservation.status)}
                            </div>
                            <div>
                              <p className="font-medium">Check-in</p>
                              <p className="text-sm text-muted-foreground">{formatDate(selectedReservation.check_in)}</p>
                            </div>
                            <div>
                              <p className="font-medium">Check-out</p>
                              <p className="text-sm text-muted-foreground">{formatDate(selectedReservation.check_out)}</p>
                            </div>
                            <div>
                              <p className="font-medium">Huéspedes</p>
                              <p className="text-sm text-muted-foreground">{selectedReservation.guests_count}</p>
                            </div>
                            <div>
                              <p className="font-medium">Total</p>
                              <p className="text-sm text-muted-foreground">${selectedReservation.total_amount}</p>
                            </div>
                          </div>
                          
                          {selectedReservation.special_requests && (
                            <div>
                              <p className="font-medium">Solicitudes Especiales</p>
                              <p className="text-sm text-muted-foreground">{selectedReservation.special_requests}</p>
                            </div>
                          )}
                          
                          <div className="flex justify-end space-x-2">
                            {selectedReservation.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => updateReservationStatus(selectedReservation.id, 'confirmed')}
                                  className="bg-green-500 hover:bg-green-600"
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Confirmar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => updateReservationStatus(selectedReservation.id, 'cancelled')}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Cancelar
                                </Button>
                              </>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteReservation(selectedReservation.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Eliminar
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  
                  {reservation.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => updateReservationStatus(reservation.id, 'confirmed')}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredReservations.length === 0 && (
        <Card className="p-8 text-center">
          <div className="text-muted-foreground">
            <h3 className="text-lg font-medium mb-2">No hay reservas</h3>
            <p>
              {statusFilter === "all" 
                ? "Aún no tienes reservas para mostrar" 
                : `No hay reservas con estado "${statusFilter}"`
              }
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}