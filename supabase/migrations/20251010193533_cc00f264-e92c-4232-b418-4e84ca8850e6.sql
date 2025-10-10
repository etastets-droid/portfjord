-- Ensure RLS is enabled on owners table
ALTER TABLE public.owners ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Users can view their own owner profile" ON public.owners;
DROP POLICY IF EXISTS "Users can create their own owner profile" ON public.owners;
DROP POLICY IF EXISTS "Users can update their own owner profile" ON public.owners;

-- Block all public access explicitly
CREATE POLICY "Block public access to owners"
ON public.owners
FOR ALL
TO anon
USING (false);

-- Only authenticated users can view their own owner profile
CREATE POLICY "Authenticated users can view their own owner profile"
ON public.owners
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Only authenticated users can create their own owner profile
CREATE POLICY "Authenticated users can create their own owner profile"
ON public.owners
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Only authenticated users can update their own owner profile
CREATE POLICY "Authenticated users can update their own owner profile"
ON public.owners
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);