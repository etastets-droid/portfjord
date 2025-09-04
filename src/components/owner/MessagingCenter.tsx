import { useState, useEffect } from "react";
import { Send, Search, MessageCircle, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface AdminMessage {
  id: string;
  sender_id: string;
  sender_type: 'owner' | 'admin';
  receiver_id: string | null;
  receiver_type: 'owner' | 'admin' | null;
  subject: string;
  message: string;
  response: string | null;
  status: 'pending' | 'responded';
  created_at: string;
  updated_at: string;
}

export function MessagingCenter() {
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<AdminMessage | null>(null);
  const [response, setResponse] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  const [newMessageData, setNewMessageData] = useState({
    subject: "",
    message: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data: owner } = await supabase
        .from('owners')
        .select('id')
        .eq('user_id', user.user.id)
        .single();

      if (!owner) return;

      const { data, error } = await supabase
        .from('admin_messages')
        .select('*')
        .or(`sender_id.eq.${owner.id},receiver_id.eq.${owner.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages((data || []) as AdminMessage[]);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los mensajes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendResponse = async () => {
    if (!selectedMessage || !response.trim()) return;

    try {
      const { error } = await supabase
        .from('admin_messages')
        .update({ 
          response: response, 
          status: 'responded',
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedMessage.id);

      if (error) throw error;
      
      setSelectedMessage({ 
        ...selectedMessage, 
        response: response, 
        status: 'responded' 
      });
      setResponse("");
      await loadMessages();
      
      toast({
        title: "Éxito",
        description: "Respuesta enviada correctamente"
      });
    } catch (error) {
      console.error('Error sending response:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar la respuesta",
        variant: "destructive"
      });
    }
  };

  const handleNewMessage = async () => {
    if (!newMessageData.subject.trim() || !newMessageData.message.trim()) return;

    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data: owner } = await supabase
        .from('owners')
        .select('id')
        .eq('user_id', user.user.id)
        .single();

      if (!owner) return;

      const { error } = await supabase
        .from('admin_messages')
        .insert({
          sender_id: owner.id,
          sender_type: 'owner',
          receiver_type: 'admin',
          subject: newMessageData.subject,
          message: newMessageData.message
        });

      if (error) throw error;

      setNewMessageData({ subject: "", message: "" });
      setIsNewMessageOpen(false);
      await loadMessages();
      
      toast({
        title: "Éxito",
        description: "Mensaje enviado a administración"
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje",
        variant: "destructive"
      });
    }
  };

  const filteredMessages = messages.filter(message =>
    message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Cargando mensajes...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Centro de Mensajería - Administración</h1>
          <p className="text-muted-foreground">Comunícate con el equipo de administración</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Dialog open={isNewMessageOpen} onOpenChange={setIsNewMessageOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Mensaje
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Enviar mensaje a administración</DialogTitle>
                <DialogDescription>
                  Escribe tu consulta o solicitud para el equipo administrativo
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="subject">Asunto</Label>
                  <Input
                    id="subject"
                    value={newMessageData.subject}
                    onChange={(e) => setNewMessageData({
                      ...newMessageData, 
                      subject: e.target.value
                    })}
                    placeholder="Escribe el asunto del mensaje"
                  />
                </div>
                <div>
                  <Label htmlFor="message">Mensaje</Label>
                  <Textarea
                    id="message"
                    value={newMessageData.message}
                    onChange={(e) => setNewMessageData({
                      ...newMessageData, 
                      message: e.target.value
                    })}
                    placeholder="Escribe tu mensaje aquí..."
                    rows={6}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsNewMessageOpen(false)}>
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleNewMessage}
                    disabled={!newMessageData.subject.trim() || !newMessageData.message.trim()}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Mensaje
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar mensajes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Messages List */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-semibold">Mensajes</h2>
          
          {filteredMessages.map((message) => (
            <Card 
              key={message.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedMessage?.id === message.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedMessage(message)}
            >
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium truncate">
                      {message.sender_type === 'admin' ? 'Administración' : 'Mi mensaje'}
                    </h3>
                    <Badge variant={message.status === 'pending' ? 'destructive' : 'default'}>
                      {message.status === 'pending' ? 'Pendiente' : 'Respondido'}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground truncate">
                    {message.subject}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {message.message}
                  </p>
                  <div className="flex items-center justify-end text-xs text-muted-foreground">
                    <span>{formatDate(message.created_at)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredMessages.length === 0 && (
            <Card className="p-8 text-center">
              <div className="text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No hay mensajes</h3>
                <p>No se encontraron mensajes que coincidan con tu búsqueda</p>
              </div>
            </Card>
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedMessage.subject}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {selectedMessage.sender_type === 'admin' ? 'De: Administración' : 'Tu mensaje a administración'}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant={selectedMessage.status === 'pending' ? 'destructive' : 'default'}>
                      {selectedMessage.status === 'pending' ? 'Pendiente' : 'Respondido'}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDate(selectedMessage.created_at)}
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Original Message */}
                <div>
                  <h4 className="font-medium mb-2">Mensaje:</h4>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm">{selectedMessage.message}</p>
                  </div>
                </div>

                {/* Previous Response */}
                {selectedMessage.response && (
                  <div>
                    <h4 className="font-medium mb-2">Tu respuesta:</h4>
                    <div className="bg-primary/10 p-4 rounded-lg">
                      <p className="text-sm">{selectedMessage.response}</p>
                    </div>
                  </div>
                )}

                {/* Response Form - Only for received messages from admin */}
                {selectedMessage.status === 'pending' && selectedMessage.sender_type === 'admin' && (
                  <div>
                    <h4 className="font-medium mb-2">Escribir respuesta:</h4>
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Escribe tu respuesta aquí..."
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        rows={6}
                      />
                      <div className="flex justify-end">
                        <Button onClick={handleSendResponse} disabled={!response.trim()}>
                          <Send className="h-4 w-4 mr-2" />
                          Enviar Respuesta
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Selecciona un mensaje</h3>
                <p className="text-muted-foreground">
                  Elige un mensaje de la lista para ver los detalles y responder
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}