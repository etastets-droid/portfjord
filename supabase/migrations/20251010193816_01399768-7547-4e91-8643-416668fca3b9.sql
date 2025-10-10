-- Ensure RLS is enabled on reservations table
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to recreate them properly
DROP POLICY IF EXISTS "Deny public read access to reservations" ON public.reservations;
DROP POLICY IF EXISTS "Authenticated users can create their own reservations" ON public.reservations;
DROP POLICY IF EXISTS "Public can create guest reservations with valid data" ON public.reservations;
DROP POLICY IF EXISTS "Users can view their own reservations" ON public.reservations;
DROP POLICY IF EXISTS "Users can update their own reservations" ON public.reservations;
DROP POLICY IF EXISTS "Property owners can view reservations for their properties" ON public.reservations;
DROP POLICY IF EXISTS "Owners can update reservations for their properties" ON public.reservations;
DROP POLICY IF EXISTS "Owners can delete reservations for their properties" ON public.reservations;

-- Block ALL public/anonymous access explicitly
CREATE POLICY "Block all public access to reservations"
ON public.reservations
FOR ALL
TO anon
USING (false);

-- Allow public to create reservations (for guest bookings)
CREATE POLICY "Public can create guest reservations"
ON public.reservations
FOR INSERT
TO anon
WITH CHECK (
  property_id IN (SELECT id FROM properties WHERE status = 'active')
  AND check_in IS NOT NULL
  AND check_out IS NOT NULL
  AND check_out > check_in
  AND guests_count > 0
  AND total_amount >= 0
  AND guest_name IS NOT NULL
  AND guest_email IS NOT NULL
);

-- Authenticated users can create their own reservations
CREATE POLICY "Authenticated users can create reservations"
ON public.reservations
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can view only their own reservations
CREATE POLICY "Users can view their own reservations"
ON public.reservations
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can update their own reservations
CREATE POLICY "Users can update their own reservations"
ON public.reservations
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Property owners can view reservations for their properties
CREATE POLICY "Owners can view property reservations"
ON public.reservations
FOR SELECT
TO authenticated
USING (
  property_id IN (
    SELECT p.id
    FROM properties p
    JOIN owners o ON p.owner_id = o.id
    WHERE o.user_id = auth.uid()
  )
);

-- Property owners can update reservations for their properties
CREATE POLICY "Owners can update property reservations"
ON public.reservations
FOR UPDATE
TO authenticated
USING (
  property_id IN (
    SELECT p.id
    FROM properties p
    JOIN owners o ON p.owner_id = o.id
    WHERE o.user_id = auth.uid()
  )
);

-- Property owners can delete reservations for their properties
CREATE POLICY "Owners can delete property reservations"
ON public.reservations
FOR DELETE
TO authenticated
USING (
  property_id IN (
    SELECT p.id
    FROM properties p
    JOIN owners o ON p.owner_id = o.id
    WHERE o.user_id = auth.uid()
  )
);