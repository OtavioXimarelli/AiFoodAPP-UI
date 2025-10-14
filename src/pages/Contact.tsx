import { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Send, MessageSquare, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AnimatedElement, PageTransition } from '@/components/ui/animated';
import Header from '@/components/Header';

const Contact = memo(() => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simular envio (implementar integração real depois)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: 'Mensagem enviada!',
      description: 'Entraremos em contato em breve. Obrigado!',
    });

    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
        <Header />

        <div className="container mx-auto px-4 pt-32 pb-20">
          <AnimatedElement variant="slideUp">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para Home
            </Link>

            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                    <MessageSquare className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                  Entre em Contato
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Tem alguma dúvida ou sugestão? Estamos aqui para ajudar!
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Formulário */}
                <Card className="border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Send className="w-5 h-5 text-amber-500" />
                      Envie sua Mensagem
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Nome Completo *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          placeholder="Seu nome"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="email">E-mail *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          placeholder="seu@email.com"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="subject">Assunto *</Label>
                        <Input
                          id="subject"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          required
                          placeholder="Sobre o que você quer falar?"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="message">Mensagem *</Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          required
                          placeholder="Escreva sua mensagem aqui..."
                          rows={6}
                          className="mt-1 resize-none"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg py-6 text-base font-bold transition-all duration-300 rounded-xl"
                      >
                        {isSubmitting ? (
                          <>Enviando...</>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Enviar Mensagem
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Informações de Contato */}
                <div className="space-y-6">
                  {/* Email Direto */}
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                          <Mail className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-2">E-mail Direto</h3>
                          <p className="text-muted-foreground text-sm mb-2">
                            Prefere enviar um e-mail direto?
                          </p>
                          <a
                            href="mailto:contato@aifoodapp.com"
                            className="text-amber-500 hover:underline font-medium"
                          >
                            contato@aifoodapp.com
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* FAQ */}
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                          <HelpCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-2">Perguntas Frequentes</h3>
                          <p className="text-muted-foreground text-sm mb-3">
                            Talvez sua dúvida já tenha sido respondida:
                          </p>
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>• Como criar uma conta?</li>
                            <li>• Como funciona a IA de receitas?</li>
                            <li>• O serviço é realmente gratuito?</li>
                            <li>• Como exportar meus dados?</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Horário de Atendimento */}
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-500/10 to-orange-500/10">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-3">Tempo de Resposta</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Respondemos todas as mensagens em até{' '}
                        <strong className="text-foreground">24-48 horas úteis</strong>. Para
                        questões urgentes, use o e-mail direto com [URGENTE] no assunto.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="text-center mt-12">
                <Link to="/">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-amber-500/80 bg-transparent hover:bg-amber-500 text-foreground hover:text-white transition-all duration-300 px-8 py-6 text-base font-semibold rounded-xl"
                  >
                    Voltar para Home
                  </Button>
                </Link>
              </div>
            </div>
          </AnimatedElement>
        </div>
      </div>
    </PageTransition>
  );
});

Contact.displayName = 'Contact';

export default Contact;
