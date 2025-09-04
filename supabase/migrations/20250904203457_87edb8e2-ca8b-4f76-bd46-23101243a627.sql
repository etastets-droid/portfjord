-- Check current RLS policies and add additional security measures

-- Add explicit denial policy for unauthenticated users on experience_requests
DROP POLICY IF EXISTS "Deny all public access to experience requests" ON experience_requests;
CREATE POLICY "Deny all public access to experience requests" 
ON experience_requests 
FOR ALL 
TO anon 
USING (false);

-- Add explicit denial policy for unauthenticated users on reservations  
DROP POLICY IF EXISTS "Deny all public access to reservations" ON reservations;
CREATE POLICY "Deny all public access to reservations" 
ON reservations 
FOR ALL 
TO anon 
USING (false);

-- Ensure only authenticated users can access sensitive data
-- Add policy to restrict experience_requests to only owners and the requester
DROP POLICY IF EXISTS "Owners can view experience requests" ON experience_requests;
CREATE POLICY "Owners can view experience requests" 
ON experience_requests 
FOR SELECT 
TO authenticated
USING (
  auth.uid() = user_id OR 
  auth.uid() IN (SELECT user_id FROM owners)
);

-- Add policy for owners to update experience requests status
DROP POLICY IF EXISTS "Owners can update experience requests" ON experience_requests;
CREATE POLICY "Owners can update experience requests" 
ON experience_requests 
FOR UPDATE 
TO authenticated
USING (auth.uid() IN (SELECT user_id FROM owners))
WITH CHECK (auth.uid() IN (SELECT user_id FROM owners));