import React, { useState } from 'react';
import { BasicFoodPayload } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Plus,
  Pencil,
  Calendar as CalendarIcon,
  Package,
  AlertTriangle,
  Scale,
  CalendarDays,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DATE_PRESETS, formatDatePtBR, getDateFromDays } from '@/utils/dateUtils';

interface FoodInventoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: any;
  form: BasicFoodPayload;
  formErrors: Record<string, string>;
  onFormChange: (form: BasicFoodPayload) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const FoodInventoryForm: React.FC<FoodInventoryFormProps> = ({
  open,
  onOpenChange,
  editing,
  form,
  formErrors,
  onFormChange,
  onSubmit,
}) => {
  const [calendarOpen, setCalendarOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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

        <form onSubmit={onSubmit} className="space-y-6 pt-2">
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
              onChange={e => onFormChange({ ...form, name: e.target.value })}
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
                    onFormChange({ ...form, quantity: parseInt(e.target.value) || 1 })
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
                        formatDatePtBR(form.expiration)
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
                            onFormChange({
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
                        {DATE_PRESETS.map(option => (
                          <Button
                            key={option.label}
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              onFormChange({
                                ...form,
                                expiration: getDateFromDays(option.days),
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
              onClick={() => onOpenChange(false)}
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
  );
};
