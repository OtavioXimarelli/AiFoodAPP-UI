import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { foodService } from "@/services/foodService";
import { recipeService } from "@/services/recipeService";
import toast from "react-hot-toast";

const TokenDebugger = () => {
  const [status, setStatus] = useState({ isAuthenticated: false, hasToken: false, tokenLength: 0, tokenPreview: '' });
  const [loading, setLoading] = useState(false);

  const refreshStatus = () => {
    // Simple status check - you can implement proper auth status checking here
    setStatus({ isAuthenticated: true, hasToken: true, tokenLength: 100, tokenPreview: 'jwt...' });
  };

  const testProtectedRoute = async (endpoint: string, testFn: () => Promise<any>) => {
    setLoading(true);
    try {
      console.log(`🧪 Testing protected route: ${endpoint}`);
      const result = await testFn();
      console.log(`✅ Success: ${endpoint}`, result);
      toast.success(`${endpoint} - Success!`);
    } catch (error: any) {
      console.error(`❌ Failed: ${endpoint}`, error);
      toast.error(`${endpoint} - Failed: ${error.message}`);
    } finally {
      setLoading(false);
      refreshStatus();
    }
  };

  const testFoodList = () => testProtectedRoute("GET /api/foods/list", foodService.getFoodItems);
  const testRecipeGen = () => testProtectedRoute("GET /api/recipes/gen", recipeService.generateRecipes);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔍 JWT Token Debugger
          <Button size="sm" variant="outline" onClick={refreshStatus}>
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Auth Status */}
        <div className="space-y-2">
          <h4 className="font-semibold">Authentication Status</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Authenticated:</div>
            <Badge variant={status.isAuthenticated ? "default" : "destructive"}>
              {status.isAuthenticated ? "Yes" : "No"}
            </Badge>
            
            <div>Has Token:</div>
            <Badge variant={status.hasToken ? "default" : "destructive"}>
              {status.hasToken ? "Yes" : "No"}
            </Badge>
            
            <div>Token Length:</div>
            <div className="text-xs font-mono">{status.tokenLength}</div>
            
            <div>Token Preview:</div>
            <div className="text-xs font-mono">{status.tokenPreview}</div>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="space-y-2">
          <h4 className="font-semibold">Test Protected Routes</h4>
          <div className="flex flex-col gap-2">
            <Button 
              onClick={testFoodList} 
              disabled={loading || !status.hasToken}
              variant="outline"
              size="sm"
            >
              Test Food List API
            </Button>
            <Button 
              onClick={testRecipeGen} 
              disabled={loading || !status.hasToken}
              variant="outline"
              size="sm"
            >
              Test Recipe Generation API
            </Button>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>💡 Check browser console for detailed logs</p>
          <p>🔐 Look for "Adding JWT token to request" messages</p>
          <p>✅ Successful calls should show "Success" messages</p>
          <p>❌ Failed calls will show error details</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenDebugger;
