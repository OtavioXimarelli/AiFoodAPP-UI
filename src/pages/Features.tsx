import { memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AnimatedElement,
  StaggerContainer,
  HoverAnimation,
  PageTransition,
} from '@/components/ui/animated';
import { ReactBitsCard } from '@/components/ui/reactbits-components';
import {
  Brain,
  Smartphone,
  BarChart3,
  Cloud,
  Shield,
  Target,
  ChefHat,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Zap,
  Heart,
  Clock,
  TrendingUp,
  Activity,
  Award,
  Leaf,
  Dumbbell,
  Microscope,
  Utensils,
  BookOpen,
  Calendar,
  ShoppingCart,
  Bell,
  Users,
  Lock,
  Database,
  Gauge,
} from 'lucide-react';
import Header from '@/components/Header';

// Funcionalidades principais detalhadas
const mainFeatures = [
  {
    icon: Brain,
    title: 'IA Avançada',
    shortDescription:
      'Motor de IA que analisa milhares de combinações para criar receitas perfeitas.',
    fullDescription:
      'Nosso motor de inteligência artificial utiliza algoritmos avançados de aprendizado de máquina para analisar seus ingredientes disponíveis, preferências alimentares, restrições dietéticas e histórico de consumo. Com base nisso, gera receitas personalizadas que maximizam o uso dos seus ingredientes e atendem suas necessidades nutricionais.',
    gradient: 'from-violet-500 to-purple-600',
    features: [
      'Análise inteligente de ingredientes',
      'Sugestões baseadas em preferências',
      'Adaptação a restrições alimentares',
      'Aprendizado com seu histórico',
      'Otimização nutricional automática',
    ],
  },
  {
    icon: Smartphone,
    title: 'Interface Intuitiva',
    shortDescription: 'Design moderno e responsivo que torna o gerenciamento uma experiência agradável.',
    fullDescription:
      'Interface projetada com foco na experiência do usuário, combinando design moderno com usabilidade excepcional. Funciona perfeitamente em qualquer dispositivo, com navegação fluida e intuitiva que torna cada interação agradável e eficiente.',
    gradient: 'from-blue-500 to-cyan-600',
    features: [
      'Design responsivo para todos os dispositivos',
      'Navegação intuitiva e fluida',
      'Modo claro e escuro',
      'Animações suaves e performáticas',
      'Acessibilidade otimizada',
    ],
  },
  {
    icon: BarChart3,
    title: 'Análises Avançadas',
    shortDescription: 'Dashboard completo com insights nutricionais e relatórios personalizados.',
    fullDescription:
      'Plataforma completa de analytics que transforma seus dados alimentares em insights acionáveis. Visualize tendências, acompanhe seu progresso nutricional e receba recomendações personalizadas baseadas em análises profundas dos seus hábitos alimentares.',
    gradient: 'from-emerald-500 to-teal-600',
    features: [
      'Dashboard interativo e detalhado',
      'Gráficos de tendências nutricionais',
      'Relatórios personalizados',
      'Métricas de progresso em tempo real',
      'Exportação de dados e relatórios',
    ],
  },
  {
    icon: Cloud,
    title: 'Sincronização Total',
    shortDescription: 'Acesse seus dados em qualquer lugar com sincronização automática.',
    fullDescription:
      'Sistema de sincronização em nuvem que mantém seus dados sempre atualizados em todos os seus dispositivos. Backup automático e seguro garante que suas receitas, ingredientes e histórico nunca sejam perdidos.',
    gradient: 'from-orange-500 to-red-600',
    features: [
      'Sincronização automática em tempo real',
      'Backup seguro na nuvem',
      'Acesso de múltiplos dispositivos',
      'Histórico completo versionado',
      'Restauração de dados facilitada',
    ],
  },
  {
    icon: Shield,
    title: 'Segurança Máxima',
    shortDescription: 'Criptografia de ponta a ponta e conformidade com LGPD.',
    fullDescription:
      'Segurança é nossa prioridade. Todos os seus dados são criptografados de ponta a ponta, garantindo privacidade total. Estamos em conformidade com a LGPD e as melhores práticas internacionais de proteção de dados.',
    gradient: 'from-indigo-500 to-purple-600',
    features: [
      'Criptografia end-to-end',
      'Conformidade com LGPD',
      'Autenticação segura (OAuth2)',
      'Controle total sobre seus dados',
      'Auditoria de segurança regular',
    ],
  },
  {
    icon: Target,
    title: 'Metas Personalizadas',
    shortDescription: 'Defina objetivos nutricionais e acompanhe seu progresso.',
    fullDescription:
      'Sistema inteligente de definição e acompanhamento de metas que se adapta aos seus objetivos de saúde e nutrição. Receba recomendações personalizadas e ajustes automáticos para manter você no caminho certo.',
    gradient: 'from-pink-500 to-rose-600',
    features: [
      'Definição de metas nutricionais',
      'Acompanhamento de progresso',
      'Alertas e notificações inteligentes',
      'Ajuste automático de recomendações',
      'Celebração de conquistas',
    ],
  },
];

// Funcionalidades adicionais
const additionalFeatures = [
  {
    icon: Utensils,
    title: 'Receitas Ilimitadas',
    description: 'Acesse milhares de receitas geradas por IA baseadas nos seus ingredientes.',
  },
  {
    icon: BookOpen,
    title: 'Histórico Completo',
    description: 'Mantenha registro de todas as suas receitas e refeições preparadas.',
  },
  {
    icon: Calendar,
    title: 'Planejamento de Refeições',
    description: 'Organize suas refeições da semana com nosso planejador inteligente.',
  },
  {
    icon: ShoppingCart,
    title: 'Lista de Compras',
    description: 'Gere listas de compras automáticas baseadas nas receitas selecionadas.',
  },
  {
    icon: Bell,
    title: 'Alertas de Validade',
    description: 'Receba notificações antes dos ingredientes expirarem.',
  },
  {
    icon: Users,
    title: 'Compartilhamento',
    description: 'Compartilhe suas receitas favoritas com amigos e família.',
  },
  {
    icon: Activity,
    title: 'Tracking Nutricional',
    description: 'Monitore calorias, macronutrientes e micronutrientes em tempo real.',
  },
  {
    icon: Award,
    title: 'Conquistas',
    description: 'Ganhe badges e recompensas ao atingir suas metas nutricionais.',
  },
  {
    icon: Leaf,
    title: 'Opções Vegetarianas',
    description: 'Filtros especiais para dietas vegetarianas, veganas e plant-based.',
  },
  {
    icon: Dumbbell,
    title: 'Fitness Integration',
    description: 'Integre com apps de fitness para recomendações baseadas em atividade.',
  },
  {
    icon: Microscope,
    title: 'Análise Nutricional',
    description: 'Análise detalhada de cada receita com informações nutricionais completas.',
  },
  {
    icon: Database,
    title: 'Base de Dados Extensa',
    description: 'Acesso a uma base massiva de alimentos e ingredientes catalogados.',
  },
];

// Benefícios principais
const benefits = [
  {
    title: 'Economize Tempo',
    description:
      'Não perca mais tempo pensando no que cozinhar. A IA faz o trabalho pesado por você.',
    icon: Clock,
  },
  {
    title: 'Reduza Desperdício',
    description: 'Use ingredientes antes que estraguem com rastreamento inteligente de validade.',
    icon: TrendingUp,
  },
  {
    title: 'Alimentação Saudável',
    description: 'Tome decisões informadas sobre suas refeições com análises nutricionais.',
    icon: Heart,
  },
  {
    title: 'Performance Máxima',
    description: 'Interface otimizada que funciona perfeitamente mesmo em conexões lentas.',
    icon: Gauge,
  },
];

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

            <StaggerContainer className="space-y-20" staggerDelay={0.2}>
              {mainFeatures.map((feature, index) => (
                <AnimatedElement key={index} variant="slideUp">
                  <ReactBitsCard variant="tilt">
                    <Card className="overflow-hidden border-0 shadow-2xl bg-card/95 backdrop-blur-sm">
                      <div className="grid md:grid-cols-2 gap-8">
                        {/* Left side - Icon & Title */}
                        <CardHeader className="relative p-8">
                          <div
                            className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5`}
                          ></div>
                          <div className="relative">
                            <HoverAnimation scale={1.1}>
                              <div
                                className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg mb-6`}
                              >
                                <feature.icon className="h-10 w-10 text-white" />
                              </div>
                            </HoverAnimation>
                            <CardTitle className="text-3xl font-bold mb-4 text-foreground">
                              {feature.title}
                            </CardTitle>
                            <p className="text-lg text-muted-foreground mb-6">
                              {feature.fullDescription}
                            </p>
                            <div className="space-y-3">
                              {feature.features.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm text-muted-foreground">{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardHeader>

                        {/* Right side - Visual representation */}
                        <CardContent className="p-8 flex items-center justify-center bg-gradient-to-br from-muted/30 to-muted/10">
                          <div className="relative w-full max-w-md">
                            <div
                              className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-10 blur-3xl`}
                            ></div>
                            <div className="relative bg-card/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-border/50">
                              <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}
                                  >
                                    <feature.icon className="w-6 h-6 text-white" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="h-3 bg-gradient-to-r from-primary/20 to-primary/40 rounded-full mb-2"></div>
                                    <div className="h-2 bg-gradient-to-r from-primary/10 to-primary/30 rounded-full w-2/3"></div>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="h-2 bg-muted rounded-full"></div>
                                  <div className="h-2 bg-muted rounded-full w-5/6"></div>
                                  <div className="h-2 bg-muted rounded-full w-4/6"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </ReactBitsCard>
                </AnimatedElement>
              ))}
            </StaggerContainer>
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

            <StaggerContainer
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              staggerDelay={0.05}
            >
              {additionalFeatures.map((feature, index) => (
                <AnimatedElement key={index} variant="scale">
                  <ReactBitsCard variant="hover-glow">
                    <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow bg-card/95 backdrop-blur-sm">
                      <CardHeader>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                          <feature.icon className="w-6 h-6 text-white" />
                        </div>
                        <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </ReactBitsCard>
                </AnimatedElement>
              ))}
            </StaggerContainer>
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

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <AnimatedElement key={index} variant="slideUp">
                  <Card className="p-6 text-center border-0 shadow-lg bg-card/95 backdrop-blur-sm hover:shadow-xl transition-shadow">
                    <benefit.icon className="w-12 h-12 mx-auto mb-4 text-amber-500" />
                    <h3 className="text-lg font-bold mb-2 text-foreground">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </Card>
                </AnimatedElement>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <AnimatedElement variant="scale">
              <Card className="border-0 shadow-2xl overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white">
                <CardContent className="p-12 text-center">
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
                </CardContent>
              </Card>
            </AnimatedElement>
          </div>
        </section>
      </div>
    </PageTransition>
  );
});

Features.displayName = 'Features';

export default Features;
