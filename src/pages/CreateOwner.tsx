import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const CreateOwner = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleCreateWoodsOwner = async () => {
    setLoading(true);
    try {
      const response = await fetch('/supabase/functions/v1/create-owner-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'tcpatagonia30@hotmail.com',
          password: 'WoodsHouse2024!',
          name: 'Woods House Owner',
          propertyId: '9c83de44-dbf7-4b7c-a5c0-b6934a867d81' // The Woods House ID
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Usuario creado exitosamente",
          description: `Owner creado para The Woods House. Email: tcpatagonia30@hotmail.com, Password: WoodsHouse2024!`
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Error al crear usuario: ${error}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Crear Usuario Owner</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value="tcpatagonia30@hotmail.com" disabled />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input value="WoodsHouse2024!" disabled />
            </div>
            <div className="space-y-2">
              <Label>Propiedad asignada</Label>
              <Input value="The Woods House" disabled />
            </div>
            <Button 
              onClick={handleCreateWoodsOwner} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Creando...' : 'Crear Usuario Owner para The Woods House'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateOwner;