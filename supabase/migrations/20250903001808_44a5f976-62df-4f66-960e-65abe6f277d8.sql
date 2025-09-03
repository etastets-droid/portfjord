-- Add a separate column for booking availability
ALTER TABLE properties 
ADD COLUMN available_for_booking BOOLEAN DEFAULT true;

-- Update Nest House to show but not allow bookings (like the original design)
UPDATE properties 
SET available_for_booking = false
WHERE name = 'Nest House';