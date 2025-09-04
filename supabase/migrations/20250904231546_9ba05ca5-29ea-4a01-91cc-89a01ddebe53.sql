-- 1) Update overlapping prevention function to allow cancelling updates
CREATE OR REPLACE FUNCTION public.prevent_overlapping_reservations()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  -- Always allow cancellations
  IF NEW.status = 'cancelled' THEN
    RETURN NEW;
  END IF;

  -- Block overlaps for pending/confirmed rows
  IF EXISTS (
    SELECT 1 FROM public.reservations r
    WHERE r.property_id = NEW.property_id
      AND (NEW.id IS NULL OR r.id <> NEW.id)
      AND r.status IN ('pending','confirmed')
      AND NEW.check_in < r.check_out
      AND NEW.check_out > r.check_in
  ) THEN
    RAISE EXCEPTION 'Overlapping reservation for this property and date range' USING ERRCODE = 'P0001';
  END IF;
  RETURN NEW;
END;
$$;

-- 2) Ensure triggers exist and use the updated function
DROP TRIGGER IF EXISTS prevent_overlaps_on_insert ON public.reservations;
DROP TRIGGER IF EXISTS prevent_overlaps_on_update ON public.reservations;

CREATE TRIGGER prevent_overlaps_on_insert
BEFORE INSERT ON public.reservations
FOR EACH ROW
EXECUTE FUNCTION public.prevent_overlapping_reservations();

CREATE TRIGGER prevent_overlaps_on_update
BEFORE UPDATE ON public.reservations
FOR EACH ROW
EXECUTE FUNCTION public.prevent_overlapping_reservations();

-- 3) RPC to confirm a reservation atomically by cancelling overlapping pendings first
CREATE OR REPLACE FUNCTION public.confirm_reservation(p_reservation_id uuid)
RETURNS reservations
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_property_id uuid;
  v_check_in date;
  v_check_out date;
  v_row reservations;
BEGIN
  -- Lock target reservation
  SELECT property_id, check_in, check_out
    INTO v_property_id, v_check_in, v_check_out
  FROM reservations
  WHERE id = p_reservation_id
  FOR UPDATE;

  IF v_property_id IS NULL THEN
    RAISE EXCEPTION 'Reservation not found' USING ERRCODE = 'P0002';
  END IF;

  -- Ensure caller owns the property
  IF NOT EXISTS (
    SELECT 1
    FROM properties p
    JOIN owners o ON o.id = p.owner_id
    WHERE p.id = v_property_id AND o.user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Not authorized to confirm this reservation' USING ERRCODE = '42501';
  END IF;

  -- Cancel overlapping PENDING reservations first
  UPDATE reservations r
  SET status = 'cancelled'
  WHERE r.property_id = v_property_id
    AND r.id <> p_reservation_id
    AND r.status = 'pending'
    AND v_check_in < r.check_out
    AND v_check_out > r.check_in;

  -- Now confirm the target reservation
  UPDATE reservations
  SET status = 'confirmed'
  WHERE id = p_reservation_id
  RETURNING * INTO v_row;

  RETURN v_row;
END;
$$;