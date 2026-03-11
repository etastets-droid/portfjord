-- Update Kayak Trip to Kayak Journey in experiences table
UPDATE experiences 
SET name = 'Kayak Journey Eberhard Fjord Half Day',
    updated_at = now()
WHERE name = 'Kayak Trip Eberhard Fjord Half Day';

-- Also update the Spanish version if it exists
UPDATE experiences 
SET name_es = 'Kayak Journey Fiordo Eberhard Media Jornada',
    updated_at = now()
WHERE name = 'Kayak Journey Eberhard Fjord Half Day';