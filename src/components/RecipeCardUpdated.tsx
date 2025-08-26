import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, Flame, BookmarkPlus, BookmarkCheck } from "lucide-react";
import { useLocalRecipes } from "@/hooks/useLocalRecipes";
import { Recipe } from "@/lib/types";
import { formatPrepTime, formatCalories, formatServings } from "@/lib/format";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface RecipeCardProps {
  recipe: Partial<Recipe> & {
    id: string;
    title?: string;
    description: string;
    prepTime?: string;
    servings: number;
    calories: number;
    difficulty: 'Fácil' | 'Médio' | 'Difícil';
    tags: string[];
    ingredients?: string[];
    instructions?: string[];
  };
}

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  const { storedRecipes, saveRecipes } = useLocalRecipes();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // Check if recipe is already saved
  const isRecipeSaved = storedRecipes.some(saved => saved.id === recipe.id);

  const difficultyColors = {
    'Fácil': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Médio': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'Difícil': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  };

  const handleSaveRecipe = async () => {
    if (isRecipeSaved) {
      toast({
        title: "Receita já salva",
        description: "Esta receita já está na sua coleção",
        variant: "default"
      });
      return;
    }

    setIsSaving(true);
    try {
      // Convert recipe to the format expected by the cache
      const recipeToSave: Recipe = {
        id: recipe.id,
        name: recipe.title || "Receita sem nome",
        description: recipe.description,
        nutritionalInfo: [`${recipe.calories} calorias`, `${recipe.servings} porções`],
        instructions: recipe.instructions || ["Instruções não disponíveis"],
        ingredientsList: (recipe.ingredients || []).map(ingredient => ({
          name: ingredient,
          quantity: 1,
          unit: "unidade"
        })),
        prepTime: recipe.prepTime ? parseInt((recipe.prepTime as string).replace(/\D/g, '') || '0') || undefined : undefined,
        servings: recipe.servings,
        calories: recipe.calories,
        difficulty: recipe.difficulty,
        tags: recipe.tags,
        createdAt: new Date().toISOString()
      };

      const success = saveRecipes([recipeToSave]);
      
      if (success) {
        toast({
          title: "Receita salva!",
          description: "A receita foi adicionada à sua coleção",
          variant: "default"
        });
      } else {
        throw new Error("Falha ao salvar receita");
      }
    } catch (error) {
      console.error('Erro ao salvar receita:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar a receita. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="h-full shadow-card hover:shadow-lg transition-all duration-300 animate-slide-up">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold text-foreground line-clamp-2">
            {recipe.title || "Receita sem nome"}
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSaveRecipe}
            disabled={isSaving}
            className={`transition-colors duration-200 ${
              isRecipeSaved 
                ? "text-primary hover:text-primary/80" 
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            {isRecipeSaved ? (
              <BookmarkCheck className="h-4 w-4" />
            ) : (
              <BookmarkPlus className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-muted-foreground line-clamp-2">{recipe.description}</p>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {formatPrepTime(recipe.prepTime) ?? "N/A"}
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {formatServings(recipe.servings) ?? 'N/A'}
          </div>
          <div className="flex items-center gap-1">
            <Flame className="h-4 w-4" />
            {formatCalories(recipe.calories) ?? 'N/A'}
          </div>
        </div>

        <div className="flex gap-2 mb-4 flex-wrap">
          <Badge className={difficultyColors[recipe.difficulty]}>
            {recipe.difficulty}
          </Badge>
          {recipe.tags.slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="space-y-3">
          <div>
            <h5 className="font-semibold text-sm mb-2">Ingredientes principais:</h5>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {(recipe.ingredients || []).slice(0, 3).join(', ')}
              {(recipe.ingredients || []).length > 3 && '...'}
            </p>
          </div>

          <Button className="w-full bg-primary hover:bg-primary-hover">
            Ver Receita Completa
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;
