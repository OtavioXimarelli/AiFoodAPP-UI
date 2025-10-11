import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  AlertTriangle,
  Mail,
  Send,
  Sparkles,
  Construction,
  Heart,
  MessageCircle,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface WelcomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName?: string;
}

const WelcomeDialog = ({ open, onOpenChange, userName }: WelcomeDialogProps) => {
  const [suggestion, setSuggestion] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const { toast } = useToast();

  const handleSendSuggestion = async () => {
    if (!suggestion.trim()) {
      toast({
        title: 'Ops! 🤔',
        description: 'Por favor, escreva sua sugestão antes de enviar.',
        variant: 'destructive',
      });
      return;
    }

    if (!userEmail.trim()) {
      toast({
        title: 'Email necessário 📧',
        description: 'Por favor, informe seu email para que possamos responder.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create mailto link as backup/primary method
      const subject = encodeURIComponent('Sugestão para AI Food App');
      const body = encodeURIComponent(
        `Olá equipe do AI Food App!\n\n` +
          `Sugestão: ${suggestion}\n\n` +
          `De: ${userEmail}\n` +
          `Usuário: ${userName || 'Não informado'}\n\n` +
          `Enviado através do app.`
      );

      const mailtoLink = `mailto:dev@aifoodapp.site?subject=${subject}&body=${body}`;

      // Try to open email client
      window.location.href = mailtoLink;

      // Show success message
      toast({
        title: 'Sugestão enviada! 🎉',
        description:
          'Obrigado pelo feedback! Seu cliente de email foi aberto para enviar a sugestão.',
      });

      // Clear form
      setSuggestion('');
      setUserEmail('');
      setShowFeedback(false);
    } catch (error) {
      toast({
        title: 'Erro ao enviar 😅',
        description: 'Tente enviar diretamente para dev@aifoodapp.site',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto bg-gradient-card border-border/30 backdrop-blur-xl">
        <DialogHeader className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-primary animate-pulse" />
          </div>
          <DialogTitle className="text-2xl font-bold text-foreground">
            Bem-vindo, {userName || 'Chef'}! 👨‍🍳
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Development Notice */}
          <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-xl bg-yellow-500/20">
                  <Construction className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-2">🚧 Em Desenvolvimento</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Nosso app está em constante evolução! Algumas funcionalidades podem não estar
                    totalmente operacionais e mudanças podem ocorrer para melhorar sua experiência.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feedback Section */}
          {!showFeedback ? (
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-xl bg-primary/20">
                    <Heart className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-2">💡 Sua opinião importa!</h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      Tem sugestões de funcionalidades? Queremos ouvir você! Ajude-nos a criar o app
                      dos seus sonhos.
                    </p>
                    <Button
                      onClick={() => setShowFeedback(true)}
                      className="w-full gap-2 hover:scale-105 transition-transform duration-200"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Enviar Sugestão
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Enviar Sugestão</h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Seu email:
                    </label>
                    <Input
                      type="email"
                      placeholder="seu@email.com"
                      value={userEmail}
                      onChange={e => setUserEmail(e.target.value)}
                      className="bg-card/50 border-border/30"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Sua sugestão:
                    </label>
                    <Textarea
                      placeholder="Conte-nos sua ideia! Ex: seria incrível ter receitas veganas, ou um timer para cozinhar..."
                      value={suggestion}
                      onChange={e => setSuggestion(e.target.value)}
                      className="min-h-24 bg-card/50 border-border/30 resize-none"
                      maxLength={500}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {suggestion.length}/500 caracteres
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowFeedback(false)}
                    className="flex-1"
                  >
                    Voltar
                  </Button>
                  <Button
                    onClick={handleSendSuggestion}
                    disabled={isSubmitting}
                    className="flex-1 gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Enviar
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contact Info */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              💌 Ou envie diretamente para{' '}
              <span className="font-medium text-primary">dev@aifoodapp.site</span>
            </p>
          </div>

          {/* Close Button */}
          <Button onClick={() => onOpenChange(false)} variant="outline" className="w-full mt-6">
            Começar a usar o app
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeDialog;
