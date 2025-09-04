-- Fix critical security vulnerability in experience_requests table
-- Remove overly broad owner access that exposes all guest personal data

-- Drop the current problematic policy that allows all owners to see all guest data
DROP POLICY IF EXISTS "Owners can view experience requests" ON public.experience_requests;

-- Create a more secure policy that only allows users to see their own requests
-- and removes blanket owner access to personal information
CREATE POLICY "Users can view only their own experience requests" 
ON public.experience_requests 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create a security definer function for owners to see anonymized request summaries
-- This allows owners to see business-relevant data without exposing personal information
CREATE OR REPLACE FUNCTION public.get_anonymized_experience_requests()
RETURNS TABLE(
  id uuid,
  experience_type text,
  preferred_dates text,
  special_requirements text,
  message text,
  group_size integer,
  status text,
  created_at timestamp with time zone,
  request_reference text
) 
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    er.id,
    er.experience_type,
    er.preferred_dates,
    er.special_requirements,
    er.message,
    er.group_size,
    er.status,
    er.created_at,
    'REQ-' || SUBSTRING(er.id::text, 1, 8) as request_reference
  FROM experience_requests er
  WHERE auth.uid() IN (SELECT owners.user_id FROM owners)
    AND er.status = 'pending'; -- Only show pending requests that need attention
$$;

-- Grant execute permission on the function to authenticated users
GRANT EXECUTE ON FUNCTION public.get_anonymized_experience_requests() TO authenticated;