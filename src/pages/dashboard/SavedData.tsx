import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import CustomScrollbar from "@/components/ui/custom-scrollbar";
import { useLocalRecipes } from "@/hooks/useLocalRecipes";
import { useLocalNutritionAnalysis } from "@/hooks/useLocalNutritionAnalysis";
import { useAppCache } from "@/hooks/useAppCache";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import {
  ChefHat,
  TrendingUp,
  Search,
  Calendar,
  Clock,
  Users,
  Flame,
  Trash2,
  Download,
  Upload,
  HardDrive,
  AlertCircle,
  CheckCircle,
  ShieldAlert
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SavedDataPage = () => {
  const { user } = useAuth();
  const { 
    storedRecipes, 
    searchRecipes, 
    deleteRecipe, 
    getRecentRecipes,
    totalRecipes 
  } = useLocalRecipes();
  
  const { 
    storedAnalyses, 
    searchAnalyses, 
    deleteAnalysis, 
    getRecentAnalyses,
    totalAnalyses 
  } = useLocalNutritionAnalysis();
  
  const { 
    getStorageInfo, 
    clearAllCache, 
    exportAllData, 
    importData, 
    getCacheHealth 
  } = useAppCache();

  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  // Check if user is admin
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'admin';
  
  // If not admin, show access denied
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
                <ShieldAlert className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Acesso Restrito</h2>
              <p className="text-sm text-muted-foreground">
                Esta página é exclusiva para administradores. Você não tem permissão para acessar os dados de armazenamento.
              </p>
              <Button 
                variant="outline" 
                onClick={() => window.history.back()}
                className="w-full"
              >
                Voltar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const storageInfo = getStorageInfo();
  const cacheHealth = getCacheHealth();

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const data = exportAllData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-food-app-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Backup criado!",
        description: "Seus dados foram exportados com sucesso",
        variant: "default"
      });
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      toast({
        title: "Erro no backup",
        description: "Não foi possível exportar os dados",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const result = importData(data);

      if (result.success) {
        toast({
          title: "Dados importados!",
          description: `${result.total} itens foram restaurados`,
          variant: "default"
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      toast({
        title: "Erro na importação",
        description: "Arquivo inválido ou corrompido",
        variant: "destructive"
      });
    }
  };

  const handleClearAllData = () => {
    if (confirm('Tem certeza que deseja apagar todos os dados salvos? Esta ação não pode ser desfeita.')) {
      const success = clearAllCache();
      if (success) {
        toast({
          title: "Dados limpos",
          description: "Todos os dados foram removidos",
          variant: "default"
        });
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível limpar os dados",
          variant: "destructive"
        });
      }
    }
  };

  const filteredRecipes = searchTerm 
    ? searchRecipes(searchTerm, ['name', 'description']) 
    : storedRecipes;

  const filteredAnalyses = searchTerm 
    ? searchAnalyses(searchTerm, ['title']) 
    : storedAnalyses;

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dados Salvos</h1>
          <p className="text-muted-foreground">
            Gerencie suas receitas e análises nutricionais salvas
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar receitas ou análises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Storage Info */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Informações de Armazenamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Receitas</span>
                <span className="font-medium">{totalRecipes}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Análises</span>
                <span className="font-medium">{totalAnalyses}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tamanho total</span>
                <span className="font-medium">{storageInfo.totalSizeInKB} KB</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Uso do storage</span>
                <span className="font-medium">{storageInfo.storageUsagePercent}%</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cacheHealth.status === 'healthy' && (
                <CheckCircle className="h-4 w-4 text-green-600" />
              )}
              {cacheHealth.status === 'warning' && (
                <AlertCircle className="h-4 w-4 text-yellow-600" />
              )}
              {cacheHealth.status === 'critical' && (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <span className="text-sm capitalize">{cacheHealth.status}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
            <Button onClick={handleExportData} disabled={isExporting} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? 'Exportando...' : 'Fazer Backup'}
            </Button>
            
            <label className="inline-flex">
              <Button variant="outline" size="sm" asChild>
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Importar Backup
                </span>
              </Button>
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>

            <Button 
              onClick={handleClearAllData} 
              variant="destructive" 
              size="sm"
              className="ml-auto"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Limpar Tudo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Tabs */}
      <Tabs defaultValue="recipes" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recipes" className="flex items-center gap-2">
            <ChefHat className="h-4 w-4" />
            Receitas ({totalRecipes})
          </TabsTrigger>
          <TabsTrigger value="analyses" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Análises ({totalAnalyses})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recipes" className="space-y-4">
          {filteredRecipes.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <ChefHat className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  {searchTerm ? 'Nenhuma receita encontrada' : 'Nenhuma receita salva ainda'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <CustomScrollbar 
              height="600px" 
              variant="default"
              className="border rounded-lg p-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRecipes.map((recipe) => (
                <Card key={recipe.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg line-clamp-2">{recipe.name}</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteRecipe(recipe.id!)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {recipe.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                      {recipe.prepTime && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {recipe.prepTime}min
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {recipe.servings}
                      </div>
                      {recipe.calories && (
                        <div className="flex items-center gap-1">
                          <Flame className="h-3 w-3" />
                          {recipe.calories}cal
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {recipe.tags?.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {recipe.createdAt && (
                      <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(recipe.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
              </div>
            </CustomScrollbar>
          )}
        </TabsContent>

        <TabsContent value="analyses" className="space-y-4">
          {filteredAnalyses.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  {searchTerm ? 'Nenhuma análise encontrada' : 'Nenhuma análise salva ainda'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <CustomScrollbar 
              height="600px" 
              variant="thin"
              className="border rounded-lg p-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAnalyses.map((analysis) => (
                <Card key={analysis.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg line-clamp-2">{analysis.title}</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteAnalysis(analysis.id!)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="text-center p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                        <div className="text-sm font-medium text-orange-600 dark:text-orange-400">
                          {analysis.analysis.calories}
                        </div>
                        <div className="text-xs text-muted-foreground">Calorias</div>
                      </div>
                      <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                        <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          {analysis.analysis.protein}g
                        </div>
                        <div className="text-xs text-muted-foreground">Proteína</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium">Alimentos:</span>
                        <p className="text-sm text-muted-foreground">
                          {analysis.foodItems.slice(0, 3).join(', ')}
                          {analysis.foodItems.length > 3 && '...'}
                        </p>
                      </div>

                      {analysis.period && (
                        <Badge variant="outline" className="text-xs">
                          {analysis.period}
                        </Badge>
                      )}
                    </div>

                    {analysis.createdAt && (
                      <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(analysis.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
              </div>
            </CustomScrollbar>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SavedDataPage;
