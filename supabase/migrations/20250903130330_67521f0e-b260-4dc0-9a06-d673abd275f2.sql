-- Eliminar los registros duplicados de Bird Watching
DELETE FROM public.experiences 
WHERE id IN ('dd90ac27-a990-474d-91b5-7898f464bead', '56263e7c-088f-49c2-bdb4-2a09454fb89f', 'e7e12df0-b2f6-431a-a2c9-981d684b11fc');

-- Actualizar el registro original con la nueva imagen del búho
UPDATE public.experiences 
SET image_url = '/lovable-uploads/78eeadaf-5b55-4d42-acff-4a192887da06.png'
WHERE id = '51660a40-7675-4287-90bb-4335cf5f8500';