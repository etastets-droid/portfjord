import { useState, useEffect } from "react";
import { Send, Search, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface Message {
  id: string;
  guest_name: string;
  guest_email: string;
  subject: string;
  message: string;
  response: string | null;
  status: 'pending' | 'responded';
  created_at: string;
  property_name?: string;
}

export function MessagingCenter() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [response, setResponse] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      // For demo purposes, we'll create some example messages
      // In a real implementation, you'd have a messages table in Supabase
      const exampleMessages: Message[] = [
        {
          id: "1",
          guest_name: "María González",
          guest_email: "maria.gonzalez@email.com",
          subject: "Consulta sobre check-in tardío",
          message: "Hola, quería consultar si es posible hacer el check-in después de las 22:00. Mi vuelo llega tarde.",
          response: null,
          status: 'pending',
          created_at: new Date().toISOString(),
          property_name: "Casa Lago Patagonia"
        },
        {
          id: "2",
          guest_name: "Carlos Rodríguez",
          guest_email: "carlos.rodriguez@email.com",
          subject: "Pregunta sobre amenidades",
          message: "¿La propiedad cuenta con WiFi y aire acondicionado? También quería saber si hay estacionamiento disponible.",
          response: "Hola Carlos, sí contamos con WiFi de alta velocidad y aire acondicionado en todas las habitaciones. El estacionamiento está incluido sin costo adicional.",
          status: 'responded',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          property_name: "Cabaña Bosque Encantado"
        },
        {
          id: "3",
          guest_name: "Ana Silva",
          guest_email: "ana.silva@email.com",
          subject: "Solicitud de cancelación",
          message: "Debido a una emergencia familiar, necesito cancelar mi reserva. ¿Cuál es la política de cancelación?",
          response: null,
          status: 'pending',
          created_at: new Date(Date.now() - 43200000).toISOString(),
          property_name: "Departamento Centro Turístico"
        }
      ];

      setMessages(exampleMessages);
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
      // In a real implementation, you'd update the database
      const updatedMessages = messages.map(msg => 
        msg.id === selectedMessage.id 
          ? { ...msg, response: response, status: 'responded' as const }
          : msg
      );
      
      setMessages(updatedMessages);
      setSelectedMessage({ ...selectedMessage, response: response, status: 'responded' });
      setResponse("");
      
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

  const filteredMessages = messages.filter(message =>
    message.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
          <h1 className="text-3xl font-bold">Centro de Mensajería</h1>
          <p className="text-muted-foreground">Gestiona la comunicación con tus huéspedes</p>
        </div>
        
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
                    <h3 className="font-medium truncate">{message.guest_name}</h3>
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
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{message.property_name}</span>
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
                      De: {selectedMessage.guest_name} ({selectedMessage.guest_email})
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Propiedad: {selectedMessage.property_name}
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

                {/* Response Form */}
                {selectedMessage.status === 'pending' && (
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