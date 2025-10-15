import { useState, useEffect, useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
imp    if (stats.totalRecipes >= 10) {
      allTips.push({
        icon: 'star' as const,
        title: 'Você é um Chef experiente!',
        description: `Parabéns! Você já criou ${stats.totalRecipes} receitas. Continue compartilhando seu conhecimento!`,
        color: 'text-purple-600 dark:text-purple-400',
        bgColor: 'bg-purple-100 dark:bg-purple-950/30',
      });
    }

    return allTips;
  }, [stats, recipesThisWeek]);

  // Loading state (DEPOIS de todos os hooks)
  if (!mounted) {
    return (
      <div className="space-y-6 animate-pulse pb-24 px-1">
        <div className="h-40 bg-muted/50 rounded-2xl shadow-md"></div>
        <div className="grid gap-4 grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-muted/50 rounded-xl shadow-md"></div>
          ))}
        </div>
        <div className="h-64 bg-muted/50 rounded-2xl shadow-md"></div>
      </div>
    );
  }

  return (} from '@/hooks/useFoodItems';
import { useLocalRecipes } from '@/hooks/useLocalRecipes';
import { differenceInDays } from 'date-fns';
import { FOOD_GROUP_LABELS } from '@/lib/types';
import { 
  Package, 
  AlertCircle, 
  BookOpen, 
  Plus, 
  ChefHat, 
  TrendingUp,
  ArrowRight
} from 'lucide-react';

// Import new components
import { WelcomeCard } from '@/components/dashboard/WelcomeCard';
import { StatCard } from '@/components/dashboard/StatCard';
import { QuickActionCard } from '@/components/dashboard/QuickActionCard';
import { InsightCard } from '@/components/dashboard/InsightCard';
import { RecentRecipeCard } from '@/components/dashboard/RecentRecipeCard';
import { AnimatedElement } from '@/components/ui/animated';
import { Button } from '@/components/ui/button';

const DashboardHome = memo(() => {
  const { user } = useAuth();
  const { foodItems } = useFoodItems();
  const { storedRecipes } = useLocalRecipes();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate statistics
  const stats = useMemo(() => {
    const items = Array.isArray(foodItems) ? foodItems : [];
    const recipes = Array.isArray(storedRecipes) ? storedRecipes : [];
    const today = new Date();

    const expiringCount = items.filter(item => {
      if (!item.expiration) return false;
      const expirationDate = new Date(item.expiration);
      const daysUntilExpiration = Math.ceil(
        (expirationDate.getTime() - today.getTime()) / (1000 * 3600 * 24)
      );
      return daysUntilExpiration <= 3 && daysUntilExpiration >= 0;
    }).length;

    return {
      totalItems: items.length,
      expiringItems: expiringCount,
      totalRecipes: recipes.length,
      recentRecipes: recipes.slice(0, 3),
    };
  }, [foodItems, storedRecipes]);

  // Calculate insights
  const insights = useMemo(() => {
    const items = Array.isArray(foodItems) ? foodItems : [];
    const today = new Date();

    // Items expiring soon
    const withDates = items.map(i => {
      const exp = i.expiration ? new Date(i.expiration) : null;
      const validDate = exp && !isNaN(exp.getTime()) ? exp : null;
      const daysLeft = validDate ? differenceInDays(validDate, today) : null;
      return { item: i, daysLeft };
    });

    const expiringSoon = withDates
      .filter(x => x.daysLeft !== null && x.daysLeft >= 0 && x.daysLeft <= 3)
      .sort((a, b) => a.daysLeft! - b.daysLeft!)
      .slice(0, 3);

    // Food group distribution
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
        percentage: Math.round((count / totalGroups) * 100),
      }));

    // Nutrition totals
    const nutrition = items.reduce(
      (acc, item: any) => ({
        calories: acc.calories + (Number(item.calories) || 0),
        protein: acc.protein + (Number(item.protein) || 0),
        carbs: acc.carbs + (Number(item.carbohydrates) || 0),
        fat: acc.fat + (Number(item.fat) || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    return { expiringSoon, topGroups, nutrition };
  }, [foodItems]);

  // Calculate user level and goals (ANTES do return condicional)
  const userLevel = Math.floor(stats.totalRecipes / 10) + 1;
  const recipesThisWeek = 2; // TODO: Calculate from actual data
  const consecutiveDays = 3; // TODO: Calculate from actual data

  // Generate contextual tips based on user data (ANTES do return condicional)
  const tips = useMemo(() => {
    const allTips: Array<{
      icon: 'lightbulb' | 'trending' | 'clock' | 'star';
      title: string;
      description: string;
      color: string;
      bgColor: string;
    }> = [];
    
    if (stats.expiringItems > 0) {
      allTips.push({
        icon: 'clock' as const,
        title: 'Itens expirando em breve!',
        description: `Você tem ${stats.expiringItems} ${stats.expiringItems === 1 ? 'item' : 'itens'} expirando nos próximos 3 dias. Que tal criar uma receita com eles?`,
        color: 'text-orange-600 dark:text-orange-400',
        bgColor: 'bg-orange-100 dark:bg-orange-950/30',
      });
    }

    if (stats.totalItems === 0) {
      allTips.push({
        icon: 'lightbulb' as const,
        title: 'Comece adicionando ingredientes',
        description: 'Adicione seus ingredientes para que possamos sugerir receitas personalizadas!',
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-100 dark:bg-blue-950/30',
      });
    }

    if (stats.totalRecipes >= 5 && recipesThisWeek < 2) {
      allTips.push({
        icon: 'trending' as const,
        title: 'Continue criando!',
        description: 'Você está indo bem! Tente criar mais receitas esta semana para manter o ritmo.',
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-100 dark:bg-green-950/30',
      });
    }

    if (stats.totalRecipes >= 10) {
      allTips.push({
        icon: 'star' as const,
        title: 'Você é um Chef experiente!',
        description: `Parabéns! Você já criou ${stats.totalRecipes} receitas. Continue compartilhando seu conhecimento!`,
        color: 'text-purple-600 dark:text-purple-400',
        bgColor: 'bg-purple-100 dark:bg-purple-950/30',
      });
    }

    return allTips;
  }, [stats, recipesThisWeek]);

  // Loading state (DEPOIS de todos os hooks)
  if (!mounted) {
    return allTips;
  }, [stats, recipesThisWeek]);

  // Loading state (DEPOIS de todos os hooks)
  if (!mounted) {
    return (
      <div className="space-y-6 animate-pulse pb-24 px-1">
        <div className="h-40 bg-muted/50 rounded-2xl shadow-md"></div>
        <div className="grid gap-4 grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-muted/50 rounded-xl shadow-md"></div>
          ))}
        </div>
        <div className="h-64 bg-muted/50 rounded-2xl shadow-md"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Welcome Card */}
      <WelcomeCard 
        userName={user?.name} 
        userEmail={user?.email} 
      />

      {/* Quick Actions - Priority shortcuts */}
      <AnimatedElement variant="slideUp" delay={0.1}>
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">Ações Rápidas</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <QuickActionCard
              title="Adicionar Ingrediente"
              description="Adicione novos itens à sua despensa"
              icon={Plus}
              to="/dashboard/food"
              color="text-blue-600 dark:text-blue-400"
              iconBg="bg-blue-100 dark:bg-blue-950/30"
            />
            <QuickActionCard
              title="Gerar Receita"
              description="Crie receitas com seus ingredientes"
              icon={ChefHat}
              to="/dashboard/recipes"
              color="text-green-600 dark:text-green-400"
              iconBg="bg-green-100 dark:bg-green-950/30"
              badge="IA"
            />
            <QuickActionCard
              title="Ver Insights"
              description="Analise suas informações nutricionais"
              icon={TrendingUp}
              to="/dashboard/insights"
              color="text-purple-600 dark:text-purple-400"
              iconBg="bg-purple-100 dark:bg-purple-950/30"
            />
          </div>
        </div>
      </AnimatedElement>

      {/* Stats Grid */}
      <AnimatedElement variant="slideUp" delay={0.2}>
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">Resumo da Despensa</h2>
          <div className="grid grid-cols-3 gap-3">
            <StatCard
              title="Total de Ingredientes"
              value={stats.totalItems}
              subtitle={stats.totalItems > 0 ? 'itens registrados' : 'Adicione itens'}
              icon={Package}
              color="text-blue-600 dark:text-blue-400"
              bgColor="bg-blue-100 dark:bg-blue-950/30"
              delay={0.3}
            />
            <StatCard
              title="Itens Expirando"
              value={stats.expiringItems}
              subtitle={stats.expiringItems > 0 ? 'próximos 3 dias' : 'Nenhum item'}
              icon={AlertCircle}
              color="text-orange-600 dark:text-orange-400"
              bgColor="bg-orange-100 dark:bg-orange-950/30"
              delay={0.4}
            />
            <StatCard
              title="Receitas Salvas"
              value={stats.totalRecipes}
              subtitle={stats.totalRecipes > 0 ? 'receitas criadas' : 'Crie receitas'}
              icon={BookOpen}
              color="text-green-600 dark:text-green-400"
              bgColor="bg-green-100 dark:bg-green-950/30"
              delay={0.5}
            />
          </div>
        </div>
      </AnimatedElement>

      {/* Insights Section */}
      <AnimatedElement variant="slideUp" delay={0.6}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">Insights Nutricionais</h2>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/dashboard/insights')}
            className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/20"
          >
            Ver todos <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </AnimatedElement>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Expiring Soon */}
        {insights.expiringSoon.length > 0 && (
          <InsightCard
            title="⏰ Expirando em Breve"
            items={insights.expiringSoon.map(x => ({
              label: x.item.name,
              value: `${x.daysLeft} ${x.daysLeft === 1 ? 'dia' : 'dias'}`,
              color: x.daysLeft === 0 ? 'text-red-600' : (x.daysLeft ?? 0) <= 1 ? 'text-orange-600' : 'text-yellow-600',
              badge: x.daysLeft === 0 ? 'Hoje!' : undefined,
            }))}
            delay={0.7}
          />
        )}

        {/* Food Groups Distribution */}
        {insights.topGroups.length > 0 && (
          <InsightCard
            title="📊 Distribuição por Grupo"
            items={insights.topGroups.map(g => ({
              label: g.label,
              value: `${g.percentage}%`,
              badge: `${g.count}`,
            }))}
            delay={0.8}
          />
        )}

        {/* Nutrition Summary */}
        <InsightCard
          title="🥗 Resumo Nutricional"
          items={[
            { 
              label: 'Calorias totais', 
              value: `${Math.round(insights.nutrition.calories)}kcal`,
              color: 'text-orange-600'
            },
            { 
              label: 'Proteínas', 
              value: `${Math.round(insights.nutrition.protein)}g`,
              color: 'text-blue-600'
            },
            { 
              label: 'Carboidratos', 
              value: `${Math.round(insights.nutrition.carbs)}g`,
              color: 'text-green-600'
            },
          ]}
          actionLabel="Ver detalhes"
          onAction={() => navigate('/dashboard/insights')}
          delay={0.9}
        />
      </div>

      {/* Recent Recipes */}
      {stats.recentRecipes.length > 0 && (
        <>
          <AnimatedElement variant="slideUp" delay={1.0}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">📖 Receitas Recentes</h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/dashboard/saved-recipes')}
                className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/20"
              >
                Ver todas <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </AnimatedElement>

          <div className="space-y-3">
            {stats.recentRecipes.map((recipe, index) => (
              <AnimatedElement key={recipe.id} variant="fadeIn" delay={1.1 + (index * 0.1)}>
                <RecentRecipeCard
                  id={String(recipe.id)}
                  title={recipe.name || 'Receita Deliciosa'}
                  prepTime={typeof recipe.prepTime === 'number' ? String(recipe.prepTime) : recipe.prepTime}
                  servings={recipe.servings}
                />
              </AnimatedElement>
            ))}
          </div>
        </>
      )}

      {/* Empty State for Recipes */}
      {stats.totalRecipes === 0 && (
        <AnimatedElement variant="fadeIn" delay={1.0}>
          <div className="bg-gradient-to-br from-card via-card to-card/95 border border-border/40 rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/20">
              <ChefHat className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Comece sua jornada culinária! 👨‍🍳</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Adicione seus ingredientes e deixe nossa IA criar receitas personalizadas para você!
            </p>
            <Button 
              onClick={() => navigate('/dashboard/recipes')}
              size="lg"
              className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/20"
            >
              <ChefHat className="w-5 h-5 mr-2" />
              Gerar Primeira Receita
            </Button>
          </div>
        </AnimatedElement>
      )}
    </div>
  );
});

DashboardHome.displayName = 'DashboardHome';

export default DashboardHome;
