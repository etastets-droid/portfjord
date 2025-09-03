-- Update the third experience name
UPDATE experiences 
SET name = 'Kayak Trip Eberhard Fjord Half Day'
WHERE id = (
  SELECT id 
  FROM experiences 
  ORDER BY created_at 
  LIMIT 1 OFFSET 2
);