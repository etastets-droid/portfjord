-- Update experience name to "Bird Watching – Torres del Paine Full Day"
UPDATE experiences 
SET name = 'Bird Watching – Torres del Paine Full Day'
WHERE id = (
  SELECT id 
  FROM experiences 
  ORDER BY created_at 
  LIMIT 1 OFFSET 0
);