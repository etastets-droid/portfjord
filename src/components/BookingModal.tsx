import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Users, X } from "lucide-react";
import { format, differenceInDays, parseISO, isWithinInterval } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface Reservation {
  check_in: string;
  check_out: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  house: {
    id: string;
    name: string;
    capacity: number;
    price: number;
  };
  language: 'en' | 'es';
}

const translations = {
  en: {
    bookingTitle: "Book Your Stay",
    checkIn: "Check-in Date",
    checkOut: "Check-out Date",
    guests: "Number of Guests",
    guestName: "Full Name",
    guestEmail: "Email Address",
    guestPhone: "Phone Number",
    specialRequests: "Special Requests",
    specialRequestsPlaceholder: "Any special requirements or requests...",
    pricePerNight: "per night",
    totalNights: "nights",
    totalPrice: "Total Price",
    confirmBooking: "Confirm Booking",
    cancel: "Cancel",
    selectCheckIn: "Select check-in date",
    selectCheckOut: "Select check-out date",
    bookingSuccess: "Booking confirmed! We'll contact you soon.",
    bookingError: "Error creating booking. Please try again.",
    requiredFields: "Please fill in all required fields and select dates.",
    invalidDates: "Check-out date must be after check-in date.",
    maxGuestsError: "Maximum guests exceeded for this property."
  },
  es: {
    bookingTitle: "Reservar tu Estadía",
    checkIn: "Fecha de Entrada",
    checkOut: "Fecha de Salida",
    guests: "Número de Huéspedes",
    guestName: "Nombre Completo",
    guestEmail: "Dirección de Email",
    guestPhone: "Número de Teléfono",
    specialRequests: "Solicitudes Especiales",
    specialRequestsPlaceholder: "Cualquier requerimiento o solicitud especial...",
    pricePerNight: "por noche",
    totalNights: "noches",
    totalPrice: "Precio Total",
    confirmBooking: "Confirmar Reserva",
    cancel: "Cancelar",
    selectCheckIn: "Seleccionar fecha de entrada",
    selectCheckOut: "Seleccionar fecha de salida",
    bookingSuccess: "¡Reserva confirmada! Te contactaremos pronto.",
    bookingError: "Error al crear la reserva. Inténtalo de nuevo.",
    requiredFields: "Por favor completa todos los campos requeridos y selecciona las fechas.",
    invalidDates: "La fecha de salida debe ser posterior a la fecha de entrada.",
    maxGuestsError: "Número máximo de huéspedes excedido para esta propiedad."
  }
};

export function BookingModal({ isOpen, onClose, house, language }: BookingModalProps) {
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guestsCount, setGuestsCount] = useState(1);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [existingReservations, setExistingReservations] = useState<Reservation[]>([]);
  
  const { toast } = useToast();
  const t = translations[language];

  // Load existing reservations when modal opens
  useEffect(() => {
    if (isOpen && house.id) {
      const fetchReservations = async () => {
        try {
          const { data, error } = await supabase
            .from('reservations')
            .select('check_in, check_out')
            .eq('property_id', house.id)
            .in('status', ['confirmed', 'pending']); // Include pending reservations too

          if (error) throw error;
          setExistingReservations(data || []);
        } catch (error) {
          console.error('Error fetching reservations:', error);
        }
      };

      fetchReservations();
    }
  }, [isOpen, house.id]);

  // Function to check if a date is disabled (already booked)
  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Disable past dates
    if (date < today) return true;

    // Check if date falls within any existing reservation
    return existingReservations.some(reservation => {
      const checkInDate = parseISO(reservation.check_in);
      const checkOutDate = parseISO(reservation.check_out);
      
      return isWithinInterval(date, {
        start: checkInDate,
        end: checkOutDate
      });
    });
  };

  // Validate date range doesn't conflict with existing reservations
  const validateDateRange = (start: Date, end: Date) => {
    return existingReservations.some(reservation => {
      const reservationStart = parseISO(reservation.check_in);
      const reservationEnd = parseISO(reservation.check_out);
      
      // Check for any overlap
      return (start < reservationEnd && end > reservationStart);
    });
  };

  const totalNights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;
  const totalAmount = totalNights * house.price;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!checkIn || !checkOut || !guestName || !guestEmail) {
      toast({
        title: "Error",
        description: t.requiredFields,
        variant: "destructive",
      });
      return;
    }

    if (checkOut <= checkIn) {
      toast({
        title: "Error", 
        description: t.invalidDates,
        variant: "destructive",
      });
      return;
    }

    // Validate date range doesn't conflict with existing reservations
    if (validateDateRange(checkIn, checkOut)) {
      toast({
        title: "Error",
        description: "Las fechas seleccionadas ya están reservadas. Por favor selecciona otras fechas.",
        variant: "destructive",
      });
      return;
    }

    if (guestsCount > house.capacity) {
      toast({
        title: "Error",
        description: t.maxGuestsError,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('reservations')
        .insert({
          property_id: house.id,
          check_in: format(checkIn, 'yyyy-MM-dd'),
          check_out: format(checkOut, 'yyyy-MM-dd'),
          guests_count: guestsCount,
          guest_name: guestName,
          guest_email: guestEmail,
          guest_phone: guestPhone || null,
          special_requests: specialRequests || null,
          total_amount: totalAmount,
          status: 'pending',
          payment_status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: t.bookingSuccess,
      });

      // Reset form and close modal
      setCheckIn(undefined);
      setCheckOut(undefined);
      setGuestsCount(1);
      setGuestName("");
      setGuestEmail("");
      setGuestPhone("");
      setSpecialRequests("");
      onClose();

    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Error",
        description: t.bookingError,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {t.bookingTitle} - {house.name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="checkin">{t.checkIn}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !checkIn && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkIn ? format(checkIn, "PPP") : t.selectCheckIn}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={checkIn}
                    onSelect={setCheckIn}
                    disabled={isDateDisabled}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="checkout">{t.checkOut}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !checkOut && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkOut ? format(checkOut, "PPP") : t.selectCheckOut}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={checkOut}
                    onSelect={setCheckOut}
                    disabled={(date) => {
                      if (!checkIn) return isDateDisabled(date);
                      return date <= checkIn || isDateDisabled(date);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Guests */}
          <div className="space-y-2">
            <Label htmlFor="guests">{t.guests}</Label>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <Input
                id="guests"
                type="number"
                min="1"
                max={house.capacity}
                value={guestsCount}
                onChange={(e) => setGuestsCount(parseInt(e.target.value))}
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">
                (max {house.capacity})
              </span>
            </div>
          </div>

          {/* Guest Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t.guestName} *</Label>
              <Input
                id="name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t.guestEmail} *</Label>
              <Input
                id="email"
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{t.guestPhone}</Label>
            <Input
              id="phone"
              type="tel"
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
            />
          </div>

          {/* Special Requests */}
          <div className="space-y-2">
            <Label htmlFor="requests">{t.specialRequests}</Label>
            <Textarea
              id="requests"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder={t.specialRequestsPlaceholder}
              rows={3}
            />
          </div>

          {/* Price Summary */}
          {totalNights > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>${house.price} {t.pricePerNight} × {totalNights} {t.totalNights}</span>
                    <span>${totalAmount}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>{t.totalPrice}</span>
                      <span>${totalAmount}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              {t.cancel}
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-fjord hover:opacity-90"
            >
              {isLoading ? "..." : t.confirmBooking}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}