-- Fix security vulnerability in experience_requests table
-- Current policy allows any owner to see all customer contact information
-- This is a privacy violation - restrict access appropriately

-- Drop the overly permissive policy that allows any owner to see all requests
DROP POLICY "Only owners can view experience requests" ON public.experience_requests;

-- Create more restrictive policies based on business logic
-- Since experiences appear to be centrally managed (no owner_id in experiences table),
-- only platform administrators should access customer contact information

-- Option 1: If you want to add owner-specific experience management:
-- You would need to add owner_id to experiences table first, then:
-- ALTER TABLE public.experiences ADD COLUMN owner_id uuid REFERENCES public.owners(id);
-- ALTER TABLE public.experience_requests ADD COLUMN experience_id uuid REFERENCES public.experiences(id);

-- Option 2: More secure approach - restrict to platform admin only
-- For now, implementing the most secure solution:
-- Only authenticated users can view their own requests (if we add user_id)
-- Or completely restrict owner access since experiences are centrally managed

-- Add user_id to link requests to the user who made them
ALTER TABLE public.experience_requests 
ADD COLUMN user_id uuid REFERENCES auth.users(id);

-- Create policy for users to view their own requests
CREATE POLICY "Users can view their own experience requests" 
ON public.experience_requests 
FOR SELECT 
USING (auth.uid() = user_id);

-- Update the insert policy to require authentication and set user_id
DROP POLICY "Anyone can create experience requests" ON public.experience_requests;

CREATE POLICY "Authenticated users can create their own experience requests" 
ON public.experience_requests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- If you need owners to manage experience requests for their specific experiences,
-- you would need to establish the relationship between experiences and owners first
-- This current solution prioritizes customer data privacy