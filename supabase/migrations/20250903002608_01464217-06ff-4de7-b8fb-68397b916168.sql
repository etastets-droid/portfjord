-- Insert 6 sample experiences with Patagonian themes
INSERT INTO public.experiences (
  name, description, image_url, duration, difficulty_level, price_range, included_items
) VALUES 
(
  'Glaciar Grey Kayaking',
  'Paddle through the pristine waters of Grey Lake, surrounded by towering peaks and ancient icebergs. Experience the raw power of nature as you kayak near the magnificent Grey Glacier in Torres del Paine National Park.',
  '/lovable-uploads/658a7807-c55f-457e-bbd7-157d3cf08f66.png',
  '6 hours',
  'Intermediate',
  '$150 - $200 per person',
  ARRAY['Professional guide', 'Kayaking equipment', 'Safety gear', 'Hot lunch', 'Transportation']
),
(
  'Torres del Paine Trekking',
  'Embark on an unforgettable journey to the iconic granite towers. This full-day trek takes you through diverse landscapes, from pristine lakes to ancient forests, culminating at the base of the famous Torres.',
  '/lovable-uploads/c5e7ccaf-ffd9-401f-bc65-d26f8c97f2b9.png',
  '12 hours',
  'Advanced',
  '$180 - $250 per person',
  ARRAY['Expert mountain guide', 'Trekking poles', 'Trail lunch', 'First aid kit', 'Group photos']
),
(
  'Milodon Cave Exploration',
  'Discover the prehistoric world at the famous Milodon Cave, where ancient giants once roamed. Learn about Patagonian paleontology and enjoy stunning views of the Ultima Esperanza Sound.',
  '/lovable-uploads/7c73e2bf-2738-449d-8d1e-31c47d8bb826.png',
  '4 hours',
  'Easy',
  '$80 - $120 per person',
  ARRAY['Professional guide', 'Cave exploration gear', 'Educational materials', 'Snacks', 'Transportation']
),
(
  'Condor Wildlife Watching',
  'Witness the majestic Andean condors soaring through the Patagonian skies. This experience includes bird watching from prime locations and learning about local wildlife conservation efforts.',
  '/lovable-uploads/5fccdd0b-83a4-4e3e-b3f9-bec2c5139eeb.png',
  '5 hours',
  'Easy',
  '$100 - $150 per person',
  ARRAY['Wildlife expert guide', 'High-quality binoculars', 'Photography tips', 'Field notebook', 'Refreshments']
),
(
  'Fjord Navigation Adventure',
  'Navigate the pristine waters of the Patagonian fjords aboard our comfortable vessel. Discover hidden coves, glacial formations, and marine wildlife in one of the worlds last frontiers.',
  '/lovable-uploads/09c0e326-5d72-4c1a-95d0-32513b39dfb6.png',
  '8 hours',
  'Easy',
  '$200 - $300 per person',
  ARRAY['Captain and crew', 'Onboard lunch', 'Hot beverages', 'Wildlife spotting guide', 'Warm blankets']
),
(
  'Gaucho Experience',
  'Immerse yourself in traditional Patagonian culture with a visit to a working estancia. Learn horseback riding, sheep herding, and enjoy an authentic asado with local gauchos.',
  '/lovable-uploads/d595f609-fd89-411c-af90-5e08d32837f3.png',
  '7 hours',
  'Easy',
  '$120 - $180 per person',
  ARRAY['Gaucho guide', 'Horse and equipment', 'Traditional asado lunch', 'Folk music show', 'Cultural activities']
);