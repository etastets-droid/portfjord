-- Update RLS policies for reservations to allow public bookings
-- First, drop the restrictive policy that denies all public access
DROP POLICY IF EXISTS "Deny all public access to reservations" ON public.reservations;

-- Allow public to create reservations (guest bookings)
CREATE POLICY "Allow public to create guest reservations" 
ON public.reservations 
FOR INSERT 
WITH CHECK (true);

-- Keep existing policies for authenticated users and owners
-- No changes needed for the other policies as they handle authenticated access properly