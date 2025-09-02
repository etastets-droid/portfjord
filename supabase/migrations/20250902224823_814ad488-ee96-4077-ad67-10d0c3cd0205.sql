-- Create owners table
CREATE TABLE public.owners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create properties table
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES public.owners(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  price_per_night DECIMAL(10,2),
  max_guests INTEGER DEFAULT 1,
  bedrooms INTEGER DEFAULT 1,
  bathrooms INTEGER DEFAULT 1,
  amenities TEXT[],
  images TEXT[],
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reservations table
CREATE TABLE public.reservations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests_count INTEGER NOT NULL DEFAULT 1,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  special_requests TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for owners
CREATE POLICY "Users can view their own owner profile" 
ON public.owners 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own owner profile" 
ON public.owners 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own owner profile" 
ON public.owners 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for properties
CREATE POLICY "Owners can view their own properties" 
ON public.properties 
FOR SELECT 
USING (
  owner_id IN (
    SELECT id FROM public.owners WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Owners can create properties" 
ON public.properties 
FOR INSERT 
WITH CHECK (
  owner_id IN (
    SELECT id FROM public.owners WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Owners can update their own properties" 
ON public.properties 
FOR UPDATE 
USING (
  owner_id IN (
    SELECT id FROM public.owners WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Owners can delete their own properties" 
ON public.properties 
FOR DELETE 
USING (
  owner_id IN (
    SELECT id FROM public.owners WHERE user_id = auth.uid()
  )
);

-- Create RLS policies for reservations
CREATE POLICY "Owners can view reservations for their properties" 
ON public.reservations 
FOR SELECT 
USING (
  property_id IN (
    SELECT p.id FROM public.properties p 
    JOIN public.owners o ON p.owner_id = o.id 
    WHERE o.user_id = auth.uid()
  )
);

CREATE POLICY "Owners can update reservations for their properties" 
ON public.reservations 
FOR UPDATE 
USING (
  property_id IN (
    SELECT p.id FROM public.properties p 
    JOIN public.owners o ON p.owner_id = o.id 
    WHERE o.user_id = auth.uid()
  )
);

-- Create functions to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_owners_updated_at
  BEFORE UPDATE ON public.owners
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at
  BEFORE UPDATE ON public.reservations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();