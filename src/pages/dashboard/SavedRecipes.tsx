import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLocalRecipes } from '@/hooks/useLocalRecipes';
import { useToast } from '@/hooks/use-toast';
import { Recipe } from '@/lib/types';
import { EnhancedClickSpark } from '@/components/ui/enhanced-click-spark';
import {
  Search,
  Clock,
  Users,
  Flame,
  Trash2,
  Eye,
  ChefHat,
  Calendar
} from 'lucide-react';

interface SavedRecipesProps {
  onViewRecipe: (recipe: Recipe) => void;
}

const SavedRecipes = ({ onViewRecipe }: SavedRecipesProps) => {
  const { storedRecipes, searchRecipes, deleteRecipe } = useLocalRecipes();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRecipes = searchTerm 
    ? searchRecipes(searchTerm)
    : storedRecipes;

  const handleDeleteRecipe = (recipeId: string | number) => {
    const success = deleteRecipe(recipeId);
    if (success) {
      toast({
        title: "Receita removida",
        description: "A receita foi removida da sua coleção",
        variant: "default"
      });
    } else {
      toast({
        title: "Erro ao remover",
        description: "Não foi possível remover a receita",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ChefHat className="h-6 w-6" />
            Receitas Salvas
          </h2>
          <p className="text-muted-foreground">
            {storedRecipes.length} receita{storedRecipes.length !== 1 ? 's' : ''} na sua coleção
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar receitas salvas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Recipes Grid */}
      <ScrollArea className="h-[600px] scrollbar-accent">
        {filteredRecipes.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <ChefHat className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {searchTerm ? 'Nenhuma receita encontrada' : 'Nenhuma receita salva'}
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm 
                    ? 'Tente ajustar sua busca'
                    : 'As receitas que você gerar serão salvas automaticamente aqui'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredRecipes.map((recipe) => (
              <EnhancedClickSpark key={recipe.id} sparkColor="hsl(var(--primary))" sparkCount={6}>
                <Card className="hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg line-clamp-2">{recipe.name}</CardTitle>
                      <div className="flex gap-1 ml-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewRecipe(recipe)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteRecipe(recipe.id!)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {recipe.description}
                  </p>
                  
                  {/* Recipe Info */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {recipe.prepTime && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{typeof recipe.prepTime === 'string' ? recipe.prepTime : `${recipe.prepTime}min`}</span>
                      </div>
                    )}
                    {recipe.servings && (
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{recipe.servings}</span>
                      </div>
                    )}
                    {recipe.calories && (
                      <div className="flex items-center gap-1">
                        <Flame className="h-3 w-3" />
                        <span>{recipe.calories}</span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {recipe.tags && recipe.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {recipe.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {recipe.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{recipe.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Created Date */}
                  {recipe.createdAt && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2 border-t">
                      <Calendar className="h-3 w-3" />
                      <span>Salva em {formatDate(recipe.createdAt)}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
              </EnhancedClickSpark>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default SavedRecipes;
