-- First, let's add some sample properties that match the hardcoded houses
-- We'll need to get a property owner first, so let's create a default one for demo
INSERT INTO owners (user_id, name, email, phone) 
VALUES (
  '00000000-0000-0000-0000-000000000000', -- placeholder user_id for demo
  'Puerto Fjord Properties', 
  'admin@puertofjord.com',
  '+56 9 1234 5678'
) ON CONFLICT (email) DO NOTHING;

-- Now insert the properties that match our hardcoded houses
INSERT INTO properties (
  id, name, description, price_per_night, max_guests, bedrooms, bathrooms, 
  amenities, images, owner_id, status
) VALUES 
-- The Cliff House
(
  'cliff-house'::uuid,
  'The Cliff House',
  'Perched dramatically on coastal cliffs with panoramic fjord views. This architectural masterpiece combines luxury with nature, featuring floor-to-ceiling windows, a private hot tub overlooking the ocean, and a chef''s kitchen perfect for entertaining.',
  450,
  8,
  4,
  3,
  ARRAY['Ocean Views', 'Private Hot Tub', 'Chef''s Kitchen', 'Fireplace', 'WiFi', 'Parking'],
  ARRAY['/lovable-uploads/658a7807-c55f-457e-bbd7-157d3cf08f66.png', '/lovable-uploads/c5e7ccaf-ffd9-401f-bc65-d26f8c97f2b9.png'],
  (SELECT id FROM owners WHERE email = 'admin@puertofjord.com' LIMIT 1),
  'active'
),
-- Nest House
(
  'nest-house'::uuid,
  'Nest House',
  'Elevated retreat nestled among ancient trees with intimate forest views. This unique suspended structure offers an immersive nature experience while maintaining luxury comfort.',
  380,
  6,
  3,
  2,
  ARRAY['Tree Canopy Views', 'Suspended Design', 'Glass Walls', 'Eco-Friendly', 'WiFi', 'Hiking Trails'],
  ARRAY['/lovable-uploads/c5e7ccaf-ffd9-401f-bc65-d26f8c97f2b9.png', '/lovable-uploads/658a7807-c55f-457e-bbd7-157d3cf08f66.png'],
  (SELECT id FROM owners WHERE email = 'admin@puertofjord.com' LIMIT 1),
  'occupied' -- This one was unavailable in the hardcoded data
),
-- Fjord House  
(
  'fjord-house'::uuid,
  'Fjord House',
  'Waterfront sanctuary with direct fjord access and private boat dock. Perfect for large groups seeking adventure and luxury.',
  580,
  10,
  5,
  4,
  ARRAY['Waterfront Access', 'Private Marina', 'Panoramic Deck', 'Boat Included', 'WiFi', 'Fishing Gear'],
  ARRAY['/lovable-uploads/7c73e2bf-2738-449d-8d1e-31c47d8bb826.png', '/lovable-uploads/658a7807-c55f-457e-bbd7-157d3cf08f66.png'],
  (SELECT id FROM owners WHERE email = 'admin@puertofjord.com' LIMIT 1),
  'active'
),
-- The Valley House
(
  'valley-house'::uuid,
  'The Valley House', 
  'Intimate valley setting surrounded by towering mountain peaks. This cozy retreat offers the perfect romantic getaway with its private garden, mountain views, and intimate atmosphere.',
  320,
  4,
  2,
  2,
  ARRAY['Mountain Views', 'Private Garden', 'Cozy Fireplace', 'Hot Tub', 'WiFi', 'Organic Garden'],
  ARRAY['/lovable-uploads/5fccdd0b-83a4-4e3e-b3f9-bec2c5139eeb.png', '/lovable-uploads/658a7807-c55f-457e-bbd7-157d3cf08f66.png'],
  (SELECT id FROM owners WHERE email = 'puertofjord@example.com' LIMIT 1),
  'active'
),
-- The Woods House
(
  'woods-house'::uuid,
  'The Woods House',
  'Deep forest hideaway designed for complete nature immersion. This eco-friendly retreat runs on solar power and offers unparalleled wildlife viewing opportunities.',
  400,
  6,
  3,
  2,
  ARRAY['Forest Immersion', 'Wildlife Viewing', 'Sustainable Design', 'Solar Power', 'WiFi', 'Nature Trails'],
  ARRAY['/lovable-uploads/09c0e326-5d72-4c1a-95d0-32513b39dfb6.png', '/lovable-uploads/658a7807-c55f-457e-bbd7-157d3cf08f66.png'],
  (SELECT id FROM owners WHERE email = 'admin@puertofjord.com' LIMIT 1),
  'active'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price_per_night = EXCLUDED.price_per_night,
  max_guests = EXCLUDED.max_guests,
  bedrooms = EXCLUDED.bedrooms,
  bathrooms = EXCLUDED.bathrooms,
  amenities = EXCLUDED.amenities,
  images = EXCLUDED.images,
  status = EXCLUDED.status;