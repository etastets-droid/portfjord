-- Update Cliff House description with new text
UPDATE properties 
SET description = 'Seated dramatically on the hillside, the Cliff House feels both bold and serene, offering mesmerizing views of the fjord and surrounding peaks. Each window frames the landscape, creating shifting scenes throughout the day. Designed with natural textures and spacious interiors, it''s a place to slow down, breathe deeply, and feel immersed in the wild beauty that surrounds you.',
    updated_at = now()
WHERE name = 'The Cliff House';