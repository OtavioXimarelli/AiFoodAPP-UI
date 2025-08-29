import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ChefHat, 
  Package, 
  TrendingUp, 
  Clock, 
  Star,
  Plus,
  Activity,
  ArrowRight
} from "lucide-react";
import { formatPrepTime, formatCalories, formatServings } from "@/lib/format";
import { FOOD_GROUP_LABELS } from "@/lib/types";
import { differenceInDays } from "date-fns";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { useFoodItems } from "@/hooks/useFoodItems";
import { useLocalRecipes } from "@/hooks/useLocalRecipes";
import { cn } from "@/lib/utils";
import { ReactBitsCard, TextReveal } from "@/components/ui/reactbits-components";
import { NavLink } from "react-router-dom";
import { EnhancedClickSpark } from "@/components/ui/enhanced-click-spark";

const DashboardHome = () => {
  const { user } = useAuth();
  const { foodItems } = useFoodItems();
  const { storedRecipes } = useLocalRecipes();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Memoize calculations for better performance
  const stats = useMemo(() => ({
    totalItems: foodItems?.length || 0,
    expiringItems: foodItems?.filter(item => {
      if (!item.expiration) return false;
      const expirationDate = new Date(item.expiration);
      const today = new Date();
      const daysUntilExpiration = Math.ceil((expirationDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
      return daysUntilExpiration <= 3 && daysUntilExpiration >= 0;
    }).length || 0,
    totalRecipes: storedRecipes?.length || 0,
    recentRecipes: storedRecipes?.slice(0, 3) || []
  }), [foodItems, storedRecipes]);

  // Quick Insights derived from real pantry data
  const insights = useMemo(() => {
    const items = Array.isArray(foodItems) ? foodItems : [];
    const today = new Date();

    const withDates = items.map((i) => {
      const exp = i.expiration ? new Date(i.expiration) : null;
      const validDate = exp && !isNaN(exp.getTime()) ? exp : null;
      const daysLeft = validDate ? differenceInDays(validDate, today) : null;
      return { item: i, daysLeft };
    });

    const expiringSoon = withDates
      .filter((x) => x.daysLeft !== null && x.daysLeft >= 0 && x.daysLeft <= 3)
      .sort((a, b) => (a.daysLeft! - b.daysLeft!))
      .slice(0, 3);

    const expiredCount = withDates.filter((x) => x.daysLeft !== null && x.daysLeft < 0).length;

    const groupCounts: Record<string, number> = {};
    for (const i of items) {
      const key = i.foodGroup || 'OTHER';
      groupCounts[key] = (groupCounts[key] || 0) + 1;
    }
    const totalGroups = Object.values(groupCounts).reduce((a, b) => a + b, 0) || 1;
    const topGroups = Object.entries(groupCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([key, count]) => ({
        key,
        label: (FOOD_GROUP_LABELS as any)[key] || key,
        count,
        pct: Math.round((count / totalGroups) * 100)
      }));

    // Basic nutrition totals (only sum if present)
    const totals = items.reduce((acc, it: any) => ({
      calories: acc.calories + (Number(it.calories) || 0),
      protein: acc.protein + (Number(it.protein) || 0),
      carbohydrates: acc.carbohydrates + (Number(it.carbohydrates) || 0),
      fat: acc.fat + (Number(it.fat) || 0)
    }), { calories: 0, protein: 0, carbohydrates: 0, fat: 0 });

    return { expiringSoon, expiredCount, topGroups, totals };
  }, [foodItems]);

  const quickActions = useMemo(() => [
    {
      title: "Adicionar Ingrediente",
      description: "Adicione novos itens à sua despensa",
      icon: Package,
      to: "/dashboard/food",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20"
    },
    {
      title: "Gerar Receita",
      description: "Crie receitas com seus ingredientes",
      icon: ChefHat,
      to: "/dashboard/recipes",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/20"
    },
    {
      title: "Ver Insights",
      description: "Analise suas informações nutricionais",
      icon: TrendingUp,
      to: "/dashboard/insights",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/20"
    }
  ], []);

  if (!mounted) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/3"></div>
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-2"
      >
        <TextReveal className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Bem-vindo, {user?.name || 'Chef'}! 👨‍🍳
        </TextReveal>
        <p className="text-muted-foreground">
          Gerencie sua despensa e descubra receitas deliciosas com IA
        </p>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <EnhancedClickSpark sparkColor="hsl(214, 100%, 59%)" sparkCount={8}>
            <ReactBitsCard>
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200 dark:border-blue-800/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    Total de Ingredientes
                  </CardTitle>
                  <Package className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                    {stats.totalItems}
                  </div>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    itens em sua despensa
                  </p>
                </CardContent>
              </Card>
            </ReactBitsCard>
          </EnhancedClickSpark>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <EnhancedClickSpark sparkColor="hsl(24, 100%, 50%)" sparkCount={10}>
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/20 border-orange-200 dark:border-orange-800/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
                  Itens Expirando
                </CardTitle>
                <Clock className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-800 dark:text-orange-200">
                  {stats.expiringItems}
                </div>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                  expiram em 3 dias
                </p>
              </CardContent>
            </Card>
          </EnhancedClickSpark>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <EnhancedClickSpark sparkColor="hsl(142, 72%, 29%)" sparkCount={12}>
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20 border-green-200 dark:border-green-800/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
                  Receitas Salvas
                </CardTitle>
                <ChefHat className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-800 dark:text-green-200">
                  {stats.totalRecipes}
                </div>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  receitas criadas
                </p>
              </CardContent>
            </Card>
          </EnhancedClickSpark>
        </motion.div>
      </div>

      {/* Insights Rápidos (dados reais) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold text-foreground">Insights Rápidos</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Expira em breve */}
          <Card className="bg-card border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-600" />
                Expira em breve
              </CardTitle>
              <CardDescription className="text-xs">Itens que precisam de atenção</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {insights.expiringSoon.length === 0 ? (
                <p className="text-xs text-muted-foreground">Nenhum item expira nos próximos 3 dias.</p>
              ) : (
                <ul className="space-y-2">
                  {insights.expiringSoon.map(({ item, daysLeft }) => (
                    <li key={item.id} className="flex items-center justify-between text-sm">
                      <span className="truncate max-w-[60%]" title={item.name}>{item.name}</span>
                      <Badge className="bg-red-600 text-white text-[10px]">
                        {daysLeft === 0 ? 'Hoje' : `${daysLeft}d`}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
              {insights.expiringSoon.length > 0 && (
                <Button variant="outline" size="sm" className="mt-2" asChild>
                  <NavLink to="/dashboard/food">Ver na Despensa</NavLink>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Distribuição por grupo */}
          <Card className="bg-card border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Distribuição por grupo
              </CardTitle>
              <CardDescription className="text-xs">Principais categorias da sua despensa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {insights.topGroups.length === 0 ? (
                <p className="text-xs text-muted-foreground">Sem dados de grupos por enquanto.</p>
              ) : (
                <div className="space-y-2">
          {insights.topGroups.map((g) => (
                    <div key={g.key} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span>{g.label}</span>
                        <span className="text-muted-foreground">{g.count}</span>
                      </div>
            <Progress value={g.pct} className="h-1.5" aria-label={`Percentual de ${g.label}`} />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resumo Nutricional básico */}
          <Card className="bg-card border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                Resumo Nutricional
              </CardTitle>
              <CardDescription className="text-xs">Totais aproximados disponíveis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-muted-foreground">Calorias</p>
                  <p className="font-semibold">{insights.totals.calories}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Proteínas</p>
                  <p className="font-semibold">{insights.totals.protein}g</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Carboidratos</p>
                  <p className="font-semibold">{insights.totals.carbohydrates}g</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Gorduras</p>
                  <p className="font-semibold">{insights.totals.fat}g</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="mt-3" asChild>
                <NavLink to="/dashboard/insights">Ver detalhes</NavLink>
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold text-foreground">Ações Rápidas</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              >
                <EnhancedClickSpark sparkColor={`hsl(var(--primary))`} sparkCount={6}>
                  <Card className="cursor-pointer group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-gradient-to-br from-card to-card/80">
                    <NavLink to={action.to} className="block h-full p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={cn(
                          "p-2 rounded-lg bg-gradient-to-r transition-transform duration-300 group-hover:scale-110",
                          action.color
                        )}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                            {action.title}
                          </h3>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {action.description}
                      </p>
                    </NavLink>
                  </Card>
                </EnhancedClickSpark>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Recent Recipes */}
      {stats.recentRecipes.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Receitas Recentes</h2>
            <Button variant="ghost" size="sm" asChild>
              <NavLink to="/dashboard/saved" className="flex items-center gap-2">
                Ver todas
                <ArrowRight className="h-4 w-4" />
              </NavLink>
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {stats.recentRecipes.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
              >
                <EnhancedClickSpark sparkColor="hsl(47, 100%, 50%)" sparkCount={8}>
                  <Card className="group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                          {recipe.name || "Receita Deliciosa"}
                        </CardTitle>
                        {((recipe as any).rating) ? (
                          <Badge variant="secondary" className="ml-2 flex-shrink-0">
                            <Star className="h-3 w-3 mr-1" />
                            {(recipe as any).rating}
                          </Badge>
                        ) : null}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                        {recipe.description || "Receita deliciosa criada com IA"}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatPrepTime(recipe.prepTime) ?? 'N/A'}
                        </span>
                        <span>{recipe.difficulty || 'Médio'}</span>
                      </div>
                    </CardContent>
                  </Card>
                </EnhancedClickSpark>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DashboardHome;