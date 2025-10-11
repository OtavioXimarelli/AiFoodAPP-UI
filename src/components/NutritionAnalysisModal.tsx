import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Recipe, NutritionAnalysis } from '@/lib/types';
import { useLocalNutritionAnalysis } from '@/hooks/useLocalNutritionAnalysis';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
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
  Users,
  Save,
  CheckCircle,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  Crown,
  BarChart3,
  Star,
  FileText,
  Utensils,
  Calculator,
} from 'lucide-react';

interface NutritionAnalysisModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipe: Recipe;
  analysis: string;
}

const NutritionAnalysisModal = ({
  open,
  onOpenChange,
  recipe,
  analysis,
}: NutritionAnalysisModalProps) => {
  const { saveAnalyses, storedAnalyses } = useLocalNutritionAnalysis();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // Check if this analysis is already saved
  const isAnalysisSaved = storedAnalyses.some(
    saved =>
      saved.title === `Análise: ${recipe.name}` &&
      saved.foodItems.join(',') === recipe.ingredientsList?.map(i => i.name).join(',')
  );
  // Parse the analysis text/JSON to extract structured information
  const parseAnalysis = (text: string) => {
    let parsedData: any = null;

    // Try to parse as JSON first
    try {
      // Clean up the text in case it has extra formatting
      const cleanText = text.trim();
      parsedData = JSON.parse(cleanText);
    } catch (error) {
      // If not JSON, parse as text
      console.log('Analysis is not JSON, parsing as text');
    }

    // Initialize structured data
    const structured = {
      perfil: '',
      calorias: '',
      proteinas: '',
      carboidratos: '',
      gorduras: '',
      observacoes: '',
      sugestoes: [] as string[],
      fontesProteina: [] as string[],
      graosIntegrais: [] as string[],
      outrasRecomendacoes: [] as string[],
      rawData: parsedData,
    };

    if (parsedData && typeof parsedData === 'object') {
      // Extract data from JSON structure
      if (parsedData.alimento) {
        structured.perfil = parsedData.alimento;
      }

      if (parsedData.perfil_nutricional) {
        const perfil = parsedData.perfil_nutricional;
        structured.calorias = perfil.calorias || '';
        structured.proteinas = perfil.proteinas || '';
        structured.carboidratos = perfil.carboidratos || '';
        structured.gorduras = perfil.gorduras || '';
      }

      if (parsedData.observacoes) {
        structured.observacoes = parsedData.observacoes;
      }

      if (parsedData.sugestoes_para_uma_dieta_equilibrada) {
        const sugestoes = parsedData.sugestoes_para_uma_dieta_equilibrada;

        if (Array.isArray(sugestoes)) {
          structured.sugestoes = sugestoes;
        } else if (typeof sugestoes === 'object') {
          if (sugestoes.fontes_de_proteina_magra) {
            structured.fontesProteina = Array.isArray(sugestoes.fontes_de_proteina_magra)
              ? sugestoes.fontes_de_proteina_magra
              : [sugestoes.fontes_de_proteina_magra];
          }
          if (sugestoes.graos_integrais) {
            structured.graosIntegrais = Array.isArray(sugestoes.graos_integrais)
              ? sugestoes.graos_integrais
              : [sugestoes.graos_integrais];
          }
          // Extract other recommendations
          Object.keys(sugestoes).forEach(key => {
            if (key !== 'fontes_de_proteina_magra' && key !== 'graos_integrais') {
              const value = sugestoes[key];
              if (typeof value === 'string') {
                structured.outrasRecomendacoes.push(`${key.replace(/_/g, ' ')}: ${value}`);
              } else if (Array.isArray(value)) {
                structured.outrasRecomendacoes.push(
                  `${key.replace(/_/g, ' ')}: ${value.join(', ')}`
                );
              }
            }
          });
        }
      }
    } else {
      // Fallback to text parsing
      const sections = text.split('\n').filter(line => line.trim());
      sections.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.includes('Caloria') || trimmed.includes('calorias')) {
          structured.calorias = trimmed;
        } else if (trimmed.includes('Proteína') || trimmed.includes('proteinas')) {
          structured.proteinas = trimmed;
        } else if (trimmed.includes('Carboidrato') || trimmed.includes('carboidratos')) {
          structured.carboidratos = trimmed;
        } else if (trimmed.includes('Gordura') || trimmed.includes('gorduras')) {
          structured.gorduras = trimmed;
        } else if (
          trimmed.includes('Sugestão') ||
          trimmed.includes('Recomend') ||
          trimmed.includes('Dica')
        ) {
          structured.sugestoes.push(trimmed);
        } else if (trimmed.length > 10) {
          structured.outrasRecomendacoes.push(trimmed);
        }
      });
    }

    return structured;
  };

  const structuredAnalysis = parseAnalysis(analysis);

  const handleSaveAnalysis = async () => {
    if (isAnalysisSaved) {
      toast({
        title: 'Análise já salva',
        description: 'Esta análise já está na sua coleção',
        variant: 'default',
      });
      return;
    }

    setIsSaving(true);
    try {
      const analysisToSave: NutritionAnalysis = {
        id: Date.now() + Math.random(),
        title: `Análise: ${recipe.name}`,
        foodItems: recipe.ingredientsList?.map(ingredient => ingredient.name) || [],
        analysis: {
          calories: recipe.calories || 350,
          protein: 15, // Default values - in a real app, this would be calculated
          carbohydrates: 22,
          fat: 2.6,
          fiber: 3.2,
          sugar: 8.1,
          sodium: 0.8,
        },
        recommendations: [
          ...structuredAnalysis.sugestoes,
          ...structuredAnalysis.fontesProteina,
          ...structuredAnalysis.graosIntegrais,
        ],
        insights: [
          ...structuredAnalysis.outrasRecomendacoes,
          structuredAnalysis.observacoes,
        ].filter(Boolean),
        createdAt: new Date().toISOString(),
        period: 'daily',
      };

      const success = saveAnalyses([analysisToSave]);

      if (success) {
        toast({
          title: 'Análise salva!',
          description: 'A análise nutricional foi adicionada à sua coleção',
          variant: 'default',
        });
      } else {
        throw new Error('Falha ao salvar análise');
      }
    } catch (error) {
      console.error('Erro ao salvar análise:', error);
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar a análise. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Extract nutrition values from parsed data
  const extractNutritionValues = (structured: any) => {
    const extractNumber = (text: string) => {
      const match = text.match(/(\d+(?:\.\d+)?)/);
      return match ? parseFloat(match[1]) : 0;
    };

    return {
      calorias: extractNumber(structured.calorias),
      proteinas: extractNumber(structured.proteinas),
      carboidratos: extractNumber(structured.carboidratos),
      gorduras: extractNumber(structured.gorduras),
    };
  };

  const nutritionValues = extractNutritionValues(structuredAnalysis);

  const nutritionMetrics = [
    {
      icon: Zap,
      label: 'Energia',
      value:
        structuredAnalysis.calorias ||
        `${nutritionValues.calorias || recipe.calories || 'N/A'} kcal`,
      rawValue: nutritionValues.calorias,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
      description: 'Por porção',
    },
    {
      icon: Activity,
      label: 'Proteínas',
      value: structuredAnalysis.proteinas || `${nutritionValues.proteinas || 'N/A'} g`,
      rawValue: nutritionValues.proteinas,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      description: 'Alto valor biológico',
    },
    {
      icon: Apple,
      label: 'Carboidratos',
      value: structuredAnalysis.carboidratos || `${nutritionValues.carboidratos || 'N/A'} g`,
      rawValue: nutritionValues.carboidratos,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      description: 'Energia rápida',
    },
    {
      icon: Droplets,
      label: 'Gorduras',
      value: structuredAnalysis.gorduras || `${nutritionValues.gorduras || 'N/A'} g`,
      rawValue: nutritionValues.gorduras,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      description: 'Gorduras essenciais',
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden bg-white/95 border border-border/20 shadow-lg w-[95vw] sm:w-full">
        {/* Subtle Close Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 h-8 w-8 p-0 rounded-full opacity-30 hover:opacity-100 hover:bg-background/80 hover:backdrop-blur-sm transition-all duration-300 group z-50 border border-border/20 hover:border-border/50"
          aria-label="Fechar modal"
        >
          <X className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors duration-200" />
        </Button>

        <DialogHeader className="space-y-4 pb-6 border-b border-border/10">
          <div className="flex items-start justify-between gap-4 pr-12">
            <div className="flex items-start gap-4 flex-1">
              <div className="p-3 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-2xl border border-primary/20 shadow-lg">
                <Zap className="h-7 w-7 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
                  Análise Nutricional IA
                </DialogTitle>
                <p className="text-muted-foreground text-lg mt-1">{recipe.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={isAnalysisSaved ? 'secondary' : 'default'}
                size="sm"
                onClick={handleSaveAnalysis}
                disabled={isSaving}
                className="h-10 px-4 text-sm font-medium rounded-xl transition-all duration-200"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Salvando...
                  </>
                ) : isAnalysisSaved ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Salva
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(95vh-180px)]">
          <div className="space-y-8 p-1">
            {/* Recipe Header */}
            <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-border">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <div className="p-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl">
                    <ChefHat className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
                      {recipe.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {recipe.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className="p-1 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                          <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="font-medium">{recipe.prepTime || '30min'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="p-1 bg-green-100 dark:bg-green-900/20 rounded-full">
                          <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="font-medium">{recipe.servings || 4} porções</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="p-1 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                          <Star className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <span className="font-medium">{recipe.difficulty || 'Médio'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Nutrition Metrics - Enhanced */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-500/20 via-green-500/10 to-transparent rounded-2xl border border-primary/20 shadow-lg">
                  <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Informações Nutricionais</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {nutritionMetrics.map((metric, index) => (
                  <Card
                    key={index}
                    className="border border-border/50 hover:border-primary/30 bg-gradient-to-br from-background to-muted/20 hover:shadow-xl transition-all duration-300 group overflow-hidden"
                  >
                    <CardContent className="p-6 text-center space-y-4 relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="flex items-center justify-between relative z-10">
                        <div
                          className={`p-3 ${metric.bgColor} rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-sm`}
                        >
                          <metric.icon className={`h-6 w-6 ${metric.color}`} />
                        </div>
                        {metric.rawValue > 0 && (
                          <div className="text-xs px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-400 rounded-full font-medium border border-green-200 dark:border-green-800">
                            ✓ Detectado
                          </div>
                        )}
                      </div>
                      <div className="space-y-3 relative z-10">
                        <p className="text-2xl sm:text-3xl font-bold text-foreground group-hover:scale-105 transition-transform duration-300">
                          {metric.value}
                        </p>
                        <p className={`text-base font-semibold ${metric.color}`}>{metric.label}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {metric.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Analysis Sections */}
            <div className="space-y-8">
              {/* Main Analysis */}
              {structuredAnalysis.outrasRecomendacoes.length > 0 && (
                <Card className="border border-border/50 bg-gradient-to-br from-background to-muted/20 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <CardHeader className="pb-6 border-b border-border/10 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20">
                    <CardTitle className="flex items-center gap-4 text-xl">
                      <div className="p-3 bg-gradient-to-br from-blue-500/20 via-indigo-500/10 to-transparent rounded-2xl border border-blue-200 dark:border-blue-800 shadow-sm">
                        <Info className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-foreground font-bold">Análise Detalhada</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 p-6">
                    {structuredAnalysis.outrasRecomendacoes.map((point, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-5 bg-gradient-to-r from-blue-50/70 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/10 rounded-2xl border border-blue-100 dark:border-blue-800/30 hover:shadow-md transition-all duration-300 group"
                      >
                        <div className="p-2.5 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/30 rounded-full mt-0.5 flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-300">
                          <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <p className="text-sm text-foreground leading-relaxed flex-1 font-medium">
                          {point}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Suggestions */}
              {structuredAnalysis.sugestoes.length > 0 && (
                <Card className="border border-border/50 bg-gradient-to-br from-green-50/70 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/10 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <CardHeader className="pb-6 border-b border-border/10 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20">
                    <CardTitle className="flex items-center gap-4 text-xl">
                      <div className="p-3 bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-transparent rounded-2xl border border-green-200 dark:border-green-800 shadow-sm">
                        <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-foreground font-bold">Sugestões de Melhoria</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 p-6">
                    {structuredAnalysis.sugestoes.map((suggestion, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-5 bg-gradient-to-r from-green-50/80 to-emerald-50/60 dark:from-green-950/30 dark:to-emerald-950/20 rounded-2xl border border-green-100 dark:border-green-800/30 hover:shadow-md transition-all duration-300 group"
                      >
                        <div className="p-2.5 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/30 rounded-full mt-0.5 flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-300">
                          <Heart className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <p className="text-sm text-foreground leading-relaxed flex-1 font-medium">
                          {suggestion}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Warnings/Observations */}
              {structuredAnalysis.observacoes && structuredAnalysis.observacoes.length > 0 && (
                <Card className="border border-border/50 bg-gradient-to-br from-amber-50/70 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/10 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <CardHeader className="pb-6 border-b border-border/10 bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20">
                    <CardTitle className="flex items-center gap-4 text-xl">
                      <div className="p-3 bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-transparent rounded-2xl border border-amber-200 dark:border-amber-800 shadow-sm">
                        <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                      </div>
                      <span className="text-foreground font-bold">Pontos de Atenção</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 p-5 bg-gradient-to-r from-amber-50/80 to-orange-50/60 dark:from-amber-950/30 dark:to-orange-950/20 rounded-2xl border border-amber-100 dark:border-amber-800/30 hover:shadow-md transition-all duration-300 group">
                      <div className="p-2.5 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/30 rounded-full mt-0.5 flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <p className="text-sm text-foreground leading-relaxed flex-1 font-medium">
                        {structuredAnalysis.observacoes}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Full Analysis Text */}
              <Card className="border border-border/50 bg-gradient-to-br from-background to-muted/20 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <CardHeader className="pb-6 border-b border-border/10 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20">
                  <CardTitle className="flex items-center gap-4 text-xl">
                    <div className="p-3 bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-transparent rounded-2xl border border-purple-200 dark:border-purple-800 shadow-sm">
                      <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-foreground font-bold">Análise Completa da IA</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="p-6 bg-gradient-to-br from-muted/50 to-muted/30 rounded-2xl border border-muted/50 hover:shadow-md transition-all duration-300">
                    <pre className="whitespace-pre-wrap text-sm text-foreground leading-relaxed font-sans overflow-auto max-h-96">
                      {analysis}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default NutritionAnalysisModal;
