INSERT INTO public.experiences (
  name,
  description,
  image_url,
  duration,
  difficulty_level,
  price_range,
  included_items,
  status
) VALUES (
  'Bird Watching – Torres del Paine Full Day',
  'Discover the incredible avian diversity of Torres del Paine National Park on this full-day birdwatching expedition. Observe endemic species including the Magellanic owl, Andean condor, and Chilean flamingo in their natural habitat. Perfect for nature enthusiasts and photography lovers.',
  '/lovable-uploads/0add3f64-040d-4832-8e7d-7b783cac202c.png',
  'Full Day (8 hours)',
  'Easy',
  '$120-180 USD',
  ARRAY['Professional ornithologist guide', 'Binoculars and spotting scope', 'Bird identification guide', 'Packed lunch', 'Transportation', 'Photography tips'],
  'active'
);