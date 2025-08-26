import React, { useState } from "react";
import { useFoodItems } from "@/hooks/useFoodItems";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Target,
  Heart,
  Zap,
  Award,
  Apple,
  Wheat,
  Beef,
  Milk,
  Leaf,
  Package
} from "lucide-react";
import { FOOD_GROUP_LABELS } from "@/lib/types";
import PageToolbar from "@/components/shared/PageToolbar";

const groupIcons: Record<string, any> = {
  VEGETABLES: Leaf,
  FRUITS: Apple,
  GRAINS: Wheat,
  PROTEINS: Beef,
  DAIRY: Milk
};

const periods = [
  { value: "week", label: "Semana" },
  { value: "month", label: "Mês" },
  { value: "year", label: "Ano" }
];

const NutritionInsights = () => {
  const { foodItems, loading } = useFoodItems();
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [nutritionData, setNutritionData] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  const safeFoodItems = Array.isArray(foodItems) ? foodItems : [];

  // Fetch nutrition analysis from your backend
  const fetchNutritionAnalysis = async () => {
    setLoadingAnalysis(true);
    try {
      // Replace with your actual API endpoint
      // const response = await fetch(`/api/nutrition/analysis?period=${selectedPeriod}`);
      // const data = await response.json();
      // setNutritionData(data);
      
      // TODO: Connect to your backend API for real nutrition analysis
      setNutritionData(null);
    } catch (error) {
      console.error('Failed to fetch nutrition analysis:', error);
    } finally {
      setLoadingAnalysis(false);
    }
  };

  React.useEffect(() => {
    fetchNutritionAnalysis();
  }, [selectedPeriod]);

  // Calculate basic totals from available food items (if any)
  const basicTotals = safeFoodItems.reduce((acc, item) => {
    return {
      calories: acc.calories + (item.calories || 0),
      protein: acc.protein + (item.protein || 0),
      carbohydrates: acc.carbohydrates + (item.carbohydrates || 0),
      fat: acc.fat + (item.fat || 0),
      fiber: acc.fiber + (item.fiber || 0)
    };
  }, { calories: 0, protein: 0, carbohydrates: 0, fat: 0, fiber: 0 });

  // Group foods by category (basic grouping)
  const foodGroups = safeFoodItems.reduce((acc, item) => {
    const group = item.foodGroup || 'OTHER';
    acc[group] = (acc[group] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background pb-20 lg:pb-0">
      <div className="sticky top-0 z-40 py-4">
        <PageToolbar
          title="Insights Nutricionais"
          subtitle="Análise completa dos seus alimentos e padrões nutricionais"
          actions={
            <div className="flex gap-1 bg-muted/50 backdrop-blur-sm rounded-xl p-1.5 border border-border/20">
              {periods.map((period) => (
                <Button
                  key={period.value}
                  variant={selectedPeriod === period.value ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedPeriod(period.value)}
                  className="text-xs px-4 py-2 rounded-lg font-medium transition-all duration-200"
                >
                  {period.label}
                </Button>
              ))}
            </div>
          }
        />
      </div>

      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        {/* Empty State - No Data Available */}
        {safeFoodItems.length === 0 ? (
          <Card className="border-dashed border-2 border-border/40 rounded-2xl bg-gradient-to-br from-background/50 to-accent/5 backdrop-blur-sm">
            <CardContent className="p-16 text-center">
              <div className="space-y-6">
                <div className="relative">
                  <div className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl mx-auto w-fit border border-primary/20">
                    <BarChart3 className="h-12 w-12 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-pulse"></div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-foreground">Sem Dados Nutricionais</h3>
                  <p className="text-muted-foreground text-lg max-w-md mx-auto">
                    Adicione alimentos à sua despensa para ver insights nutricionais detalhados e análises personalizadas.
                  </p>
                  <Button 
                    variant="default" 
                    className="gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Package className="h-5 w-5" />
                    Adicionar Alimentos
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Nutrition Overview - Basic Data */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-primary to-primary/50 rounded-full"></div>
                <h2 className="text-2xl font-bold text-foreground">Resumo Nutricional</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="rounded-2xl border-border/20 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background/80 to-red-50/20 backdrop-blur-sm group">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-2xl bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 group-hover:scale-110 transition-transform duration-300">
                        <Zap className="h-6 w-6 text-red-500" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{basicTotals.calories}</p>
                        <p className="text-sm text-muted-foreground">Calorias totais</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-border/20 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background/80 to-blue-50/20 backdrop-blur-sm group">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                        <Target className="h-6 w-6 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{basicTotals.protein}g</p>
                        <p className="text-sm text-muted-foreground">Proteínas</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-border/20 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background/80 to-green-50/20 backdrop-blur-sm group">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 group-hover:scale-110 transition-transform duration-300">
                        <Wheat className="h-6 w-6 text-green-500" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{basicTotals.carbohydrates}g</p>
                        <p className="text-sm text-muted-foreground">Carboidratos</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-border/20 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background/80 to-purple-50/20 backdrop-blur-sm group">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                        <Heart className="h-6 w-6 text-purple-500" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{basicTotals.fiber}g</p>
                        <p className="text-sm text-muted-foreground">Fibras</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Connect to Backend Notice */}
            <Card className="rounded-2xl bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5 border border-blue-500/20 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center gap-6">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20">
                    <BarChart3 className="h-8 w-8 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-2">Análise Avançada Disponível</h3>
                    <p className="text-muted-foreground">
                      Conecte com seu backend para análises nutricionais detalhadas, gráficos interativos e relatórios personalizados.
                    </p>
                  </div>
                  <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-xl font-medium">
                    Backend Ready
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Food Groups - Basic Distribution */}
        {Object.keys(foodGroups).length > 0 && (
          <Card className="rounded-2xl bg-gradient-to-br from-background/80 to-accent/5 backdrop-blur-xl border-border/20 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-primary to-primary/50 rounded-full"></div>
                <CardTitle className="text-2xl text-foreground flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                    <PieChart className="h-6 w-6 text-primary" />
                  </div>
                  Distribuição de Alimentos
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(foodGroups).map(([group, count]) => {
                const IconComponent = groupIcons[group] || Leaf;
                const total = Object.values(foodGroups).reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? (count / total) * 100 : 0;

                return (
                  <div key={group} className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-background/50 to-accent/10 border border-border/20 hover:border-border/40 transition-all duration-300">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-foreground">
                          {FOOD_GROUP_LABELS[group] || group}
                        </span>
                        <span className="text-sm text-muted-foreground font-medium">
                          {count} {count === 1 ? 'item' : 'itens'}
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2 bg-muted/50" />
                    </div>
                    <Badge variant="outline" className="px-3 py-1 rounded-full font-medium border-primary/20 text-primary">
                      {percentage.toFixed(0)}%
                    </Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default NutritionInsights;