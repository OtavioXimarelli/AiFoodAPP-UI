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
        const hasError = params.has('error');
        
        if (hasError) {
          const errorMsg = params.get('error') || 'Unknown error';
          console.error('❌ Error in OAuth callback URL:', errorMsg);
          throw new Error(`OAuth error: ${errorMsg}`);
        }
        
        if (!hasToken) {
          console.log('⚠️ No token or code found in URL, checking if session is already established...');
        } else {
          console.log('🔒 Authentication token/code found in URL');
        }
        
        // Try multiple times to get authentication status, with increasing delays
        // This helps with race conditions where cookies are not yet set
        console.log('🔄 Starting multiple auth check attempts...');
        
        for (let attempt = 1; attempt <= 3; attempt++) {
          console.log(`🔄 Auth check attempt ${attempt}/3...`);
          
          // Wait with increasing delay between attempts
          await new Promise(resolve => setTimeout(resolve, attempt * 1000));
          
          // Check auth status directly
          try {
            const status = await apiClient.getAuthStatus();
            console.log(`🔍 Auth status from API (attempt ${attempt}):`, status);
            
            if (status && status.authenticated) {
              console.log('✅ User authenticated according to status endpoint');
              
              // Try to get user details to ensure everything is working
              try {
                const userResponse = await api.get('/api/auth');
                console.log('✅ Successfully got user details:', userResponse.data);
                
                // Store session timestamp and mark as authenticated
                localStorage.setItem('session_established_at', new Date().toISOString());
                localStorage.setItem('is_authenticated', 'true');
                
                // Redirect to dashboard
                console.log('🔄 Redirecting to dashboard...');
                navigate('/dashboard', { replace: true });
                return;
              } catch (userError) {
                console.error('❌ Failed to get user details even though status shows authenticated:', userError);
                // Continue to next attempt
              }
            } else {
              console.log('⚠️ Auth status indicates not authenticated, will retry or try alternate method');
            }
          } catch (statusError) {
            console.log(`⚠️ Auth status check failed (attempt ${attempt}):`, statusError);
          }
          
          // If we're on the last attempt, try the regular authentication check
          if (attempt === 3) {
            console.log('🔄 All auth status checks failed, trying regular authentication check...');
            await checkAuthentication();
            
            // If we get here, authentication must have succeeded (otherwise an error would have been thrown)
            console.log('✅ OAuth2Callback: Authentication successful via regular check, redirecting to dashboard...');
            localStorage.setItem('session_established_at', new Date().toISOString());
            localStorage.setItem('is_authenticated', 'true');
            
            // Redirect to dashboard
            navigate('/dashboard', { replace: true });
            return;
          }
        }
        
        // If we get here, all attempts failed
        throw new Error('Authentication failed after multiple attempts');
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