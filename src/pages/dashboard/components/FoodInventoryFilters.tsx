import React from 'react';
import { FoodGroup, FOOD_GROUP_LABELS } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface FoodInventoryFiltersProps {
  activeGroup: FoodGroup | 'all';
  onGroupChange: (group: FoodGroup | 'all') => void;
  statusFilter: 'all' | 'expired' | 'expiring' | 'fresh';
  onStatusFilterChange: (status: 'all' | 'expired' | 'expiring' | 'fresh') => void;
  sortBy: 'relevance' | 'expSoon' | 'expFar' | 'qtyDesc' | 'qtyAsc' | 'nameAsc';
  onSortByChange: (sort: 'relevance' | 'expSoon' | 'expFar' | 'qtyDesc' | 'qtyAsc' | 'nameAsc') => void;
}

export const FoodInventoryFilters: React.FC<FoodInventoryFiltersProps> = ({
  activeGroup,
  onGroupChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortByChange,
}) => {
  return (
    <div className="mt-2 overflow-x-auto px-4 pb-4">
      <div className="flex items-center gap-2 min-w-max">
        <button
          onClick={() => onGroupChange('all')}
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
            onClick={() => onGroupChange(value as FoodGroup)}
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
              onClick={() => onStatusFilterChange(opt.v as any)}
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
          <Select value={sortBy} onValueChange={v => onSortByChange(v as any)}>
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
  );
};
