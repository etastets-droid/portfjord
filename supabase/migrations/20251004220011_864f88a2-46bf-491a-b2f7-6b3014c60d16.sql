-- Drop the overly permissive public insert policy
DROP POLICY IF EXISTS "Allow public to create guest reservations" ON public.reservations;

-- Create a more restrictive policy for public guest reservations
-- This allows public inserts but doesn't grant any read access
CREATE POLICY "Public can create guest reservations with valid data"
ON public.reservations
FOR INSERT
TO public
WITH CHECK (
  -- Ensure property_id references a valid, active property
  property_id IN (SELECT id FROM public.properties WHERE status = 'active')
  AND check_in IS NOT NULL
  AND check_out IS NOT NULL
  AND check_out > check_in
  AND guests_count > 0
  AND total_amount >= 0
  AND guest_name IS NOT NULL
  AND guest_email IS NOT NULL
);

-- Explicitly deny public SELECT access to protect guest contact information
-- This complements existing policies that allow only owners and authenticated users
CREATE POLICY "Deny public read access to reservations"
ON public.reservations
FOR SELECT
TO public
USING (false);