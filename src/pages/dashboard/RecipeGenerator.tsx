import { useState } from "react";
import { useRecipes } from "@/hooks/useRecipes";
import { useFoodItems } from "@/hooks/useFoodItems";
import { useLocalRecipes } from "@/hooks/useLocalRecipes";
import { Recipe } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { ChefHat, Clock, Users, Zap, Loader2, AlertTriangle, Package, Sparkles, Star, Heart, TrendingUp, Award, Flame, Info, Trash2, Save } from "lucide-react";
import toast from "react-hot-toast";
import NutritionAnalysisModal from "@/components/NutritionAnalysisModal";

const RecipeGenerator = () => {
  const { recipes, loading, error, analysis, analyzingId, generateRecipe, analyzeRecipe, clearRecipes, clearError } = useRecipes();
  const { foodItems, loading: foodLoading } = useFoodItems();
  const { storedRecipes, saveRecipes, deleteRecipe, totalRecipes } = useLocalRecipes();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);

  const handleGenerate = async () => {
    try {
      clearRecipes();
      const newRecipes = await generateRecipe();
      if (newRecipes.length > 0) {
        saveRecipes(newRecipes);
        toast.success("Receita gerada com sucesso!");
      }
    } catch (error: any) {
      toast.error(error.message || "Falha ao gerar receita");
    }
  };

  const handleAnalyze = async (recipe: Recipe) => {
    if (!recipe.id) return;
    
    try {
      setSelectedRecipe(recipe);
      const id = typeof recipe.id === 'string' ? parseInt(recipe.id) : recipe.id;
      await analyzeRecipe(id);
      setShowAnalysisModal(true);
      toast.success("Análise da receita concluída!");
    } catch (error: any) {
      toast.error(error.message || "Falha ao analisar receita");
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <span>Erro: {error}</span>
            </div>
            <Button 
              onClick={clearError} 
              variant="outline" 
              className="mt-4"
            >
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getRecipeImage = (recipeName: string) => {
    const searchQuery = recipeName.toLowerCase();
    return `https://images.unsplash.com/400x300/?${searchQuery}`;
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch(difficulty?.toLowerCase()) {
      case 'fácil': return 'bg-green-100 text-green-700 border-green-200';
      case 'médio': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'difícil': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRecipeDifficulty = () => {
    const difficulties = ['Fácil', 'Médio', 'Difícil'];
    return difficulties[Math.floor(Math.random() * difficulties.length)];
  };

  const getRecipeTime = () => {
    const times = [15, 20, 30, 45, 60];
    return times[Math.floor(Math.random() * times.length)];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-background/60 pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6 md:space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in px-2">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <ChefHat className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Gerador de Receitas IA
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Transforme os ingredientes da sua despensa em receitas deliciosas com inteligência artificial
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 animate-fade-in">
          <Card className="bg-card/60 backdrop-blur-xl border-border/30 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="p-2 md:p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                  <Package className="h-5 w-5 md:h-6 md:w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-bold text-foreground">{foodItems.length}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Ingredientes disponíveis</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-xl border-border/30 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="p-2 md:p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                  <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-bold text-foreground">{totalRecipes}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Receitas salvas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-xl border-border/30 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="p-2 md:p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                  <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-bold text-foreground">IA</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Powered by AI</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pantry Overview */}
        <Card className="bg-card/60 backdrop-blur-xl border-border/30 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Package className="h-5 w-5 text-orange-600" />
              </div>
              Sua Despensa Digital
            </CardTitle>
          </CardHeader>
          <CardContent>
            {foodLoading ? (
              <div className="flex items-center justify-center gap-3 py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="text-lg">Carregando ingredientes...</span>
              </div>
            ) : foodItems.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <div className="p-4 bg-amber-50 rounded-full mx-auto w-fit">
                  <AlertTriangle className="h-8 w-8 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Despensa Vazia</h3>
                  <p className="text-muted-foreground">
                    Adicione alguns ingredientes à sua despensa primeiro para gerar receitas personalizadas.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Sparkles className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-foreground">
                        {foodItems.length} {foodItems.length === 1 ? 'Ingrediente' : 'Ingredientes'}
                      </p>
                      <p className="text-sm text-muted-foreground">Pronto para criar receitas</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    🍽️ {Math.ceil(foodItems.length / 3)} receitas possíveis
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {foodItems.slice(0, 12).map((item, index) => (
                    <div 
                      key={item.id} 
                      className="group p-3 bg-gradient-to-br from-white to-gray-50 rounded-lg border hover:shadow-md transition-all duration-200 hover:scale-105"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="text-center space-y-2">
                        <div className="text-2xl">
                          {item.name.includes('tomate') ? '🍅' :
                           item.name.includes('cebola') ? '🧅' :
                           item.name.includes('alho') ? '🧄' :
                           item.name.includes('arroz') ? '🍚' :
                           item.name.includes('feijão') ? '🫘' :
                           item.name.includes('frango') ? '🍗' :
                           item.name.includes('carne') ? '🥩' :
                           item.name.includes('peixe') ? '🐟' :
                           item.name.includes('queijo') ? '🧀' :
                           item.name.includes('leite') ? '🥛' :
                           item.name.includes('ovo') ? '🥚' :
                           item.name.includes('batata') ? '🥔' :
                           item.name.includes('cenoura') ? '🥕' :
                           '🥬'}
                        </div>
                        <div>
                          <p className="font-medium text-xs text-foreground truncate">{item.name}</p>
                          <Badge variant="outline" className="text-xs mt-1">
                            {item.quantity}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                  {foodItems.length > 12 && (
                    <div className="p-3 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20 text-center">
                      <div className="text-2xl mb-2">➕</div>
                      <Badge variant="secondary" className="text-xs">
                        +{foodItems.length - 12} mais
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Recipe Generator */}
        <Card className="bg-card/60 backdrop-blur-xl border-border/30 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Sparkles className="h-5 w-5 text-purple-600" />
              </div>
              Gerador de Receitas IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full">
                    <ChefHat className="h-12 w-12 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Transforme seus ingredientes em pratos incríveis
                  </h3>
                  <p className="text-muted-foreground">
                    Nossa IA analisa sua despensa e cria receitas personalizadas para você
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <Button 
                  onClick={handleGenerate} 
                  disabled={loading || foodItems.length === 0}
                  size="lg"
                  className="px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Criando receita mágica...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-2" />
                      Gerar Receita com IA
                    </>
                  )}
                </Button>
              </div>

              {foodItems.length === 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
                  <Info className="h-5 w-5 text-amber-600 mx-auto mb-2" />
                  <p className="text-sm text-amber-700">
                    Adicione alguns ingredientes à sua despensa primeiro para gerar receitas personalizadas.
                  </p>
                </div>
              )}

              {loading && (
                <div className="space-y-4 animate-pulse">
                  <div className="flex items-center gap-3">
                    <Flame className="h-5 w-5 text-orange-500 animate-bounce" />
                    <span className="text-sm text-muted-foreground">Analisando ingredientes...</span>
                  </div>
                  <Progress value={33} className="h-2" />
                  <div className="flex items-center gap-3">
                    <ChefHat className="h-5 w-5 text-blue-500 animate-bounce" />
                    <span className="text-sm text-muted-foreground">Criando combinações perfeitas...</span>
                  </div>
                  <Progress value={66} className="h-2" />
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-purple-500 animate-bounce" />
                    <span className="text-sm text-muted-foreground">Finalizando receita...</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Generated Recipes */}
        {recipes.length > 0 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Suas Receitas Criadas
              </h2>
              <p className="text-muted-foreground">
                Receitas personalizadas baseadas nos seus ingredientes
              </p>
            </div>
            
            <div className="grid gap-6">
              {recipes.map((recipe, index) => {
                const difficulty = getRecipeDifficulty();
                const cookTime = getRecipeTime();
                
                return (
                  <Card key={recipe.id} className="overflow-hidden gradient-border hover-lift group" style={{ animationDelay: `${index * 0.2}s` }}>
                    <div className="grid md:grid-cols-3 gap-0">
                      {/* Recipe Image */}
                      <div className="relative overflow-hidden">
                        <img 
                          src={getRecipeImage(recipe.name)} 
                          alt={recipe.name}
                          className="w-full h-48 md:h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-4 left-4 space-y-2">
                          <Badge className={`${getDifficultyColor(difficulty)} border`}>
                            {difficulty}
                          </Badge>
                          <div className="flex items-center gap-1 text-white text-sm">
                            <Clock className="h-4 w-4" />
                            {cookTime} min
                          </div>
                        </div>
                        <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                          <Heart className="h-4 w-4 text-white" />
                        </button>
                      </div>

                      {/* Recipe Content */}
                      <div className="md:col-span-2 p-6 space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                              {recipe.name}
                            </h3>
                            <p className="text-muted-foreground">
                              {recipe.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {Math.ceil(recipe.ingredientsList.length / 3)} porções
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                4.8
                              </div>
                              <div className="flex items-center gap-1">
                                <Award className="h-4 w-4" />
                                Recomendado
                              </div>
                            </div>
                          </div>
                          <Button
                            onClick={() => handleAnalyze(recipe)}
                            disabled={analyzingId === recipe.id}
                            variant="outline"
                            size="sm"
                            className="shrink-0"
                          >
                            {analyzingId === recipe.id ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Analisando...
                              </>
                            ) : (
                              <>
                                <Zap className="h-4 w-4 mr-2" />
                                Analisar Nutrição
                              </>
                            )}
                          </Button>
                        </div>

                        {/* Nutritional Information */}
                        {recipe.nutritionalInfo.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="font-semibold flex items-center gap-2 text-foreground">
                              <div className="p-1 bg-green-100 rounded">
                                <Zap className="h-4 w-4 text-green-600" />
                              </div>
                              Informações Nutricionais
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              {recipe.nutritionalInfo.map((info, infoIndex) => (
                                <Badge key={infoIndex} variant="secondary" className="justify-center py-1">
                                  {info}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Quick Ingredients Preview */}
                        <div className="space-y-3">
                          <h4 className="font-semibold flex items-center gap-2 text-foreground">
                            <div className="p-1 bg-orange-100 rounded">
                              <Package className="h-4 w-4 text-orange-600" />
                            </div>
                            Ingredientes Principais
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {recipe.ingredientsList.slice(0, 6).map((ingredient) => (
                              <Badge key={ingredient.id} variant="outline" className="text-xs">
                                {ingredient.name}
                              </Badge>
                            ))}
                            {recipe.ingredientsList.length > 6 && (
                              <Badge variant="secondary" className="text-xs">
                                +{recipe.ingredientsList.length - 6} mais
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Recipe Analysis */}
                        {selectedRecipe?.id === recipe.id && analysis && (
                          <div className="space-y-3 animate-fade-in">
                            <Separator />
                            <div className="space-y-3">
                              <h4 className="font-semibold flex items-center gap-2 text-foreground">
                                <div className="p-1 bg-purple-100 rounded">
                                  <Sparkles className="h-4 w-4 text-purple-600" />
                                </div>
                                Análise Nutricional IA
                              </h4>
                              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                  <div className="p-2 bg-blue-100 rounded-full shrink-0">
                                    <Info className="h-4 w-4 text-blue-600" />
                                  </div>
                                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                                    {analysis}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Nutrition Analysis Modal */}
      {selectedRecipe && analysis && (
        <NutritionAnalysisModal
          open={showAnalysisModal}
          onOpenChange={setShowAnalysisModal}
          recipe={selectedRecipe}
          analysis={analysis}
        />
      )}
    </div>
  );
};

export default RecipeGenerator;