import { useState } from "react";
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
  Leaf
} from "lucide-react";
import { FOOD_GROUP_LABELS } from "@/lib/types";

const NutritionInsights = () => {
  const { foodItems, loading } = useFoodItems();
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  const safeFoodItems = Array.isArray(foodItems) ? foodItems : [];

  // Calculate nutrition totals
  const nutritionTotals = safeFoodItems.reduce((acc, item) => {
    return {
      calories: acc.calories + (item.calories || 0),
      protein: acc.protein + (item.protein || 0),
      carbohydrates: acc.carbohydrates + (item.carbohydrates || 0),
      fat: acc.fat + (item.fat || 0),
      fiber: acc.fiber + (item.fiber || 0)
    };
  }, { calories: 0, protein: 0, carbohydrates: 0, fat: 0, fiber: 0 });

  // Group foods by category
  const foodGroups = safeFoodItems.reduce((acc, item) => {
    const group = item.foodGroup || 'OTHER';
    acc[group] = (acc[group] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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

  const dailyGoals = {
    calories: 2000,
    protein: 120,
    carbohydrates: 250,
    fat: 65,
    fiber: 25
  };

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
        {/* Nutrition Overview */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">Resumo Nutricional</h2>
          <div className="grid grid-cols-2 gap-3">
            <Card className="border-border/30 shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-500/10">
                    <Zap className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">{nutritionTotals.calories}</p>
                    <p className="text-xs text-muted-foreground">Calorias</p>
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
                    <p className="text-lg font-bold text-foreground">{nutritionTotals.protein}g</p>
                    <p className="text-xs text-muted-foreground">Proteínas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Daily Goals */}
        <Card className="bg-card/60 backdrop-blur-xl border-border/30 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-foreground flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Metas Diárias
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(dailyGoals).map(([key, goal]) => {
              const current = nutritionTotals[key as keyof typeof nutritionTotals];
              const percentage = Math.min((current / goal) * 100, 100);
              const unit = key === 'calories' ? '' : 'g';

              return (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-foreground capitalize">
                      {key === 'calories' ? 'Calorias' : 
                       key === 'protein' ? 'Proteínas' :
                       key === 'carbohydrates' ? 'Carboidratos' :
                       key === 'fat' ? 'Gorduras' : 'Fibras'}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {current}{unit} / {goal}{unit}
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                  <div className="text-right">
                    <Badge 
                      variant={percentage >= 100 ? "default" : percentage >= 70 ? "secondary" : "outline"}
                      className="text-xs"
                    >
                      {percentage.toFixed(0)}%
                    </Badge>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Food Groups */}
        <Card className="bg-card/60 backdrop-blur-xl border-border/30 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-foreground flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              Grupos Alimentares
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

        {/* Health Score */}
        <Card className="bg-gradient-to-br from-green-500/5 to-blue-500/5 border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-500/10">
                <Heart className="h-6 w-6 text-green-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground">Score de Saúde</h3>
                <p className="text-2xl font-bold text-green-500">85/100</p>
                <p className="text-sm text-muted-foreground">
                  Boa variedade de alimentos saudáveis!
                </p>
              </div>
              <Badge className="bg-green-500 text-white">
                Excelente
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="bg-card/60 backdrop-blur-xl border-border/30 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-foreground flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Recomendações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg bg-blue-500/10">
              <p className="text-sm text-foreground font-medium">💧 Hidratação</p>
              <p className="text-xs text-muted-foreground mt-1">
                Adicione mais frutas ricas em água como melancia e melão
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-500/10">
              <p className="text-sm text-foreground font-medium">🥬 Vegetais</p>
              <p className="text-xs text-muted-foreground mt-1">
                Tente incluir mais vegetais folhosos verdes na sua despensa
              </p>
            </div>
            <div className="p-3 rounded-lg bg-orange-500/10">
              <p className="text-sm text-foreground font-medium">🥜 Proteínas</p>
              <p className="text-xs text-muted-foreground mt-1">
                Considere adicionar leguminosas como feijão e lentilha
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NutritionInsights;