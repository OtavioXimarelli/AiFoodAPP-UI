import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFoodItems } from "@/hooks/useFoodItems";
import { useAuth } from "@/hooks/useAuth";
import { useLocalRecipes } from "@/hooks/useLocalRecipes";
import { useLocalNutritionAnalysis } from "@/hooks/useLocalNutritionAnalysis";
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
  User,
  Save,
  Database
} from "lucide-react";
import { Link } from "react-router-dom";
import { format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";

const DashboardHome = () => {
  const { foodItems, loading } = useFoodItems();
  const { user } = useAuth();
  const { totalRecipes } = useLocalRecipes();
  const { totalAnalyses } = useLocalNutritionAnalysis();
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-background pb-20 lg:pb-8"
    >
      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/50 px-4 md:px-6 py-4 md:py-5"
      >
        <motion.div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setShowUserInfo(!showUserInfo)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold text-foreground">
              {greeting}, {getUserName()}! 👋
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
            </p>
            <AnimatePresence>
              {showUserInfo && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 p-3 md:p-4 bg-gradient-warm rounded-xl border border-border/30 backdrop-blur-sm shadow-warm"
                >
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-2 md:space-y-3"
                  >
                  <div className="flex items-center gap-2">
                    <User className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                    <span className="text-xs md:text-sm text-foreground">{user?.name || "Nome não informado"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Email:</span>
                    <span className="text-xs text-foreground">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Total de itens:</span>
                    <span className="text-xs font-medium text-primary">{totalItems}</span>
                  </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Avatar className="h-10 w-10 md:h-12 md:w-12 ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-200">
                <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold text-sm md:text-base shadow-glow">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      <div className="px-4 md:px-6 py-4 md:py-6 space-y-6 md:space-y-8">
        {/* Search and Filter */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex gap-3"
        >
          <motion.div 
            className="relative flex-1"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar alimentos, receitas..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gradient-card border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200 backdrop-blur-sm shadow-card focus:shadow-glow"
            />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button variant="outline" size="lg" className="px-4 py-4 rounded-2xl border-border/30 hover:bg-gradient-warm transition-all duration-200 shadow-soft hover:shadow-card">
              <Filter className="h-5 w-5" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Status Cards */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 gap-4"
        >
          <motion.div
            whileHover={{ scale: 1.03, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="bg-gradient-success border-border/30 hover:shadow-success transition-all duration-300 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="p-3 rounded-2xl bg-primary/15 shadow-soft"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Package className="h-6 w-6 text-primary" />
                  </motion.div>
                  <div>
                    <motion.p 
                      className="text-3xl font-bold text-foreground"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                    >
                      {totalItems}
                    </motion.p>
                    <p className="text-sm text-muted-foreground mt-1 font-medium">Total de Itens</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="bg-gradient-warm border-border/30 hover:shadow-warm transition-all duration-300 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="p-3 rounded-2xl bg-warning/15 shadow-soft"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Clock className="h-6 w-6 text-warning" />
                  </motion.div>
                  <div>
                    <motion.p 
                      className="text-3xl font-bold text-foreground"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                    >
                      {expiringItems.length}
                    </motion.p>
                    <p className="text-sm text-muted-foreground mt-1 font-medium">Vencendo</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Saved Data Summary */}
        {(totalRecipes > 0 || totalAnalyses > 0) && (
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-border/30 hover:shadow-glow transition-all duration-300 hover-lift card-hover backdrop-blur-sm animate-slide-in-bottom animation-delay-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-primary/10 hover:scale-110 transition-transform duration-300">
                    <Database className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">Dados Salvos</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {totalRecipes} receitas e {totalAnalyses} análises salvas
                    </p>
                  </div>
                </div>
                <Link to="/dashboard/saved">
                  <Button variant="outline" size="sm" className="hover:scale-105 transition-transform duration-200">
                    <Save className="h-4 w-4 mr-2" />
                    Ver Todos
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

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
        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <motion.h2 
            className="text-xl font-bold text-foreground mb-5"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Ações Rápidas
          </motion.h2>
          <div className="space-y-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02, x: 10 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link to={action.to} className="block">
                  <Card className="bg-gradient-card border-border/30 hover:shadow-glow transition-all duration-300 backdrop-blur-sm group overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-5">
                        <motion.div 
                          className={`p-4 rounded-2xl ${action.color} ${action.textColor} shadow-lg`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <action.icon className="h-7 w-7" />
                        </motion.div>
                        <div className="flex-1">
                          <h3 className="font-bold text-foreground text-lg group-hover:text-primary transition-colors duration-200">{action.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{action.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

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
    </motion.div>
  );
};

export default DashboardHome;