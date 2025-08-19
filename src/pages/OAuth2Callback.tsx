import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

const OAuth2Callback = () => {
  const navigate = useNavigate();
  const { checkAuthentication } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('🔄 OAuth2Callback: Starting authentication check...');
        console.log('🔄 Current URL:', window.location.href);
        console.log('🔄 URL search params:', window.location.search);
        console.log('🔄 API Base URL:', import.meta.env.VITE_API_BASE_URL);
        console.log('🔄 Document cookies:', document.cookie);
        
        // Check for token parameter in the URL
        const params = new URLSearchParams(window.location.search);
        const hasToken = params.has('token') || params.has('code');
        
        if (!hasToken) {
          console.log('⚠️ No token or code found in URL, checking if session is already established...');
        } else {
          console.log('🔒 Authentication token/code found in URL');
        }
        
        // Add a longer delay to ensure the backend session is properly set
        console.log('🔄 Waiting for backend session to be established...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check if authentication was successful
        console.log('🔄 Attempting to check authentication...');
        await checkAuthentication();
        
        console.log('✅ OAuth2Callback: Authentication successful, redirecting to dashboard...');
        // Store session timestamp to track session longevity
        localStorage.setItem('session_established_at', new Date().toISOString());
        
        // Redirect to dashboard on successful authentication
        navigate('/dashboard', { replace: true });
      } catch (error) {
        console.error('❌ OAuth2 callback error:', error);
        console.log('🔄 OAuth2Callback: Authentication failed, analyzing...');
        
        // Log more details about the error
        if (error instanceof Error) {
          console.error('❌ Error message:', error.message);
          console.error('❌ Error stack:', error.stack);
        }
        
        setError(error instanceof Error ? error.message : 'Authentication failed');
        
        // Wait longer before redirecting to show the error
        setTimeout(() => {
          console.log('🔄 OAuth2Callback: Redirecting to login due to error...');
          navigate('/login', { replace: true });
        }, 5000);
      }
    };

    handleCallback();
  }, [checkAuthentication, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
        <div className="text-center max-w-md">
          <div className="text-red-600 mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Authentication Error
          </h2>
          <p className="text-gray-600 mb-4">
            {error}
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to login page...
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