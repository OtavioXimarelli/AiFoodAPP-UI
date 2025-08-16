import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChefHat, Sparkles, Shield, BarChart3, ArrowRight, Users, Zap, Heart, Check, Brain, Clock, Trophy, Star, Bot, Target, TrendingUp, Activity, Award, Leaf, Dumbbell, Microscope } from "lucide-react";

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
      icon: ChefHat,
      title: "Gerencie Seus Alimentos",
      description: "Registre, liste, atualize e remova itens da sua despensa de forma simples e organizada.",
      gradient: "from-green-400 to-emerald-500",
      bgGlow: "bg-green-400/10"
    },
    {
      icon: Sparkles,
      title: "Receitas com IA",
      description: "Crie receitas automaticamente com inteligência artificial baseado nos seus ingredientes.",
      gradient: "from-purple-400 to-pink-500",
      bgGlow: "bg-purple-400/10"
    },
    {
      icon: BarChart3,
      title: "Análise Nutricional",
      description: "Obtenha análises nutricionais detalhadas e insights sobre suas refeições.",
      gradient: "from-blue-400 to-cyan-500",
      bgGlow: "bg-blue-400/10"
    },
    {
      icon: Shield,
      title: "Dados Seguros",
      description: "Seus dados estão protegidos com autenticação segura e criptografia avançada.",
      gradient: "from-orange-400 to-red-500",
      bgGlow: "bg-orange-400/10"
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <Header />
      <Hero />
      
      {/* Features Section */}
      <section className="py-20 px-4" data-section="features">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-orange-100 text-orange-800 hover:bg-orange-200">
              Funcionalidades
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tudo que você precisa para cozinhar de forma inteligente
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Descubra recursos poderosos que tornam o planejamento de refeições fácil e prazeroso
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="group hover-lift bg-gradient-card border-0 shadow-soft animate-fade-in" 
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-glow transition-all duration-500 hover-breathe`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-800 hover:bg-purple-200">
              Benefícios
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Por que escolher o AI Food App?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Transforme sua experiência culinária com gerenciamento inteligente de alimentos
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <Card 
                key={index} 
                className="group hover-lift bg-card border-0 shadow-soft animate-fade-in" 
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl ${benefit.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-all duration-300 hover-float`}>
                      <benefit.icon className={`h-6 w-6 ${benefit.color}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary opacity-90"></div>
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-scale-in">
            Pronto para revolucionar sua cozinha?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '200ms' }}>
            Comece hoje mesmo a cozinhar de forma mais inteligente com receitas geradas por IA
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '400ms' }}>
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 hover-lift shadow-card">
              <Link to="/register">
                Começar Grátis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:border-white hover-lift backdrop-blur-sm">
              <Link to="/login">
                Entrar
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">AI Food App</h3>
              <p className="text-gray-400">
                Culinária inteligente simplificada com geração de receitas por IA e gestão de alimentos.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Funcionalidades</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Inventário de Alimentos</li>
                <li>Gerador de Receitas</li>
                <li>Análise Nutricional</li>
                <li>Controle de Validade</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Sobre Nós</li>
                <li>Política de Privacidade</li>
                <li>Termos de Serviço</li>
                <li>Contato</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Conecte-se</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Twitter</li>
                <li>Facebook</li>
                <li>Instagram</li>
                <li>LinkedIn</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AI Food App. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;