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
import { useAuth } from "@/hooks/useAuth";
import { useFoodItems } from "@/hooks/useFoodItems";
import { useLocalRecipes } from "@/hooks/useLocalRecipes";
import { cn } from "@/lib/utils";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { NavLink } from "react-router-dom";
import { 
  SpringCard, 
  StaggeredList, 
  MagneticButton, 
  RevealAnimation 
} from "@/components/ui/reactbits-animations";
import { 
  ReactBitsCard, 
  TextReveal, 
  ScrollTriggeredSection,
  RippleButton 
} from "@/components/ui/reactbits-components";
import { FluidGlass, FluidGlassCard, AnimatedFluidGlass } from "@/components/ui/fluid-glass";

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
    <ScrollTriggeredSection animation="fadeUp" className="space-y-8">
      {/* Welcome Section */}
      <RevealAnimation direction="up" className="space-y-2">
        <TextReveal className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Olá, {user?.name || 'Usuário'}! 👋
        </TextReveal>
        <p className="text-muted-foreground text-lg">
          Bem-vindo ao seu painel de controle alimentar
        </p>
      </RevealAnimation>

      {/* Stats Overview */}
      <StaggeredList stagger={150} className="grid gap-6 md:grid-cols-3">
        <SpringCard hover className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200 dark:border-blue-800/50">
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
        </SpringCard>

        <SpringCard delay={100} hover className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/20 border-orange-200 dark:border-orange-800/50">
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
        </SpringCard>

        <SpringCard delay={200} hover className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20 border-green-200 dark:border-green-800/50">
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
        </SpringCard>
      </StaggeredList>

      {/* Quick Actions with FluidGlass */}
      <ScrollTriggeredSection animation="slideLeft" className="space-y-4">
        <TextReveal className="text-xl font-semibold text-foreground">Ações Rápidas</TextReveal>
        <StaggeredList stagger={100} className="grid gap-4 md:grid-cols-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <AnimatedFluidGlass 
                key={action.title}
                variant="default"
                intensity="medium"
                className="cursor-pointer group"
              >
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
              </AnimatedFluidGlass>
            );
          })}
        </StaggeredList>
      </ScrollTriggeredSection>

      {/* FluidGlass Showcase Section */}
      <ScrollTriggeredSection animation="fadeUp" className="space-y-6">
        <TextReveal className="text-xl font-semibold text-foreground">Componentes FluidGlass</TextReveal>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FluidGlassCard 
            title="Glass Sutil"
            description="Efeito de vidro com baixa intensidade"
            variant="subtle"
            intensity="low"
          >
            <div className="flex items-center gap-2 mt-4">
              <Activity className="h-4 w-4 text-primary" />
              <span className="text-sm text-foreground">Componente ativo</span>
            </div>
          </FluidGlassCard>

          <FluidGlassCard 
            title="Glass Padrão"
            description="Efeito de vidro com intensidade média"
            variant="default"
            intensity="medium"
          >
            <div className="flex items-center gap-2 mt-4">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-foreground">Recomendado</span>
            </div>
          </FluidGlassCard>

          <FluidGlassCard 
            title="Glass Forte"
            description="Efeito de vidro com alta intensidade"
            variant="strong"
            intensity="high"
          >
            <div className="flex items-center gap-2 mt-4">
              <Plus className="h-4 w-4 text-green-500" />
              <span className="text-sm text-foreground">Premium</span>
            </div>
          </FluidGlassCard>
        </div>

        <FluidGlass variant="default" intensity="medium" className="p-8">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-foreground">FluidGlass Container</h3>
            <p className="text-muted-foreground">
              Este é um exemplo de container com efeito de vidro fluido. 
              Perfeito para destacar conteúdo importante com um visual moderno e elegante.
            </p>
            <RippleButton 
              variant="primary" 
              className="mt-4"
              onClick={() => console.log('FluidGlass button clicked!')}
            >
              Botão Interativo
            </RippleButton>
          </div>
        </FluidGlass>
      </ScrollTriggeredSection>
    </ScrollTriggeredSection>
  );
};

export default DashboardHome;