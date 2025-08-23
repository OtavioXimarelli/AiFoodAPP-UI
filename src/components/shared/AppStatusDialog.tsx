import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertTriangle, 
  Mail, 
  Send, 
  Sparkles, 
  Construction,
  Heart,
  MessageCircle,
  Code,
  Rocket,
  Clock,
  CheckCircle2,
  AlertCircle,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AppStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName?: string;
}

const AppStatusDialog = ({ open, onOpenChange, userName }: AppStatusDialogProps) => {
  const [suggestion, setSuggestion] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const { toast } = useToast();

  const handleSendSuggestion = async () => {
    if (!suggestion.trim()) {
      toast({
        title: "Ops! 🤔",
        description: "Por favor, escreva sua sugestão antes de enviar.",
        variant: "destructive",
      });
      return;
    }

    if (!userEmail.trim()) {
      toast({
        title: "Email necessário 📧",
        description: "Por favor, informe seu email para que possamos responder.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create mailto link
      const subject = encodeURIComponent("Sugestão/Feedback - AI Food App");
      const body = encodeURIComponent(
        `Olá equipe do AI Food App!\n\n` +
        `Sugestão/Feedback: ${suggestion}\n\n` +
        `De: ${userEmail}\n` +
        `Usuário: ${userName || "Não informado"}\n\n` +
        `Enviado através do modal de status do app.`
      );
      
      const mailtoLink = `mailto:dev@aifoodapp.site?subject=${subject}&body=${body}`;
      
      // Try to open email client
      window.location.href = mailtoLink;
      
      // Show success message
      toast({
        title: "Feedback enviado! 🎉",
        description: "Obrigado pelo feedback! Seu cliente de email foi aberto para enviar a mensagem.",
      });

      // Clear form
      setSuggestion("");
      setUserEmail("");
      setShowFeedback(false);
      
    } catch (error) {
      toast({
        title: "Erro ao enviar 😅",
        description: "Tente enviar diretamente para dev@aifoodapp.site",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const appFeatures = [
    {
      name: "Sistema de Login",
      status: "completed",
      icon: CheckCircle2,
      description: "OAuth2 com Google implementado"
    },
    {
      name: "Despensa Digital",
      status: "completed",
      icon: CheckCircle2,
      description: "Gerenciamento básico de alimentos"
    },
    {
      name: "Gerador de Receitas",
      status: "development",
      icon: Code,
      description: "IA para criação de receitas"
    },
    {
      name: "Análise Nutricional",
      status: "development",
      icon: Construction,
      description: "Informações nutricionais detalhadas"
    },
    {
      name: "Unidades e Categorias",
      status: "planning",
      icon: Clock,
      description: "Sistema completo de medidas"
    },
    {
      name: "Notificações Push",
      status: "planning",
      icon: AlertCircle,
      description: "Alertas de vencimento"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500/20 text-green-700 border-green-500/30";
      case "development": return "bg-yellow-500/20 text-yellow-700 border-yellow-500/30";
      case "planning": return "bg-blue-500/20 text-blue-700 border-blue-500/30";
      default: return "bg-gray-500/20 text-gray-700 border-gray-500/30";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed": return "✅ Pronto";
      case "development": return "🚧 Desenvolvendo";
      case "planning": return "📋 Planejado";
      default: return "❓ Indefinido";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl mx-auto bg-gradient-card border-border/30 backdrop-blur-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
            <Rocket className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-bold text-foreground">
            Estado do AI Food App 🚀
          </DialogTitle>
          <p className="text-muted-foreground text-sm">
            Acompanhe o desenvolvimento e envie suas sugestões
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* App Status Card */}
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Construction className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-semibold">Status Atual</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <Zap className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">App Funcional</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <Code className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium">Em Desenvolvimento</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                O AI Food App está em <strong>desenvolvimento ativo</strong>. As funcionalidades principais 
                estão operacionais, mas ainda estamos aprimorando recursos e adicionando novos campos 
                para uma experiência mais completa.
              </p>
            </CardContent>
          </Card>

          {/* Features Progress */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-semibold">Progresso das Funcionalidades</h3>
              </div>
              
              <div className="space-y-3">
                {appFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-border transition-colors">
                    <div className="flex items-center gap-3">
                      <feature.icon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium text-sm">{feature.name}</div>
                        <div className="text-xs text-muted-foreground">{feature.description}</div>
                      </div>
                    </div>
                    <Badge className={cn("text-xs font-medium", getStatusColor(feature.status))}>
                      {getStatusText(feature.status)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Feedback Section */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <MessageCircle className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-semibold">Envie sua Sugestão</h3>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                Sua opinião é importante! Conte-nos o que você gostaria de ver no app.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    Seu email:
                  </label>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="bg-background/50"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-primary" />
                    Sua sugestão:
                  </label>
                  <Textarea
                    placeholder="Gostaria de sugerir uma nova funcionalidade, reportar um bug, ou dar um feedback geral..."
                    value={suggestion}
                    onChange={(e) => setSuggestion(e.target.value)}
                    className="min-h-[100px] bg-background/50 resize-none"
                  />
                </div>

                <Button 
                  onClick={handleSendSuggestion} 
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin" />
                      Enviando...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Enviar Sugestão
                    </div>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Heart className="h-4 w-4 text-red-500" />
                <span>Desenvolvido com carinho pela equipe AI Food App</span>
              </div>
              <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-1">
                <Mail className="h-3 w-3" />
                <span>dev@aifoodapp.site</span>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppStatusDialog;
