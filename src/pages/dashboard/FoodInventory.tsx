import { useState } from "react";
import { useFoodItems } from "@/hooks/useFoodItems";
import { FoodItem, CreateFoodPayload, UpdateFoodPayload, FoodGroup, FOOD_GROUP_LABELS, validateFoodItem } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Trash2, Pencil, Calendar, Package, AlertTriangle, Loader2 } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import toast from "react-hot-toast";
import { format, isAfter, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";

const FoodInventory = () => {
  const { foodItems, loading, error, createFoodItem, updateFoodItem, deleteFoodItem, clearError } = useFoodItems();

  // Safety check to ensure foodItems is always an array
  const safeFoodItems = Array.isArray(foodItems) ? foodItems : [];

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<FoodItem | null>(null);
  const [form, setForm] = useState<CreateFoodPayload>({
    name: "",
    quantity: 1,
    expiration: ""
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const getFoodImage = (name: string) => {
    const foodImages: { [key: string]: string } = {
      'apple': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop',
      'banana': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop',
      'tomato': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop',
      'chicken': 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop',
      'rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
      'bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
    };
    
    const lowerName = name.toLowerCase();
    for (const [food, image] of Object.entries(foodImages)) {
      if (lowerName.includes(food)) {
        return image;
      }
    }
    return 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop';
  };

  const getExpirationStatus = (expiration: string) => {
    const expirationDate = new Date(expiration);
    const today = new Date();
    const daysUntilExpiration = differenceInDays(expirationDate, today);

    if (daysUntilExpiration < 0) {
      return { status: 'expired', color: 'bg-red-500', text: 'Vencido' };
    } else if (daysUntilExpiration <= 3) {
      return { status: 'expiring', color: 'bg-yellow-500', text: `${daysUntilExpiration} ${daysUntilExpiration === 1 ? 'dia restante' : 'dias restantes'}` };
    } else {
      return { status: 'fresh', color: 'bg-green-500', text: `${daysUntilExpiration} dias restantes` };
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      quantity: 1,
      expiration: ""
    });
    setFormErrors({});
    setEditing(null);
  };

  const handleEdit = (item: FoodItem) => {
    setEditing(item);
    setForm({
      name: item.name,
      quantity: item.quantity,
      expiration: item.expiration
    });
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validation = validateFoodItem(form);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    try {
      if (editing) {
        // Para atualização, enviamos apenas nome, quantidade e data de validade
        const updatePayload = {
          id: editing.id!,
          name: form.name,
          quantity: form.quantity,
          expiration: form.expiration
        };
        await updateFoodItem(updatePayload);
        toast.success("Alimento atualizado com sucesso!");
      } else {
        // Para criação, enviamos apenas nome, quantidade e data de validade
        // O backend calculará automaticamente as informações nutricionais
        await createFoodItem(form);
        toast.success("Alimento criado com sucesso!");
      }
      setOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || "Falha ao salvar alimento");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteFoodItem(id);
      toast.success("Alimento excluído com sucesso!");
    } catch (error: any) {
      toast.error(error.message || "Falha ao excluir alimento");
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <span>Erro ao carregar alimentos: {error}</span>
            </div>
            <Button
              onClick={clearError}
              variant="outline"
              className="mt-4"
            >
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/50 p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Despensa Inteligente</h1>
            <p className="text-sm text-muted-foreground">Gerencie seus alimentos com IA</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-primary-foreground">
                <Plus className="h-4 w-4" />
                Adicionar Alimento
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {editing ? "Editar Alimento" : "Adicionar Novo Alimento"}
                {!editing && (
                  <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    Nutrientes via IA
                  </span>
                )}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="name">Nome do Alimento *</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="ex: Maçã, Peito de Frango, Arroz..."
                  />
                  {formErrors.name && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.name}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Nossa IA identificará automaticamente os nutrientes e grupo alimentar
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantidade *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 1 })}
                  />
                  {formErrors.quantity && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.quantity}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="expiration">Data de Validade *</Label>
                  <Input
                    id="expiration"
                    type="date"
                    value={form.expiration}
                    onChange={(e) => setForm({ ...form, expiration: e.target.value })}
                  />
                  {formErrors.expiration && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.expiration}</p>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-md border border-blue-100 mt-4">
                <div className="flex items-center gap-2 text-blue-700 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
                  <span className="font-medium">Informações Nutricionais Automáticas</span>
                </div>
                <p className="text-sm text-blue-600">
                  Nossa IA analisará automaticamente o alimento para calcular:
                </p>
                <ul className="text-xs text-blue-600 mt-2 grid grid-cols-2 gap-1">
                  <li>• Calorias</li>
                  <li>• Proteínas</li>
                  <li>• Gorduras</li>
                  <li>• Carboidratos</li>
                  <li>• Fibras</li>
                  <li>• Açúcares</li>
                  <li>• Sódio</li>
                  <li>• Grupo alimentar</li>
                </ul>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editing ? "Atualizar" : "Adicionar"} Alimento
                </Button>
              </div>
            </form>
          </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="p-4 space-y-6">

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Carregando alimentos...</span>
        </div>
      ) : safeFoodItems.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum alimento ainda</h3>
            <p className="text-gray-600 mb-4">Adicione seu primeiro alimento e nossa IA calculará automaticamente as informações nutricionais.</p>
            <Button onClick={() => setOpen(true)} className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Alimento com IA
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {safeFoodItems.map((item) => {
            const expirationStatus = getExpirationStatus(item.expiration);
            const tags = item.tags ? item.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];

            return (
              <Card key={item.id} className="bg-gradient-card border-border/50 overflow-hidden hover:shadow-glow hover:scale-[1.02] transition-all duration-300">
                <AspectRatio ratio={16 / 9}>
                  <img
                    src={getFoodImage(item.name)}
                    alt={item.name}
                    className="object-cover w-full h-full"
                  />
                </AspectRatio>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base text-foreground">{item.name}</CardTitle>
                    <Badge className={`${expirationStatus.color} text-white text-xs`}>
                      {expirationStatus.text}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      <span>Qtd: {item.quantity}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{format(new Date(item.expiration), 'dd/MM/yyyy', { locale: ptBR })}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Grupo:</span>
                      <Badge variant="outline" className="text-xs">{FOOD_GROUP_LABELS[item.foodGroup]}</Badge>
                    </div>

                    {(item.calories || item.protein || item.fat || item.carbohydrates) && (
                      <div className="text-xs text-muted-foreground">
                        <div className="grid grid-cols-2 gap-1">
                          {item.calories && <span>Cal: {item.calories}</span>}
                          {item.protein && <span>Prot: {item.protein}g</span>}
                          {item.fat && <span>Gord: {item.fat}g</span>}
                          {item.carbohydrates && <span>Carb: {item.carbohydrates}g</span>}
                        </div>
                      </div>
                    )}

                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(item)}
                        className="h-8 w-8 p-0"
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir Alimento</AlertDialogTitle>
                          </AlertDialogHeader>
                          <p>Tem certeza que deseja excluir "{item.name}"? Esta ação não pode ser desfeita.</p>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(item.id!)}>
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      </div>
    </div>
  );
};

export default FoodInventory;