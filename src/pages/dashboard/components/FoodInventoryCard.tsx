import React, { memo } from 'react';
import { FoodItem, FOOD_GROUP_LABELS, TAG_TRANSLATIONS } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Trash2,
  Pencil,
  Calendar as CalendarIcon,
  Package,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/lib/utils';
import { differenceInDays } from 'date-fns';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { getExpirationStatus, DATE_PRESETS, formatDateShort } from '@/utils/dateUtils';

interface FoodInventoryCardProps {
  item: FoodItem;
  onEdit: (item: FoodItem) => void;
  onDelete: (id: number) => void;
  onRenew: (item: FoodItem, days?: number) => void;
  getFoodImage: (name: string) => string;
}

export const FoodInventoryCard = memo<FoodInventoryCardProps>(
  ({ item, onEdit, onDelete, onRenew, getFoodImage }) => {
    const expirationStatus = getExpirationStatus(item.expiration);
    
    // Translate tags to Portuguese
    const tags = item.tags
      ? item.tags
          .split(',')
          .map(tag => {
            const trimmed = tag.trim().toLowerCase();
            return TAG_TRANSLATIONS[trimmed] || trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
          })
          .filter(Boolean)
      : [];
    
    const today = new Date();
    const exp = item.expiration ? new Date(item.expiration) : null;
    const validDate = exp && !isNaN(exp.getTime());
    const daysLeft = validDate ? differenceInDays(exp!, today) : null;
    const pct = daysLeft !== null ? Math.max(0, Math.min(100, (daysLeft / 30) * 100)) : null;
    const isExpired = expirationStatus.status === 'expired';
    const isExpiring = expirationStatus.status === 'expiring';

    return (
      <Card
        className={cn(
          "relative group bg-card border overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300",
          isExpired && "ring-2 ring-red-500/30 border-red-400/60",
          isExpiring && !isExpired && "ring-2 ring-orange-500/30 border-orange-400/60",
          !isExpired && !isExpiring && "border-border/40 hover:border-border/60"
        )}
        aria-label={
          isExpired
            ? 'Alimento vencido'
            : isExpiring
              ? 'Alimento prestes a vencer'
              : undefined
        }
      >
        {/* Status bar at top */}
        <div
          className={cn(
            "absolute inset-x-0 top-0 h-1.5 z-20",
            isExpired && "bg-red-500",
            isExpiring && !isExpired && "bg-orange-500",
            !isExpired && !isExpiring && "bg-gradient-to-r from-green-500 to-emerald-500"
          )}
        />

        {/* Image with overlay */}
        <AspectRatio ratio={16 / 9} className="relative bg-muted">
          <img
            src={getFoodImage(item.name || 'Unknown')}
            alt={item.name || 'Alimento'}
            className={cn(
              "object-cover w-full h-full transition-all duration-300 group-hover:scale-105",
              isExpired && "grayscale opacity-75"
            )}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Status badge on image */}
          {(isExpired || isExpiring) && (
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
              <Badge
                className={cn(
                  "px-2.5 py-1 text-xs font-bold shadow-lg backdrop-blur-sm",
                  isExpired && "bg-red-600/95 hover:bg-red-600",
                  isExpiring && "bg-orange-600/95 hover:bg-orange-600"
                )}
              >
                <AlertTriangle className="h-3 w-3 mr-1" />
                {isExpired ? 'Vencido' : daysLeft === 0 ? 'Expira hoje!' : `${daysLeft} dias`}
              </Badge>
            </div>
          )}

          {/* Food name overlay on image */}
          <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
            <h3 className="text-base font-bold text-white drop-shadow-lg line-clamp-1">
              {item.name || 'Alimento sem nome'}
            </h3>
          </div>
        </AspectRatio>

        <CardContent className="p-4 space-y-3">
          {/* Main info row */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Package className="h-4 w-4" />
              <span className="font-medium">Qtd: {item.quantity}</span>
            </div>
            <Badge variant="outline" className="text-xs font-medium">
              {FOOD_GROUP_LABELS[item.foodGroup]}
            </Badge>
          </div>

          {/* Expiration date */}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <CalendarIcon className="h-4 w-4" />
            <span
              className={cn(
                "font-medium",
                daysLeft !== null && daysLeft < 0 && "text-red-600 line-through"
              )}
            >
              {validDate ? formatDateShort(exp!) : 'Data inválida'}
            </span>
          </div>

          {/* Progress bar */}
          {pct !== null && validDate && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span className="font-medium">Validade</span>
                <span className="font-semibold">
                  {daysLeft !== null && daysLeft < 0
                    ? 'Vencido'
                    : daysLeft === 0
                      ? 'Hoje'
                      : `${daysLeft} dias`}
                </span>
              </div>
              <Progress
                value={pct}
                className="h-2"
                indicatorClassName={cn(
                  "transition-all duration-300",
                  expirationStatus.status === 'expired' && "bg-red-500",
                  expirationStatus.status === 'expiring' && "bg-orange-500",
                  expirationStatus.status === 'fresh' && "bg-green-500"
                )}
              />
            </div>
          )}

          {/* Nutritional information */}
          {(item.calories || item.protein || item.fat || item.carbohydrates) && (
            <div className="space-y-2">
              <div className="h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />
              <div className="grid grid-cols-2 gap-2 text-xs">
                {item.calories && (
                  <div className="flex justify-between items-center p-2 rounded-lg bg-muted/40">
                    <span className="text-muted-foreground">Calorias</span>
                    <span className="font-semibold text-orange-600">{item.calories}</span>
                  </div>
                )}
                {item.protein && (
                  <div className="flex justify-between items-center p-2 rounded-lg bg-muted/40">
                    <span className="text-muted-foreground">Proteínas</span>
                    <span className="font-semibold text-blue-600">{item.protein}g</span>
                  </div>
                )}
                {item.carbohydrates && (
                  <div className="flex justify-between items-center p-2 rounded-lg bg-muted/40">
                    <span className="text-muted-foreground">Carboidratos</span>
                    <span className="font-semibold text-green-600">{item.carbohydrates}g</span>
                  </div>
                )}
                {item.fat && (
                  <div className="flex justify-between items-center p-2 rounded-lg bg-muted/40">
                    <span className="text-muted-foreground">Gorduras</span>
                    <span className="font-semibold text-amber-600">{item.fat}g</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="space-y-2">
              <div className="h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />
              <div className="flex flex-wrap gap-1.5">
                {tags.slice(0, 3).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs px-2 py-0.5 bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    {tag}
                  </Badge>
                ))}
                {tags.length > 3 && (
                  <Badge
                    variant="outline"
                    className="text-xs px-2 py-0.5 border-primary/30 text-primary"
                  >
                    +{tags.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-end gap-2 pt-2">
            {(isExpired || isExpiring) && (
              <Popover>
                <PopoverTrigger asChild>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-9 px-3 hover:bg-green-50 hover:text-green-700 hover:border-green-300 dark:hover:bg-green-950/30 dark:hover:text-green-400 transition-all"
                        title="Renovar validade"
                        aria-label="Renovar validade"
                      >
                        <RefreshCw className="h-4 w-4 mr-1.5" />
                        <span className="text-xs font-medium">Renovar</span>
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
                    {DATE_PRESETS.map(opt => (
                      <Button
                        key={opt.label}
                        variant="ghost"
                        size="sm"
                        className="justify-start h-8"
                        onClick={() => onRenew(item, opt.days)}
                      >
                        {opt.label}
                      </Button>
                    ))}
                    <div className="my-1 h-px bg-border/40" />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start h-8"
                      onClick={() => onRenew(item)}
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
                  onClick={() => onEdit(item)}
                  className="h-9 px-3 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 dark:hover:bg-blue-950/30 dark:hover:text-blue-400 transition-all"
                  title="Editar alimento"
                  aria-label="Editar alimento"
                >
                  <Pencil className="h-4 w-4 mr-1.5" />
                  <span className="text-xs font-medium">Editar</span>
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
                      className="h-9 px-3 hover:bg-red-50 hover:text-red-700 hover:border-red-300 dark:hover:bg-red-950/30 dark:hover:text-red-400 transition-all"
                      title="Excluir alimento"
                      aria-label="Excluir alimento"
                    >
                      <Trash2 className="h-4 w-4 mr-1.5" />
                      <span className="text-xs font-medium">Excluir</span>
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
                  Tem certeza que deseja excluir "{item.name || 'este alimento'}"? Esta ação não
                  pode ser desfeita.
                </p>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(item.id!)}>
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    );
  }
);

FoodInventoryCard.displayName = 'FoodInventoryCard';
