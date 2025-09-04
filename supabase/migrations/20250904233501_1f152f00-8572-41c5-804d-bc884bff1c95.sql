-- Enable booking for Nest House
UPDATE properties 
SET available_for_booking = true 
WHERE name = 'Nest House';