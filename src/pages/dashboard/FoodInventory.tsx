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

const FoodInventory = () => {
  const { foodItems, loading, error, createFoodItem, updateFoodItem, deleteFoodItem, clearError } = useFoodItems();

  // Safety check to ensure foodItems is always an array
  const safeFoodItems = Array.isArray(foodItems) ? foodItems : [];

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<FoodItem | null>(null);
  const [form, setForm] = useState<CreateFoodPayload>({
    name: "",
    quantity: 1,
    expiration: "",
    calories: 0,
    protein: 0,
    fat: 0,
    carbohydrates: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0,
    foodGroup: FoodGroup.FRUITS,
    tags: ""
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
      expiration: "",
      calories: 0,
      protein: 0,
      fat: 0,
      carbohydrates: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
      foodGroup: FoodGroup.FRUITS,
      tags: ""
    });
    setFormErrors({});
    setEditing(null);
  };

  const handleEdit = (item: FoodItem) => {
    setEditing(item);
    setForm({
      name: item.name,
      quantity: item.quantity,
      expiration: item.expiration,
      calories: item.calories || 0,
      protein: item.protein || 0,
      fat: item.fat || 0,
      carbohydrates: item.carbohydrates || 0,
      fiber: item.fiber || 0,
      sugar: item.sugar || 0,
      sodium: item.sodium || 0,
      foodGroup: item.foodGroup,
      tags: item.tags
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
        await updateFoodItem({ ...form, id: editing.id! });
        toast.success("Alimento atualizado com sucesso!");
      } else {
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
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Despensa</h1>
          <p className="text-gray-600 mt-1">Gerencie seus alimentos e acompanhe as datas de validade</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Alimento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editing ? "Editar Alimento" : "Adicionar Novo Alimento"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="ex: Maçã"
                  />
                  {formErrors.name && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.name}</p>
                  )}
                </div>
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
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                <div>
                  <Label htmlFor="foodGroup">Grupo Alimentar *</Label>
                  <Select
                    value={form.foodGroup}
                    onValueChange={(value) => setForm({ ...form, foodGroup: value as FoodGroup })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(FoodGroup).map((group) => (
                        <SelectItem key={group} value={group}>
                          {FOOD_GROUP_LABELS[group]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.foodGroup && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.foodGroup}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="ex: orgânico,fresco,local (separado por vírgulas)"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="calories">Calorias</Label>
                  <Input
                    id="calories"
                    type="number"
                    min="0"
                    step="0.1"
                    value={form.calories}
                    onChange={(e) => setForm({ ...form, calories: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="protein">Proteína (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    min="0"
                    step="0.1"
                    value={form.protein}
                    onChange={(e) => setForm({ ...form, protein: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="fat">Gordura (g)</Label>
                  <Input
                    id="fat"
                    type="number"
                    min="0"
                    step="0.1"
                    value={form.fat}
                    onChange={(e) => setForm({ ...form, fat: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="carbohydrates">Carboidratos (g)</Label>
                  <Input
                    id="carbohydrates"
                    type="number"
                    min="0"
                    step="0.1"
                    value={form.carbohydrates}
                    onChange={(e) => setForm({ ...form, carbohydrates: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="fiber">Fibra (g)</Label>
                  <Input
                    id="fiber"
                    type="number"
                    min="0"
                    step="0.1"
                    value={form.fiber}
                    onChange={(e) => setForm({ ...form, fiber: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="sodium">Sódio (mg)</Label>
                  <Input
                    id="sodium"
                    type="number"
                    min="0"
                    step="0.1"
                    value={form.sodium}
                    onChange={(e) => setForm({ ...form, sodium: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editing ? "Atualizar" : "Criar"} Alimento
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Carregando alimentos...</span>
        </div>
      ) : safeFoodItems.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum alimento ainda</h3>
            <p className="text-gray-600 mb-4">Comece adicionando seu primeiro alimento para acompanhar sua despensa.</p>
            <Button onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Alimento
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {safeFoodItems.map((item) => {
            const expirationStatus = getExpirationStatus(item.expiration);
            const tags = item.tags ? item.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];

            return (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <AspectRatio ratio={16 / 9}>
                  <img
                    src={getFoodImage(item.name)}
                    alt={item.name}
                    className="object-cover w-full h-full"
                  />
                </AspectRatio>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <Badge className={`${expirationStatus.color} text-white`}>
                      {expirationStatus.text}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Package className="h-4 w-4" />
                      <span>Qtd: {item.quantity}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(item.expiration), 'dd/MM/yyyy')}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Grupo Alimentar:</span>
                      <Badge variant="outline">{FOOD_GROUP_LABELS[item.foodGroup]}</Badge>
                    </div>

                    {(item.calories || item.protein || item.fat || item.carbohydrates) && (
                      <div className="text-sm text-gray-600">
                        <div className="grid grid-cols-2 gap-1">
                          {item.calories && <span>Calorias: {item.calories}</span>}
                          {item.protein && <span>Proteína: {item.protein}g</span>}
                          {item.fat && <span>Gordura: {item.fat}g</span>}
                          {item.carbohydrates && <span>Carboidratos: {item.carbohydrates}g</span>}
                        </div>
                      </div>
                    )}

                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(item)}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline">
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
  );
};

export default FoodInventory;