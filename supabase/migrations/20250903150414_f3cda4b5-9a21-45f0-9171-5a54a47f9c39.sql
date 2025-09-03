-- Actualiza la imagen de Bird Watching con la foto subida por el usuario
UPDATE public.experiences 
SET image_url = '/lovable-uploads/140fd2e0-65fc-4262-99e3-ab71f4ab1b68.png',
    updated_at = now()
WHERE id = '51660a40-7675-4287-90bb-4335cf5f8500';