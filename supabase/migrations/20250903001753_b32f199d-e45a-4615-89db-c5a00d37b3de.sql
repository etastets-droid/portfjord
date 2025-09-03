-- Fix Nest House status to show it but mark as unavailable  
UPDATE properties 
SET status = 'active'
WHERE name = 'Nest House';