-- Insertar datos de ejemplo para demostrar el portal de propietarios

-- Primero, obtener el owner_id del usuario autenticado (necesario para las propiedades)
-- Nota: Este script asume que ya existe un owner en la tabla owners

-- Insertar propiedades de ejemplo
INSERT INTO public.properties (name, description, address, price_per_night, max_guests, bedrooms, bathrooms, amenities, owner_id) 
SELECT 
    'Casa Lago Patagonia',
    'Hermosa casa con vista al lago en el corazón de la Patagonia. Perfecta para escapadas románticas o aventuras familiares.',
    'Av. San Martín 1234, Bariloche, Río Negro',
    150.00,
    6,
    3,
    2,
    ARRAY['WiFi', 'Chimenea', 'Vista al lago', 'Cocina completa', 'Parrilla', 'Estacionamiento'],
    o.id
FROM public.owners o
LIMIT 1;

INSERT INTO public.properties (name, description, address, price_per_night, max_guests, bedrooms, bathrooms, amenities, owner_id)
SELECT 
    'Cabaña Bosque Encantado',
    'Acogedora cabaña rodeada de bosque nativo. Ideal para desconectarse y disfrutar de la naturaleza.',
    'Ruta 237 Km 45, Villa La Angostura, Neuquén',
    120.00,
    4,
    2,
    1,
    ARRAY['WiFi', 'Chimenea', 'Senderos', 'Cocina', 'Deck', 'Vista al bosque'],
    o.id
FROM public.owners o
LIMIT 1;

INSERT INTO public.properties (name, description, address, price_per_night, max_guests, bedrooms, bathrooms, amenities, owner_id)
SELECT 
    'Departamento Centro Turístico',
    'Moderno departamento en el centro de la ciudad, cerca de restaurantes y atracciones principales.',
    'Mitre 567, Apt 4B, San Carlos de Bariloche',
    80.00,
    2,
    1,
    1,
    ARRAY['WiFi', 'Calefacción', 'Cocina', 'Ubicación céntrica', 'Transporte público'],
    o.id
FROM public.owners o
LIMIT 1;

-- Insertar reservas de ejemplo
INSERT INTO public.reservations (property_id, guest_name, guest_email, guest_phone, check_in, check_out, guests_count, total_amount, status, special_requests)
SELECT 
    p.id,
    'María González',
    'maria.gonzalez@email.com',
    '+56 9 1234 5678',
    CURRENT_DATE + INTERVAL '5 days',
    CURRENT_DATE + INTERVAL '8 days',
    4,
    450.00,
    'confirmed',
    'Llegada tardía (22:00). Necesitamos cuna para bebé.'
FROM public.properties p
WHERE p.name = 'Casa Lago Patagonia'
LIMIT 1;

INSERT INTO public.reservations (property_id, guest_name, guest_email, guest_phone, check_in, check_out, guests_count, total_amount, status)
SELECT 
    p.id,
    'Carlos Rodríguez',
    'carlos.rodriguez@email.com',
    '+54 11 9876 5432',
    CURRENT_DATE + INTERVAL '12 days',
    CURRENT_DATE + INTERVAL '15 days',
    2,
    360.00,
    'pending'
FROM public.properties p
WHERE p.name = 'Cabaña Bosque Encantado'
LIMIT 1;

INSERT INTO public.reservations (property_id, guest_name, guest_email, guest_phone, check_in, check_out, guests_count, total_amount, status)
SELECT 
    p.id,
    'Ana Silva',
    'ana.silva@email.com',
    '+56 9 8765 4321',
    CURRENT_DATE - INTERVAL '3 days',
    CURRENT_DATE + INTERVAL '1 day',
    2,
    320.00,
    'confirmed'
FROM public.properties p
WHERE p.name = 'Departamento Centro Turístico'
LIMIT 1;

INSERT INTO public.reservations (property_id, guest_name, guest_email, guest_phone, check_in, check_out, guests_count, total_amount, status)
SELECT 
    p.id,
    'Roberto Fernández',
    'roberto.fernandez@email.com',
    '+54 261 555 1234',
    CURRENT_DATE - INTERVAL '10 days',
    CURRENT_DATE - INTERVAL '7 days',
    6,
    600.00,
    'completed'
FROM public.properties p
WHERE p.name = 'Casa Lago Patagonia'
LIMIT 1;