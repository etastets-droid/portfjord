-- Crear un nuevo owner para The Woods House
-- Primero, insertamos un registro temporal en owners para obtener el ID
INSERT INTO public.owners (name, email, user_id) 
VALUES ('Woods House Owner', 'tcpatagonia30@hotmail.com', gen_random_uuid());

-- Obtener el ID del nuevo owner
DO $$
DECLARE
    new_owner_id uuid;
    woods_house_id uuid := '9c83de44-dbf7-4b7c-a5c0-b6934a867d81';
BEGIN
    -- Obtener el ID del owner recién creado
    SELECT id INTO new_owner_id 
    FROM public.owners 
    WHERE email = 'tcpatagonia30@hotmail.com';
    
    -- Actualizar The Woods House para que pertenezca al nuevo owner
    UPDATE public.properties 
    SET owner_id = new_owner_id 
    WHERE id = woods_house_id;
END $$;