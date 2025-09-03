-- Update experience name to "Cabalgata Estancia Puerto Consuelo Half day"
UPDATE experiences 
SET name = 'Cabalgata Estancia Puerto Consuelo Half day'
WHERE id = (
  SELECT id 
  FROM experiences 
  ORDER BY created_at 
  LIMIT 1 OFFSET 4
);