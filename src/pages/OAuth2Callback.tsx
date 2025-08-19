import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { apiClient, api } from '@/lib/api';

const OAuth2Callback = () => {
  const navigate = useNavigate();
  const { checkAuthentication } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Flag para evitar efeitos de corrida
    let mounted = true;
    
    // Verificar se o processo de OAuth já está há muito tempo e limpar se necessário
    const oauthStartedAt = sessionStorage.getItem('oauth_login_started_at');
    if (oauthStartedAt) {
      const startTime = new Date(oauthStartedAt).getTime();
      const now = Date.now();
      const timePassed = now - startTime;
      
      // Se passou mais de 10 minutos, considerar que o processo falhou e limpar
      if (timePassed > 10 * 60 * 1000) {
        console.log('⚠️ OAuth login process timed out after', Math.round(timePassed/1000/60), 'minutes');
        sessionStorage.removeItem('oauth_login_in_progress');
        sessionStorage.removeItem('oauth_login_started_at');
      }
    }
    
    const handleCallback = async () => {
      // Evitar múltiplas chamadas/redirecionamentos por causa de efeitos de montagem/desmontagem
      if (!mounted) return;
      
      try {
        console.log('🔄 OAuth2Callback: Starting authentication check...');
        
        // Check for token parameter in the URL
        const params = new URLSearchParams(window.location.search);
        const hasToken = params.has('token') || params.has('code');
        const hasError = params.has('error');
        
        // Verificar por erro no URL - o servidor pode retornar erro tanto pelo parâmetro error
        // quanto pelo código de status na própria URL (caso do erro 500)
        if (hasError) {
          const errorMsg = params.get('error') || 'Unknown error';
          console.error('❌ Error in OAuth callback URL:', errorMsg);
          throw new Error(`OAuth error: ${errorMsg}`);
        }
        
        // Verificar por padrão de erro 500 na URL (caso do Whitelabel Error)
        const currentUrl = window.location.href;
        if (currentUrl.includes('error') || 
            currentUrl.includes('status=500') || 
            currentUrl.includes('Internal+Server+Error')) {
          console.error('❌ Detected server error in URL:', currentUrl);
          throw new Error('Server error (500) - The authentication server encountered an error');
        }
        
        // Registrar que o callback foi iniciado (pode ajudar no debugging)
        console.log('🔄 OAuth2 callback processing with params:', 
          Object.fromEntries([...params.entries()]
            .filter(([key]) => !['token', 'code'].includes(key)))); // Não logar tokens por segurança
        
        // Esperar um tempo fixo (3 segundos) para o backend processar o token/código
        // Isso reduz o número de chamadas desnecessárias enquanto o backend está processando
        console.log('🔄 Waiting for backend to process authentication...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Verificar se ainda estamos montados após a espera
        if (!mounted) return;
        
        // Fazer apenas uma única tentativa com o endpoint de status
        try {
          console.log('🔄 Checking authentication status...');
          const status = await apiClient.getAuthStatus();
          
          if (status && status.authenticated) {
            console.log('✅ User authenticated according to status endpoint');
            
            // Definir marcadores de sessão
            localStorage.setItem('session_established_at', new Date().toISOString());
            localStorage.setItem('is_authenticated', 'true');
            
            // Limpar marcadores de processo OAuth
            sessionStorage.removeItem('oauth_login_in_progress');
            sessionStorage.removeItem('oauth_login_started_at');
            
            // Redirecionar para o dashboard
            if (mounted) {
              console.log('🔄 Redirecting to dashboard...');
              navigate('/dashboard', { replace: true });
            }
            return;
          } else {
            console.log('⚠️ Status endpoint reports not authenticated');
          }
        } catch (statusError) {
          console.log('⚠️ Failed to check auth status:', statusError);
        }
        
        // Se o status falhou, tentar uma verificação de autenticação regular
        try {
          console.log('🔄 Attempting regular authentication check...');
          await checkAuthentication();
          
          // Se chegamos aqui sem erros, a autenticação foi bem-sucedida
          localStorage.setItem('session_established_at', new Date().toISOString());
          localStorage.setItem('is_authenticated', 'true');
          
          // Limpar marcadores de processo OAuth
          sessionStorage.removeItem('oauth_login_in_progress');
          sessionStorage.removeItem('oauth_login_started_at');
          
          if (mounted) {
            navigate('/dashboard', { replace: true });
          }
          return;
        } catch (authError) {
          console.error('❌ Authentication check failed:', authError);
          throw authError;
        }
      } catch (error) {
        if (!mounted) return;
        
        console.error('❌ OAuth2 callback error:', error instanceof Error ? error.message : error);
        
        const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
        
        // Detectar tipos específicos de erro para mensagens mais amigáveis
        let userFriendlyMessage = 'Authentication failed. Please try again.';
        let errorDetails = '';
        
        if (errorMessage.includes('500') || errorMessage.includes('Server error')) {
          userFriendlyMessage = 'Authentication server error';
          errorDetails = 'The authentication server encountered an internal error. This is a backend issue that requires attention from the development team.';
        } else if (errorMessage.includes('Network Error') || errorMessage.includes('timeout')) {
          userFriendlyMessage = 'Connection error';
          errorDetails = 'Could not connect to the authentication server. Please check your internet connection and try again.';
        } else if (errorMessage.includes('OAuth error')) {
          userFriendlyMessage = 'OAuth authentication error';
          errorDetails = errorMessage;
        }
        
        setError(userFriendlyMessage + (errorDetails ? `: ${errorDetails}` : ''));
        
        // Limpar marcadores de processo OAuth em caso de erro
        sessionStorage.removeItem('oauth_login_in_progress');
        sessionStorage.removeItem('oauth_login_started_at');
        
        // Redirecionar após um tempo maior para erros do servidor (usuário pode precisar ler a mensagem)
        const redirectDelay = errorMessage.includes('500') ? 5000 : 3000;
        setTimeout(() => {
          if (mounted) {
            navigate('/login', { replace: true });
          }
        }, redirectDelay);
      }
    };

    handleCallback();
    
    // Função de limpeza para evitar atualizações em componentes desmontados
    return () => {
      mounted = false;
    };
  }, [checkAuthentication, navigate]);

  if (error) {
    // Determinar se é erro de servidor para estilo especial
    const isServerError = error.includes('server error') || error.includes('500');
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-lg border border-red-100">
          <div className={`text-4xl mb-4 ${isServerError ? 'text-red-600' : 'text-amber-500'}`}>
            {isServerError ? '🛑' : '⚠️'}
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            {isServerError ? 'Server Error' : 'Authentication Error'}
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            {error}
          </p>
          {isServerError && (
            <div className="bg-gray-50 p-3 rounded text-left text-sm mb-4 border border-gray-200">
              <p className="text-gray-700 font-medium mb-1">Troubleshooting:</p>
              <ul className="list-disc pl-5 text-gray-600 space-y-1">
                <li>Verifique se o servidor backend está funcionando corretamente</li>
                <li>Verifique os logs do servidor para mais detalhes sobre o erro</li>
                <li>O erro 500 indica um problema no lado do servidor e não no cliente</li>
              </ul>
            </div>
          )}
          <p className="text-sm text-gray-500">
            Redirecionando para a página de login em alguns segundos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-orange-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Completing sign in...
        </h2>
        <p className="text-gray-600">
          Please wait while we finish setting up your account.
        </p>
      </div>
    </div>
  );
};

export default OAuth2Callback;