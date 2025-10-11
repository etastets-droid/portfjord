-- Add Spanish translation columns to properties table
ALTER TABLE public.properties 
ADD COLUMN name_es TEXT,
ADD COLUMN description_es TEXT;

-- Add Spanish translation columns to experiences table
ALTER TABLE public.experiences 
ADD COLUMN name_es TEXT,
ADD COLUMN description_es TEXT;