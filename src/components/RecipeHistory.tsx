import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocalRecipes } from "@/hooks/useLocalRecipes";
import { Recipe } from "@/lib/types";
import { Clock, Users, ChefHat, Trash2, Eye } from "lucide-react";
import { format } from "date-fns";
import { formatPrepTime, formatCalories, formatServings } from "@/lib/format";
import { ptBR } from "date-fns/locale";

interface RecipeHistoryProps {
  onViewRecipe?: (recipe: Recipe) => void;
}

const RecipeHistory = ({ onViewRecipe }: RecipeHistoryProps) => {
  const { storedRecipes, deleteRecipe, clearAllRecipes, totalRecipes } = useLocalRecipes();

  if (totalRecipes === 0) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-8 text-center">
          <ChefHat className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Nenhuma receita salva</h3>
          <p className="text-muted-foreground">
            Suas receitas geradas aparecerão aqui automaticamente
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-foreground flex items-center gap-2">
            <ChefHat className="h-5 w-5 text-primary" />
            Receitas Salvas ({totalRecipes})
          </CardTitle>
          {totalRecipes > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={clearAllRecipes}
              className="text-destructive hover:text-destructive"
            >
              Limpar Todas
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full pr-4">
          <div className="space-y-3">
            {storedRecipes.map((recipe) => (
              <Card key={recipe.id} className="bg-muted/30 border-border/50 hover:bg-muted/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground text-sm mb-2 line-clamp-1">
                        {recipe.name}
                      </h4>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                        {recipe.description}
                      </p>
                      
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatPrepTime(recipe.prepTime) ?? 'N/A'}</span>
                          </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{formatServings(recipe.servings) ?? 'N/A'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {recipe.difficulty || 'Médio'}
                        </Badge>
                        {recipe.createdAt && (
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(recipe.createdAt), "dd/MM 'às' HH:mm", { locale: ptBR })}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewRecipe?.(recipe)}
                        className="h-8 w-8 p-0"
                        title="Ver receita"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteRecipe(recipe.id!)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        title="Excluir receita"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default RecipeHistory;