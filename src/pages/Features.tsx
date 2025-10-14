import { memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AnimatedElement,
  StaggerContainer,
  PageTransition,
} from '@/components/ui/animated';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import { FeatureDetailCard } from '@/components/features/FeatureDetailCard';
import { SimpleFeatureCard } from '@/components/features/SimpleFeatureCard';
import { mainFeatures, additionalFeatures, benefits } from '@/data/featuresData';

const Features = memo(() => {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
        <Header />

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent"></div>
          
          <div className="container mx-auto relative z-10">
            <AnimatedElement variant="slideUp">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar para Home
              </Link>

              <Badge className="mb-6 bg-amber-500/10 text-amber-600 border-amber-500/20 px-4 py-2 text-sm font-medium">
                <Sparkles className="w-4 h-4 inline mr-2" />
                Todas as Funcionalidades
              </Badge>

              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
                Tudo que você precisa para
                <span className="block bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent mt-2">
                  transformar sua cozinha
                </span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-3xl mb-8 leading-relaxed">
                Uma plataforma completa com inteligência artificial avançada, análises profundas e
                ferramentas intuitivas para revolucionar sua experiência culinária.
              </p>

              <Button
                onClick={() => navigate('/register')}
                size="lg"
                className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:via-orange-600 hover:to-amber-700 text-white shadow-lg hover:shadow-2xl hover:shadow-amber-500/50 px-8 py-6 text-base font-bold transition-all duration-300 rounded-xl"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Começar Grátis Agora
              </Button>
            </AnimatedElement>
          </div>
        </section>

        {/* Main Features Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <AnimatedElement variant="slideUp" className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-foreground">
                Funcionalidades Principais
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Recursos poderosos desenvolvidos para oferecer a melhor experiência
              </p>
            </AnimatedElement>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {mainFeatures.map((feature, index) => (
                <FeatureDetailCard 
                  key={index}
                  {...feature}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Additional Features Grid */}
        <section className="py-20 px-4 bg-gradient-to-r from-background/80 via-primary/5 to-background/80">
          <div className="container mx-auto">
            <AnimatedElement variant="slideUp" className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-foreground">E muito mais...</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Funcionalidades adicionais para potencializar sua experiência
              </p>
            </AnimatedElement>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {additionalFeatures.map((feature, index) => (
                <SimpleFeatureCard
                  key={index}
                  {...feature}
                  delay={index * 0.05}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <AnimatedElement variant="slideUp" className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-foreground">Por que escolher?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Benefícios que fazem a diferença no seu dia a dia
              </p>
            </AnimatedElement>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <SimpleFeatureCard
                  key={index}
                  {...benefit}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <AnimatedElement variant="scale">
              <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white shadow-2xl">
                <div className="p-12 text-center">
                  <Sparkles className="w-16 h-16 mx-auto mb-6 animate-pulse" />
                  <h2 className="text-4xl font-bold mb-4">
                    Pronto para revolucionar sua cozinha?
                  </h2>
                  <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                    Comece gratuitamente agora e descubra o poder da inteligência artificial na sua
                    culinária
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={() => navigate('/register')}
                      size="lg"
                      className="bg-white text-amber-600 hover:bg-gray-100 px-8 py-6 text-lg font-bold shadow-xl rounded-xl"
                    >
                      Começar Grátis
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                    <Button
                      onClick={() => navigate('/')}
                      variant="outline"
                      size="lg"
                      className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold rounded-xl"
                    >
                      Voltar para Home
                    </Button>
                  </div>
                </div>
              </div>
            </AnimatedElement>
          </div>
        </section>
      </div>
    </PageTransition>
  );
});

Features.displayName = 'Features';

export default Features;
