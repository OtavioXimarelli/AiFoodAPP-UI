import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Plus, X, Apple, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EnhancedClickSpark } from '@/components/ui/enhanced-click-spark';

interface Ingredient {
  id: string;
  name: string;
  category: string;
}

const IngredientForm = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [inputValue, setInputValue] = useState('');
  const { toast } = useToast();

  const addIngredient = () => {
    if (inputValue.trim()) {
      const newIngredient: Ingredient = {
        id: Date.now().toString(),
        name: inputValue.trim(),
        category: 'personalizado',
      };
      setIngredients([...ingredients, newIngredient]);
      setInputValue('');
      toast({
        title: 'Ingrediente adicionado!',
        description: `${newIngredient.name} foi adicionado à sua lista.`,
      });
    }
  };

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter(ing => ing.id !== id));
  };

  const generateRecipes = () => {
    if (ingredients.length === 0) {
      toast({
        title: 'Adicione ingredientes',
        description: 'Você precisa adicionar pelo menos um ingrediente para gerar receitas.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Gerando receitas...',
      description: 'Nossa IA está criando receitas personalizadas para você!',
    });
  };

  return (
    <section id="ingredientes" className="py-16 bg-gradient-secondary">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Cadastre seus Ingredientes</h3>
            <p className="text-muted-foreground text-lg">
              Adicione os alimentos que você tem disponível e nossa IA criará receitas incríveis
            </p>
          </div>

          <Card className="p-6 shadow-card">
            <div className="flex gap-3 mb-6">
              <Input
                placeholder="Digite um ingrediente (ex: frango, brócolis, quinoa...)"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && addIngredient()}
                className="flex-1"
              />
              <Button onClick={addIngredient} className="bg-primary hover:bg-primary-hover">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>

            {ingredients.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3 flex items-center">
                  <Apple className="h-5 w-5 mr-2 text-primary" />
                  Seus Ingredientes ({ingredients.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {ingredients.map(ingredient => (
                    <Badge
                      key={ingredient.id}
                      variant="secondary"
                      className="px-3 py-2 bg-accent text-accent-foreground"
                    >
                      {ingredient.name}
                      <button
                        onClick={() => removeIngredient(ingredient.id)}
                        className="ml-2 hover:text-destructive"
                        aria-label={`Remover ingrediente ${ingredient.name}`}
                        title={`Remover ingrediente ${ingredient.name}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={generateRecipes}
              size="lg"
              className="w-full bg-gradient-primary hover:bg-primary-hover text-primary-foreground"
              disabled={ingredients.length === 0}
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Gerar Receitas com IA
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default IngredientForm;
