-- Crear tabla para mensajes entre owners y administradores
CREATE TABLE public.admin_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('owner', 'admin')),
  receiver_id UUID,
  receiver_type TEXT CHECK (receiver_type IN ('owner', 'admin')),
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  response TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'responded')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_messages ENABLE ROW LEVEL SECURITY;

-- Policies for owners to see their own messages and send to admins
CREATE POLICY "Owners can view their own messages" 
ON public.admin_messages 
FOR SELECT 
USING (
  (sender_type = 'owner' AND sender_id IN (
    SELECT o.id FROM owners o WHERE o.user_id = auth.uid()
  )) 
  OR 
  (receiver_type = 'owner' AND receiver_id IN (
    SELECT o.id FROM owners o WHERE o.user_id = auth.uid()
  ))
);

CREATE POLICY "Owners can create messages to admins" 
ON public.admin_messages 
FOR INSERT 
WITH CHECK (
  sender_type = 'owner' AND sender_id IN (
    SELECT o.id FROM owners o WHERE o.user_id = auth.uid()
  )
);

CREATE POLICY "Owners can update their own pending messages" 
ON public.admin_messages 
FOR UPDATE 
USING (
  sender_type = 'owner' AND sender_id IN (
    SELECT o.id FROM owners o WHERE o.user_id = auth.uid()
  ) AND status = 'pending'
);

-- Add trigger for updating timestamps
CREATE TRIGGER update_admin_messages_updated_at
BEFORE UPDATE ON public.admin_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();