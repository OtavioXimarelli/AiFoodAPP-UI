import { Button } from "@/components/ui/button";
import { ArrowDown, Sparkles, Play, Users, Star, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AnimatedElement, StaggerContainer, HoverAnimation } from "@/components/ui/animated";
import { useOptimizedAnimation } from "@/hooks/usePerformance";
import { memo } from "react";

const Hero = memo(() => {
  const { shouldReduceMotion } = useOptimizedAnimation();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with modern gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent"></div>
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Column - Content */}
          <StaggerContainer className="text-center lg:text-left" staggerDelay={0.2}>
            <AnimatedElement variant="slideUp" delay={0.1}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-foreground leading-tight">
                Transforme sua
                <span className="block bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent mt-2">
                  Cozinha
                </span>
                <span className="block mt-2">com Inteligência Artificial</span>
              </h1>
            </AnimatedElement>
            
            <AnimatedElement variant="slideUp" delay={0.3}>
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Descubra receitas personalizadas, gerencie ingredientes e otimize sua nutrição com nossa plataforma alimentada por IA. 
                <span className="text-primary font-semibold">O futuro da culinária</span> está aqui!
              </p>
            </AnimatedElement>
            
            <AnimatedElement variant="slideUp" delay={0.5}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
                <HoverAnimation scale={1.05}>
                  <Button 
                    onClick={() => {
                      window.location.href = '/register';
                    }}
                    size="lg" 
                    className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg hover:shadow-xl px-8 py-4 text-base font-semibold transition-all duration-300"
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Começar Grátis Agora
                  </Button>
                </HoverAnimation>
                <HoverAnimation scale={1.02}>
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
                </HoverAnimation>
              </div>
            </AnimatedElement>

            <AnimatedElement variant="fadeIn" delay={0.7}>
              {/* Trust Indicators */}
              <div className="mt-8 text-sm text-muted-foreground">
                <p>✓ Teste grátis • ✓ Sem cartão de crédito • ✓ Cancele a qualquer momento</p>
              </div>
            </AnimatedElement>
          </StaggerContainer>

          {/* Right Column - Visual */}
          <AnimatedElement variant="slideLeft" delay={0.4} className="relative">
            {/* Floating Cards/Mockup Area */}
            <div className="relative w-full max-w-lg mx-auto">
              {/* Main Card - Recipe Generator */}
              <HoverAnimation scale={1.02} y={-5}>
                <div className="bg-card/80 backdrop-blur-xl rounded-3xl border border-border/50 shadow-2xl p-6 transform rotate-2 hover:rotate-0 transition-transform duration-500 will-change-transform">
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
              </HoverAnimation>

              {/* Floating Nutrition Card */}
              <AnimatedElement 
                variant="scale" 
                delay={0.8}
                className="absolute -top-6 -right-6"
              >
                <HoverAnimation scale={1.1} y={-3}>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-800 shadow-lg p-4 transform -rotate-6 hover:rotate-0 transition-transform duration-500 will-change-transform">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">450</div>
                      <div className="text-xs text-green-600 dark:text-green-400">Calorias</div>
                    </div>
                  </div>
                </HoverAnimation>
              </AnimatedElement>

              {/* Floating Ingredients Card */}
              <AnimatedElement 
                variant="scale" 
                delay={1}
                className="absolute -bottom-4 -left-8"
              >
                <HoverAnimation scale={1.1} y={-3}>
                  <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl border border-orange-200 dark:border-orange-800 shadow-lg p-4 transform rotate-3 hover:rotate-0 transition-transform duration-500 will-change-transform">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-orange-500 rounded-full"></div>
                      <div className="text-sm font-medium text-orange-600 dark:text-orange-400">5 Ingredientes</div>
                    </div>
                  </div>
                </HoverAnimation>
              </AnimatedElement>
            </div>
          </AnimatedElement>
        </div>
        
        <AnimatedElement 
          variant="bounce" 
          delay={1.2}
          className="text-center mt-16"
        >
          <ArrowDown className={`h-6 w-6 text-primary mx-auto opacity-70 ${!shouldReduceMotion ? 'animate-bounce' : ''}`} />
        </AnimatedElement>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;