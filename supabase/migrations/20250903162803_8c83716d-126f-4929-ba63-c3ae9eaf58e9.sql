-- Add SELECT policy to allow only authenticated owners to view experience requests
-- This ensures customer contact information is only accessible to authorized business owners

CREATE POLICY "Only owners can view experience requests" 
ON public.experience_requests 
FOR SELECT 
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM public.owners
  )
);