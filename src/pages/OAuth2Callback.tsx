import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

const OAuth2Callback = () => {
  const navigate = useNavigate();
  const { checkAuthentication } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('🔄 OAuth2Callback: Starting authentication check...');
        console.log('🔄 Current URL:', window.location.href);
        console.log('🔄 URL search params:', window.location.search);
        
        // Check if authentication was successful
        await checkAuthentication();
        
        console.log('✅ OAuth2Callback: Authentication successful, redirecting to dashboard...');
        // Redirect to dashboard on successful authentication
        navigate('/dashboard', { replace: true });
      } catch (error) {
        console.error('❌ OAuth2 callback error:', error);
        console.log('🔄 OAuth2Callback: Redirecting to login due to error...');
        // Redirect to login on error
        navigate('/login', { replace: true });
      }
    };

    handleCallback();
  }, [checkAuthentication, navigate]);

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