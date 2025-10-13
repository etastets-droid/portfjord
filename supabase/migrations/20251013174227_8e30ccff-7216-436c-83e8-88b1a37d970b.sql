-- Create newsletter subscribers table
CREATE TABLE public.newsletter_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'active'
);

-- Enable Row Level Security
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (subscribe)
CREATE POLICY "Anyone can subscribe to newsletter"
ON public.newsletter_subscribers
FOR INSERT
WITH CHECK (true);

-- Only owners can view subscribers
CREATE POLICY "Owners can view newsletter subscribers"
ON public.newsletter_subscribers
FOR SELECT
USING (auth.uid() IN (SELECT user_id FROM owners));

-- Only owners can update subscribers
CREATE POLICY "Owners can update newsletter subscribers"
ON public.newsletter_subscribers
FOR UPDATE
USING (auth.uid() IN (SELECT user_id FROM owners));

-- Create index on email for faster lookups
CREATE INDEX idx_newsletter_subscribers_email ON public.newsletter_subscribers(email);