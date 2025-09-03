-- Update experience name to "Full day Sierra Baguales"
UPDATE experiences 
SET name = 'Full day Sierra Baguales'
WHERE id = (
  SELECT id 
  FROM experiences 
  ORDER BY created_at 
  LIMIT 1 OFFSET 1
);