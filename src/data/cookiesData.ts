import { Cookie, Settings, Eye, ToggleLeft, type LucideIcon } from 'lucide-react';

export interface CookieType {
  title: string;
  badgeText: string;
  badgeClass: string;
  description: string;
  items: string[];
}

export const cookieTypes: CookieType[] = [
  {
    title: 'Cookies Essenciais',
    badgeText: 'Obrigatórios',
    badgeClass: 'bg-green-500/10 text-green-600',
    description: 'Necessários para o funcionamento básico do site.',
    items: [
      'Autenticação de sessão',
      'Manutenção da sessão',
      'Preferências de idioma',
    ],
  },
  {
    title: 'Cookies de Funcionalidade',
    badgeText: 'Opcionais',
    badgeClass: 'bg-amber-500/10 text-amber-600',
    description: 'Melhoram a experiência do usuário.',
    items: [
      'Preferências de tema (modo claro/escuro)',
      'Configurações de layout',
      'Histórico de receitas visualizadas',
    ],
  },
  {
    title: 'Cookies de Performance',
    badgeText: 'Opcionais',
    badgeClass: 'bg-blue-500/10 text-blue-600',
    description: 'Nos ajudam a entender como você usa o aplicativo.',
    items: [
      'Análise de uso do aplicativo',
      'Métricas de performance',
      'Relatórios de erros',
    ],
  },
];

export interface BrowserInstruction {
  browser: string;
  instructions: string[];
}

export const browserInstructions: BrowserInstruction[] = [
  {
    browser: 'Google Chrome',
    instructions: [
      'Clique no menu (três pontos) no canto superior direito',
      'Selecione "Configurações"',
      'Clique em "Privacidade e segurança"',
      'Selecione "Cookies e outros dados do site"',
      'Configure suas preferências',
    ],
  },
  {
    browser: 'Mozilla Firefox',
    instructions: [
      'Clique no menu no canto superior direito',
      'Selecione "Configurações"',
      'Clique em "Privacidade e Segurança"',
      'Na seção "Cookies e dados de sites", configure suas preferências',
    ],
  },
  {
    browser: 'Safari',
    instructions: [
      'Clique em "Safari" no menu superior',
      'Selecione "Preferências"',
      'Clique na aba "Privacidade"',
      'Configure suas preferências de cookies',
    ],
  },
  {
    browser: 'Microsoft Edge',
    instructions: [
      'Clique no menu (três pontos) no canto superior direito',
      'Selecione "Configurações"',
      'Clique em "Cookies e permissões de site"',
      'Selecione "Cookies e dados de sites armazenados"',
    ],
  },
];
