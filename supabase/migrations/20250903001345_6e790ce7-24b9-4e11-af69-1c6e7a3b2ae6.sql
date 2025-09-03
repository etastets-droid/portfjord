-- Let's update the existing properties instead of using ON CONFLICT
-- First delete any test data and insert our official houses

-- Clear existing test data (keeping the real owner)
DELETE FROM properties WHERE name IN ('The Cliff House', 'Nest House', 'Fjord House', 'The Valley House', 'The Woods House');

-- Insert the official properties with proper UUIDs
INSERT INTO properties (
  name, description, price_per_night, max_guests, bedrooms, bathrooms, 
  amenities, images, owner_id, status, address
) VALUES 
-- The Cliff House
(
  'The Cliff House',
  'Perched dramatically on coastal cliffs with panoramic fjord views. This architectural masterpiece combines luxury with nature, featuring floor-to-ceiling windows, a private hot tub overlooking the ocean, and a chef''s kitchen perfect for entertaining.',
  450,
  8,
  4,
  3,
  ARRAY['Ocean Views', 'Private Hot Tub', 'Chef''s Kitchen', 'Fireplace', 'WiFi', 'Parking'],
  ARRAY['/lovable-uploads/658a7807-c55f-457e-bbd7-157d3cf08f66.png', '/lovable-uploads/c5e7ccaf-ffd9-401f-bc65-d26f8c97f2b9.png', '/lovable-uploads/7c73e2bf-2738-449d-8d1e-31c47d8bb826.png'],
  (SELECT id FROM owners LIMIT 1),
  'active',
  'Coastal Cliffs, Puerto Natales, Patagonia'
),
-- Nest House
(
  'Nest House',
  'Elevated retreat nestled among ancient trees with intimate forest views. This unique suspended structure offers an immersive nature experience while maintaining luxury comfort.',
  380,
  6,
  3,
  2,
  ARRAY['Tree Canopy Views', 'Suspended Design', 'Glass Walls', 'Eco-Friendly', 'WiFi', 'Hiking Trails'],
  ARRAY['/lovable-uploads/c5e7ccaf-ffd9-401f-bc65-d26f8c97f2b9.png', '/lovable-uploads/658a7807-c55f-457e-bbd7-157d3cf08f66.png'],
  (SELECT id FROM owners LIMIT 1),
  'occupied',
  'Ancient Forest, Puerto Natales, Patagonia'
),
-- Fjord House  
(
  'Fjord House',
  'Waterfront sanctuary with direct fjord access and private boat dock. Perfect for large groups seeking adventure and luxury.',
  580,
  10,
  5,
  4,
  ARRAY['Waterfront Access', 'Private Marina', 'Panoramic Deck', 'Boat Included', 'WiFi', 'Fishing Gear'],
  ARRAY['/lovable-uploads/7c73e2bf-2738-449d-8d1e-31c47d8bb826.png', '/lovable-uploads/658a7807-c55f-457e-bbd7-157d3cf08f66.png'],
  (SELECT id FROM owners LIMIT 1),
  'active',
  'Fjord Waterfront, Puerto Natales, Patagonia'
),
-- The Valley House
(
  'The Valley House', 
  'Intimate valley setting surrounded by towering mountain peaks. This cozy retreat offers the perfect romantic getaway with its private garden, mountain views, and intimate atmosphere.',
  320,
  4,
  2,
  2,
  ARRAY['Mountain Views', 'Private Garden', 'Cozy Fireplace', 'Hot Tub', 'WiFi', 'Organic Garden'],
  ARRAY['/lovable-uploads/5fccdd0b-83a4-4e3e-b3f9-bec2c5139eeb.png', '/lovable-uploads/658a7807-c55f-457e-bbd7-157d3cf08f66.png'],
  (SELECT id FROM owners LIMIT 1),
  'active',
  'Mountain Valley, Puerto Natales, Patagonia'
),
-- The Woods House
(
  'The Woods House',
  'Deep forest hideaway designed for complete nature immersion. This eco-friendly retreat runs on solar power and offers unparalleled wildlife viewing opportunities.',
  400,
  6,
  3,
  2,
  ARRAY['Forest Immersion', 'Wildlife Viewing', 'Sustainable Design', 'Solar Power', 'WiFi', 'Nature Trails'],
  ARRAY['/lovable-uploads/09c0e326-5d72-4c1a-95d0-32513b39dfb6.png', '/lovable-uploads/658a7807-c55f-457e-bbd7-157d3cf08f66.png'],
  (SELECT id FROM owners LIMIT 1),
  'active',
  'Deep Forest, Puerto Natales, Patagonia'
);