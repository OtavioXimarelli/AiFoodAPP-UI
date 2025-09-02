import { Link } from "react-router-dom";
import { DEV_CONFIG } from "@/config/dev";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wrench, ArrowRight } from "lucide-react";

export const DevAccess = () => {
  // Só renderizar se estivermos em modo de desenvolvimento
  if (!DEV_CONFIG.ENABLE_DEV_ACCESS) {
    return null;
  }

  return (
    <div className="mb-8">
      <Alert className="border-yellow-500/30 bg-yellow-500/5">
        <Wrench className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30">
              DESENVOLVIMENTO
            </Badge>
            <span>Dashboard disponível para testes locais</span>
          </div>
          <Button asChild size="sm" variant="outline" className="ml-4">
            <Link to="/dev-dashboard" className="flex items-center gap-2">
              Abrir Dashboard
              <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
};