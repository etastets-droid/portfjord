-- Fix warn-level security issues

-- 1. Create centralized owner verification function (fixes CLIENT_SIDE_AUTH)
CREATE OR REPLACE FUNCTION public.get_current_owner()
RETURNS TABLE(id uuid, name text, email text, phone text, user_id uuid)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, name, email, phone, user_id
  FROM public.owners
  WHERE user_id = auth.uid();
$$;

-- 2. Replace get_reserved_dates with secure availability check (fixes DEFINER_OR_RPC_BYPASS)
DROP FUNCTION IF EXISTS public.get_reserved_dates(uuid);

CREATE OR REPLACE FUNCTION public.is_date_range_available(
  _property_id uuid,
  _check_in date,
  _check_out date
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NOT EXISTS (
    SELECT 1
    FROM public.reservations r
    WHERE r.property_id = _property_id
      AND r.status IN ('pending', 'confirmed')
      AND _check_in < r.check_out
      AND _check_out > r.check_in
  );
$$;

-- 3. Fix get_anonymized_experience_requests to truly anonymize (fixes DEFINER_OR_RPC_BYPASS)
DROP FUNCTION IF EXISTS public.get_anonymized_experience_requests();

CREATE OR REPLACE FUNCTION public.get_pending_experience_requests()
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
LANGUAGE sql
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
    AND er.status = 'pending';
$$;