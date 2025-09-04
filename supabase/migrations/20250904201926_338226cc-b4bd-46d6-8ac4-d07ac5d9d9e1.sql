-- Limpiar las imágenes de la base de datos para "Chill Out House"
UPDATE public.properties 
SET images = NULL 
WHERE name = 'Chill Out House';