import React, { useState, useMemo, memo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { EnhancedClickSpark } from "@/components/ui/enhanced-click-spark";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { usePerformance, useOptimizedAnimation } from "@/hooks/usePerformance";
import { 
  ChefHat, 
  Package, 
  BarChart3, 
  Heart, 
  Clock, 
  TrendingUp,
  Users,
  Award
} from "lucide-react";

const DashboardHome = memo(() => {
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const { metrics, measureRender } = usePerformance('DashboardHome');
  const { shouldReduceMotion } = useOptimizedAnimation();

  // Memoize static data to prevent re-computation
  const stats = useMemo(() => [
    { label: "Receitas Criadas", value: "24", icon: ChefHat, color: "text-primary" },
    { label: "Ingredientes", value: "156", icon: Package, color: "text-green-500" },
    { label: "Calorias Economizadas", value: "3.2k", icon: TrendingUp, color: "text-blue-500" },
    { label: "Dias Ativos", value: "12", icon: Clock, color: "text-orange-500" }
  ], []);

  const quickActions = useMemo(() => [
    {
      title: "Gerar Nova Receita",
      description: "Crie receitas deliciosas com IA",
      icon: ChefHat,
      href: "/dashboard/recipes",
      color: "from-primary/20 to-primary/10"
    },
    {
      title: "Inventário de Comida",
      description: "Gerencie seus ingredientes",
      icon: Package,
      href: "/dashboard/food",
      color: "from-green-500/20 to-green-500/10"
    },
    {
      title: "Insights Nutricionais",
      description: "Analise sua nutrição",
      icon: BarChart3,
      href: "/dashboard/insights",
      color: "from-blue-500/20 to-blue-500/10"
    },
    {
      title: "Dados Salvos",
      description: "Acesse suas receitas favoritas",
      icon: Heart,
      href: "/dashboard/saved",
      color: "from-red-500/20 to-red-500/10"
    }
  ], []);

  const recentActivities = useMemo(() => [
    {
      title: "Receita de Risotto Criada",
      description: "Há 2 horas",
      badge: { text: "Nova", icon: Award, variant: "secondary" as const }
    },
    {
      title: "Inventário Atualizado",
      description: "Há 5 horas",
      badge: { text: "Ingredientes", icon: Package, variant: "outline" as const }
    }
  ], []);

  return (
    <div className="space-y-8 p-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Bem-vindo de volta!</h1>
        <p className="text-muted-foreground">
          Aqui está um resumo das suas atividades culinárias.
        </p>
      </div>

      {/* Stats Grid - Optimized with memoization */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const StatIcon = stat.icon;
          return (
            <EnhancedClickSpark key={stat.label}>
              <SpotlightCard className="p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center space-x-2">
                  <StatIcon className={`h-4 w-4 ${stat.color}`} />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </SpotlightCard>
            </EnhancedClickSpark>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Ações Rápidas</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {quickActions.map((action, index) => {
            const ActionIcon = action.icon;
            return (
              <EnhancedClickSpark key={action.title}>
                <Link to={action.href}>
                  <SpotlightCard className="group cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10">
                    <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                      <div className={`rounded-lg bg-gradient-to-br ${action.color} p-2`}>
                        <ActionIcon className="h-4 w-4" />
                      </div>
                      <div className="ml-4 space-y-1">
                        <CardTitle className="text-sm font-medium">
                          {action.title}
                        </CardTitle>
                        <CardDescription>{action.description}</CardDescription>
                      </div>
                    </CardHeader>
                  </SpotlightCard>
                </Link>
              </EnhancedClickSpark>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Atividade Recente</h2>
        <div className="grid gap-4">
          {recentActivities.map((activity, index) => {
            const BadgeIcon = activity.badge.icon;
            return (
              <EnhancedClickSpark key={activity.title}>
                <SpotlightCard className="hover:shadow-md transition-shadow duration-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-base">{activity.title}</CardTitle>
                        <CardDescription>{activity.description}</CardDescription>
                      </div>
                      <Badge variant={activity.badge.variant}>
                        <BadgeIcon className="mr-1 h-3 w-3" />
                        {activity.badge.text}
                      </Badge>
                    </div>
                  </CardHeader>
                </SpotlightCard>
              </EnhancedClickSpark>
            );
          })}
        </div>
      </div>
    </div>
  );
});

DashboardHome.displayName = 'DashboardHome';

export default DashboardHome;