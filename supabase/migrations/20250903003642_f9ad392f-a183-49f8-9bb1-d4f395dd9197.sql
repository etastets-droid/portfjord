-- Update the fourth experience name
UPDATE experiences 
SET name = 'Base Torres Full Day'
WHERE id = (
  SELECT id 
  FROM experiences 
  ORDER BY created_at 
  LIMIT 1 OFFSET 3
);