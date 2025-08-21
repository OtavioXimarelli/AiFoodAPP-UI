import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Recipe } from "@/lib/types";
import { 
  X, 
  Info, 
  Heart, 
  Activity, 
  Zap, 
  Apple, 
  Droplets, 
  Scale,
  Target,
  TrendingUp,
  AlertCircle,
  ChefHat,
  Clock,
  Users
} from "lucide-react";

interface NutritionAnalysisModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipe: Recipe;
  analysis: string;
}

const NutritionAnalysisModal = ({ open, onOpenChange, recipe, analysis }: NutritionAnalysisModalProps) => {
  // Parse the analysis text to extract structured information
  const parseAnalysis = (text: string) => {
    const sections = text.split('\n').filter(line => line.trim());
    const structured = {
      mainPoints: [] as string[],
      suggestions: [] as string[],
      warnings: [] as string[]
    };

    sections.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.includes('Caloria') || trimmed.includes('Proteína') || trimmed.includes('Carboidrato')) {
        structured.mainPoints.push(trimmed);
      } else if (trimmed.includes('Sugestão') || trimmed.includes('Recomend') || trimmed.includes('Dica')) {
        structured.suggestions.push(trimmed);
      } else if (trimmed.includes('Atenção') || trimmed.includes('Cuidado') || trimmed.includes('Evite')) {
        structured.warnings.push(trimmed);
      } else if (trimmed.length > 10) {
        structured.mainPoints.push(trimmed);
      }
    });

    return structured;
  };

  const structuredAnalysis = parseAnalysis(analysis);

  const nutritionMetrics = [
    {
      icon: Zap,
      label: "Energia",
      value: "350 kcal",
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
      description: "Por porção"
    },
    {
      icon: Activity,
      label: "Proteínas",
      value: "15 g",
      color: "text-blue-600 dark:text-blue-400", 
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      description: "Alto valor biológico"
    },
    {
      icon: Apple,
      label: "Carboidratos",
      value: "22 g",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/20", 
      description: "Energia rápida"
    },
    {
      icon: Droplets,
      label: "Gorduras",
      value: "2.6 g",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
      description: "Gorduras boas"
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-background border-border">
        <DialogHeader className="space-y-3 pb-4 border-b border-border/20">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              Análise Nutricional IA
            </DialogTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 p-0 hover:bg-muted/50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="space-y-6 p-1">
            {/* Recipe Header */}
            <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-border">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <ChefHat className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">{recipe.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{recipe.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{recipe.prepTime || '30min'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{recipe.servings || 4} porções</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {nutritionMetrics.map((metric, index) => (
                <Card key={index} className="border-border hover:shadow-md hover:scale-[1.02] transition-all duration-200">
                  <CardContent className="p-3 sm:p-4 text-center space-y-2 sm:space-y-3">
                    <div className={`p-2 ${metric.bgColor} rounded-full mx-auto w-fit`}>
                      <metric.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${metric.color}`} />
                    </div>
                    <div>
                      <p className="text-lg sm:text-2xl font-bold text-foreground">{metric.value}</p>
                      <p className="text-xs sm:text-sm font-medium text-foreground">{metric.label}</p>
                      <p className="text-xs text-muted-foreground">{metric.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Main Analysis */}
            {structuredAnalysis.mainPoints.length > 0 && (
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <div className="p-1.5 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    Análise Detalhada
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {structuredAnalysis.mainPoints.map((point, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <div className="p-1 bg-blue-100 dark:bg-blue-900/20 rounded-full mt-1">
                        <Target className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                      </div>
                      <p className="text-sm text-foreground leading-relaxed flex-1">{point}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Suggestions */}
            {structuredAnalysis.suggestions.length > 0 && (
              <Card className="border-border bg-green-50/50 dark:bg-green-900/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <div className="p-1.5 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    Sugestões de Melhoria
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {structuredAnalysis.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-green-100/50 dark:bg-green-900/20 rounded-lg">
                      <div className="p-1 bg-green-200 dark:bg-green-800 rounded-full mt-1">
                        <Heart className="h-3 w-3 text-green-700 dark:text-green-400" />
                      </div>
                      <p className="text-sm text-foreground leading-relaxed flex-1">{suggestion}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Warnings */}
            {structuredAnalysis.warnings.length > 0 && (
              <Card className="border-border bg-amber-50/50 dark:bg-amber-900/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <div className="p-1.5 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    Pontos de Atenção
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {structuredAnalysis.warnings.map((warning, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-amber-100/50 dark:bg-amber-900/20 rounded-lg">
                      <div className="p-1 bg-amber-200 dark:bg-amber-800 rounded-full mt-1">
                        <AlertCircle className="h-3 w-3 text-amber-700 dark:text-amber-400" />
                      </div>
                      <p className="text-sm text-foreground leading-relaxed flex-1">{warning}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Full Analysis Text */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <div className="p-1.5 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <Info className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  Análise Completa da IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 rounded-lg p-4">
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {analysis}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Recipe Ingredients */}
            {recipe.ingredientsList && recipe.ingredientsList.length > 0 && (
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <div className="p-1.5 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                      <Scale className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    Ingredientes Analisados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {recipe.ingredientsList.map((ingredient) => (
                      <Badge key={ingredient.id} variant="outline" className="justify-center py-2 px-3 text-xs">
                        {ingredient.name} - {ingredient.quantity}{ingredient.unit}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-border/20">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="order-2 sm:order-1">
            Fechar
          </Button>
          <Button className="bg-primary hover:bg-primary/90 order-1 sm:order-2">
            Salvar Análise
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NutritionAnalysisModal;