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
  'Kayak Trip Eberhard Fjord Half Day',
  'Explore the pristine waters of Eberhard Fjord on this half-day kayaking adventure. Paddle through calm waters surrounded by towering snow-capped mountains and experience the raw beauty of Patagonian fjords. Perfect for both beginners and experienced kayakers.',
  '/lovable-uploads/79b026eb-5a8a-4461-893c-9d5a5483424e.png',
  'Half Day (4 hours)',
  'Moderate',
  '$80-120 USD',
  ARRAY['Professional guide', 'Kayak and safety equipment', 'Waterproof jacket', 'Hot beverages', 'Transportation from Puerto Natales'],
  'active'
);