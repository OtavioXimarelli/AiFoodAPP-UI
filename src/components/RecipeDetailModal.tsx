import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Recipe } from "@/lib/types";
import { 
  X, 
  Clock, 
  Users, 
  Flame, 
  ChefHat, 
  List,
  ShoppingCart,
  Calendar,
  Star
} from "lucide-react";
import { formatPrepTime, formatCalories } from "@/lib/format";

interface RecipeDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipe: Recipe | null;
}

const RecipeDetailModal = ({ open, onOpenChange, recipe }: RecipeDetailModalProps) => {
  if (!recipe) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden bg-white/95 border border-border/20 shadow-lg w-[95vw] sm:w-full">
        {/* Subtle Close Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 h-8 w-8 p-0 rounded-full opacity-30 hover:opacity-100 hover:bg-background/80 hover:backdrop-blur-sm transition-all duration-300 group z-50 border border-border/20 hover:border-border/50"
          aria-label="Fechar modal"
        >
          <X className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors duration-200" />
        </Button>
        
        <DialogHeader className="space-y-4 pb-6 border-b border-border/10">
          <div className="flex items-start justify-between gap-4 pr-12">
            <div className="flex items-start gap-4 flex-1">
              <div className="p-3 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-2xl border border-primary/20 shadow-lg">
                <ChefHat className="h-7 w-7 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
                  {recipe.name}
                </DialogTitle>
                {recipe.createdAt && (
                  <div className="flex items-center gap-2 mt-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Salva em {formatDate(recipe.createdAt)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(95vh-180px)] px-1 scrollbar-success">
          <div className="space-y-8 p-1">
            {/* Recipe Overview Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-secondary/5 to-background border border-border/30 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50"></div>
              <div className="relative p-6 space-y-6">
                <p className="text-foreground leading-relaxed text-lg">{recipe.description}</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {recipe.prepTime && (
                    <div className="flex items-center gap-3 p-3 bg-white/95 rounded-xl border border-border/20">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">Tempo</p>
                          <p className="font-semibold text-foreground">
                            {formatPrepTime(recipe.prepTime) ?? 'N/A'}
                          </p>
                      </div>
                    </div>
                  )}
                  {recipe.servings && (
                    <div className="flex items-center gap-3 p-3 bg-background/60 backdrop-blur-sm rounded-xl border border-border/20">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">Porções</p>
                        <p className="font-semibold text-foreground">{recipe.servings}</p>
                      </div>
                    </div>
                  )}
                  {recipe.calories && (
                    <div className="flex items-center gap-3 p-3 bg-background/60 backdrop-blur-sm rounded-xl border border-border/20">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                        <Flame className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">Calorias</p>
                          <p className="font-semibold text-foreground">{formatCalories(recipe.calories) ?? 'N/A'}</p>
                      </div>
                    </div>
                  )}
                  {recipe.difficulty && (
                    <div className="flex items-center gap-3 p-3 bg-background/60 backdrop-blur-sm rounded-xl border border-border/20">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <Star className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">Dificuldade</p>
                        <p className="font-semibold text-foreground">{recipe.difficulty}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {recipe.tags && recipe.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {recipe.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1 text-sm bg-white/95 border border-border/30">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Ingredients */}
            {recipe.ingredientsList && recipe.ingredientsList.length > 0 && (
              <Card className="border-border/30 shadow-md bg-white/95">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl border border-green-200 dark:border-green-800">
                      <ShoppingCart className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <span>Ingredientes</span>
                    <Badge variant="outline" className="ml-auto">
                      {recipe.ingredientsList.length} itens
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {recipe.ingredientsList.map((ingredient, index) => (
                      <div key={index} className="group flex items-center gap-4 p-4 bg-gradient-to-r from-background to-muted/30 rounded-xl border border-border/20 hover:border-border/40 transition-all duration-200 hover:shadow-md">
                        <div className="w-3 h-3 bg-gradient-to-br from-primary to-primary/70 rounded-full flex-shrink-0 shadow-lg"></div>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                            {ingredient.name}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full font-medium">
                          {ingredient.quantity} {ingredient.unit}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Instructions */}
            {recipe.instructions && recipe.instructions.length > 0 && (
              <Card className="border-border/30 shadow-md bg-white/95">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-200 dark:border-blue-800">
                      <List className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span>Modo de Preparo</span>
                    <Badge variant="outline" className="ml-auto">
                      {recipe.instructions.length} passos
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {recipe.instructions.map((instruction, index) => (
                      <div key={index} className="group flex gap-5">
                        <div className="flex-shrink-0 relative">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg border border-primary/20">
                            <span className="text-sm font-bold text-primary-foreground">{index + 1}</span>
                          </div>
                          {index < recipe.instructions.length - 1 && (
                            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-gradient-to-b from-primary/30 to-transparent"></div>
                          )}
                        </div>
                        <div className="flex-1 pt-2">
                          <p className="text-foreground leading-relaxed group-hover:text-foreground/80 transition-colors">
                            {instruction}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Nutritional Info */}
            {recipe.nutritionalInfo && recipe.nutritionalInfo.length > 0 && (
              <Card className="border-border/30 shadow-md bg-white/95">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl border border-orange-200 dark:border-orange-800">
                      <Flame className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <span>Informações Nutricionais</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {recipe.nutritionalInfo.map((info, index) => (
                      <div key={index} className="p-3 bg-gradient-to-br from-background to-muted/30 rounded-xl border border-border/20 text-center group hover:shadow-md transition-all duration-200">
                        <Badge variant="outline" className="w-full text-sm py-2 px-3 group-hover:border-primary/30 transition-colors">
                          {info}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeDetailModal;
