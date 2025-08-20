import { Button } from "@/components/ui/button";
import { ArrowDown, Sparkles, Play, Users, Star, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with modern gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent"></div>
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left animate-fade-in">
            {/* Trust Badge */}
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-6">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/15">
                <Star className="w-3 h-3 mr-1" />
                IA Avançada
              </Badge>
              <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 hover:bg-green-200">
                <Users className="w-3 h-3 mr-1" />
                +10k Usuários
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200">
                <TrendingUp className="w-3 h-3 mr-1" />
                Crescimento 300%
              </Badge>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-foreground leading-tight">
              Transforme sua
              <span className="block bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent mt-2">
                Cozinha
              </span>
              <span className="block mt-2">com Inteligência Artificial</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Descubra receitas personalizadas, gerencie ingredientes e otimize sua nutrição com nossa plataforma alimentada por IA. 
              <span className="text-primary font-semibold">Mais de 50.000 receitas</span> já criadas!
            </p>
            
            {/* Social Proof Numbers */}
            <div className="grid grid-cols-3 gap-6 mb-8 max-w-md mx-auto lg:mx-0">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-foreground">50k+</div>
                <div className="text-sm text-muted-foreground">Receitas Criadas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-foreground">98%</div>
                <div className="text-sm text-muted-foreground">Satisfação</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-foreground">4.8⭐</div>
                <div className="text-sm text-muted-foreground">Avaliação</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
              <Button 
                onClick={() => {
                  window.location.href = '/register';
                }}
                size="lg" 
                className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-8 py-4 text-base font-semibold"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Começar Grátis Agora
              </Button>
              <Button 
                onClick={() => {
                  const featuresSection = document.querySelector('[data-section="features"]');
                  featuresSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                variant="outline" 
                size="lg"
                className="w-full sm:w-auto border-primary/30 text-primary hover:bg-primary/10 hover:border-primary transition-all duration-300 px-8 py-4 text-base font-semibold backdrop-blur-sm"
              >
                <Play className="mr-2 h-4 w-4" />
                Ver Demonstração
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 text-sm text-muted-foreground">
              <p>✓ Teste grátis por 14 dias • ✓ Sem cartão de crédito • ✓ Cancele a qualquer momento</p>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative animate-slide-in-right">
            {/* Floating Cards/Mockup Area */}
            <div className="relative w-full max-w-lg mx-auto">
              {/* Main Card - Recipe Generator */}
              <div className="bg-card/80 backdrop-blur-xl rounded-3xl border border-border/50 shadow-2xl p-6 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Receita Gerada</h3>
                    <p className="text-sm text-muted-foreground">Baseada em seus ingredientes</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gradient-to-r from-primary/20 to-primary/40 rounded-full"></div>
                  <div className="h-3 bg-gradient-to-r from-primary/10 to-primary/30 rounded-full w-3/4"></div>
                  <div className="h-3 bg-gradient-to-r from-primary/5 to-primary/20 rounded-full w-1/2"></div>
                </div>
              </div>

              {/* Floating Nutrition Card */}
              <div className="absolute -top-6 -right-6 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-800 shadow-lg p-4 transform -rotate-6 hover:rotate-0 transition-transform duration-500">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">450</div>
                  <div className="text-xs text-green-600 dark:text-green-400">Calorias</div>
                </div>
              </div>

              {/* Floating Ingredients Card */}
              <div className="absolute -bottom-4 -left-8 bg-orange-50 dark:bg-orange-900/20 rounded-2xl border border-orange-200 dark:border-orange-800 shadow-lg p-4 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-orange-500 rounded-full"></div>
                  <div className="text-sm font-medium text-orange-600 dark:text-orange-400">5 Ingredientes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-16 animate-bounce">
          <ArrowDown className="h-6 w-6 text-primary mx-auto opacity-70" />
        </div>
      </div>
    </section>
  );
};

export default Hero;