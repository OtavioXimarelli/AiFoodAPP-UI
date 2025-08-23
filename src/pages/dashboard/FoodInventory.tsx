import { useState } from "react";
import { useFoodItems } from "@/hooks/useFoodItems";
import { FoodItem, CreateFoodPayload, UpdateFoodPayload, FoodGroup, FOOD_GROUP_LABELS, validateFoodItem } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Trash2, Pencil, Calendar as CalendarIcon, Package, AlertTriangle, Loader2, Scale, Hash, CalendarDays, Info } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { format, isAfter, differenceInDays, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect } from "react";

const FoodInventory = () => {
  const { foodItems, loading, error, createFoodItem, updateFoodItem, deleteFoodItem, clearError } = useFoodItems();

  // Safety check to ensure foodItems is always an array
  const safeFoodItems = Array.isArray(foodItems) ? foodItems : [];

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<FoodItem | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
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
    foodGroup: FoodGroup.VEGETABLES, // default value
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
      return { 
        status: 'expired', 
        color: 'bg-red-500', 
        text: '⚠️ Vencido',
        icon: '🚨'
      };
    } else if (daysUntilExpiration <= 3) {
      return { 
        status: 'expiring', 
        color: 'bg-yellow-500', 
        text: `⏰ ${daysUntilExpiration} ${daysUntilExpiration === 1 ? 'dia restante' : 'dias restantes'}`,
        icon: '⚠️'
      };
    } else {
      return { 
        status: 'fresh', 
        color: 'bg-green-500', 
        text: `✅ ${daysUntilExpiration} dias restantes`,
        icon: '✅'
      };
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
      foodGroup: FoodGroup.VEGETABLES,
      tags: ""
    });
    setFormErrors({});
    setEditing(null);
  };

  // Mostrar modal de boas-vindas na primeira visita
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('food_inventory_welcome_seen');
    if (!hasSeenWelcome) {
      setShowWelcomeModal(true);
    }
  }, []);

  const handleWelcomeModalClose = () => {
    setShowWelcomeModal(false);
    localStorage.setItem('food_inventory_welcome_seen', 'true');
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
      tags: item.tags || ""
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
        // Para atualização, enviamos todos os campos
        const updatePayload = {
          id: editing.id!,
          name: form.name,
          quantity: form.quantity,
          expiration: form.expiration
        };
        await updateFoodItem(updatePayload);
        toast.success("Alimento atualizado com sucesso!");
      } else {
        // Para criação, enviamos todos os campos conforme esperado pela API
        const createPayload: CreateFoodPayload = {
          name: form.name,
          quantity: form.quantity,
          expiration: form.expiration,
          calories: form.calories,
          protein: form.protein,
          fat: form.fat,
          carbohydrates: form.carbohydrates,
          fiber: form.fiber,
          sugar: form.sugar,
          sodium: form.sodium,
          foodGroup: form.foodGroup,
          tags: form.tags
        };
        await createFoodItem(createPayload);
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-background/60 pb-20 lg:pb-0 scrollbar-default">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border/30 p-4 shadow-lg shadow-black/5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Despensa Inteligente</h1>
            <p className="text-sm text-muted-foreground">Gerencie seus alimentos com IA</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-primary-foreground">
                <Plus className="h-4 w-4" />
                Adicionar Alimento
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar bg-background/95 backdrop-blur-xl border border-border/20 shadow-2xl">
            <DialogHeader className="space-y-4 pb-6 border-b border-border/10">
              <DialogTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-xl border border-primary/20 shadow-sm">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  {editing ? "Editar Alimento" : "Adicionar Novo Alimento"}
                  {!editing && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300 ring-1 ring-inset ring-blue-200 dark:ring-blue-800">
                        🤖 Nutrientes via IA
                      </span>
                    </div>
                  )}
                </div>
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {editing ? "Atualize as informações do alimento selecionado" : "Adicione um novo alimento ao seu inventário. Nossa IA identificará automaticamente os nutrientes."}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6 pt-2">
              {/* Campo Nome do Alimento */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-foreground flex items-center gap-2">
                  <div className="p-1 bg-primary/10 rounded-md">
                    <Package className="h-3 w-3 text-primary" />
                  </div>
                  Nome do Alimento *
                </Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="ex: Maçã, Peito de Frango, Arroz..."
                  className="h-11 border-border/50 focus:border-primary/50 transition-colors"
                />
                {formErrors.name && (
                  <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                    <AlertTriangle className="h-3 w-3" />
                    {formErrors.name}
                  </p>
                )}
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 16v-4"/>
                    <path d="M12 8h.01"/>
                  </svg>
                  Nossa IA identificará automaticamente os nutrientes e grupo alimentar
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Campo Quantidade Simplificado */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <div className="p-1 bg-green-500/10 rounded-md">
                      <Scale className="h-3 w-3 text-green-600" />
                    </div>
                    Quantidade *
                  </Label>
                  <div className="space-y-2">
                    <Input
                      type="number"
                      min="1"
                      value={form.quantity}
                      onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 1 })}
                      className="h-11 border-border/50 focus:border-primary/50 transition-colors"
                      placeholder="Ex: 500, 3, 1..."
                    />
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 16v-4"/>
                        <path d="M12 8h.01"/>
                      </svg>
                      Use números para quantidade (ex: 500g = 500, 3 unidades = 3)
                    </p>
                  </div>
                  {formErrors.quantity && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {formErrors.quantity}
                    </p>
                  )}
                </div>

                {/* Campo Data de Validade Melhorado */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <div className="p-1 bg-orange-500/10 rounded-md">
                      <CalendarDays className="h-3 w-3 text-orange-600" />
                    </div>
                    Data de Validade *
                  </Label>
                  <div className="space-y-2">
                    {/* Date Picker Customizado */}
                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full h-11 justify-start text-left font-normal border-border/50 hover:border-primary/50 transition-all duration-200",
                            !form.expiration && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-orange-600" />
                          {form.expiration ? (
                            format(new Date(form.expiration), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                          ) : (
                            <span>Selecione a data de validade</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-background/98 backdrop-blur-xl border border-border/30 shadow-2xl rounded-xl overflow-hidden" align="start" sideOffset={4}>
                        {/* Header do Calendário */}
                        <div className="p-3 border-b border-border/10 bg-gradient-to-r from-orange-50/50 to-amber-50/30 dark:from-orange-950/20 dark:to-amber-950/10">
                          <h4 className="font-medium text-foreground flex items-center gap-2 text-sm">
                            <div className="p-1.5 bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-lg">
                              <CalendarIcon className="h-3.5 w-3.5 text-orange-600" />
                            </div>
                            Selecionar Data de Validade
                          </h4>
                        </div>
                        
                        {/* Calendário */}
                        <div className="p-3">
                          <Calendar
                            mode="single"
                            selected={form.expiration ? new Date(form.expiration) : undefined}
                            onSelect={(date) => {
                              if (date) {
                                setForm({ ...form, expiration: date.toISOString().split('T')[0] });
                                setCalendarOpen(false);
                              }
                            }}
                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                            initialFocus
                            className="rounded-md border-0"
                          />
                        </div>
                        
                        {/* Footer com Atalhos */}
                        <div className="p-3 border-t border-border/10 bg-muted/20">
                          <div className="flex gap-1 flex-wrap">
                            {[
                              { label: "Hoje", days: 0 },
                              { label: "3 dias", days: 3 },
                              { label: "1 semana", days: 7 },
                              { label: "1 mês", days: 30 }
                            ].map((option) => (
                              <Button
                                key={option.label}
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const date = addDays(new Date(), option.days);
                                  setForm({ ...form, expiration: date.toISOString().split('T')[0] });
                                  setCalendarOpen(false);
                                }}
                                className="h-7 px-2 text-xs hover:bg-primary/10 hover:text-primary transition-colors"
                              >
                                {option.label}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                    
                    {/* Botões de Atalho Externa (mantida para compatibilidade) */}
                    <div className="flex gap-1 flex-wrap">
                      {[
                        { label: "Hoje", days: 0 },
                        { label: "3 dias", days: 3 },
                        { label: "1 semana", days: 7 },
                        { label: "1 mês", days: 30 }
                      ].map((option) => (
                        <Button
                          key={option.label}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const date = addDays(new Date(), option.days);
                            setForm({ ...form, expiration: date.toISOString().split('T')[0] });
                          }}
                          className="h-7 px-2 text-xs border-border/50 hover:border-primary/50 hover:bg-primary/5"
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                    {formErrors.expiration && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {formErrors.expiration}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Seção de Informações Nutricionais (Opcional) */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-1 bg-blue-500/10 rounded-md">
                    <svg className="h-4 w-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 3h18v18H3z"/>
                      <path d="M9 9h6v6H9z"/>
                    </svg>
                  </div>
                  <Label className="text-sm font-medium text-foreground">
                    Informações Nutricionais (por 100g/ml)
                  </Label>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-muted/20 rounded-lg border border-border/30">
                  <div className="space-y-2">
                    <Label htmlFor="calories" className="text-xs font-medium text-foreground flex items-center gap-1">
                      🔥 Calorias (kcal)
                    </Label>
                    <Input
                      id="calories"
                      type="number"
                      min="0"
                      step="0.1"
                      value={form.calories}
                      onChange={(e) => setForm({ ...form, calories: parseFloat(e.target.value) || 0 })}
                      className="h-9"
                      placeholder="0"
                    />
                    {formErrors.calories && (
                      <p className="text-xs text-red-500">{formErrors.calories}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="protein" className="text-xs font-medium text-foreground flex items-center gap-1">
                      💪 Proteínas (g)
                    </Label>
                    <Input
                      id="protein"
                      type="number"
                      min="0"
                      step="0.1"
                      value={form.protein}
                      onChange={(e) => setForm({ ...form, protein: parseFloat(e.target.value) || 0 })}
                      className="h-9"
                      placeholder="0"
                    />
                    {formErrors.protein && (
                      <p className="text-xs text-red-500">{formErrors.protein}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fat" className="text-xs font-medium text-foreground flex items-center gap-1">
                      🥑 Gorduras (g)
                    </Label>
                    <Input
                      id="fat"
                      type="number"
                      min="0"
                      step="0.1"
                      value={form.fat}
                      onChange={(e) => setForm({ ...form, fat: parseFloat(e.target.value) || 0 })}
                      className="h-9"
                      placeholder="0"
                    />
                    {formErrors.fat && (
                      <p className="text-xs text-red-500">{formErrors.fat}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="carbohydrates" className="text-xs font-medium text-foreground flex items-center gap-1">
                      🌾 Carboidratos (g)
                    </Label>
                    <Input
                      id="carbohydrates"
                      type="number"
                      min="0"
                      step="0.1"
                      value={form.carbohydrates}
                      onChange={(e) => setForm({ ...form, carbohydrates: parseFloat(e.target.value) || 0 })}
                      className="h-9"
                      placeholder="0"
                    />
                    {formErrors.carbohydrates && (
                      <p className="text-xs text-red-500">{formErrors.carbohydrates}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fiber" className="text-xs font-medium text-foreground flex items-center gap-1">
                      🌿 Fibras (g)
                    </Label>
                    <Input
                      id="fiber"
                      type="number"
                      min="0"
                      step="0.1"
                      value={form.fiber}
                      onChange={(e) => setForm({ ...form, fiber: parseFloat(e.target.value) || 0 })}
                      className="h-9"
                      placeholder="0"
                    />
                    {formErrors.fiber && (
                      <p className="text-xs text-red-500">{formErrors.fiber}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sugar" className="text-xs font-medium text-foreground flex items-center gap-1">
                      🍯 Açúcares (g)
                    </Label>
                    <Input
                      id="sugar"
                      type="number"
                      min="0"
                      step="0.1"
                      value={form.sugar}
                      onChange={(e) => setForm({ ...form, sugar: parseFloat(e.target.value) || 0 })}
                      className="h-9"
                      placeholder="0"
                    />
                    {formErrors.sugar && (
                      <p className="text-xs text-red-500">{formErrors.sugar}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sodium" className="text-xs font-medium text-foreground flex items-center gap-1">
                      🧂 Sódio (g)
                    </Label>
                    <Input
                      id="sodium"
                      type="number"
                      min="0"
                      step="0.001"
                      value={form.sodium}
                      onChange={(e) => setForm({ ...form, sodium: parseFloat(e.target.value) || 0 })}
                      className="h-9"
                      placeholder="0"
                    />
                    {formErrors.sodium && (
                      <p className="text-xs text-red-500">{formErrors.sodium}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="foodGroup" className="text-xs font-medium text-foreground flex items-center gap-1">
                      📊 Grupo Alimentar
                    </Label>
                    <select
                      id="foodGroup"
                      title="Selecionar grupo alimentar"
                      value={form.foodGroup}
                      onChange={(e) => setForm({ ...form, foodGroup: e.target.value as FoodGroup })}
                      className="h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      {Object.entries(FOOD_GROUP_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                    {formErrors.foodGroup && (
                      <p className="text-xs text-red-500">{formErrors.foodGroup}</p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-1">
                    <Label htmlFor="tags" className="text-xs font-medium text-foreground flex items-center gap-1">
                      🏷️ Tags
                    </Label>
                    <Input
                      id="tags"
                      value={form.tags}
                      onChange={(e) => setForm({ ...form, tags: e.target.value })}
                      className="h-9"
                      placeholder="ex: carne branca,magro,versatil"
                    />
                    {formErrors.tags && (
                      <p className="text-xs text-red-500">{formErrors.tags}</p>
                    )}
                    <p className="text-xs text-muted-foreground">Separe por vírgulas</p>
                  </div>
                </div>
              </div>

              {/* Seção de Informações da IA Melhorada */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50/80 via-indigo-50/50 to-purple-50/30 dark:from-blue-950/20 dark:via-indigo-950/10 dark:to-purple-950/5 border border-blue-200/50 dark:border-blue-800/30 shadow-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-50"></div>
                <div className="relative p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl shadow-sm">
                      <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 16v-4"/>
                        <path d="M12 8h.01"/>
                      </svg>
                    </div>
                    <h3 className="font-semibold text-blue-700 dark:text-blue-300 text-base">
                      🤖 Informações Nutricionais Automáticas
                    </h3>
                  </div>
                  <p className="text-sm text-blue-600 dark:text-blue-400 leading-relaxed">
                    Nossa IA analisará automaticamente o alimento "{form.name || 'nome do alimento'}" para calcular informações precisas:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { icon: "🔥", label: "Calorias", color: "text-orange-600" },
                      { icon: "💪", label: "Proteínas", color: "text-blue-600" },
                      { icon: "🌾", label: "Carboidratos", color: "text-green-600" },
                      { icon: "🥑", label: "Gorduras", color: "text-purple-600" },
                      { icon: "🌿", label: "Fibras", color: "text-emerald-600" },
                      { icon: "🍯", label: "Açúcares", color: "text-amber-600" },
                      { icon: "🧂", label: "Sódio", color: "text-gray-600" },
                      { icon: "📊", label: "Grupo alimentar", color: "text-indigo-600" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-white/60 dark:bg-gray-900/20 rounded-lg border border-blue-100/50 dark:border-blue-800/20">
                        <span className="text-sm">{item.icon}</span>
                        <span className={`text-xs font-medium ${item.color}`}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Botões de Ação Melhorados */}
              <div className="flex justify-end gap-3 pt-6 border-t border-border/10">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setOpen(false)}
                  className="h-11 px-6 border-border/50 hover:border-border hover:bg-muted/50 transition-all duration-200"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  className="h-11 px-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                >
                  {editing ? (
                    <>
                      <Pencil className="h-4 w-4" />
                      Atualizar Alimento
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Adicionar Alimento
                    </>
                  )}
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
        <Card className="border-border bg-card">
          <CardContent className="p-8 sm:p-12 text-center">
            <Package className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum alimento ainda</h3>
            <p className="text-muted-foreground mb-4">Adicione seu primeiro alimento e nossa IA calculará automaticamente as informações nutricionais.</p>
            <Button onClick={() => setOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Alimento com IA
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {safeFoodItems.map((item) => {
            const expirationStatus = getExpirationStatus(item.expiration);
            const tags = item.tags ? item.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];

            return (
              <Card key={item.id} className="bg-card border-border/50 overflow-hidden hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] transition-all duration-300">
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
                    <Badge className={`${expirationStatus.color} text-white text-xs font-medium ${expirationStatus.status === 'expired' ? 'animate-pulse' : ''}`}>
                      {expirationStatus.text}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      <span>Qtd: {item.quantity}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" />
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

      {/* Modal de Boas-vindas */}
      <Dialog open={showWelcomeModal} onOpenChange={setShowWelcomeModal}>
        <DialogContent className="max-w-lg bg-background/95 backdrop-blur-xl border border-border/20 shadow-2xl">
          <DialogHeader className="space-y-4 pb-6 border-b border-border/10">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-500/30 shadow-sm">
                <Info className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                Bem-vindo à sua Despensa! 🥗
              </div>
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Sua despensa inteligente está pronta para uso!
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 pt-2">
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-50/80 via-orange-50/50 to-red-50/30 dark:from-amber-950/20 dark:via-orange-950/10 dark:to-red-950/5 border border-amber-200/50 dark:border-amber-800/30 p-4">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-amber-500/20 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium text-amber-800 dark:text-amber-300 text-sm">
                    🚧 Em Desenvolvimento
                  </h3>
                  <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                    <strong>Campos mais precisos</strong> para cadastro de alimentos (unidades, categorias detalhadas, informações nutricionais específicas) estão sendo desenvolvidos.
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                    Por enquanto, use o campo <strong>quantidade</strong> para números (ex: 500g = 500, 3 unidades = 3).
                  </p>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-50/80 via-emerald-50/50 to-teal-50/30 dark:from-green-950/20 dark:via-emerald-950/10 dark:to-teal-950/5 border border-green-200/50 dark:border-green-800/30 p-4">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-green-500/20 rounded-lg">
                  <Package className="h-4 w-4 text-green-600" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium text-green-800 dark:text-green-300 text-sm">
                    ✨ Já Disponível
                  </h3>
                  <ul className="text-xs text-green-700 dark:text-green-400 space-y-1">
                    <li>• <strong>IA automática</strong> para cálculo nutricional</li>
                    <li>• <strong>Alertas de validade</strong> com flags coloridas</li>
                    <li>• <strong>Gestão completa</strong> dos seus alimentos</li>
                    <li>• <strong>Interface intuitiva</strong> e responsiva</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border/10">
            <Button 
              onClick={handleWelcomeModalClose}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Entendi, vamos começar! 🚀
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FoodInventory;