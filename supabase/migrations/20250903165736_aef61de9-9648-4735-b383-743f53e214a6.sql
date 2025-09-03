-- Fix security vulnerability in reservations table
-- Add user_id column to link reservations to authenticated users
ALTER TABLE public.reservations 
ADD COLUMN user_id uuid REFERENCES auth.users(id);

-- Drop the insecure email-based policy
DROP POLICY "Guests can view their own reservations" ON public.reservations;

-- Create secure authentication-based policies
CREATE POLICY "Users can view their own reservations" 
ON public.reservations 
FOR SELECT 
USING (auth.uid() = user_id);

-- Update insert policy to require authentication and set user_id
DROP POLICY "Anyone can create reservations" ON public.reservations;

CREATE POLICY "Authenticated users can create their own reservations" 
ON public.reservations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own reservations (for cancellations, etc.)
CREATE POLICY "Users can update their own reservations" 
ON public.reservations 
FOR UPDATE 
USING (auth.uid() = user_id);