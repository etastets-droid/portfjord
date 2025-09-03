-- Actualiza la imagen de BASE TORRES HIKE con la nueva foto de Torres del Paine
UPDATE public.experiences 
SET image_url = '/lovable-uploads/e0936169-fe06-4541-83f4-a9431fd2b0ca.png',
    updated_at = now()
WHERE id = '0b1655cf-929c-41d4-a388-13fa725b4b6b';