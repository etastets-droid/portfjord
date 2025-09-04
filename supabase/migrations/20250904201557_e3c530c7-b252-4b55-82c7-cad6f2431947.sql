-- Crear la nueva propiedad "Chill Out House"
INSERT INTO public.properties (
  name,
  description,
  price_per_night,
  max_guests,
  bedrooms,
  bathrooms,
  amenities,
  images,
  status,
  address,
  available_for_booking,
  owner_id
) VALUES (
  'Chill Out House',
  'Un refugio de relajación total con vistas panorámicas al fiordo. Esta casa está diseñada para el descanso perfecto, con espacios amplios, decoración zen y todas las comodidades para una estadía memorable en la Patagonia.',
  280,
  6,
  3,
  2,
  ARRAY['WiFi', 'Mountain Views', 'Hot Tub', 'Fireplace', 'Kitchen', 'Yoga Space'],
  ARRAY['/lovable-uploads/5fccdd0b-83a4-4e3e-b3f9-bec2c5139eeb.png'],
  'active',
  'Puerto Natales, Patagonia',
  true,
  '0f219b52-608f-4ee0-85f1-5d3e50b5e4b9'
);