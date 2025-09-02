-- Add INSERT policy for public users to create reservations
-- This allows guests to book properties
CREATE POLICY "Anyone can create reservations" 
ON public.reservations 
FOR INSERT 
WITH CHECK (true);

-- Add SELECT policy for authenticated guests to view their own reservations
-- This allows guests to see their bookings when logged in
CREATE POLICY "Guests can view their own reservations" 
ON public.reservations 
FOR SELECT 
USING (
  auth.email() = guest_email
);

-- Update existing owner view policy to be more explicit
-- (This maintains existing functionality while being clearer)
DROP POLICY IF EXISTS "Owners can view reservations for their properties" ON public.reservations;
CREATE POLICY "Property owners can view reservations for their properties" 
ON public.reservations 
FOR SELECT 
USING (
  property_id IN (
    SELECT p.id
    FROM properties p
    JOIN owners o ON p.owner_id = o.id
    WHERE o.user_id = auth.uid()
  )
);