// Configuração de desenvolvimento
export const DEV_CONFIG = {
  // Ative esta flag para testar funcionalidades em desenvolvimento
  ENABLE_DEV_ACCESS:
    process.env.NODE_ENV === 'development' && window.location.hostname === 'localhost',

  // Bypass de autenticação em desenvolvimento
  BYPASS_AUTH: process.env.NODE_ENV === 'development' && window.location.hostname === 'localhost',

  // Usuário mock para desenvolvimento
  MOCK_USER: {
    id: 123,
    email: 'dev@localhost.com',
    name: 'Desenvolvedor',
    role: 'user',
  },
};

// Hook para verificar se estamos em modo de desenvolvimento
export const useDevMode = () => {
  return DEV_CONFIG.ENABLE_DEV_ACCESS;
};

// Função para debug - mostra no console se o modo dev está ativo
export const logDevStatus = () => {
  if (DEV_CONFIG.ENABLE_DEV_ACCESS) {
    console.log('🛠️ MODO DESENVOLVIMENTO ATIVO');
    console.log('🛠️ Hostname:', window.location.hostname);
    console.log('🛠️ Environment:', process.env.NODE_ENV);
    console.log('🛠️ Dashboard disponível em /dev-dashboard');
  }
};
