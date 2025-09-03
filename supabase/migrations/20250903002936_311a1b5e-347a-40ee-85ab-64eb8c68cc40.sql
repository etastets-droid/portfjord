-- 1) Function (RPC) to fetch reserved date ranges securely
CREATE OR REPLACE FUNCTION public.get_reserved_dates(_property_id uuid)
RETURNS TABLE (check_in date, check_out date)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT r.check_in, r.check_out
  FROM public.reservations r
  WHERE r.property_id = _property_id
    AND r.status IN ('pending','confirmed');
$$;

-- Allow anon/authenticated to execute this function
GRANT EXECUTE ON FUNCTION public.get_reserved_dates(uuid) TO anon, authenticated;

-- 2) Trigger to prevent overlapping reservations per property
CREATE OR REPLACE FUNCTION public.prevent_overlapping_reservations()
RETURNS trigger AS $$
BEGIN
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
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS trg_prevent_overlap_insert ON public.reservations;
DROP TRIGGER IF EXISTS trg_prevent_overlap_update ON public.reservations;

CREATE TRIGGER trg_prevent_overlap_insert
BEFORE INSERT ON public.reservations
FOR EACH ROW EXECUTE FUNCTION public.prevent_overlapping_reservations();

CREATE TRIGGER trg_prevent_overlap_update
BEFORE UPDATE ON public.reservations
FOR EACH ROW EXECUTE FUNCTION public.prevent_overlapping_reservations();