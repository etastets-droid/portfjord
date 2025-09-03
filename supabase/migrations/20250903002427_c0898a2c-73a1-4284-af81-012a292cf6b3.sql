-- Create experiences table for storing different experience offerings
CREATE TABLE public.experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  duration TEXT,
  difficulty_level TEXT,
  price_range TEXT,
  included_items TEXT[],
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Public can view active experiences" 
ON public.experiences 
FOR SELECT 
USING (status = 'active');

-- Create table for tailor-made experience requests
CREATE TABLE public.experience_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  experience_type TEXT,
  group_size INTEGER,
  preferred_dates TEXT,
  special_requirements TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS for experience requests
ALTER TABLE public.experience_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to create experience requests
CREATE POLICY "Anyone can create experience requests" 
ON public.experience_requests 
FOR INSERT 
WITH CHECK (true);

-- Add trigger for updated_at
CREATE TRIGGER update_experiences_updated_at
BEFORE UPDATE ON public.experiences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_experience_requests_updated_at
BEFORE UPDATE ON public.experience_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();