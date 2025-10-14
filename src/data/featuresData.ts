import {
  Brain,
  Smartphone,
  BarChart3,
  Cloud,
  Shield,
  Target,
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
  type LucideIcon,
} from 'lucide-react';

export interface MainFeature {
  icon: LucideIcon;
  title: string;
  shortDescription: string;
  fullDescription: string;
  gradient: string;
  features: string[];
}

export interface SimpleFeature {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const mainFeatures: MainFeature[] = [
  {
    icon: Brain,
    title: 'IA Avançada',
    shortDescription: 'Motor de IA que analisa milhares de combinações para criar receitas perfeitas.',
    fullDescription: 'Nosso motor de inteligência artificial utiliza algoritmos avançados de aprendizado de máquina para analisar seus ingredientes disponíveis, preferências alimentares, restrições dietéticas e histórico de consumo. Com base nisso, gera receitas personalizadas que maximizam o uso dos seus ingredientes e atendem suas necessidades nutricionais.',
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
    fullDescription: 'Interface projetada com foco na experiência do usuário, combinando design moderno com usabilidade excepcional. Funciona perfeitamente em qualquer dispositivo, com navegação fluida e intuitiva que torna cada interação agradável e eficiente.',
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
    fullDescription: 'Plataforma completa de analytics que transforma seus dados alimentares em insights acionáveis. Visualize tendências, acompanhe seu progresso nutricional e receba recomendações personalizadas baseadas em análises profundas dos seus hábitos alimentares.',
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
    fullDescription: 'Sistema de sincronização em nuvem que mantém seus dados sempre atualizados em todos os seus dispositivos. Backup automático e seguro garante que suas receitas, ingredientes e histórico nunca sejam perdidos.',
    gradient: 'from-orange-500 to-red-600',
    features: [
      'Sincronização em tempo real',
      'Backup automático e seguro',
      'Acesso multiplataforma',
      'Restauração de dados facilitada',
      'Compartilhamento entre dispositivos',
    ],
  },
  {
    icon: Shield,
    title: 'Segurança Máxima',
    shortDescription: 'Seus dados protegidos com criptografia de ponta a ponta.',
    fullDescription: 'Implementamos os mais altos padrões de segurança da indústria para proteger suas informações. Criptografia end-to-end, autenticação de dois fatores e conformidade com LGPD garantem que seus dados estejam sempre seguros e privados.',
    gradient: 'from-red-500 to-pink-600',
    features: [
      'Criptografia end-to-end',
      'Autenticação de dois fatores',
      'Conformidade com LGPD',
      'Auditorias de segurança regulares',
      'Controle total sobre seus dados',
    ],
  },
  {
    icon: Target,
    title: 'Metas Personalizadas',
    shortDescription: 'Defina e acompanhe objetivos nutricionais personalizados.',
    fullDescription: 'Configure metas nutricionais específicas para seus objetivos de saúde e bem-estar. O sistema acompanha automaticamente seu progresso e ajusta as recomendações de receitas para ajudá-lo a alcançar seus objetivos de forma sustentável.',
    gradient: 'from-amber-500 to-orange-600',
    features: [
      'Definição de metas personalizadas',
      'Acompanhamento de progresso em tempo real',
      'Ajuste automático de recomendações',
      'Notificações de conquistas',
      'Relatórios de progresso detalhados',
    ],
  },
];

export const additionalFeatures: SimpleFeature[] = [
  {
    title: 'Receitas Ilimitadas',
    description: 'Acesso a milhares de receitas e crie suas próprias combinações únicas.',
    icon: Utensils,
  },
  {
    title: 'Planejamento Semanal',
    description: 'Organize suas refeições da semana com facilidade e praticidade.',
    icon: Calendar,
  },
  {
    title: 'Lista de Compras',
    description: 'Gere automaticamente listas de compras baseadas nas suas receitas.',
    icon: ShoppingCart,
  },
  {
    title: 'Notificações Smart',
    description: 'Receba lembretes sobre validade de ingredientes e sugestões diárias.',
    icon: Bell,
  },
  {
    title: 'Comunidade Ativa',
    description: 'Compartilhe receitas e descubra criações de outros usuários.',
    icon: Users,
  },
  {
    title: 'Modo Offline',
    description: 'Acesse suas receitas favoritas mesmo sem conexão com internet.',
    icon: Lock,
  },
  {
    title: 'Backup Automático',
    description: 'Seus dados sempre seguros com backup automático na nuvem.',
    icon: Database,
  },
  {
    title: 'Análise Nutricional',
    description: 'Informações nutricionais detalhadas para cada receita gerada.',
    icon: Microscope,
  },
  {
    title: 'Suporte a Dietas',
    description: 'Vegetariano, vegano, low-carb, keto e muito mais.',
    icon: Leaf,
  },
  {
    title: 'Treinos Integrados',
    description: 'Combine alimentação com sugestões de exercícios físicos.',
    icon: Dumbbell,
  },
  {
    title: 'Histórico Completo',
    description: 'Acompanhe todas as receitas que você já preparou.',
    icon: Clock,
  },
  {
    title: 'Conquistas',
    description: 'Ganhe badges e recompensas por atingir suas metas.',
    icon: Award,
  },
];

export const benefits: SimpleFeature[] = [
  {
    title: 'Economia de Tempo',
    description: 'Reduza em 70% o tempo gasto planejando refeições.',
    icon: Zap,
  },
  {
    title: 'Vida Saudável',
    description: 'Tome decisões informadas sobre suas refeições com análises nutricionais.',
    icon: Heart,
  },
  {
    title: 'Performance Máxima',
    description: 'Interface otimizada que funciona perfeitamente mesmo em conexões lentas.',
    icon: Gauge,
  },
];
