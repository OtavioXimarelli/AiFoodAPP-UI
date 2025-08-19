import { useState } from "react";
import { useFoodItems } from "@/hooks/useFoodItems";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  const [greeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  });

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
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/50 p-4">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setShowUserInfo(!showUserInfo)}
        >
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">
              {greeting}, {getUserName()}! 👋
            </h1>
            <p className="text-sm text-muted-foreground">
              {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
            </p>
            {showUserInfo && (
              <div className="mt-3 p-3 bg-card/50 rounded-lg border border-border/30 backdrop-blur-sm">
                <div className="space-y-2">
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
            <Avatar className="h-10 w-10 ring-2 ring-primary/20">
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold text-sm">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Search and Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar alimentos, receitas..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <Button variant="outline" size="sm" className="px-3 py-3 rounded-xl">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-gradient-card border-border/50 hover:shadow-glow transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalItems}</p>
                  <p className="text-xs text-muted-foreground">Total de Itens</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50 hover:shadow-glow transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-500/10">
                  <Clock className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{expiringItems.length}</p>
                  <p className="text-xs text-muted-foreground">Vencendo</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {(expiringItems.length > 0 || expiredItems.length > 0) && (
          <Card className="bg-gradient-to-r from-yellow-500/10 to-red-500/10 border-yellow-500/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Atenção!</h3>
                  <p className="text-sm text-muted-foreground">
                    {expiredItems.length > 0 && `${expiredItems.length} item(ns) vencido(s)`}
                    {expiredItems.length > 0 && expiringItems.length > 0 && " e "}
                    {expiringItems.length > 0 && `${expiringItems.length} vencendo em breve`}
                  </p>
                  <Link to="/dashboard/food">
                    <Button variant="outline" size="sm" className="mt-2 text-xs">
                      Ver Despensa
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">Ações Rápidas</h2>
          <div className="space-y-4">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.to}>
                <Card className="bg-gradient-card border-border/50 hover:shadow-glow hover:scale-[1.02] transition-all duration-300">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${action.color} ${action.textColor} shadow-lg`}>
                        <action.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{action.title}</h3>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
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
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-foreground">Adicionados Recentemente</h2>
              <Link to="/dashboard/food">
                <Button variant="ghost" size="sm" className="text-primary">
                  Ver Todos
                </Button>
              </Link>
            </div>
            <div className="space-y-2">
              {safeFoodItems.slice(0, 3).map((item) => {
                const daysUntilExpiration = differenceInDays(new Date(item.expiration), new Date());
                const isExpiring = daysUntilExpiration >= 0 && daysUntilExpiration <= 3;
                const isExpired = daysUntilExpiration < 0;

                return (
                  <Card key={item.id} className="bg-gradient-card border-border/50">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Leaf className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground truncate">{item.name}</h3>
                          <div className="flex items-center gap-2">
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
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Star className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Dica do Dia</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Use alimentos próximos ao vencimento primeiro para evitar desperdício. 
                  Nossa IA pode sugerir receitas baseadas nos ingredientes que vencem em breve!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;