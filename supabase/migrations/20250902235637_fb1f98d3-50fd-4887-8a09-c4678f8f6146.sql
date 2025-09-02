-- Add public read access policy for property listings
-- This allows potential guests to view active properties for browsing
CREATE POLICY "Public can view active properties" 
ON public.properties 
FOR SELECT 
USING (status = 'active');