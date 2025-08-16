import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, Flame, Heart } from "lucide-react";

interface Recipe {
  id: string;
  title: string;
  description: string;
  prepTime: string;
  servings: number;
  calories: number;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  tags: string[];
  ingredients: string[];
  instructions: string[];
}

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  const difficultyColors = {
    'Fácil': 'bg-green-100 text-green-800',
    'Médio': 'bg-yellow-100 text-yellow-800',
    'Difícil': 'bg-red-100 text-red-800'
  };

  return (
    <Card className="h-full shadow-card hover:shadow-lg transition-all duration-300 animate-slide-up">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold text-foreground line-clamp-2">
            {recipe.title}
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-muted-foreground line-clamp-2">{recipe.description}</p>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {recipe.prepTime}
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {recipe.servings} porções
          </div>
          <div className="flex items-center gap-1">
            <Flame className="h-4 w-4" />
            {recipe.calories} cal
          </div>
        </div>

        <div className="flex gap-2 mb-4">
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
              {recipe.ingredients.slice(0, 3).join(', ')}
              {recipe.ingredients.length > 3 && '...'}
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