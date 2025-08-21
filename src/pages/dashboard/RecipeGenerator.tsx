import { useRecipes } from "@/hooks/useRecipes";
import { useLocalRecipes } from "@/hooks/useLocalRecipes";
import { useFoodItems } from "@/hooks/useFoodItems";
import { Recipe } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SavedRecipes from "./SavedRecipes";
import RecipeDetailModal from "@/components/RecipeDetailModal";
import { 
  ChefHat, 
  Sparkles, 
  Clock, 
  Users, 
  TrendingUp, 
  Loader2,
  AlertTriangle,
  Zap,
  Package,
  Eye,
  Trash2,
  History,
  BookOpen
} from "lucide-react";
import toast from "react-hot-toast";
import NutritionAnalysisModal from "@/components/NutritionAnalysisModal";
import RecipeHistory from "@/components/RecipeHistory";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const RecipeGenerator = () => {
  const { recipes, loading, error, analysis, analyzingId, generateRecipe, analyzeRecipe, clearRecipes, clearError } = useRecipes();
  const { foodItems, loading: foodLoading } = useFoodItems();
  const { saveRecipes } = useLocalRecipes();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [analysisModalOpen, setAnalysisModalOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedSavedRecipe, setSelectedSavedRecipe] = useState<Recipe | null>(null);
  const [recipeDetailModalOpen, setRecipeDetailModalOpen] = useState(false);

  const handleGenerateRecipes = async () => {
    try {
      clearRecipes();
      const newRecipes = await generateRecipe();
      if (newRecipes && newRecipes.length > 0) {
        saveRecipes(newRecipes);
        toast.success(`${newRecipes.length} receitas geradas com sucesso!`);
      }
    } catch (error: any) {
      toast.error(error.message || "Falha ao gerar receitas");
    }
  };

  const handleAnalyze = async (recipe: Recipe) => {
    if (!recipe.id) return;
    
    try {
      setSelectedRecipe(recipe);
      const id = typeof recipe.id === 'string' ? parseInt(recipe.id) : recipe.id;
      await analyzeRecipe(id);
      setAnalysisModalOpen(true);
      toast.success("Análise nutricional concluída!");
    } catch (error: any) {
      toast.error(error.message || "Falha ao analisar receita");
    }
  };

  const handleViewSavedRecipe = (recipe: Recipe) => {
    setSelectedSavedRecipe(recipe);
    setRecipeDetailModalOpen(true);
  };

  if (error) {
    return (
      <div className="p-4">
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-destructive">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-background/60 pb-20 lg:pb-0">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border/30 p-4 shadow-lg shadow-black/5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ChefHat className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              Gerador de Receitas IA
            </h1>
            <p className="text-sm text-muted-foreground">Crie receitas personalizadas com seus ingredientes</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button 
              variant="outline"
              onClick={() => setShowHistory(!showHistory)}
              className="flex-1 sm:flex-none gap-2"
            >
              <History className="h-4 w-4" />
              {showHistory ? 'Ocultar' : 'Histórico'}
            </Button>
            <Button 
              onClick={handleGenerateRecipes}
              disabled={loading || foodItems.length === 0}
              className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-lg shadow-primary/20"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Gerar Receitas
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Gerar Receitas
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Receitas Salvas
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="generate" className="space-y-6 mt-6">
            {/* Toggle between History and Ingredients */}
            {showHistory ? (
              <RecipeHistory onViewRecipe={(recipe) => {
                setSelectedRecipe(recipe);
                setAnalysisModalOpen(true);
              }} />
            ) : (
              <>
                {/* Ingredientes Disponíveis */}
                {foodItems.length > 0 && (
                  <Card className="bg-card border-border/50">
                    <CardHeader>
                      <CardTitle className="text-foreground flex items-center gap-2 text-lg">
                        <div className="p-1.5 bg-primary/10 rounded-lg">
                          <Package className="h-4 w-4 text-primary" />
                        </div>
                        Ingredientes Disponíveis ({foodItems.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-24">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                          {foodItems.map((item) => (
                            <Badge key={item.id} variant="outline" className="justify-center py-2 px-3 bg-background/50">
                              {item.name} ({item.quantity})
                            </Badge>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

        {/* Estado de Carregamento */}
        {loading && !showHistory && (
          <Card className="bg-card border-border/50">
            <CardContent className="p-8">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary"></div>
                  <ChefHat className="h-6 w-6 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">IA Criando Receitas Personalizadas</h3>
                  <p className="text-muted-foreground">Analisando seus ingredientes e criando receitas únicas...</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    <span>Isso pode levar alguns segundos...</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Receitas Geradas */}
        {recipes.length > 0 && !showHistory && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <ChefHat className="h-5 w-5 text-primary" />
                Receitas Geradas ({recipes.length})
              </h2>
              <Button
                variant="outline"
                onClick={clearRecipes}
                size="sm"
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Limpar
              </Button>
            </div>

            <div className="grid gap-4 md:gap-6">
              {recipes.map((recipe, index) => (
                <Card key={recipe.id} className="bg-card border-border/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 overflow-hidden">
                  <div className="grid md:grid-cols-3 gap-0">
                    {/* Recipe Image */}
                    <div className="relative h-48 md:h-full bg-gradient-to-br from-primary/10 to-secondary/10">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ChefHat className="h-12 w-12 text-primary/60" />
                      </div>
                      <div className="absolute top-4 left-4">
                        <Badge variant="secondary" className="bg-background/80">
                          {recipe.difficulty || 'Médio'}
                        </Badge>
                      </div>
                    </div>

                    {/* Recipe Content */}
                    <div className="md:col-span-2 p-4 sm:p-6 space-y-4">
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">{recipe.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{recipe.description}</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{recipe.prepTime || '30min'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{recipe.servings || 4} porções</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          <span>IA Powered</span>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-foreground mb-2 text-sm">Ingredientes:</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                            {recipe.ingredientsList?.slice(0, 6).map((ingredient, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs justify-center py-1">
                                {ingredient.name}
                              </Badge>
                            )) || (
                              <span className="text-xs text-muted-foreground col-span-2">
                                Baseado nos seus ingredientes disponíveis
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 pt-2">
                          <Button
                            onClick={() => handleAnalyze(recipe)}
                            disabled={analyzingId === recipe.id}
                            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                            size="sm"
                          >
                            {analyzingId === recipe.id ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Analisando...
                              </>
                            ) : (
                              <>
                                <Zap className="h-4 w-4" />
                                Análise Nutricional
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            Ver Completa
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Estado vazio - Sem ingredientes */}
        {foodItems.length === 0 && !loading && !showHistory && (
          <Card className="bg-card border-border/50">
            <CardContent className="p-8 sm:p-12 text-center">
              <div className="space-y-4">
                <div className="p-4 bg-primary/10 rounded-full mx-auto w-fit">
                  <Package className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Despensa Vazia</h3>
                  <p className="text-muted-foreground mb-4">
                    Adicione alguns ingredientes à sua despensa primeiro para gerar receitas personalizadas.
                  </p>
                  <Button variant="outline" className="gap-2">
                    <Package className="h-4 w-4" />
                    Ir para Despensa
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Estado vazio - Nenhuma receita gerada ainda */}
        {recipes.length === 0 && !loading && foodItems.length > 0 && !showHistory && (
          <Card className="bg-card border-border/50">
            <CardContent className="p-8 sm:p-12 text-center">
              <div className="space-y-4">
                <div className="p-4 bg-primary/10 rounded-full mx-auto w-fit">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Pronto para Criar!</h3>
                  <p className="text-muted-foreground mb-4">
                    Você tem {foodItems.length} ingredientes disponíveis. Clique no botão acima para gerar receitas personalizadas.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
          </TabsContent>
          
          <TabsContent value="saved" className="mt-6">
            <SavedRecipes onViewRecipe={handleViewSavedRecipe} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      {selectedRecipe && analysis && (
        <NutritionAnalysisModal
          open={analysisModalOpen}
          onOpenChange={setAnalysisModalOpen}
          recipe={selectedRecipe}
          analysis={analysis}
        />
      )}
      
      {selectedSavedRecipe && (
        <RecipeDetailModal
          open={recipeDetailModalOpen}
          onOpenChange={setRecipeDetailModalOpen}
          recipe={selectedSavedRecipe}
        />
      )}
    </div>
  );
};

export default RecipeGenerator;