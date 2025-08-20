import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChefHat, Sparkles, Shield, BarChart3, ArrowRight, Users, Zap, Heart, Check, Brain, Clock, Trophy, Star, Bot, Target, TrendingUp, Activity, Award, Leaf, Dumbbell, Microscope, Quote, CheckCircle, Smartphone, Cloud } from "lucide-react";

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, isLoading, navigate]);

  const features = [
    {
      icon: Brain,
      title: "IA Avançada",
      description: "Motor de IA que analisa milhares de combinações para criar receitas perfeitas baseadas nos seus ingredientes e preferências.",
      gradient: "from-violet-500 to-purple-600",
      bgGlow: "bg-violet-400/10"
    },
    {
      icon: Smartphone,
      title: "Interface Intuitiva",
      description: "Design moderno e responsivo que torna o gerenciamento de alimentos e receitas uma experiência agradável em qualquer dispositivo.",
      gradient: "from-blue-500 to-cyan-600",
      bgGlow: "bg-blue-400/10"
    },
    {
      icon: BarChart3,
      title: "Análises Avançadas",
      description: "Dashboard completo com insights nutricionais, tendências alimentares e relatórios personalizados para otimizar sua dieta.",
      gradient: "from-emerald-500 to-teal-600",
      bgGlow: "bg-emerald-400/10"
    },
    {
      icon: Cloud,
      title: "Sincronização Total",
      description: "Acesse seus dados em qualquer lugar com sincronização automática e backup seguro na nuvem.",
      gradient: "from-orange-500 to-red-600",
      bgGlow: "bg-orange-400/10"
    },
    {
      icon: Shield,
      title: "Segurança Máxima",
      description: "Criptografia de ponta a ponta e conformidade com LGPD garantem que seus dados pessoais estejam sempre protegidos.",
      gradient: "from-indigo-500 to-purple-600",
      bgGlow: "bg-indigo-400/10"
    },
    {
      icon: Target,
      title: "Metas Personalizadas",
      description: "Defina objetivos nutricionais específicos e acompanhe seu progresso com recomendações personalizadas da IA.",
      gradient: "from-pink-500 to-rose-600",
      bgGlow: "bg-pink-400/10"
    }
  ];

  const benefits = [
    {
      icon: Brain,
      title: "Sugestões Inteligentes",
      description: "A IA analisa seus ingredientes e preferências dietéticas para sugerir receitas perfeitas.",
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
    {
      icon: Clock,
      title: "Economize Tempo",
      description: "Não perca mais tempo pensando no que cozinhar. Obtenha ideias instantâneas baseadas no que você tem.",
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      icon: Heart,
      title: "Alimentação Saudável",
      description: "Acompanhe a nutrição e tome decisões informadas sobre suas refeições.",
      color: "text-red-600",
      bg: "bg-red-50"
    },
    {
      icon: Target,
      title: "Reduza o Desperdício",
      description: "Use ingredientes antes que estraguem com o rastreamento inteligente de validade.",
      color: "text-green-600",
      bg: "bg-green-50"
    }
  ];


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <Header />
      <Hero />
      
      {/* Features Section */}
      <section className="py-24 px-4" data-section="features">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 px-4 py-2 text-sm font-medium">
              🚀 Funcionalidades Avançadas
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              A plataforma mais
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> completa</span>
              <br />para sua cozinha
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Tecnologia de ponta que revoluciona como você planeja, prepara e desfruta suas refeições
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="group hover-lift bg-card/50 backdrop-blur-sm border border-border/50 shadow-xl hover:shadow-2xl animate-fade-in overflow-hidden relative" 
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                <CardHeader className="relative pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-lg`}>
                      <feature.icon className="h-7 w-7 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  <div className="flex items-center text-sm text-primary font-medium group-hover:translate-x-1 transition-transform">
                    Saiba mais <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Simple stats without fake numbers */}
          <div className="mt-24 bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-12 backdrop-blur-sm border border-primary/20">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                A Revolução da Culinária Inteligente
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Junte-se à nova era da culinária onde a tecnologia encontra a gastronomia. 
                Crie, explore e otimize suas receitas com o poder da inteligência artificial.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        {/* Background with modern gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-accent/90"></div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-20 w-20 h-20 bg-white/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-8 bg-white/20 text-white border-white/30 px-6 py-3 text-sm backdrop-blur-sm">
              🎯 Comece Sua Jornada Culinária
            </Badge>
            
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-scale-in leading-tight">
              Transforme sua cozinha em um
              <span className="block bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent mt-2">
                laboratório de sabores
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto animate-fade-in leading-relaxed" style={{ animationDelay: '200ms' }}>
              Descubra o futuro da culinária com nossa plataforma alimentada por IA. 
              <span className="font-bold text-white">Crie, explore e inove</span> na sua cozinha.
            </p>
            
            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12 animate-slide-up" style={{ animationDelay: '400ms' }}>
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/95 hover-lift shadow-2xl px-8 py-4 text-lg font-semibold h-auto">
                <Link to="/register">
                  <Sparkles className="mr-3 h-6 w-6" />
                  Começar Grátis Hoje
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2 border-white/40 text-white hover:bg-white/10 hover:border-white hover-lift backdrop-blur-sm px-8 py-4 text-lg font-semibold h-auto">
                <Link to="/login">
                  <Users className="mr-3 h-6 w-6" />
                  Já tenho conta
                </Link>
              </Button>
            </div>
            
            {/* Trust indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-white/80 text-sm animate-fade-in" style={{ animationDelay: '600ms' }}>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Sem cartão de crédito</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Cancele quando quiser</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Suporte brasileiro</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 bg-gray-900 text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20"></div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                  <ChefHat className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold">AI Food App</h3>
              </div>
              <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
                Revolucione sua cozinha com inteligência artificial. Crie receitas personalizadas, gerencie ingredientes e otimize sua nutrição.
              </p>
              <div className="flex items-center gap-4">
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  🚀 Em Desenvolvimento
                </Badge>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-6 text-lg">Produto</h4>
              <ul className="space-y-3 text-gray-300">
                <li className="hover:text-primary transition-colors cursor-pointer">Funcionalidades</li>
                <li className="hover:text-primary transition-colors cursor-pointer">API</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Integrações</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Roadmap</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-6 text-lg">Empresa</h4>
              <ul className="space-y-3 text-gray-300">
                <li className="hover:text-primary transition-colors cursor-pointer">Sobre Nós</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Blog</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Carreiras</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Contato</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-6 text-lg">Suporte</h4>
              <ul className="space-y-3 text-gray-300">
                <li className="hover:text-primary transition-colors cursor-pointer">Central de Ajuda</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Documentação</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Status</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Comunidade</li>
              </ul>
            </div>
          </div>
          
          {/* Bottom section */}
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-center md:text-left">
              &copy; 2024 AI Food App. Todos os direitos reservados. 
              <span className="mx-2">•</span>
              <a href="#" className="hover:text-primary transition-colors">Privacidade</a>
              <span className="mx-2">•</span>
              <a href="#" className="hover:text-primary transition-colors">Termos</a>
            </p>
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm">Feito com ❤️ no Brasil</span>
              <Badge variant="outline" className="border-green-500/30 text-green-400">
                🌱 Sustentável
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;