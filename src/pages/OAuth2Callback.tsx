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
        
        // Add a small delay to ensure the backend session is properly set
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if authentication was successful
        await checkAuthentication();
        
        console.log('✅ OAuth2Callback: Authentication successful, redirecting to dashboard...');
        // Redirect to dashboard on successful authentication
        navigate('/dashboard', { replace: true });
      } catch (error) {
        console.error('❌ OAuth2 callback error:', error);
        console.log('🔄 OAuth2Callback: Redirecting to login due to error...');
        setError(error instanceof Error ? error.message : 'Authentication failed');
        
        // Wait a bit before redirecting to show the error
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
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