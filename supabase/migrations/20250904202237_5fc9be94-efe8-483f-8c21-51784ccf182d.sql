-- Keep only one Chill Out House and remove duplicates
DELETE FROM public.properties
WHERE name = 'Chill Out House'
  AND id <> 'b26a2595-5958-4cb1-a8c2-f7740e3ad9c0';