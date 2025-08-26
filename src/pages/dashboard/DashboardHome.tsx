import React, { useState, useMemo, memo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
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
import { 
  OptimizedStatCard, 
  OptimizedActionCard, 
  OptimizedActivityItem,
  withPerformanceOptimization 
} from "@/components/ui/optimized-dashboard";

const DashboardHome = memo(() => {
  const [activeCard, setActiveCard] = useState<string | null>(null);

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

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <OptimizedStatCard 
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            index={index}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Ações Rápidas</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {quickActions.map((action, index) => (
            <OptimizedActionCard
              key={action.title}
              title={action.title}
              description={action.description}
              icon={action.icon}
              href={action.href}
              color={action.color}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Atividade Recente</h2>
        <div className="grid gap-4">
          {recentActivities.map((activity, index) => (
            <OptimizedActivityItem
              key={activity.title}
              title={activity.title}
              description={activity.description}
              badge={activity.badge}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

DashboardHome.displayName = 'DashboardHome';

export default withPerformanceOptimization(DashboardHome, 'DashboardHome');