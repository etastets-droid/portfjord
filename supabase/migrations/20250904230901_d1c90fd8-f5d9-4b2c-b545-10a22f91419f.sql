-- Allow owners to delete reservations for their properties
CREATE POLICY "Owners can delete reservations for their properties"
ON public.reservations
FOR DELETE
USING (
  property_id IN (
    SELECT p.id
    FROM properties p
    JOIN owners o ON p.owner_id = o.id
    WHERE o.user_id = auth.uid()
  )
);