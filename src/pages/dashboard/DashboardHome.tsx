import { useState, useEffect } from "react";
import { useFoodItems } from "@/hooks/useFoodItems";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import WelcomeDialog from "@/components/shared/WelcomeDialog";
import { 
  Package, 
  Clock, 
  ChefHat, 
  TrendingUp, 
  Plus,
  AlertTriangle,
  Leaf,
  Star,
  Calendar,
  Search,
  Filter,
  User
} from "lucide-react";
import { Link } from "react-router-dom";
import { format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";

const DashboardHome = () => {
  const { foodItems, loading } = useFoodItems();
  const { user } = useAuth();
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const [greeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  });

  // Show welcome dialog on first visit
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    if (!hasSeenWelcome && user) {
      setShowWelcomeDialog(true);
      localStorage.setItem("hasSeenWelcome", "true");
    }
  }, [user]);

  const getUserName = () => {
    if (user?.name) return user.name.split(' ')[0];
    if (user?.email) return user.email.split('@')[0];
    return "Usuário";
  };

  const getUserInitials = () => {
    const name = getUserName();
    return name.substring(0, 2).toUpperCase();
  };

  const safeFoodItems = Array.isArray(foodItems) ? foodItems : [];
  
  // Calculate statistics
  const totalItems = safeFoodItems.length;
  const expiringItems = safeFoodItems.filter(item => {
    const daysUntilExpiration = differenceInDays(new Date(item.expiration), new Date());
    return daysUntilExpiration >= 0 && daysUntilExpiration <= 3;
  });
  const expiredItems = safeFoodItems.filter(item => {
    return differenceInDays(new Date(item.expiration), new Date()) < 0;
  });

  const quickActions = [
    {
      title: "Adicionar Alimento",
      description: "Registre um novo item na sua despensa",
      icon: Plus,
      to: "/dashboard/food",
      color: "bg-primary",
      textColor: "text-primary-foreground"
    },
    {
      title: "Gerar Receita",
      description: "Crie receitas com seus ingredientes",
      icon: ChefHat,
      to: "/dashboard/recipes",
      color: "bg-gradient-to-br from-orange-500 to-red-500",
      textColor: "text-white"
    },
    {
      title: "Ver Insights",
      description: "Análise nutricional dos alimentos",
      icon: TrendingUp,
      to: "/dashboard/insights",
      color: "bg-gradient-to-br from-blue-500 to-purple-500",
      textColor: "text-white"
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-28 lg:pb-8">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/50 px-6 py-5">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setShowUserInfo(!showUserInfo)}
        >
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">
              {greeting}, {getUserName()}! 👋
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
            </p>
            {showUserInfo && (
              <div className="mt-4 p-4 bg-card/50 rounded-xl border border-border/30 backdrop-blur-sm">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{user?.name || "Nome não informado"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Email:</span>
                    <span className="text-xs text-foreground">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Total de itens:</span>
                    <span className="text-xs font-medium text-primary">{totalItems}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-200">
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-8">
        {/* Search and Filter */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar alimentos, receitas..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-card/50 border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200 backdrop-blur-sm"
            />
          </div>
          <Button variant="outline" size="lg" className="px-4 py-4 rounded-2xl border-border/30 hover:bg-card/50 transition-all duration-200">
            <Filter className="h-5 w-5" />
          </Button>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-2 gap-4 animate-slide-in-bottom animation-delay-400">
          <Card className="bg-gradient-card border-border/30 hover:shadow-glow transition-all duration-300 hover-lift card-hover backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-primary/10 hover:scale-110 transition-transform duration-300">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">{totalItems}</p>
                  <p className="text-sm text-muted-foreground mt-1">Total de Itens</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/30 hover:shadow-glow transition-all duration-300 hover-lift card-hover backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-yellow-500/10 hover:scale-110 transition-transform duration-300">
                  <Clock className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">{expiringItems.length}</p>
                  <p className="text-sm text-muted-foreground mt-1">Vencendo</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {(expiringItems.length > 0 || expiredItems.length > 0) && (
          <Card className="bg-gradient-to-r from-yellow-500/10 to-red-500/10 border-yellow-500/30 backdrop-blur-sm">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-yellow-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-lg">Atenção!</h3>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {expiredItems.length > 0 && `${expiredItems.length} item(ns) vencido(s)`}
                    {expiredItems.length > 0 && expiringItems.length > 0 && " e "}
                    {expiringItems.length > 0 && `${expiringItems.length} vencendo em breve`}
                  </p>
                  <Link to="/dashboard/food">
                    <Button variant="outline" size="sm" className="mt-3 text-sm hover:scale-105 transition-transform duration-200">
                      Ver Despensa
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="animate-slide-in-bottom animation-delay-600">
          <h2 className="text-xl font-bold text-foreground mb-5">Ações Rápidas</h2>
          <div className="space-y-4">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.to} className={`stagger-${index + 1} block`}>
                <Card className="bg-gradient-card border-border/30 hover:shadow-glow hover:scale-[1.02] transition-all duration-300 card-hover touch-feedback backdrop-blur-sm group">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-5">
                      <div className={`p-4 rounded-2xl ${action.color} ${action.textColor} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <action.icon className="h-7 w-7" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-foreground text-lg">{action.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Items Preview */}
        {safeFoodItems.length > 0 && (
          <div className="animate-fade-in-scale animation-delay-600">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-foreground">Adicionados Recentemente</h2>
              <Link to="/dashboard/food">
                <Button variant="ghost" size="sm" className="text-primary hover:scale-105 transition-transform duration-300 touch-feedback">
                  Ver Todos
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {safeFoodItems.slice(0, 3).map((item, index) => {
                const daysUntilExpiration = differenceInDays(new Date(item.expiration), new Date());
                const isExpiring = daysUntilExpiration >= 0 && daysUntilExpiration <= 3;
                const isExpired = daysUntilExpiration < 0;

                return (
                  <Card 
                    key={item.id} 
                    className={`bg-gradient-card border-border/30 hover:shadow-md transition-all duration-300 hover-lift stagger-${index + 1} animate-slide-in-right backdrop-blur-sm`}
                    style={{ animationDelay: `${(index + 1) * 150}ms` }}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center hover:scale-110 transition-transform duration-300">
                          <Leaf className="h-7 w-7 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate text-lg">{item.name}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <p className="text-sm text-muted-foreground">Qtd: {item.quantity}</p>
                            <Badge 
                              variant={isExpired ? "destructive" : isExpiring ? "secondary" : "outline"}
                              className="text-xs"
                            >
                              {isExpired 
                                ? "Vencido" 
                                : isExpiring 
                                  ? `${daysUntilExpiration}d restante(s)` 
                                  : `${daysUntilExpiration}d`
                              }
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Tips Section */}
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/30 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-primary/20">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg">Dica do Dia</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  Use alimentos próximos ao vencimento primeiro para evitar desperdício. 
                  Nossa IA pode sugerir receitas baseadas nos ingredientes que vencem em breve!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Welcome Dialog */}
      <WelcomeDialog 
        open={showWelcomeDialog}
        onOpenChange={setShowWelcomeDialog}
        userName={getUserName()}
      />
    </div>
  );
};

export default DashboardHome;