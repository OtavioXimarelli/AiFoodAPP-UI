import React, { useState, useEffect, useMemo, memo, useCallback } from 'react';
import { useFoodItems } from '@/hooks/useFoodItems';
import { usePerformance } from '@/hooks/usePerformance';
import {
  FoodItem,
  BasicFoodPayload,
  UpdateFoodPayload,
  FoodGroup,
  FOOD_GROUP_LABELS,
  validateFoodItem,
} from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Plus,
  Trash2,
  Pencil,
  Calendar as CalendarIcon,
  Package,
  AlertTriangle,
  Loader2,
  Scale,
  Hash,
  CalendarDays,
  Info,
  RefreshCw,
} from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { format, isAfter, differenceInDays, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { EnhancedClickSpark } from '@/components/ui/enhanced-click-spark';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';

const FoodInventory = memo(() => {
  const { foodItems, loading, error, createFoodItem, updateFoodItem, deleteFoodItem, clearError } =
    useFoodItems();
  const { measureRender } = usePerformance('FoodInventory');

  // Memoize food items to prevent unnecessary re-renders
  const safeFoodItems = useMemo(() => (Array.isArray(foodItems) ? foodItems : []), [foodItems]);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<FoodItem | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  // Memoized form state
  const [form, setForm] = useState<BasicFoodPayload>({
    name: '',
    quantity: 1,
    expiration: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Quick filter by group (persist to localStorage)
  const [activeGroup, setActiveGroup] = useState<FoodGroup | 'all'>(() => {
    const v = localStorage.getItem('food_filter_group');
    return v && (v === 'all' || Object.keys(FOOD_GROUP_LABELS).includes(v))
      ? (v as FoodGroup | 'all')
      : 'all';
  });
  useEffect(() => {
    localStorage.setItem('food_filter_group', activeGroup);
  }, [activeGroup]);
  // Filtro de status (tela atual)
  const [statusFilter, setStatusFilter] = useState<'all' | 'expired' | 'expiring' | 'fresh'>('all');
  // Ordenação (local)
  const [sortBy, setSortBy] = useState<
    'relevance' | 'expSoon' | 'expFar' | 'qtyDesc' | 'qtyAsc' | 'nameAsc'
  >('relevance');
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveGroup('all');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Cálculo de status de validade (antes do uso em filtros/ordenação)
  const getExpirationStatus = useCallback((expiration: string) => {
    if (!expiration || typeof expiration !== 'string') {
      return {
        status: 'unknown',
        color: 'bg-gray-500',
        text: '❓ Sem data',
        icon: '❓',
      };
    }

    const expirationDate = new Date(expiration);

    if (isNaN(expirationDate.getTime())) {
      return {
        status: 'invalid',
        color: 'bg-gray-500',
        text: '❓ Data inválida',
        icon: '❓',
      };
    }

    const today = new Date();
    const daysUntilExpiration = differenceInDays(expirationDate, today);

    if (daysUntilExpiration < 0) {
      return {
        status: 'expired',
        color: 'bg-red-500',
        text: '⚠️ Vencido',
        icon: '🚨',
      };
    } else if (daysUntilExpiration <= 3) {
      return {
        status: 'expiring',
        color: 'bg-red-500',
        text: `⏰ ${daysUntilExpiration} ${daysUntilExpiration === 1 ? 'dia restante' : 'dias restantes'}`,
        icon: '⚠️',
      };
    } else {
      return {
        status: 'fresh',
        color: 'bg-green-500',
        text: `✅ ${daysUntilExpiration} dias restantes`,
        icon: '✅',
      };
    }
  }, []);
  const displayedItems = useMemo(() => {
    // 1) filtro por grupo
    const groupFiltered =
      activeGroup === 'all'
        ? safeFoodItems
        : safeFoodItems.filter(i => i.foodGroup === activeGroup);
    // 2) filtro por status
    const statusFiltered = groupFiltered.filter(i => {
      if (statusFilter === 'all') return true;
      const s = getExpirationStatus(i.expiration).status as
        | 'expired'
        | 'expiring'
        | 'fresh'
        | 'invalid'
        | 'unknown';
      return s === statusFilter;
    });
    // 3) ordenação
    const withDerived = statusFiltered.map(i => {
      const exp = i.expiration ? new Date(i.expiration) : null;
      const validDate = exp && !isNaN(exp.getTime()) ? exp : null;
      const days = validDate ? differenceInDays(validDate, new Date()) : Number.POSITIVE_INFINITY;
      return { item: i, exp: validDate, days };
    });
    withDerived.sort((a, b) => {
      switch (sortBy) {
        case 'expSoon':
          return (a.days ?? Infinity) - (b.days ?? Infinity);
        case 'expFar':
          return (b.days ?? Infinity) - (a.days ?? Infinity);
        case 'qtyDesc':
          return (b.item.quantity || 0) - (a.item.quantity || 0);
        case 'qtyAsc':
          return (a.item.quantity || 0) - (b.item.quantity || 0);
        case 'nameAsc':
          return (a.item.name || '').localeCompare(b.item.name || '', 'pt-BR', {
            sensitivity: 'base',
          });
        case 'relevance':
        default: {
          // Prioriza vencidos, depois expira hoje/expirando, depois frescos; dentro do grupo, mais próximos primeiro
          const sA = getExpirationStatus(a.item.expiration).status;
          const sB = getExpirationStatus(b.item.expiration).status;
          const rank = (s: string) => (s === 'expired' ? 0 : s === 'expiring' ? 1 : 2);
          const r = rank(sA) - rank(sB);
          if (r !== 0) return r;
          return (a.days ?? Infinity) - (b.days ?? Infinity);
        }
      }
    });
    return withDerived.map(x => x.item);
  }, [safeFoodItems, activeGroup, statusFilter, sortBy, getExpirationStatus]);

  // Remove mock food images - these will be handled by your backend
  const getFoodImage = useCallback((name: string) => {
    // Return a placeholder or handle images from your backend
    return 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop';
  }, []);

  // Memoize expiration status calculation for performance (moved above usage)

  // Optimize form reset with useCallback
  const resetForm = useCallback(() => {
    setForm({
      name: '',
      quantity: 1,
      expiration: '',
    });
    setFormErrors({});
    setEditing(null);
  }, []);

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
    // Only populate basic fields for editing (AI enhancement not needed for updates)
    setForm({
      name: item.name || '',
      quantity: item.quantity || 1,
      expiration: item.expiration || '',
    });
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation for minimal fields
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = 'Nome é obrigatório';
    if (form.quantity <= 0) errors.quantity = 'Quantidade deve ser maior que 0';
    if (!form.expiration) errors.expiration = 'Data de validade é obrigatória';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      if (editing) {
        // For updates, send the basic fields
        const updatePayload: UpdateFoodPayload = {
          id: editing.id!,
          name: form.name,
          quantity: form.quantity,
          expiration: form.expiration,
        };
        await updateFoodItem(updatePayload);
        toast.success('Alimento atualizado com sucesso!');
      } else {
        // For creation, use AI-enhanced approach (minimal input)
        // Backend will automatically add nutrition facts via AI
        const createPayload: BasicFoodPayload = {
          name: form.name,
          quantity: form.quantity,
          expiration: form.expiration,
        };

        toast.success('Criando alimento com IA... ⚡');
        await createFoodItem(createPayload);
        toast.success('Alimento criado com informações nutricionais da IA! 🤖');
      }
      setOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Falha ao salvar alimento');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteFoodItem(id);
      toast.success('Alimento excluído com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Falha ao excluir alimento');
    }
  };

  // Quick renew helper: prefill form with new expiration and open edit dialog
  const handleRenew = (item: FoodItem, days?: number) => {
    setEditing(item);
    const newExpiration =
      typeof days === 'number'
        ? addDays(new Date(), days)
        : item.expiration
          ? new Date(item.expiration)
          : new Date();
    setForm({
      name: item.name || '',
      quantity: item.quantity || 1,
      expiration: !isNaN(newExpiration.getTime()) ? newExpiration.toISOString().split('T')[0] : '',
    });
    setOpen(true);
    if (typeof days !== 'number') {
      // open calendar to let user pick a date
      setTimeout(() => setCalendarOpen(true), 0);
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
            <Button onClick={clearError} variant="outline" className="mt-4">
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-background/60 pb-20 lg:pb-0 scrollbar-default">
      {/* Cabeçalho da página (sem vidro) */}
      <div className="sticky top-0 z-40 p-3 md:p-4">
        <div className="rounded-2xl bg-card border border-border shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                Despensa Inteligente
              </h1>
              <p className="text-sm text-muted-foreground">Gerencie seus alimentos com IA</p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={resetForm}
                  className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-primary-foreground"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar Alimento
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar bg-background border border-border/20 shadow-2xl">
                <DialogHeader className="space-y-4 pb-6 border-b border-border/10">
                  <DialogTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-xl border border-primary/20 shadow-sm">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      {editing ? 'Editar Alimento' : 'Adicionar Novo Alimento'}
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
                    {editing
                      ? 'Atualize as informações do alimento selecionado'
                      : 'Adicione um novo alimento ao seu inventário. Nossa IA identificará automaticamente os nutrientes.'}
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-2">
                  {/* Campo Nome do Alimento */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-sm font-medium text-foreground flex items-center gap-2"
                    >
                      <div className="p-1 bg-primary/10 rounded-md">
                        <Package className="h-3 w-3 text-primary" />
                      </div>
                      Nome do Alimento *
                    </Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
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
                      <svg
                        className="h-3 w-3"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4" />
                        <path d="M12 8h.01" />
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
                          onChange={e =>
                            setForm({ ...form, quantity: parseInt(e.target.value) || 1 })
                          }
                          className="h-11 border-border/50 focus:border-primary/50 transition-colors"
                          placeholder="Ex: 500, 3, 1..."
                        />
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <svg
                            className="h-3 w-3"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 16v-4" />
                            <path d="M12 8h.01" />
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
                                'w-full h-11 justify-start text-left font-normal border-border/50 hover:border-primary/50 transition-all duration-200',
                                !form.expiration && 'text-muted-foreground'
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4 text-orange-600" />
                              {form.expiration && !isNaN(new Date(form.expiration).getTime()) ? (
                                format(new Date(form.expiration), "dd 'de' MMMM 'de' yyyy", {
                                  locale: ptBR,
                                })
                              ) : (
                                <span>Selecione a data de validade</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto p-0 bg-background/98 backdrop-blur-xl border border-border/30 shadow-2xl rounded-xl overflow-hidden"
                            align="start"
                            sideOffset={4}
                          >
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
                                selected={
                                  form.expiration && !isNaN(new Date(form.expiration).getTime())
                                    ? new Date(form.expiration)
                                    : undefined
                                }
                                onSelect={date => {
                                  if (date) {
                                    setForm({
                                      ...form,
                                      expiration: date.toISOString().split('T')[0],
                                    });
                                    setCalendarOpen(false);
                                  }
                                }}
                                disabled={date => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                initialFocus
                                className="rounded-md border-0"
                              />
                            </div>

                            {/* Footer com Atalhos */}
                            <div className="p-3 border-t border-border/10 bg-muted/20">
                              <div className="flex gap-1 flex-wrap">
                                {[
                                  { label: 'Hoje', days: 0 },
                                  { label: '3 dias', days: 3 },
                                  { label: '1 semana', days: 7 },
                                  { label: '1 mês', days: 30 },
                                ].map(option => (
                                  <Button
                                    key={option.label}
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      const date = addDays(new Date(), option.days);
                                      setForm({
                                        ...form,
                                        expiration: date.toISOString().split('T')[0],
                                      });
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
                            { label: 'Hoje', days: 0 },
                            { label: '3 dias', days: 3 },
                            { label: '1 semana', days: 7 },
                            { label: '1 mês', days: 30 },
                          ].map(option => (
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

                  {/* AI Enhancement Information */}
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border border-border/30">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
                          <svg
                            className="h-5 w-5 text-blue-600"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                            🤖 Criação Inteligente com IA
                            <Badge variant="secondary" className="text-xs">
                              Automático
                            </Badge>
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            Nossa IA analisará automaticamente as informações nutricionais do
                            alimento que você está adicionando:
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                            <div className="flex items-center gap-2 text-orange-600">
                              <span>🔥</span>
                              <span>Calorias</span>
                            </div>
                            <div className="flex items-center gap-2 text-blue-600">
                              <span>💪</span>
                              <span>Proteínas</span>
                            </div>
                            <div className="flex items-center gap-2 text-green-600">
                              <span>🌾</span>
                              <span>Carboidratos</span>
                            </div>
                            <div className="flex items-center gap-2 text-purple-600">
                              <span>🥑</span>
                              <span>Gorduras</span>
                            </div>
                            <div className="flex items-center gap-2 text-emerald-600">
                              <span>🌿</span>
                              <span>Fibras</span>
                            </div>
                            <div className="flex items-center gap-2 text-amber-600">
                              <span>🍯</span>
                              <span>Açúcares</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                              <span>🧂</span>
                              <span>Sódio</span>
                            </div>
                            <div className="flex items-center gap-2 text-indigo-600">
                              <span>📊</span>
                              <span>Grupo Alimentar</span>
                            </div>
                          </div>
                          <div className="mt-3 p-2 bg-blue-100/50 dark:bg-blue-900/20 rounded border border-blue-200/50 dark:border-blue-800/50">
                            <p className="text-xs text-blue-700 dark:text-blue-400 flex items-center gap-1">
                              <svg
                                className="h-3 w-3"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 16v-4" />
                                <path d="M12 8h.01" />
                              </svg>
                              Processamento de 2-3 segundos após criação - informações completas
                              serão adicionadas automaticamente!
                            </p>
                          </div>
                        </div>
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
          {/* Filtros rápidos */}
          <div className="mt-2 overflow-x-auto px-4 pb-4">
            <div className="flex items-center gap-2 min-w-max">
              <button
                onClick={() => setActiveGroup('all')}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs border transition-colors',
                  activeGroup === 'all'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted/40 text-foreground/80 border-border/50 hover:bg-muted'
                )}
              >
                Todas
              </button>
              {Object.entries(FOOD_GROUP_LABELS).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setActiveGroup(value as FoodGroup)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs border transition-colors',
                    activeGroup === (value as FoodGroup)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-muted/40 text-foreground/80 border-border/50 hover:bg-muted'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            {/* Filtro por status + ordenação */}
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 overflow-x-auto">
                <span className="text-[11px] text-muted-foreground whitespace-nowrap">Status:</span>
                {[
                  { v: 'all', label: 'Todos' },
                  { v: 'expired', label: 'Vencidos' },
                  { v: 'expiring', label: 'Expirando' },
                  { v: 'fresh', label: 'Frescos' },
                ].map(opt => (
                  <button
                    key={opt.v}
                    onClick={() => setStatusFilter(opt.v as any)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs border transition-colors',
                      statusFilter === (opt.v as any)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-muted/40 text-foreground/80 border-border/50 hover:bg-muted'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground">Ordenar:</span>
                <Select value={sortBy} onValueChange={v => setSortBy(v as any)}>
                  <SelectTrigger className="h-8 w-56 text-xs">
                    <SelectValue placeholder="Ordenar" />
                  </SelectTrigger>
                  <SelectContent className="text-sm">
                    <SelectItem value="relevance">Relevância (alertas primeiro)</SelectItem>
                    <SelectItem value="expSoon">Validade (mais próximos)</SelectItem>
                    <SelectItem value="expFar">Validade (mais distantes)</SelectItem>
                    <SelectItem value="qtyDesc">Quantidade (maior primeiro)</SelectItem>
                    <SelectItem value="qtyAsc">Quantidade (menor primeiro)</SelectItem>
                    <SelectItem value="nameAsc">Nome (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {/* Loading / empty / filtered empty */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="ml-2">Carregando alimentos...</span>
        </div>
      ) : safeFoodItems.length === 0 ? (
        <Card className="border-border bg-card">
          <CardContent className="p-8 sm:p-12 text-center">
            <Package className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum alimento ainda</h3>
            <p className="text-muted-foreground mb-4">
              Adicione seu primeiro alimento e nossa IA calculará automaticamente as informações
              nutricionais.
            </p>
            <Button
              onClick={() => setOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Alimento com IA
            </Button>
          </CardContent>
        </Card>
      ) : displayedItems.length === 0 ? (
        <Card className="border-border bg-card">
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            Nenhum alimento nesta categoria.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedItems.map(item => {
            const expirationStatus = getExpirationStatus(item.expiration);
            const tags = item.tags
              ? item.tags
                  .split(',')
                  .map(tag => tag.trim())
                  .filter(Boolean)
              : [];
            const today = new Date();
            const exp = item.expiration ? new Date(item.expiration) : null;
            const validDate = exp && !isNaN(exp.getTime());
            const daysLeft = validDate ? differenceInDays(exp!, today) : null;
            const pct =
              daysLeft !== null ? Math.max(0, Math.min(100, (daysLeft / 30) * 100)) : null;
            const isExpired = expirationStatus.status === 'expired';
            const isExpiring = expirationStatus.status === 'expiring';

            return (
              <Card
                key={item.id}
                className={`relative group bg-card border border-border/40 overflow-hidden rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${isExpired ? 'ring-1 ring-red-500/20 border-red-300/60' : ''} ${isExpiring ? 'ring-1 ring-red-500/20 border-red-300/60' : ''}`}
                aria-label={
                  isExpired
                    ? 'Alimento vencido'
                    : isExpiring
                      ? 'Alimento prestes a vencer'
                      : undefined
                }
              >
                <div className={`absolute inset-x-0 top-0 h-1 ${expirationStatus.color}`} />

                <AspectRatio ratio={16 / 9} className="relative">
                  <img
                    src={getFoodImage(item.name || 'Unknown')}
                    alt={item.name || 'Alimento'}
                    className={`object-cover w-full h-full transition-transform duration-300 group-hover:scale-[1.03] ${isExpired ? 'grayscale saturate-50 opacity-90' : ''}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
                  {isExpired && (
                    <>
                      <div className="absolute inset-0 bg-red-500/10" />
                      <div className="absolute top-2 left-2 z-10">
                        <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-red-600 text-white shadow">
                          Vencido
                        </span>
                      </div>
                      <div className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-red-600/90 text-white shadow">
                        <AlertTriangle className="h-3.5 w-3.5" />
                      </div>
                    </>
                  )}
                  {isExpiring && !isExpired && (
                    <>
                      <div className="absolute inset-0 bg-red-500/5" />
                      <div className="absolute top-2 left-2 z-10">
                        <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-red-600 text-white shadow">
                          {daysLeft === 0 ? 'Expira hoje' : `Expira em ${daysLeft}d`}
                        </span>
                      </div>
                      <div className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-red-600/90 text-white shadow">
                        <AlertTriangle className="h-3.5 w-3.5" />
                      </div>
                    </>
                  )}
                </AspectRatio>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base text-foreground flex items-center gap-1">
                      {isExpired && <AlertTriangle className="h-3.5 w-3.5 text-red-600" />}
                      {isExpiring && !isExpired && (
                        <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
                      )}
                      {item.name || 'Alimento sem nome'}
                    </CardTitle>
                    <Badge
                      className={`${expirationStatus.color} text-white text-xs font-medium ${expirationStatus.status === 'expired' ? 'animate-pulse' : ''}`}
                    >
                      {expirationStatus.text}
                    </Badge>
                  </div>
                  <div className="mt-1 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
                  <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      <span>Qtd: {item.quantity}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" />
                      <span
                        className={cn(
                          daysLeft !== null && daysLeft < 0 ? 'text-red-600 line-through' : ''
                        )}
                      >
                        {validDate ? format(exp!, 'dd/MM/yyyy', { locale: ptBR }) : 'Data inválida'}
                      </span>
                    </div>
                  </div>
                  {/* Days-left progress */}
                  {pct !== null && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="mt-3">
                          <div className="flex justify-between text-[10px] text-muted-foreground">
                            <span>Validade</span>
                            <span>
                              {daysLeft !== null && daysLeft < 0
                                ? 'Vencido'
                                : daysLeft === 0
                                  ? 'Hoje'
                                  : `${daysLeft}d`}
                            </span>
                          </div>
                          <Progress
                            value={pct ?? 0}
                            aria-label="Progresso de validade (0-30 dias)"
                            title={
                              validDate
                                ? daysLeft !== null && daysLeft < 0
                                  ? `Vencido em ${format(exp!, 'dd/MM/yyyy', { locale: ptBR })} (há ${Math.abs(daysLeft!)} dias)`
                                  : daysLeft === 0
                                    ? `Expira hoje (${format(exp!, 'dd/MM/yyyy', { locale: ptBR })})`
                                    : `Expira em ${format(exp!, 'dd/MM/yyyy', { locale: ptBR })} (${daysLeft} dias)`
                                : 'Data inválida'
                            }
                            className="mt-1 h-1.5"
                            indicatorClassName={
                              expirationStatus.status === 'expired'
                                ? 'bg-red-500'
                                : expirationStatus.status === 'expiring'
                                  ? 'bg-red-500'
                                  : expirationStatus.status === 'fresh'
                                    ? 'bg-green-500'
                                    : 'bg-gray-400'
                            }
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        {validDate ? (
                          daysLeft !== null && daysLeft < 0 ? (
                            <span>
                              Vencido em {format(exp!, 'dd/MM/yyyy', { locale: ptBR })} (há{' '}
                              {Math.abs(daysLeft!)} dias)
                            </span>
                          ) : daysLeft === 0 ? (
                            <span>
                              Expira hoje ({format(exp!, 'dd/MM/yyyy', { locale: ptBR })})
                            </span>
                          ) : (
                            <span>
                              Expira em {format(exp!, 'dd/MM/yyyy', { locale: ptBR })} ({daysLeft}{' '}
                              dias)
                            </span>
                          )
                        ) : (
                          <span>Data inválida</span>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Grupo:</span>
                      <Badge variant="outline" className="text-xs">
                        {FOOD_GROUP_LABELS[item.foodGroup]}
                      </Badge>
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
                      {(isExpired || isExpiring) && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 w-8 p-0"
                                  title="Renovar validade"
                                  aria-label="Renovar validade"
                                >
                                  <RefreshCw className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Renovar validade</TooltipContent>
                            </Tooltip>
                          </PopoverTrigger>
                          <PopoverContent
                            align="end"
                            className="w-44 p-2 bg-background border border-border/30 rounded-md shadow-md"
                          >
                            <div className="grid gap-1">
                              {[
                                { label: 'Hoje', days: 0 },
                                { label: '+3 dias', days: 3 },
                                { label: '+7 dias', days: 7 },
                                { label: '+30 dias', days: 30 },
                              ].map(opt => (
                                <Button
                                  key={opt.label}
                                  variant="ghost"
                                  size="sm"
                                  className="justify-start h-8"
                                  onClick={() => handleRenew(item, opt.days)}
                                >
                                  {opt.label}
                                </Button>
                              ))}
                              <div className="my-1 h-px bg-border/40" />
                              <Button
                                variant="ghost"
                                size="sm"
                                className="justify-start h-8"
                                onClick={() => handleRenew(item)}
                              >
                                Escolher data…
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(item)}
                            className="h-8 w-8 p-0"
                            title="Editar alimento"
                            aria-label="Editar alimento"
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Editar alimento</TooltipContent>
                      </Tooltip>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0"
                                title="Excluir alimento"
                                aria-label="Excluir alimento"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Excluir alimento</TooltipContent>
                          </Tooltip>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir Alimento</AlertDialogTitle>
                          </AlertDialogHeader>
                          <p>
                            Tem certeza que deseja excluir "{item.name || 'este alimento'}"? Esta
                            ação não pode ser desfeita.
                          </p>
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

      {/* Modal de Boas-vindas */}
      <Dialog open={showWelcomeModal} onOpenChange={setShowWelcomeModal}>
        <DialogContent className="max-w-lg bg-background border border-border/20 shadow-2xl">
          <DialogHeader className="space-y-4 pb-6 border-b border-border/10">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-500/30 shadow-sm">
                <Info className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">Bem-vindo à sua Despensa! 🥗</div>
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
                    <strong>Campos mais precisos</strong> para cadastro de alimentos (unidades,
                    categorias detalhadas, informações nutricionais específicas) estão sendo
                    desenvolvidos.
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                    Por enquanto, use o campo <strong>quantidade</strong> para números (ex: 500g =
                    500, 3 unidades = 3).
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
                    <li>
                      • <strong>IA automática</strong> para cálculo nutricional
                    </li>
                    <li>
                      • <strong>Alertas de validade</strong> com flags coloridas
                    </li>
                    <li>
                      • <strong>Gestão completa</strong> dos seus alimentos
                    </li>
                    <li>
                      • <strong>Interface intuitiva</strong> e responsiva
                    </li>
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
});

FoodInventory.displayName = 'FoodInventory';

export default FoodInventory;
