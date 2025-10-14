import { memo } from 'react';
import { Mail, MessageSquare, HelpCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatedElement, PageTransition } from '@/components/ui/animated';
import Header from '@/components/Header';
import { PageHeader } from '@/components/shared/PageHeader';
import { ContactForm } from '@/components/contact/ContactForm';

const Contact = memo(() => {
  const infoCards = [
    {
      icon: Mail,
      title: 'E-mail Direto',
      description: 'Prefere enviar um e-mail? Escreva para:',
      content: 'contato@aifoodapp.com',
      link: 'mailto:contato@aifoodapp.com',
    },
    {
      icon: MessageSquare,
      title: 'FAQ',
      description: 'Perguntas frequentes e respostas rápidas.',
      content: 'Acesse nossa central de ajuda',
      link: '/faq',
    },
    {
      icon: Clock,
      title: 'Tempo de Resposta',
      description: 'Respondemos em até 24 horas úteis.',
      content: 'Segunda a Sexta, 9h às 18h',
    },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
        <Header />

        <div className="container mx-auto px-4 pt-32 pb-20">
          <PageHeader
            icon={MessageSquare}
            title="Entre em Contato"
            subtitle="Estamos aqui para ajudar! Envie sua mensagem e responderemos em breve."
          />
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Form */}
              <AnimatedElement variant="slideUp" className="lg:col-span-2">
                <Card className="border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-2xl">Envie sua Mensagem</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ContactForm />
                  </CardContent>
                </Card>
              </AnimatedElement>

              {/* Info Cards */}
              <div className="space-y-6">
                {infoCards.map((card, index) => (
                  <AnimatedElement key={index} variant="slideUp" delay={0.1 * (index + 1)}>
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                            <card.icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-lg mb-2 text-foreground">
                              {card.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {card.description}
                            </p>
                            {card.link ? (
                              <a
                                href={card.link}
                                className="text-sm text-amber-600 hover:text-amber-700 font-medium underline"
                              >
                                {card.content}
                              </a>
                            ) : (
                              <p className="text-sm font-medium text-foreground">{card.content}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </AnimatedElement>
                ))}
              </div>
            </div>

            {/* Additional Help Section */}
            <AnimatedElement variant="slideUp" delay={0.4} className="mt-12">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-500/10 to-orange-500/10">
                <CardContent className="p-8 text-center">
                  <HelpCircle className="w-12 h-12 mx-auto mb-4 text-amber-600" />
                  <h3 className="text-xl font-bold mb-2 text-foreground">Precisa de ajuda imediata?</h3>
                  <p className="text-muted-foreground mb-4">
                    Confira nossa documentação completa e tutoriais em vídeo.
                  </p>
                  <a
                    href="/docs"
                    className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium"
                  >
                    Acessar Documentação
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </CardContent>
              </Card>
            </AnimatedElement>
          </div>
        </div>
      </div>
    </PageTransition>
  );
});

Contact.displayName = 'Contact';

export default Contact;
