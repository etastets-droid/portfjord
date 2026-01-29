-- Update Chill Out House max_guests from 15 to 24
UPDATE public.properties 
SET max_guests = 24, updated_at = now()
WHERE id = 'b26a2595-5958-4cb1-a8c2-f7740e3ad9c0';