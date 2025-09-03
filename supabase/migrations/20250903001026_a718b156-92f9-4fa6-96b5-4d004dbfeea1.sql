-- Add Stripe-related columns to reservations table for payment integration
ALTER TABLE public.reservations 
ADD COLUMN stripe_session_id TEXT,
ADD COLUMN payment_status TEXT DEFAULT 'pending';