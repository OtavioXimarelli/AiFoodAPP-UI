import { Button } from '@/components/ui/button';
import { ArrowDown, Sparkles, Play, ChefHat, Flame, Beef, Droplet, Wheat } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AnimatedElement, StaggerContainer, HoverAnimation } from '@/components/ui/animated';
import { useOptimizedAnimation } from '@/hooks/usePerformance';
import { memo } from 'react';
import { ClickSpark } from '@/components/ui/click-spark';
import { ReactBitsCard } from '@/components/ui/reactbits-components';
import { useFoodItems } from '@/hooks/useFoodItems';
import { useLocalRecipes } from '@/hooks/useLocalRecipes';

const Hero = memo(() => {
  const { shouldReduceMotion } = useOptimizedAnimation();
  const { foodItems } = useFoodItems();
  const { storedRecipes } = useLocalRecipes();

  const totalIngredients = Array.isArray(foodItems) ? foodItems.length : 0;
  const totalRecipes = Array.isArray(storedRecipes) ? storedRecipes.length : 0;
  // compute average calories from saved recipes (safe fallback)
  const avgCalories = (() => {
    if (!Array.isArray(storedRecipes) || storedRecipes.length === 0) return null;
    const sum = storedRecipes.reduce((acc, r) => acc + (r.calories || 0), 0);
    return Math.round(sum / storedRecipes.length) || null;
  })();

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
                <span className="block bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent mt-2">
                  Cozinha
                </span>
                <span className="block mt-2">com Inteligência Artificial</span>
              </h1>
            </AnimatedElement>

            <AnimatedElement variant="slideUp" delay={0.3}>
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Descubra receitas personalizadas, gerencie ingredientes e otimize sua nutrição com
                nossa plataforma alimentada por IA.{' '}
                <span className="text-amber-500 font-bold">O futuro da culinária</span> está aqui!
              </p>
            </AnimatedElement>

            <AnimatedElement variant="slideUp" delay={0.5}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {/* Primary CTA Button */}
                <Button
                  onClick={() => {
                    window.location.href = '/register';
                  }}
                  size="lg"
                  className="group relative w-full sm:w-auto bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:via-orange-600 hover:to-amber-700 text-white shadow-lg hover:shadow-2xl hover:shadow-amber-500/50 px-8 py-6 text-base font-bold transition-all duration-300 rounded-xl overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                    Começar Grátis Agora
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </Button>

                {/* Secondary Button */}
                <Button
                  onClick={() => {
                    const featuresSection = document.querySelector('[data-section="features"]');
                    featuresSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  variant="outline"
                  size="lg"
                  className="group w-full sm:w-auto border-2 border-amber-500/80 bg-transparent hover:bg-amber-500 text-foreground hover:text-white transition-all duration-300 px-8 py-6 text-base font-semibold backdrop-blur-sm shadow-md hover:shadow-lg hover:shadow-amber-500/30 rounded-xl"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Play className="w-5 h-5 transition-transform group-hover:scale-110" />
                    Ver Demonstração
                  </span>
                </Button>
              </div>
            </AnimatedElement>

            <AnimatedElement variant="fadeIn" delay={0.7}>
              {/* Trust Indicators */}
              <div className="mt-8 text-sm text-muted-foreground">
                <p>✓ 100% Gratuito • ✓ Acesso Instantâneo • ✓ Suporte Brasileiro</p>
              </div>
            </AnimatedElement>
          </StaggerContainer>

          {/* Right Column - Visual */}
          <AnimatedElement variant="slideLeft" delay={0.4} className="relative">
            {/* Floating Cards/Mockup Area */}
            <div className="relative w-full max-w-lg mx-auto">
              {/* Main Card - Recipe Detail Preview */}
              <ClickSpark count={10} color="hsl(var(--primary))">
                <ReactBitsCard
                  variant="tilt"
                  className="transform hover:scale-[1.02] transition-transform duration-500 will-change-transform"
                >
                  <div className="p-6 bg-gradient-to-br from-card via-card/95 to-card/90 backdrop-blur-sm rounded-2xl border border-border/40 shadow-2xl">
                    {/* Card Header */}
                    <div className="flex items-start gap-3 mb-5">
                      <div className="w-14 h-14 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                        <ChefHat className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-foreground mb-1">Receita Detalhada</h3>
                        <p className="text-sm text-muted-foreground">
                          Baseada em seus ingredientes
                        </p>
                      </div>
                    </div>

                    {/* Recipe Name Example */}
                    <div className="mb-4 pb-4 border-b border-border/50">
                      <h4 className="font-semibold text-base text-foreground mb-2">
                        Frango Grelhado com Legumes
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="text-xs">
                          30 min
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          Fácil
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          2 porções
                        </Badge>
                      </div>
                    </div>

                    {/* Nutritional Information */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground font-medium flex items-center gap-2">
                          <Flame className="w-4 h-4 text-orange-500" />
                          Calorias
                        </span>
                        <span className="font-bold text-foreground">450 kcal</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground font-medium flex items-center gap-2">
                          <Beef className="w-4 h-4 text-red-500" />
                          Proteínas
                        </span>
                        <span className="font-bold text-foreground">35g</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground font-medium flex items-center gap-2">
                          <Wheat className="w-4 h-4 text-amber-600" />
                          Carboidratos
                        </span>
                        <span className="font-bold text-foreground">28g</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground font-medium flex items-center gap-2">
                          <Droplet className="w-4 h-4 text-blue-500" />
                          Gorduras
                        </span>
                        <span className="font-bold text-foreground">18g</span>
                      </div>
                    </div>

                    {/* Action hint */}
                    <div className="mt-5 pt-4 border-t border-border/50">
                      <p className="text-xs text-center text-muted-foreground">
                        ✨ Receitas personalizadas com análise completa
                      </p>
                    </div>
                  </div>
                </ReactBitsCard>
              </ClickSpark>

              {/* Floating Ingredients Counter */}
              <AnimatedElement variant="scale" delay={0.8} className="absolute -top-4 -right-4 z-10">
                <ReactBitsCard
                  variant="magnetic"
                  className="transform hover:scale-110 transition-transform duration-300"
                >
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-4 min-w-[120px]">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white mb-1">
                        {totalIngredients || 12}
                      </div>
                      <div className="text-xs text-white/90 font-medium">
                        Ingredientes
                      </div>
                    </div>
                  </div>
                </ReactBitsCard>
              </AnimatedElement>

              {/* Floating Recipes Counter */}
              <AnimatedElement variant="scale" delay={1} className="absolute -bottom-4 -left-4 z-10">
                <ReactBitsCard
                  variant="hover-glow"
                  className="transform hover:scale-110 transition-transform duration-300"
                >
                  <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-xl p-4 min-w-[100px]">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white mb-1">
                        {totalRecipes || 8}
                      </div>
                      <div className="text-xs text-white/90 font-medium">
                        Receitas
                      </div>
                    </div>
                  </div>
                </ReactBitsCard>
              </AnimatedElement>
            </div>
          </AnimatedElement>
        </div>

        <AnimatedElement variant="bounce" delay={1.2} className="text-center mt-16">
          <ArrowDown
            className={`h-6 w-6 text-primary mx-auto opacity-70 ${!shouldReduceMotion ? 'animate-bounce' : ''}`}
          />
        </AnimatedElement>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;
