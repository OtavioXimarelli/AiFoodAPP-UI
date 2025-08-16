import { Button } from "@/components/ui/button";
import { ArrowDown, Sparkles, Play } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[70vh] sm:min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        data-hero-bg={heroBg}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/30 sm:from-background/90 sm:via-background/60 sm:to-transparent"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-foreground leading-tight">
            Transforme seus
            <span className="block bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent mt-2">
              Ingredientes
            </span>
            <span className="block mt-2">em Receitas Saudáveis</span>
          </h2>
          
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Use IA para gerar receitas fitness personalizadas com base nos alimentos que você tem. 
            Receba insights nutricionais detalhados e sugestões de dietas.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => {
                const featuresSection = document.querySelector('[data-section="features"]');
                featuresSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              size="lg" 
              className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/80 hover:to-primary text-primary-foreground shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-8 py-4 text-base font-semibold"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Descobrir Funcionalidades
            </Button>
            <Button 
              onClick={() => {
                // Scroll to the benefits section instead of demo
                const benefitsSection = document.querySelector('section:nth-of-type(3)');
                benefitsSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              variant="outline" 
              size="lg"
              className="w-full sm:w-auto border-primary/50 text-primary hover:bg-primary/10 hover:border-primary transition-all duration-300 px-8 py-4 text-base font-semibold"
            >
              <Play className="mr-2 h-4 w-4" />
              Ver Benefícios
            </Button>
          </div>
          
          <div className="mt-12 animate-bounce">
            <ArrowDown className="h-6 w-6 text-primary mx-auto opacity-70" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;