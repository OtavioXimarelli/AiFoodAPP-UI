import { memo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Database, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnimatedElement, PageTransition } from '@/components/ui/animated';
import Header from '@/components/Header';

const Privacy = memo(() => {
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

            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                  Política de Privacidade
                </h1>
                <p className="text-xl text-muted-foreground">
                  Última atualização: {new Date().toLocaleDateString('pt-BR')}
                </p>
              </div>

              <Card className="mb-8 border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="space-y-8">
                    {/* Introdução */}
                    <section>
                      <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                        <Lock className="w-6 h-6 text-amber-500" />
                        Compromisso com sua Privacidade
                      </h2>
                      <p className="text-muted-foreground leading-relaxed">
                        No AI Food App, levamos sua privacidade a sério. Esta política descreve como
                        coletamos, usamos e protegemos suas informações pessoais quando você utiliza
                        nossa plataforma.
                      </p>
                    </section>

                    {/* Dados Coletados */}
                    <section>
                      <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                        <Database className="w-6 h-6 text-amber-500" />
                        Dados que Coletamos
                      </h2>
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-lg mb-2">Dados de Cadastro</h3>
                          <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                            <li>Nome e endereço de e-mail</li>
                            <li>Senha criptografada</li>
                            <li>Informações de perfil opcionais</li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-2">Dados de Uso</h3>
                          <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                            <li>Receitas criadas e salvas</li>
                            <li>Ingredientes cadastrados</li>
                            <li>Preferências alimentares</li>
                            <li>Histórico de uso da plataforma</li>
                          </ul>
                        </div>
                      </div>
                    </section>

                    {/* Como Usamos */}
                    <section>
                      <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                        <Eye className="w-6 h-6 text-amber-500" />
                        Como Usamos seus Dados
                      </h2>
                      <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                        <li>Fornecer e melhorar nossos serviços</li>
                        <li>Personalizar sua experiência</li>
                        <li>Gerar receitas baseadas em seus ingredientes</li>
                        <li>Enviar notificações importantes sobre o serviço</li>
                        <li>Analisar tendências e melhorar a plataforma</li>
                      </ul>
                    </section>

                    {/* Proteção de Dados */}
                    <section>
                      <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                        <Shield className="w-6 h-6 text-amber-500" />
                        Proteção de Dados
                      </h2>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Implementamos medidas de segurança técnicas e organizacionais para proteger
                        seus dados:
                      </p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                        <li>Criptografia de ponta a ponta (SSL/TLS)</li>
                        <li>Senhas armazenadas com hash seguro</li>
                        <li>Acesso restrito aos dados pessoais</li>
                        <li>Backup regular e seguro</li>
                        <li>Monitoramento contínuo de segurança</li>
                      </ul>
                    </section>

                    {/* Seus Direitos */}
                    <section>
                      <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                        <UserCheck className="w-6 h-6 text-amber-500" />
                        Seus Direitos (LGPD)
                      </h2>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Conforme a Lei Geral de Proteção de Dados (LGPD), você tem direito a:
                      </p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                        <li>Acessar seus dados pessoais</li>
                        <li>Corrigir dados incompletos ou desatualizados</li>
                        <li>Solicitar a exclusão de seus dados</li>
                        <li>Revogar consentimento a qualquer momento</li>
                        <li>Solicitar portabilidade dos dados</li>
                      </ul>
                    </section>

                    {/* Cookies */}
                    <section>
                      <h2 className="text-2xl font-bold mb-4 text-foreground">Cookies</h2>
                      <p className="text-muted-foreground leading-relaxed">
                        Utilizamos cookies essenciais para o funcionamento da plataforma. Para mais
                        informações, consulte nossa{' '}
                        <Link to="/cookies" className="text-amber-500 hover:underline font-medium">
                          Política de Cookies
                        </Link>
                        .
                      </p>
                    </section>

                    {/* Contato */}
                    <section>
                      <h2 className="text-2xl font-bold mb-4 text-foreground">Contato</h2>
                      <p className="text-muted-foreground leading-relaxed">
                        Para questões sobre privacidade ou para exercer seus direitos, entre em
                        contato conosco através do e-mail:{' '}
                        <a
                          href="mailto:privacidade@aifoodapp.com"
                          className="text-amber-500 hover:underline font-medium"
                        >
                          privacidade@aifoodapp.com
                        </a>
                      </p>
                    </section>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center">
                <Link to="/">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg px-8 py-6 text-base font-bold transition-all duration-300 rounded-xl"
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

Privacy.displayName = 'Privacy';

export default Privacy;
