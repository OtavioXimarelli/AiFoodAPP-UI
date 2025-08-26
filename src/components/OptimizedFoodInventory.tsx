import React, { useState, useMemo, memo, useCallback } from "react";
import { useFoodItems } from "@/hooks/useFoodItems";
import { FoodItem, CreateFoodPayload, UpdateFoodPayload, FoodGroup, FOOD_GROUP_LABELS } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { VirtualizedList } from "@/components/ui/virtualized-fixed";
import { AnimatedElement, StaggerContainer, HoverAnimation, LoadingAnimation } from "@/components/ui/animated";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { usePerformance } from "@/hooks/usePerformance";
import { Plus, Trash2, Pencil, Package, AlertTriangle, Scale, Hash, CalendarDays, Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";

// Memoized food item component for virtualization
const FoodItemCard = memo<{ 
  item: FoodItem; 
  index: number; 
  onEdit: (item: FoodItem) => void; 
  onDelete: (id: string) => void; 
}>(({ item, index, onEdit, onDelete }) => {
  const { measureRender } = usePerformance(`FoodItemCard-${index}`);
  
  const daysUntilExpiration = useMemo(() => {
    if (!item.expiration) return null;
    return differenceInDays(new Date(item.expiration), new Date());
  }, [item.expiration]);

  const isExpiringSoon = daysUntilExpiration !== null && daysUntilExpiration <= 3;
  const isExpired = daysUntilExpiration !== null && daysUntilExpiration < 0;

  const getFoodImage = useCallback((name: string) => {
    const foodImages: { [key: string]: string } = {
      'apple': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop',
      'banana': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop',
      'carrot': 'https://images.unsplash.com/photo-1582515073490-39981397c445?w=400&h=300&fit=crop',
      'milk': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop',
      'bread': 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400&h=300&fit=crop',
      'default': 'https://images.unsplash.com/photo-1506617420156-8e4536971650?w=400&h=300&fit=crop'
    };
    
    const key = name.toLowerCase();
    return foodImages[key] || foodImages['default'];
  }, []);

  const handleEditClick = useCallback(() => {
    measureRender(`edit-${item.id}`, () => onEdit(item));
  }, [item, measureRender, onEdit]);

  const handleDeleteClick = useCallback(() => {
    measureRender(`delete-${item.id}`, () => onDelete(item.id?.toString() || ''));
  }, [item.id, measureRender, onDelete]);

  return (
    <HoverAnimation scale={1.02} y={-2}>
      <Card className={cn(
        "h-full transition-all duration-300 hover:shadow-lg",
        isExpired && "border-red-500 bg-red-50 dark:bg-red-900/10",
        isExpiringSoon && !isExpired && "border-orange-500 bg-orange-50 dark:bg-orange-900/10"
      )}>
        <CardHeader className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                <OptimizedImage
                  src={getFoodImage(item.name)}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  fallback="https://images.unsplash.com/photo-1506617420156-8e4536971650?w=400&h=300&fit=crop"
                  placeholder="skeleton"
                />
                {(isExpired || isExpiringSoon) && (
                  <div className="absolute top-1 right-1">
                    <AlertTriangle className={cn(
                      "w-3 h-3",
                      isExpired ? "text-red-500" : "text-orange-500"
                    )} />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-base truncate">{item.name}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {FOOD_GROUP_LABELS[item.foodGroup] || item.foodGroup}
                  </Badge>
                  {item.quantity && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Scale className="w-3 h-3" />
                      {item.quantity}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-1 shrink-0">
              <Button
                onClick={handleEditClick}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-muted"
              >
                <Pencil className="w-3 h-3" />
              </Button>
              <Button
                onClick={handleDeleteClick}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {item.expiration && (
            <div className="flex items-center gap-2 text-sm">
              <CalendarDays className="w-4 h-4 text-muted-foreground" />
              <span className={cn(
                "font-medium",
                isExpired && "text-red-600 dark:text-red-400",
                isExpiringSoon && !isExpired && "text-orange-600 dark:text-orange-400"
              )}>
                {isExpired 
                  ? `Vencido há ${Math.abs(daysUntilExpiration || 0)} dias`
                  : isExpiringSoon 
                    ? `Vence em ${daysUntilExpiration} dias`
                    : format(new Date(item.expiration), "dd/MM/yyyy", { locale: ptBR })
                }
              </span>
            </div>
          )}
          {item.calories && item.calories > 0 && (
            <div className="mt-2 text-xs text-muted-foreground">
              {item.calories} kcal
            </div>
          )}
        </CardContent>
      </Card>
    </HoverAnimation>
  );
});

FoodItemCard.displayName = 'FoodItemCard';

const OptimizedFoodInventory = memo(() => {
  const { foodItems, loading, error, createFoodItem, updateFoodItem, deleteFoodItem } = useFoodItems();
  const { metrics, reportPerformanceIssue } = usePerformance('FoodInventory');
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGroup, setFilterGroup] = useState<FoodGroup | "all">("all");
  const [sortBy, setSortBy] = useState<"name" | "expiration" | "group">("name");

  // Safety check and memoized filtering
  const filteredAndSortedItems = useMemo(() => {
    const safeFoodItems = Array.isArray(foodItems) ? foodItems : [];
    
    let filtered = safeFoodItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterGroup === "all" || item.foodGroup === filterGroup;
      return matchesSearch && matchesFilter;
    });

    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "expiration":
          if (!a.expiration && !b.expiration) return 0;
          if (!a.expiration) return 1;
          if (!b.expiration) return -1;
          return new Date(a.expiration).getTime() - new Date(b.expiration).getTime();
        case "group":
          return a.foodGroup.localeCompare(b.foodGroup);
        default:
          return 0;
      }
    });

    return filtered;
  }, [foodItems, searchTerm, filterGroup, sortBy]);

  // Performance monitoring
  if (filteredAndSortedItems.length > 50 && metrics.renderTime > 100) {
    reportPerformanceIssue(
      `Large food inventory (${filteredAndSortedItems.length} items) taking ${metrics.renderTime}ms to render`,
      'medium'
    );
  }

  const handleEdit = useCallback((item: FoodItem) => {
    // Handle edit logic
    console.log('Edit item:', item);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteFoodItem(parseInt(id));
      toast.success('Item removido com sucesso!');
    } catch (error) {
      toast.error('Erro ao remover item');
    }
  }, [deleteFoodItem]);

  const handleAdd = useCallback(() => {
    // Handle add logic
    console.log('Add new item');
  }, []);

  // Render item for virtualization
  const renderFoodItem = useCallback((item: FoodItem, index: number) => (
    <div className="p-2">
      <FoodItemCard
        item={item}
        index={index}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  ), [handleEdit, handleDelete]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <LoadingAnimation size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Erro ao carregar itens</h3>
            <p className="text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <AnimatedElement variant="slideDown">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Despensa Digital
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {filteredAndSortedItems.length} {filteredAndSortedItems.length === 1 ? 'item' : 'itens'} na despensa
                </p>
              </div>
              <HoverAnimation scale={1.05}>
                <Button onClick={handleAdd} className="shrink-0">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Item
                </Button>
              </HoverAnimation>
            </div>
          </CardHeader>
        </Card>
      </AnimatedElement>

      {/* Search and Filters */}
      <AnimatedElement variant="slideUp" delay={0.1}>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar alimentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <select
                  title="Filtrar por categoria"
                  value={filterGroup}
                  onChange={(e) => setFilterGroup(e.target.value as FoodGroup | "all")}
                  className="px-3 py-2 rounded-md border border-input bg-background text-sm"
                >
                  <option value="all">Todas as categorias</option>
                  {Object.entries(FOOD_GROUP_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <select
                  title="Ordenar por"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "name" | "expiration" | "group")}
                  className="px-3 py-2 rounded-md border border-input bg-background text-sm"
                >
                  <option value="name">Ordenar por nome</option>
                  <option value="expiration">Ordenar por validade</option>
                  <option value="group">Ordenar por categoria</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </AnimatedElement>

      {/* Food Items List */}
      <AnimatedElement variant="fadeIn" delay={0.2}>
        {filteredAndSortedItems.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Nenhum item encontrado</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || filterGroup !== "all" 
                  ? "Tente ajustar os filtros de busca" 
                  : "Adicione seus primeiros alimentos à despensa"
                }
              </p>
              {(!searchTerm && filterGroup === "all") && (
                <Button onClick={handleAdd}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Primeiro Item
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              {/* Use virtualization for better performance with large lists */}
              {filteredAndSortedItems.length > 20 ? (
                <VirtualizedList
                  items={filteredAndSortedItems}
                  renderItem={renderFoodItem}
                  itemHeight={140}
                  height={600}
                  className="rounded-lg"
                  overscan={5}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
                  <StaggerContainer staggerDelay={0.05}>
                    {filteredAndSortedItems.map((item, index) => (
                      <FoodItemCard
                        key={item.id}
                        item={item}
                        index={index}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                  </StaggerContainer>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </AnimatedElement>

      {/* Performance metrics (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10">
          <CardContent className="p-4">
            <div className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Performance Info:</strong> {filteredAndSortedItems.length} items, 
              {metrics.renderTime}ms last render
              {metrics.memoryUsage && `, ${metrics.memoryUsage.toFixed(1)}MB memory`}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
});

OptimizedFoodInventory.displayName = 'OptimizedFoodInventory';

export default OptimizedFoodInventory;