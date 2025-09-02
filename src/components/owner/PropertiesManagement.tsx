import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, Building } from "lucide-react";
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

interface Property {
  id: string;
  name: string;
  description: string;
  address: string;
  price_per_night: number;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  status: string;
}

export function PropertiesManagement() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    price_per_night: 0,
    max_guests: 1,
    bedrooms: 1,
    bathrooms: 1,
    amenities: [] as string[],
  });

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
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
        .from('properties')
        .select('*')
        .eq('owner_id', owner.id);

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error loading properties:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las propiedades",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data: owner } = await supabase
        .from('owners')
        .select('id')
        .eq('user_id', user.user.id)
        .single();

      if (!owner) return;

      if (editingProperty) {
        const { error } = await supabase
          .from('properties')
          .update(formData)
          .eq('id', editingProperty.id);

        if (error) throw error;
        
        toast({
          title: "Éxito",
          description: "Propiedad actualizada correctamente"
        });
      } else {
        const { error } = await supabase
          .from('properties')
          .insert({
            ...formData,
            owner_id: owner.id
          });

        if (error) throw error;
        
        toast({
          title: "Éxito",
          description: "Propiedad creada correctamente"
        });
      }

      setIsAddDialogOpen(false);
      setEditingProperty(null);
      setFormData({
        name: "",
        description: "",
        address: "",
        price_per_night: 0,
        max_guests: 1,
        bedrooms: 1,
        bathrooms: 1,
        amenities: [],
      });
      loadProperties();
    } catch (error) {
      console.error('Error saving property:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar la propiedad",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setFormData({
      name: property.name,
      description: property.description,
      address: property.address,
      price_per_night: property.price_per_night,
      max_guests: property.max_guests,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      amenities: property.amenities || [],
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (propertyId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta propiedad?')) return;

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);

      if (error) throw error;
      
      toast({
        title: "Éxito",
        description: "Propiedad eliminada correctamente"
      });
      loadProperties();
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la propiedad",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Cargando propiedades...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Propiedades</h1>
          <p className="text-muted-foreground">Administra tus alojamientos y configuraciones</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingProperty(null);
              setFormData({
                name: "",
                description: "",
                address: "",
                price_per_night: 0,
                max_guests: 1,
                bedrooms: 1,
                bathrooms: 1,
                amenities: [],
              });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Propiedad
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingProperty ? 'Editar Propiedad' : 'Agregar Nueva Propiedad'}
              </DialogTitle>
              <DialogDescription>
                Completa la información de la propiedad
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price_per_night">Precio por noche</Label>
                  <Input
                    id="price_per_night"
                    type="number"
                    value={formData.price_per_night}
                    onChange={(e) => setFormData({...formData, price_per_night: Number(e.target.value)})}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="max_guests">Huéspedes máx.</Label>
                  <Input
                    id="max_guests"
                    type="number"
                    min="1"
                    value={formData.max_guests}
                    onChange={(e) => setFormData({...formData, max_guests: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="bedrooms">Habitaciones</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    min="1"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({...formData, bedrooms: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="bathrooms">Baños</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    min="1"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({...formData, bathrooms: Number(e.target.value)})}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingProperty ? 'Actualizar' : 'Crear'} Propiedad
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <Card key={property.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{property.name}</CardTitle>
                <Badge variant={property.status === 'active' ? 'default' : 'secondary'}>
                  {property.status === 'active' ? 'Activa' : 'Inactiva'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {property.description}
              </p>
              <div className="text-sm space-y-1">
                <p><strong>Dirección:</strong> {property.address}</p>
                <p><strong>Precio:</strong> ${property.price_per_night}/noche</p>
                <p><strong>Capacidad:</strong> {property.max_guests} huéspedes</p>
                <p><strong>Habitaciones:</strong> {property.bedrooms} | <strong>Baños:</strong> {property.bathrooms}</p>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(property)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(property.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {properties.length === 0 && (
        <Card className="p-8 text-center">
          <div className="text-muted-foreground">
            <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No hay propiedades</h3>
            <p>Agrega tu primera propiedad para comenzar a gestionar reservas</p>
          </div>
        </Card>
      )}
    </div>
  );
}