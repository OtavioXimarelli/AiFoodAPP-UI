import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { ChefHat, LogIn, LogOut, User, Info } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import GlassSurface from "@/components/GlassSurface/GlassSurface";
import SimpleHeader from "./SimpleHeader";

const Header = ({
  containerClassName,
  variant,
  onInfoClick,
}: {
  containerClassName?: string;
  variant?: "mobile" | "desktop";
  onInfoClick?: () => void;
}) => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  // keep header compact and near the top
  const defaultContainer = "fixed top-3 left-3 right-3 z-50 mx-auto max-w-none pointer-events-auto";
  const containerClass = containerClassName ?? defaultContainer;

  const isHomePage = location.pathname === "/";

  if (isHomePage) {
    return (
      <header className={containerClass}>
        <GlassSurface className="w-full rounded-[28px] border border-white/10">
          <div className="flex h-10 items-center px-3 sm:h-12 sm:px-4 w-full">
          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-3 font-bold text-sm sm:text-base bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent"
          >
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-sm">
              <ChefHat className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <div className="text-base font-semibold">AI Food App</div>
            </div>
          </Link>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            {!isAuthenticated ? (
              <div className="flex items-center gap-3">
                {onInfoClick && (
                  <Button
                    variant="outline"
                    size="sm"
                    aria-label="Estado do aplicativo"
                    className="gap-2 px-2.5 py-1.5"
                    onClick={onInfoClick}
                    title="Estado do aplicativo"
                  >
                    <Info className="h-4 w-4" />
                    <span className="hidden sm:inline">Info</span>
                  </Button>
                )}
                <Link to="/login">
                  <Button 
                    size="sm"
                    aria-label="Entrar"
                    className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/80 hover:to-primary shadow-sm transition-all duration-200 px-3 py-1.5 text-sm"
                  >
                    <LogIn className="h-4 w-4" />
                    <span className="hidden sm:inline">Entrar</span>
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                {variant === "desktop" && user && (
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 ring-1 ring-primary/20 transition-all duration-150 cursor-pointer">
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                        {user.name ? user.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden xl:block">
                      <p className="text-sm font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                )}

                {onInfoClick && (
                  <Button
                    variant="outline"
                    size="sm"
                    aria-label="Estado do aplicativo"
                    className="gap-2 px-2.5 py-1.5"
                    onClick={onInfoClick}
                    title="Estado do aplicativo"
                  >
                    <Info className="h-4 w-4" />
                    <span className="hidden sm:inline">Info</span>
                  </Button>
                )}

                <Button 
                  variant="outline" 
                  size="sm"
                  aria-label="Sair"
                  className="gap-2 hover:bg-destructive/10 hover:text-destructive transition-all duration-150 px-3 py-1.5"
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sair</span>
                </Button>
              </div>
            )}
            <div className="ml-1">
              <ThemeToggle />
            </div>
          </div>
          </div>
        </GlassSurface>
      </header>
    );
  }

  // Non-home page header
  return (
    <header className={containerClass}>
      <GlassSurface className="w-full rounded-[28px] border border-white/10">
        <div className="flex h-10 items-center px-3 sm:h-12 sm:px-4 w-full">
          <Link
            to="/"
            aria-label="Página inicial"
            className="flex items-center gap-2 sm:gap-3 font-bold text-sm sm:text-base bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent"
          >
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-sm">
              <ChefHat className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <div className="text-base font-semibold">AI Food App</div>
            </div>
          </Link>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            {!isAuthenticated ? (
              <div className="flex items-center gap-3">
                {onInfoClick && (
                  <Button
                    variant="outline"
                    size="sm"
                    aria-label="Estado do aplicativo"
                    className="gap-2 px-2.5 py-1.5"
                    onClick={onInfoClick}
                    title="Estado do aplicativo"
                  >
                    <Info className="h-4 w-4" />
                    <span className="hidden sm:inline">Info</span>
                  </Button>
                )}
                <Link to="/login">
                  <Button 
                    size="sm"
                    aria-label="Entrar"
                    className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/80 hover:to-primary shadow-sm transition-all duration-200 px-3 py-1.5 text-sm"
                  >
                    <LogIn className="h-4 w-4" />
                    <span className="hidden sm:inline">Entrar</span>
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                {variant === "desktop" && user && (
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 ring-1 ring-primary/20 transition-all duration-150 cursor-pointer">
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                        {user.name ? user.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden xl:block">
                      <p className="text-sm font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                )}

                {onInfoClick && (
                  <Button
                    variant="outline"
                    size="sm"
                    aria-label="Estado do aplicativo"
                    className="gap-2 px-2.5 py-1.5"
                    onClick={onInfoClick}
                    title="Estado do aplicativo"
                  >
                    <Info className="h-4 w-4" />
                    <span className="hidden sm:inline">Info</span>
                  </Button>
                )}

                <Button 
                  variant="outline" 
                  size="sm"
                  aria-label="Sair"
                  className="gap-2 hover:bg-destructive/10 hover:text-destructive transition-all duration-150 px-3 py-1.5"
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sair</span>
                </Button>
              </div>
            )}
            <div className="ml-1">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </GlassSurface>
    </header>
  );
};

export default Header;