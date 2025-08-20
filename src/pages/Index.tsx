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
      bgGlow: "bg-violet-400/10",
      stats: "+50k receitas geradas"
    },
    {
      icon: Smartphone,
      title: "Interface Intuitiva",
      description: "Design moderno e responsivo que torna o gerenciamento de alimentos e receitas uma experiência agradável em qualquer dispositivo.",
      gradient: "from-blue-500 to-cyan-600",
      bgGlow: "bg-blue-400/10",
      stats: "98% satisfação UX"
    },
    {
      icon: BarChart3,
      title: "Análises Avançadas",
      description: "Dashboard completo com insights nutricionais, tendências alimentares e relatórios personalizados para otimizar sua dieta.",
      gradient: "from-emerald-500 to-teal-600",
      bgGlow: "bg-emerald-400/10",
      stats: "15+ métricas"
    },
    {
      icon: Cloud,
      title: "Sincronização Total",
      description: "Acesse seus dados em qualquer lugar com sincronização automática e backup seguro na nuvem.",
      gradient: "from-orange-500 to-red-600",
      bgGlow: "bg-orange-400/10",
      stats: "99.9% uptime"
    },
    {
      icon: Shield,
      title: "Segurança Máxima",
      description: "Criptografia de ponta a ponta e conformidade com LGPD garantem que seus dados pessoais estejam sempre protegidos.",
      gradient: "from-indigo-500 to-purple-600",
      bgGlow: "bg-indigo-400/10",
      stats: "SSL 256-bit"
    },
    {
      icon: Target,
      title: "Metas Personalizadas",
      description: "Defina objetivos nutricionais específicos e acompanhe seu progresso com recomendações personalizadas da IA.",
      gradient: "from-pink-500 to-rose-600",
      bgGlow: "bg-pink-400/10",
      stats: "87% alcançam metas"
    }
  ];

  const testimonials = [
    {
      name: "Maria Silva",
      role: "Nutricionista",
      content: "Revolucionou minha prática. Agora posso criar planos alimentares personalizados em minutos com precisão nutricional impressionante.",
      avatar: "MS",
      rating: 5
    },
    {
      name: "Carlos Mendes",
      role: "Chef Executivo",
      content: "A IA entende perfeitamente sabores e combinações. Minhas receitas ficaram mais criativas e os custos reduziram 30%.",
      avatar: "CM",
      rating: 5
    },
    {
      name: "Ana Santos",
      role: "Mãe de Família",
      content: "Acabou a pergunta 'o que vamos jantar hoje?'. O app sugere receitas deliciosas com o que tenho na geladeira.",
      avatar: "AS",
      rating: 5
    }
  ];

  const pricingPlans = [
    {
      name: "Gratuito",
      price: "R$ 0",
      period: "/mês",
      description: "Perfeito para começar sua jornada culinária",
      features: [
        "10 receitas com IA por mês",
        "Gerenciar até 50 ingredientes",
        "Análises nutricionais básicas",
        "Suporte por email"
      ],
      popular: false,
      cta: "Começar Grátis"
    },
    {
      name: "Premium",
      price: "R$ 19",
      period: "/mês",
      description: "Para entusiastas da culinária saudável",
      features: [
        "Receitas ilimitadas com IA",
        "Ingredientes ilimitados",
        "Análises nutricionais avançadas",
        "Planejamento de refeições",
        "Suporte prioritário",
        "Exportar receitas em PDF"
      ],
      popular: true,
      cta: "Teste Grátis 14 Dias"
    },
    {
      name: "Professional",
      price: "R$ 49",
      period: "/mês",
      description: "Para chefs e profissionais da nutrição",
      features: [
        "Tudo do Premium",
        "API para integração",
        "Dashboard avançado",
        "Relatórios personalizados",
        "Suporte 24/7",
        "Treinamento personalizado"
      ],
      popular: false,
      cta: "Falar com Vendas"
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
                    <Badge variant="secondary" className="text-xs bg-muted/50">
                      {feature.stats}
                    </Badge>
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

          {/* Stats Section */}
          <div className="mt-24 bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-12 backdrop-blur-sm border border-primary/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">50k+</div>
                <div className="text-muted-foreground font-medium">Receitas Criadas</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">10k+</div>
                <div className="text-muted-foreground font-medium">Usuários Ativos</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">98%</div>
                <div className="text-muted-foreground font-medium">Satisfação</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">4.8⭐</div>
                <div className="text-muted-foreground font-medium">Avaliação Média</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-accent/5 to-primary/5">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-accent/10 text-accent border-accent/20 px-4 py-2 text-sm font-medium">
              ⭐ Depoimentos
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              O que nossos usuários
              <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent"> dizem</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Mais de 10.000 pessoas já transformaram sua relação com a culinária
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index} 
                className="group hover-lift bg-card/80 backdrop-blur-sm border border-border/50 shadow-xl animate-fade-in" 
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <CardContent className="p-8">
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-primary/30 mb-4" />
                  <p className="text-muted-foreground leading-relaxed mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-4" id="pricing">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 px-4 py-2 text-sm font-medium">
              💎 Planos e Preços
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Escolha o plano
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> perfeito</span>
              <br />para você
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comece grátis e evolua conforme suas necessidades culinárias crescem
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`group hover-lift animate-fade-in relative overflow-hidden ${
                  plan.popular 
                    ? 'border-2 border-primary shadow-2xl scale-105 bg-gradient-to-br from-primary/5 to-accent/5' 
                    : 'border border-border/50 shadow-xl'
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {plan.popular && (
                  <Badge className="absolute top-6 right-6 bg-gradient-to-r from-primary to-accent text-white px-3 py-1">
                    Mais Popular
                  </Badge>
                )}
                
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl font-bold text-foreground mb-2">
                    {plan.name}
                  </CardTitle>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-muted-foreground">{plan.description}</p>
                </CardHeader>
                
                <CardContent className="pb-8">
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80 text-white shadow-lg' 
                        : 'variant-outline'
                    }`}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Todos os planos incluem teste gratuito de 14 dias • Sem taxa de configuração • Cancele a qualquer momento
            </p>
            <Button variant="ghost" className="text-primary hover:text-primary/80">
              Comparar todos os recursos <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
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
              🎯 Última Chance de Começar Hoje
            </Badge>
            
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-scale-in leading-tight">
              Transforme sua cozinha em um
              <span className="block bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent mt-2">
                laboratório de sabores
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto animate-fade-in leading-relaxed" style={{ animationDelay: '200ms' }}>
              Junte-se a mais de <span className="font-bold text-white">10.000 pessoas</span> que já descobriram o futuro da culinária com nossa IA
            </p>
            
            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12 animate-slide-up" style={{ animationDelay: '400ms' }}>
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/95 hover-lift shadow-2xl px-8 py-4 text-lg font-semibold h-auto">
                <Link to="/register">
                  <Sparkles className="mr-3 h-6 w-6" />
                  Começar Teste Grátis de 14 Dias
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
                <span>Suporte brasileiro 24/7</span>
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
                  4.8 ⭐ (1.2k avaliações)
                </Badge>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-6 text-lg">Produto</h4>
              <ul className="space-y-3 text-gray-300">
                <li className="hover:text-primary transition-colors cursor-pointer">Funcionalidades</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Preços</li>
                <li className="hover:text-primary transition-colors cursor-pointer">API</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Integrações</li>
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
                🌱 Carbono Neutro
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;