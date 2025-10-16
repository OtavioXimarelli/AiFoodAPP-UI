import React, { useState, useEffect, useMemo, memo, useCallback } from 'react';
import { useFoodItems } from '@/hooks/useFoodItems';
import { usePerformance } from '@/hooks/usePerformance';
import {
  FoodItem,
  BasicFoodPayload,
  UpdateFoodPayload,
  FoodGroup,
} from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Package, AlertTriangle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { differenceInDays, addDays } from 'date-fns';
import { getExpirationStatus } from '@/utils/dateUtils';
import { getErrorMessage } from '@/utils/errorUtils';
import {
  FoodInventoryForm,
  FoodInventoryCard,
  FoodInventoryFilters,
  WelcomeModal,
} from './components';

const FoodInventory = memo(() => {
  const { foodItems, loading, error, createFoodItem, updateFoodItem, deleteFoodItem, clearError } =
    useFoodItems();
  const { measureRender } = usePerformance('FoodInventory');

  // Memoize food items to prevent unnecessary re-renders
  const safeFoodItems = useMemo(() => (Array.isArray(foodItems) ? foodItems : []), [foodItems]);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<FoodItem | null>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  // Form state
  const [form, setForm] = useState<BasicFoodPayload>({
    name: '',
    quantity: 1,
    expiration: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Quick filter by group (persist to localStorage)
  const [activeGroup, setActiveGroup] = useState<FoodGroup | 'all'>(() => {
    const v = localStorage.getItem('food_filter_group');
    const validGroups = { fruits: true, vegetables: true, grains: true, proteins: true, dairy: true, other: true };
    return v && (v === 'all' || validGroups[v as FoodGroup])
      ? (v as FoodGroup | 'all')
      : 'all';
  });
  
  useEffect(() => {
    localStorage.setItem('food_filter_group', activeGroup);
  }, [activeGroup]);
  
  // Status filter
  const [statusFilter, setStatusFilter] = useState<'all' | 'expired' | 'expiring' | 'fresh'>('all');
  
  // Sorting
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

  const displayedItems = useMemo(() => {
    // 1) Filter by group
    const groupFiltered =
      activeGroup === 'all'
        ? safeFoodItems
        : safeFoodItems.filter(i => i.foodGroup === activeGroup);
    
    // 2) Filter by status
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
    
    // 3) Sorting
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
  }, [safeFoodItems, activeGroup, statusFilter, sortBy]);

  // Get food image placeholder
  const getFoodImage = useCallback((name: string) => {
    return 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop';
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setForm({
      name: '',
      quantity: 1,
      expiration: '',
    });
    setFormErrors({});
    setEditing(null);
  }, []);

  // Show welcome modal on first visit
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
      name: item.name || '',
      quantity: item.quantity || 1,
      expiration: item.expiration || '',
    });
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
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
        const updatePayload: UpdateFoodPayload = {
          id: editing.id!,
          name: form.name,
          quantity: form.quantity,
          expiration: form.expiration,
        };
        await updateFoodItem(updatePayload);
        toast.success('Alimento atualizado com sucesso!');
      } else {
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
    } catch (error) {
      toast.error(getErrorMessage(error) || 'Falha ao salvar alimento');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteFoodItem(id);
      toast.success('Alimento excluído com sucesso!');
    } catch (error) {
      toast.error(getErrorMessage(error) || 'Falha ao excluir alimento');
    }
  };

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
      {/* Header */}
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
            </Dialog>
          </div>
          
          {/* Filters */}
          <FoodInventoryFilters
            activeGroup={activeGroup}
            onGroupChange={setActiveGroup}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            sortBy={sortBy}
            onSortByChange={setSortBy}
          />
        </div>
      </div>

      {/* Form Dialog */}
      <FoodInventoryForm
        open={open}
        onOpenChange={setOpen}
        editing={editing}
        form={form}
        formErrors={formErrors}
        onFormChange={setForm}
        onSubmit={handleSubmit}
      />

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="ml-2">Carregando alimentos...</span>
        </div>
      ) : safeFoodItems.length === 0 ? (
        <Card className="border-border bg-card mx-3 md:mx-4">
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
        <Card className="border-border bg-card mx-3 md:mx-4">
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            Nenhum alimento nesta categoria.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-3 md:px-4">
          {displayedItems.map(item => (
            <FoodInventoryCard
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onRenew={handleRenew}
              getFoodImage={getFoodImage}
            />
          ))}
        </div>
      )}

      {/* Welcome Modal */}
      <WelcomeModal open={showWelcomeModal} onClose={handleWelcomeModalClose} />
    </div>
  );
});

FoodInventory.displayName = 'FoodInventory';

export default FoodInventory;
