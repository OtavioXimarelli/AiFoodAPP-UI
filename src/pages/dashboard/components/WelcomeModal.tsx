import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Info, AlertTriangle, Package } from 'lucide-react';

interface WelcomeModalProps {
  open: boolean;
  onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
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
            onClick={onClose}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Entendi, vamos começar! 🚀
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
