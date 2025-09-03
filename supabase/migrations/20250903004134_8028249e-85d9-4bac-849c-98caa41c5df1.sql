-- Update experience name to "Trekking Estancia Puerto Consuelo Full day"
UPDATE experiences 
SET name = 'Trekking Estancia Puerto Consuelo Full day'
WHERE id = (
  SELECT id 
  FROM experiences 
  ORDER BY created_at 
  LIMIT 1 OFFSET 2
);