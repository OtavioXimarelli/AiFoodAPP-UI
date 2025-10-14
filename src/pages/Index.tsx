import { useEffect, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import AppStatusDialog from '@/components/shared/AppStatusDialog';
import { useState } from 'react';
import Hero from '@/components/Hero';
import {
  ReactBitsCard,
  ParticleBackground,
  TextReveal,
} from '@/components/ui/reactbits-components';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AnimatedElement,
  StaggerContainer,
  HoverAnimation,
  PageTransition,
  LoadingAnimation,
} from '@/components/ui/animated';
import { useIntersectionObserver } from '@/hooks/useScrollAnimation';
import {
  ChefHat,
  Sparkles,
  Shield,
  BarChart3,
  ArrowRight,
  Users,
  Zap,
  Heart,
  Check,
  Brain,
  Clock,
  Trophy,
  Star,
  Bot,
  Target,
  TrendingUp,
  Activity,
  Award,
  Leaf,
  Dumbbell,
  Microscope,
  Quote,
  CheckCircle,
  Smartphone,
  Cloud,
} from 'lucide-react';
import { DevAccess } from '@/components/DevAccess';

// Static data - defined outside component to avoid re-creation
const features = [
  {
    icon: Brain,
    title: 'IA Avançada',
    description:
      'Motor de IA que analisa milhares de combinações para criar receitas perfeitas baseadas nos seus ingredientes e preferências.',
    gradient: 'from-violet-500 to-purple-600',
    bgGlow: 'bg-violet-400/10',
  },
  {
    icon: Smartphone,
    title: 'Interface Intuitiva',
    description:
      'Design moderno e responsivo que torna o gerenciamento de alimentos e receitas uma experiência agradável em qualquer dispositivo.',
    gradient: 'from-blue-500 to-cyan-600',
    bgGlow: 'bg-blue-400/10',
  },
  {
    icon: BarChart3,
    title: 'Análises Avançadas',
    description:
      'Dashboard completo com insights nutricionais, tendências alimentares e relatórios personalizados para otimizar sua dieta.',
    gradient: 'from-emerald-500 to-teal-600',
    bgGlow: 'bg-emerald-400/10',
  },
  {
    icon: Cloud,
    title: 'Sincronização Total',
    description:
      'Acesse seus dados em qualquer lugar com sincronização automática e backup seguro na nuvem.',
    gradient: 'from-orange-500 to-red-600',
    bgGlow: 'bg-orange-400/10',
  },
  {
    icon: Shield,
    title: 'Segurança Máxima',
    description:
      'Criptografia de ponta a ponta e conformidade com LGPD garantem que seus dados pessoais estejam sempre protegidos.',
    gradient: 'from-indigo-500 to-purple-600',
    bgGlow: 'bg-indigo-400/10',
  },
  {
    icon: Target,
    title: 'Metas Personalizadas',
    description:
      'Defina objetivos nutricionais específicos e acompanhe seu progresso com recomendações personalizadas da IA.',
    gradient: 'from-pink-500 to-rose-600',
    bgGlow: 'bg-pink-400/10',
  },
];

const benefits = [
  {
    icon: Brain,
    title: 'Sugestões Inteligentes',
    description:
      'A IA analisa seus ingredientes e preferências dietéticas para sugerir receitas perfeitas.',
    color: 'text-purple-700',
    bg: 'bg-purple-100',
  },
  {
    icon: Clock,
    title: 'Economize Tempo',
    description:
      'Não perca mais tempo pensando no que cozinhar. Obtenha ideias instantâneas baseadas no que você tem.',
    color: 'text-blue-700',
    bg: 'bg-blue-100',
  },
  {
    icon: Heart,
    title: 'Alimentação Saudável',
    description: 'Acompanhe a nutrição e tome decisões informadas sobre suas refeições.',
    color: 'text-red-700',
    bg: 'bg-red-100',
  },
  {
    icon: Target,
    title: 'Reduza o Desperdício',
    description:
      'Use ingredientes antes que estraguem com o rastreamento inteligente de validade.',
    color: 'text-green-700',
    bg: 'bg-green-100',
  },
];

// Memoized FeatureCard component for better performance
const FeatureCard = memo<{
  feature: {
    icon: any;
    title: string;
    description: string;
    gradient: string;
    bgGlow: string;
  };
  index: number;
}>(({ feature, index }) => {
  const { ref, hasIntersected } = useIntersectionObserver(INTERSECTION_OPTIONS);
  const navigate = useNavigate();

  return (
    <div ref={ref}>
      <ReactBitsCard variant="tilt" className="h-full">
        <Card 
          className="group border-0 shadow-lg overflow-hidden h-full bg-card/95 backdrop-blur-sm cursor-pointer transition-all duration-300 hover:shadow-2xl"
          onClick={() => navigate('/features')}
        >
          {/* Gradient overlay on hover */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
          ></div>

          <CardHeader className="relative pb-4">
            <div className="flex items-center justify-between mb-4">
              <HoverAnimation scale={1.1}>
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg will-change-transform`}
                >
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
              </HoverAnimation>
            </div>
            <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
              {feature.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <p className="text-muted-foreground leading-relaxed mb-4">{feature.description}</p>
            <div className="flex items-center text-amber-500 font-semibold text-sm group-hover:translate-x-2 transition-transform duration-300">
              Saiba mais <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          </CardContent>

          {/* Subtle glow effect */}
          <div
            className={`absolute -inset-0.5 ${feature.bgGlow} opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500 -z-10`}
          ></div>
        </Card>
      </ReactBitsCard>
    </div>
  );
});

FeatureCard.displayName = 'FeatureCard';

// Memoize the intersection observer options outside component
const INTERSECTION_OPTIONS = {
  triggerOnce: true,
  threshold: 0.2,
} as const;

const Index = memo(() => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showAppStatus, setShowAppStatus] = useState(false);

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <LoadingAnimation size="lg" />
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen relative overflow-hidden">
        {/* Modern gradient background with glass compatibility */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-accent/10" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-background/50 to-primary/10" />

        {/* Subtle animated elements */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse opacity-30" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse opacity-40 animate-delay-2s" />

        {/* Content container */}
        <div className="relative z-10 pt-24">
          <Header onInfoClick={() => setShowAppStatus(true)} />
          <div className="container mx-auto px-4">
            <DevAccess />
          </div>
          <div className="relative">
            <Hero />
            {/* Decorative particle background for larger screens */}
            <ParticleBackground particleCount={30} className="hidden lg:block" />
          </div>
          <AppStatusDialog open={showAppStatus} onOpenChange={setShowAppStatus} />

          {/* Features Section */}
          <section className="py-24 px-4 relative" data-section="features">
            <div className="container mx-auto">
              <AnimatedElement variant="slideUp" className="text-center mb-20">
                <Badge className="mb-6 bg-amber-500/10 text-amber-600 border-amber-500/20 px-4 py-2 text-sm font-medium">
                  🚀 Funcionalidades Avançadas
                </Badge>
                <TextReveal className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                  A plataforma mais{' '}
                  <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent">
                    completa
                  </span>{' '}
                  para sua cozinha
                </TextReveal>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Tecnologia de ponta que revoluciona como você planeja, prepara e desfruta suas
                  refeições
                </p>
              </AnimatedElement>

              <StaggerContainer
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                staggerDelay={0.1}
              >
                {features.map((feature, index) => (
                  <FeatureCard key={index} feature={feature} index={index} />
                ))}
              </StaggerContainer>

              {/* View All Features Button */}
              <AnimatedElement variant="slideUp" delay={0.3} className="text-center mt-12">
                <Button
                  onClick={() => navigate('/features')}
                  size="lg"
                  variant="outline"
                  className="group border-2 border-amber-500/80 bg-transparent hover:bg-amber-500 text-foreground hover:text-white transition-all duration-300 px-8 py-6 text-base font-semibold backdrop-blur-sm shadow-md hover:shadow-lg hover:shadow-amber-500/30 rounded-xl"
                >
                  <span className="flex items-center gap-2">
                    Ver Todas as Funcionalidades
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Button>
              </AnimatedElement>

              {/* Simple stats without fake numbers */}
              <AnimatedElement variant="slideUp" delay={0.5}>
                <div className="mt-24 bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-amber-500/10 rounded-3xl p-12 backdrop-blur-sm border border-amber-500/20 shadow-xl">
                  <div className="text-center">
                    <div className="flex justify-center mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                        <Sparkles className="w-8 h-8 text-white animate-pulse" />
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold mb-4">
                      <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent">
                        A Revolução da Culinária Inteligente
                      </span>
                    </h3>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                      Junte-se à nova era da culinária onde a tecnologia encontra a gastronomia.
                      Crie, explore e otimize suas receitas com o poder da inteligência artificial.
                    </p>
                  </div>
                </div>
              </AnimatedElement>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="py-24 px-4 relative bg-gradient-to-br from-background via-amber-500/5 to-background backdrop-blur-sm">
            <div className="container mx-auto">
              <AnimatedElement variant="slideUp" className="text-center mb-16">
                <Badge className="mb-6 bg-amber-500/10 text-amber-600 border-amber-500/20 px-4 py-2 text-sm font-medium">
                  ✨ Benefícios
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  Por que escolher o{' '}
                  <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent">
                    AI Food App?
                  </span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Transforme sua experiência culinária com gerenciamento inteligente de alimentos
                </p>
              </AnimatedElement>

              <StaggerContainer
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                staggerDelay={0.15}
              >
                {benefits.map((benefit, index) => (
                  <ReactBitsCard key={index} variant="hover-glow" className="h-full">
                    <Card className="group border-0 bg-card/95 backdrop-blur-sm shadow-lg hover:shadow-2xl h-full transition-all duration-300 overflow-hidden">
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <CardContent className="p-8 relative">
                        <div className="flex items-start gap-4">
                          <HoverAnimation scale={1.15}>
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                              <benefit.icon className="h-7 w-7 text-white" />
                            </div>
                          </HoverAnimation>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-amber-600 transition-colors">
                              {benefit.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                              {benefit.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                      
                      {/* Subtle glow effect */}
                      <div className="absolute -inset-0.5 bg-amber-400/10 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500 -z-10"></div>
                    </Card>
                  </ReactBitsCard>
                ))}
              </StaggerContainer>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 px-4 relative">
            <div className="container mx-auto">
              <AnimatedElement variant="scale">
                <div className="relative overflow-hidden rounded-3xl">
                  {/* Background with modern gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600"></div>
                  
                  {/* Subtle pattern overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_rgba(255,255,255,0.1)_0%,_transparent_50%)]"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,_rgba(255,255,255,0.05)_0%,_transparent_50%)]"></div>

                  {/* Content */}
                  <div className="relative z-10 text-center px-6 py-16 md:px-12 md:py-20">
                    <AnimatedElement variant="slideUp" delay={0.1}>
                      <Badge className="mb-6 bg-white/20 text-white border-white/30 px-4 py-2 text-sm backdrop-blur-sm shadow-lg">
                        🎯 Comece Sua Jornada Culinária
                      </Badge>
                    </AnimatedElement>

                    <AnimatedElement variant="slideUp" delay={0.2}>
                      <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                        Revolucione sua
                        <span className="block mt-1">experiência culinária</span>
                      </h2>
                    </AnimatedElement>

                    <AnimatedElement variant="fadeIn" delay={0.3}>
                      <p className="text-lg md:text-xl text-white/95 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Descubra o poder da inteligência artificial aplicada à culinária.{' '}
                        <span className="font-bold">Crie receitas incríveis</span> com os
                        ingredientes que você tem em casa.
                      </p>
                    </AnimatedElement>

                    {/* Action buttons */}
                    <AnimatedElement variant="slideUp" delay={0.4}>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                        <Button
                          asChild
                          size="lg"
                          className="group bg-white text-amber-600 hover:bg-gray-50 shadow-xl px-8 py-6 text-base font-bold transition-all duration-300 rounded-xl"
                        >
                          <Link to="/register">
                            <Sparkles className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                            Começar Agora
                          </Link>
                        </Button>
                        
                        <Button
                          asChild
                          size="lg"
                          variant="outline"
                          className="group border-2 border-white text-white bg-white/10 hover:bg-white hover:text-amber-600 backdrop-blur-sm px-8 py-6 text-base font-bold shadow-lg transition-all duration-300 rounded-xl"
                        >
                          <Link to="/login">
                            <Users className="mr-2 h-5 w-5" />
                            Fazer Login
                          </Link>
                        </Button>
                      </div>
                    </AnimatedElement>

                    {/* Trust indicators */}
                    <AnimatedElement variant="fadeIn" delay={0.5}>
                      <div className="flex flex-wrap justify-center gap-6 text-white/90 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>100% Gratuito</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>Acesso Instantâneo</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>Suporte Brasileiro</span>
                        </div>
                      </div>
                    </AnimatedElement>
                  </div>
                </div>
              </AnimatedElement>
            </div>
          </section>

          {/* Footer */}
          <footer className="relative py-16 px-4 overflow-hidden">
            {/* Background with subtle gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/20"></div>
            
            {/* Decorative top border */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>

            <div className="container mx-auto relative z-10">
              {/* Main Footer Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
                {/* Brand Section */}
                <div className="lg:col-span-1">
                  <AnimatedElement variant="slideUp" delay={0.1}>
                    <Link to="/" className="inline-flex items-center gap-3 mb-4 group">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                        <ChefHat className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent">
                          AI Food App
                        </h3>
                        <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-xs px-2 py-0">
                          Beta
                        </Badge>
                      </div>
                    </Link>
                    <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                      Revolucione sua cozinha com inteligência artificial. Crie receitas
                      personalizadas e otimize sua nutrição.
                    </p>
                  </AnimatedElement>
                </div>

                {/* Produto */}
                <div>
                  <AnimatedElement variant="slideUp" delay={0.2}>
                    <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-foreground flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      Produto
                    </h4>
                    <ul className="space-y-3 text-sm">
                      <li>
                        <Link
                          to="/features"
                          className="text-muted-foreground hover:text-amber-500 transition-colors inline-flex items-center gap-2 group"
                        >
                          <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                          Funcionalidades
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/dashboard"
                          className="text-muted-foreground hover:text-amber-500 transition-colors inline-flex items-center gap-2 group"
                        >
                          <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/register"
                          className="text-muted-foreground hover:text-amber-500 transition-colors inline-flex items-center gap-2 group"
                        >
                          <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                          Começar Grátis
                        </Link>
                      </li>
                    </ul>
                  </AnimatedElement>
                </div>

                {/* Legal */}
                <div>
                  <AnimatedElement variant="slideUp" delay={0.3}>
                    <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-foreground flex items-center gap-2">
                      <Shield className="w-4 h-4 text-amber-500" />
                      Legal
                    </h4>
                    <ul className="space-y-3 text-sm">
                      <li>
                        <Link
                          to="/privacy"
                          className="text-muted-foreground hover:text-amber-500 transition-colors inline-flex items-center gap-2 group"
                        >
                          <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                          Privacidade
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/terms"
                          className="text-muted-foreground hover:text-amber-500 transition-colors inline-flex items-center gap-2 group"
                        >
                          <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                          Termos de Uso
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/cookies"
                          className="text-muted-foreground hover:text-amber-500 transition-colors inline-flex items-center gap-2 group"
                        >
                          <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                          Cookies
                        </Link>
                      </li>
                    </ul>
                  </AnimatedElement>
                </div>

                {/* Suporte */}
                <div>
                  <AnimatedElement variant="slideUp" delay={0.4}>
                    <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-foreground flex items-center gap-2">
                      <Users className="w-4 h-4 text-amber-500" />
                      Suporte
                    </h4>
                    <ul className="space-y-3 text-sm">
                      <li>
                        <Link
                          to="/contact"
                          className="text-muted-foreground hover:text-amber-500 transition-colors inline-flex items-center gap-2 group"
                        >
                          <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                          Contato
                        </Link>
                      </li>
                      <li>
                        <a
                          href="mailto:contato@aifoodapp.com"
                          className="text-muted-foreground hover:text-amber-500 transition-colors inline-flex items-center gap-2 group"
                        >
                          <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                          Email
                        </a>
                      </li>
                      <li>
                        <span className="text-muted-foreground text-xs flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          Suporte Brasileiro
                        </span>
                      </li>
                    </ul>
                  </AnimatedElement>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8"></div>

              {/* Bottom Bar */}
              <AnimatedElement variant="fadeIn" delay={0.5}>
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span>&copy; {new Date().getFullYear()} AI Food App.</span>
                    <span className="hidden md:inline">•</span>
                    <span className="hidden md:inline">Todos os direitos reservados.</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-xs">Feito com</span>
                    <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
                    <span className="text-xs">no Brasil</span>
                    <Badge 
                      variant="outline" 
                      className="ml-2 border-green-500/30 text-green-600 dark:text-green-400 bg-green-500/5"
                    >
                      <Leaf className="w-3 h-3 mr-1" />
                      Sustentável
                    </Badge>
                  </div>
                </div>
              </AnimatedElement>
            </div>
          </footer>
        </div>
      </div>
    </PageTransition>
  );
});

Index.displayName = 'Index';

export default Index;
