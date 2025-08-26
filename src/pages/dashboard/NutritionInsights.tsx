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
    <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-background/60 pb-20 lg:pb-0">
      {/* Header */}
  <div className="sticky top-0 z-40 bg-white/95 border-b border-border/30 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Insights Nutricionais</h1>
            <p className="text-sm text-muted-foreground">
              Análise completa dos seus alimentos
            </p>
          </div>
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            {periods.map((period) => (
              <Button
                key={period.value}
                variant={selectedPeriod === period.value ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedPeriod(period.value)}
                className="text-xs px-3"
              >
                {period.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Empty State - No Data Available */}
        {safeFoodItems.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardContent className="p-12 text-center">
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-full mx-auto w-fit">
                  <BarChart3 className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Sem Dados Nutricionais</h3>
                  <p className="text-muted-foreground mb-4">
                    Adicione alimentos à sua despensa para ver insights nutricionais detalhados.
                  </p>
                  <Button variant="outline" className="gap-2">
                    <Package className="h-4 w-4" />
                    Adicionar Alimentos
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Nutrition Overview - Basic Data */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-3">Resumo Nutricional Básico</h2>
              <div className="grid grid-cols-2 gap-3">
                <Card className="border-border/30 shadow-sm hover:shadow-md transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-red-500/10">
                        <Zap className="h-5 w-5 text-red-500" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-foreground">{basicTotals.calories}</p>
                        <p className="text-xs text-muted-foreground">Calorias (estimadas)</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/60 backdrop-blur-xl border-border/30 shadow-sm hover:shadow-md transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/10">
                        <Target className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-foreground">{basicTotals.protein}g</p>
                        <p className="text-xs text-muted-foreground">Proteínas (estimadas)</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Connect to Backend Notice */}
            <Card className="bg-gradient-to-br from-blue-500/5 to-purple-500/5 border-blue-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-blue-500/10">
                    <BarChart3 className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground">Análise Avançada Disponível</h3>
                    <p className="text-sm text-muted-foreground">
                      Conecte com seu backend para análises nutricionais detalhadas, gráficos e relatórios.
                    </p>
                  </div>
                  <Badge className="bg-blue-500 text-white">
                    Backend
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Food Groups - Basic Distribution */}
        {Object.keys(foodGroups).length > 0 && (
          <Card className="bg-card/60 backdrop-blur-xl border-border/30 shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-foreground flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" />
                Distribuição de Alimentos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(foodGroups).map(([group, count]) => {
                const IconComponent = groupIcons[group] || Leaf;
                const total = Object.values(foodGroups).reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? (count / total) * 100 : 0;

                return (
                  <div key={group} className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <IconComponent className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-foreground">
                          {FOOD_GROUP_LABELS[group] || group}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {count} {count === 1 ? 'item' : 'itens'}
                        </span>
                      </div>
                      <Progress value={percentage} className="h-1.5" />
                    </div>
                    <Badge variant="outline" className="text-xs">
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