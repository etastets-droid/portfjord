
-- 1) Replace overly permissive INSERT policies with validated ones

DROP POLICY IF EXISTS "Anyone can submit contact messages" ON public.contact_messages;
CREATE POLICY "Anyone can submit contact messages"
ON public.contact_messages
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(btrim(name)) BETWEEN 1 AND 200
  AND length(btrim(email)) BETWEEN 3 AND 320
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(btrim(message)) BETWEEN 1 AND 5000
  AND length(btrim(inquiry_type)) BETWEEN 1 AND 100
  AND (phone IS NULL OR length(phone) <= 50)
);

DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Anyone can subscribe to newsletter"
ON public.newsletter_subscribers
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(btrim(name)) BETWEEN 1 AND 200
  AND length(btrim(email)) BETWEEN 3 AND 320
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
);

-- 2) Lock down SECURITY DEFINER function EXECUTE grants.
--    Revoke from PUBLIC and anon on all; keep authenticated only where the app or RLS needs it.

REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.get_current_owner() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_date_range_available(uuid, date, date) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.get_pending_experience_requests() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.confirm_reservation(uuid) FROM PUBLIC, anon;

-- Trigger-only helpers: no one should call these directly
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.prevent_overlapping_reservations() FROM PUBLIC, anon, authenticated;

-- Preserve required access for authenticated app usage
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_current_owner() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_date_range_available(uuid, date, date) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_pending_experience_requests() TO authenticated;
GRANT EXECUTE ON FUNCTION public.confirm_reservation(uuid) TO authenticated;
