import { useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, SearchX } from 'lucide-react';
import Header from '@/components/Header';
import { PageTransition, AnimatedElement } from '@/components/ui/animated';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
        <Header />
        
        <div className="min-h-screen flex items-center justify-center px-4 pt-20">
          <AnimatedElement variant="scale" className="text-center max-w-2xl">
            <div className="mb-8 flex justify-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                <SearchX className="w-16 h-16 text-amber-500" />
              </div>
            </div>
            
            <h1 className="text-7xl font-bold mb-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent">
              404
            </h1>
            
            <h2 className="text-3xl font-bold mb-4 text-foreground">
              Página não encontrada
            </h2>
            
            <p className="text-xl text-muted-foreground mb-8">
              A página que você está procurando não existe ou foi movida.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:via-orange-600 hover:to-amber-700 text-white shadow-lg hover:shadow-xl px-8 py-6 text-base font-bold transition-all duration-300 rounded-xl"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Voltar para Home
                </Button>
              </Link>
              
              <Button
                onClick={() => window.history.back()}
                variant="outline"
                size="lg"
                className="border-2 border-amber-500/80 bg-transparent hover:bg-amber-500 text-foreground hover:text-white transition-all duration-300 px-8 py-6 text-base font-semibold rounded-xl"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Voltar
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground mt-8">
              Caminho tentado: <code className="px-2 py-1 bg-muted rounded text-xs">{location.pathname}</code>
            </p>
          </AnimatedElement>
        </div>
      </div>
    </PageTransition>
  );
};

export default NotFound;
