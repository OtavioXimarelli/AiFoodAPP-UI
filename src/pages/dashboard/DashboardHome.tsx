import { useState, useEffect, useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useFoodItems } from '@/hooks/useFoodItems';
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
import { UserSummaryCard } from '@/components/dashboard/UserSummaryCard';
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

  // Loading state - DEPOIS de todos os hooks
  if (!mounted) {
    return (
      <div className="space-y-6 animate-pulse pb-24">
        <div className="h-32 bg-muted rounded-2xl"></div>
        <div className="grid gap-4 grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-28 bg-muted rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {/* User Greeting */}
      <UserSummaryCard userName={user?.name} />

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          title="Total de Ingredientes"
          value={stats.totalItems}
          subtitle={stats.totalItems > 0 ? 'itens registrados' : 'Adicione itens'}
          icon={Package}
          color="text-blue-600 dark:text-blue-400"
          bgColor="bg-blue-100 dark:bg-blue-950/30"
          delay={0.1}
        />
        <StatCard
          title="Itens Expirando"
          value={stats.expiringItems}
          subtitle={stats.expiringItems > 0 ? 'próximos 3 dias' : 'Nenhum item'}
          icon={AlertCircle}
          color="text-orange-600 dark:text-orange-400"
          bgColor="bg-orange-100 dark:bg-orange-950/30"
          delay={0.2}
        />
        <StatCard
          title="Receitas Salvas"
          value={stats.totalRecipes}
          subtitle={stats.totalRecipes > 0 ? 'receitas criadas' : 'Crie receitas'}
          icon={BookOpen}
          color="text-green-600 dark:text-green-400"
          bgColor="bg-green-100 dark:bg-green-950/30"
          delay={0.3}
        />
      </div>

      {/* Insights Cards - No title, direct display */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Expiring Soon */}
        {insights.expiringSoon.length > 0 && (
          <InsightCard
            title="Expirando em Breve"
            items={insights.expiringSoon.map(x => ({
              label: x.item.name,
              value: `${x.daysLeft} ${x.daysLeft === 1 ? 'dia' : 'dias'}`,
              color: x.daysLeft === 0 ? 'text-red-600' : (x.daysLeft ?? 0) <= 1 ? 'text-orange-600' : 'text-yellow-600',
              badge: x.daysLeft === 0 ? 'Hoje!' : undefined,
            }))}
            delay={0.5}
          />
        )}

        {/* Food Groups Distribution */}
        {insights.topGroups.length > 0 && (
          <InsightCard
            title="Distribuição por Grupo"
            items={insights.topGroups.map(g => ({
              label: g.label,
              value: `${g.percentage}%`,
              badge: `${g.count}`,
            }))}
            delay={0.6}
          />
        )}

        {/* Nutrition Summary */}
        <InsightCard
          title="Resumo Nutricional"
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
          onAction={() => navigate('/dashboard/nutrition')}
          delay={0.7}
        />
      </div>

      {/* Quick Actions */}
      <AnimatedElement variant="slideUp" delay={0.8}>
        <h2 className="text-lg font-bold text-foreground mb-4">Ações Rápidas</h2>
      </AnimatedElement>

      <div className="grid md:grid-cols-3 gap-4">
        <QuickActionCard
          title="Adicionar Ingrediente"
          description="Adicione novos itens à sua despensa"
          icon={Plus}
          to="/dashboard/inventory"
          color="text-blue-600"
          iconBg="bg-blue-100 dark:bg-blue-950/30"
        />
        <QuickActionCard
          title="Gerar Receita"
          description="Crie receitas com seus ingredientes"
          icon={ChefHat}
          to="/dashboard/recipes"
          color="text-green-600"
          iconBg="bg-green-100 dark:bg-green-950/30"
          badge="IA"
        />
        <QuickActionCard
          title="Ver Insights"
          description="Analise suas informações nutricionais"
          icon={TrendingUp}
          to="/dashboard/nutrition"
          color="text-purple-600"
          iconBg="bg-purple-100 dark:bg-purple-950/30"
        />
      </div>

      {/* Recent Recipes */}
      {stats.recentRecipes.length > 0 && (
        <>
          <AnimatedElement variant="slideUp" delay={0.9}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">Receitas Recentes</h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/dashboard/saved')}
                className="text-amber-600 hover:text-amber-700"
              >
                Ver todas <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </AnimatedElement>

          <div className="space-y-3">
            {stats.recentRecipes.map((recipe, index) => (
              <AnimatedElement key={recipe.id} variant="fadeIn" delay={1.0 + (index * 0.1)}>
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
        <AnimatedElement variant="fadeIn" delay={0.9}>
          <div className="text-center py-12 px-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-4">
              <ChefHat className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Nenhuma receita ainda</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Comece adicionando ingredientes e gerando suas primeiras receitas!
            </p>
            <Button 
              onClick={() => navigate('/dashboard/recipes')}
              className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white"
            >
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
