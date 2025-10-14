import { memo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, AlertCircle, Scale, Ban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatedElement, PageTransition } from '@/components/ui/animated';
import Header from '@/components/Header';

const Terms = memo(() => {
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
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                  Termos de Uso
                </h1>
                <p className="text-xl text-muted-foreground">
                  Última atualização: {new Date().toLocaleDateString('pt-BR')}
                </p>
              </div>

              <Card className="mb-8 border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="space-y-8">
                    {/* Aceitação */}
                    <section>
                      <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                        <Scale className="w-6 h-6 text-amber-500" />
                        Aceitação dos Termos
                      </h2>
                      <p className="text-muted-foreground leading-relaxed">
                        Ao acessar e usar o AI Food App, você concorda em cumprir e estar vinculado
                        a estes Termos de Uso. Se você não concordar com algum destes termos, não
                        deve usar nossa plataforma.
                      </p>
                    </section>

                    {/* Descrição do Serviço */}
                    <section>
                      <h2 className="text-2xl font-bold mb-4 text-foreground">
                        Descrição do Serviço
                      </h2>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        O AI Food App é uma plataforma que utiliza inteligência artificial para:
                      </p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                        <li>Gerar receitas personalizadas baseadas em ingredientes disponíveis</li>
                        <li>Gerenciar inventário de alimentos</li>
                        <li>Fornecer análises nutricionais</li>
                        <li>Sugerir planejamento de refeições</li>
                      </ul>
                    </section>

                    {/* Conta de Usuário */}
                    <section>
                      <h2 className="text-2xl font-bold mb-4 text-foreground">
                        Conta de Usuário
                      </h2>
                      <div className="space-y-4 text-muted-foreground">
                        <p className="leading-relaxed">
                          Para usar certos recursos, você deve criar uma conta. Você é responsável
                          por:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                          <li>Manter a confidencialidade de sua senha</li>
                          <li>Todas as atividades realizadas em sua conta</li>
                          <li>Notificar-nos imediatamente sobre qualquer uso não autorizado</li>
                          <li>Fornecer informações precisas e atualizadas</li>
                        </ul>
                      </div>
                    </section>

                    {/* Uso Aceitável */}
                    <section>
                      <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                        <AlertCircle className="w-6 h-6 text-amber-500" />
                        Uso Aceitável
                      </h2>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Você concorda em usar o AI Food App apenas para fins legais e de acordo com
                        estes Termos. Você não deve:
                      </p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                        <li>Violar quaisquer leis ou regulamentos aplicáveis</li>
                        <li>Tentar obter acesso não autorizado aos sistemas</li>
                        <li>Transmitir vírus ou códigos maliciosos</li>
                        <li>Usar o serviço para fins comerciais sem autorização</li>
                        <li>Copiar, modificar ou distribuir o conteúdo sem permissão</li>
                      </ul>
                    </section>

                    {/* Propriedade Intelectual */}
                    <section>
                      <h2 className="text-2xl font-bold mb-4 text-foreground">
                        Propriedade Intelectual
                      </h2>
                      <p className="text-muted-foreground leading-relaxed">
                        Todo o conteúdo, recursos e funcionalidades do AI Food App são propriedade
                        exclusiva da plataforma e estão protegidos por leis de direitos autorais e
                        outras leis de propriedade intelectual. As receitas geradas pela IA são de
                        uso pessoal do usuário.
                      </p>
                    </section>

                    {/* Isenção de Responsabilidade */}
                    <section>
                      <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                        <Ban className="w-6 h-6 text-amber-500" />
                        Isenção de Responsabilidade
                      </h2>
                      <div className="space-y-4 text-muted-foreground">
                        <p className="leading-relaxed">
                          O AI Food App é fornecido "como está" e "conforme disponível". Não
                          garantimos:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                          <li>Que o serviço será ininterrupto ou livre de erros</li>
                          <li>A precisão completa das receitas ou informações nutricionais</li>
                          <li>Que o conteúdo gerado atenderá suas necessidades específicas</li>
                        </ul>
                        <p className="leading-relaxed font-medium text-foreground">
                          Importante: Consulte sempre um profissional de saúde para orientações
                          nutricionais personalizadas, especialmente se você tiver restrições
                          alimentares ou condições de saúde.
                        </p>
                      </div>
                    </section>

                    {/* Limitação de Responsabilidade */}
                    <section>
                      <h2 className="text-2xl font-bold mb-4 text-foreground">
                        Limitação de Responsabilidade
                      </h2>
                      <p className="text-muted-foreground leading-relaxed">
                        O AI Food App não será responsável por quaisquer danos diretos, indiretos,
                        incidentais, especiais ou consequenciais resultantes do uso ou
                        impossibilidade de usar o serviço.
                      </p>
                    </section>

                    {/* Modificações */}
                    <section>
                      <h2 className="text-2xl font-bold mb-4 text-foreground">
                        Modificações nos Termos
                      </h2>
                      <p className="text-muted-foreground leading-relaxed">
                        Reservamo-nos o direito de modificar estes termos a qualquer momento. As
                        alterações entrarão em vigor imediatamente após a publicação. O uso
                        continuado do serviço após as alterações constitui aceitação dos novos
                        termos.
                      </p>
                    </section>

                    {/* Rescisão */}
                    <section>
                      <h2 className="text-2xl font-bold mb-4 text-foreground">Rescisão</h2>
                      <p className="text-muted-foreground leading-relaxed">
                        Podemos suspender ou encerrar sua conta se você violar estes Termos de Uso.
                        Você pode encerrar sua conta a qualquer momento através das configurações de
                        conta ou entrando em contato conosco.
                      </p>
                    </section>

                    {/* Lei Aplicável */}
                    <section>
                      <h2 className="text-2xl font-bold mb-4 text-foreground">Lei Aplicável</h2>
                      <p className="text-muted-foreground leading-relaxed">
                        Estes Termos são regidos pelas leis da República Federativa do Brasil.
                        Quaisquer disputas serão resolvidas nos tribunais competentes do Brasil.
                      </p>
                    </section>

                    {/* Contato */}
                    <section>
                      <h2 className="text-2xl font-bold mb-4 text-foreground">Contato</h2>
                      <p className="text-muted-foreground leading-relaxed">
                        Para questões sobre estes Termos de Uso, entre em contato:{' '}
                        <a
                          href="mailto:legal@aifoodapp.com"
                          className="text-amber-500 hover:underline font-medium"
                        >
                          legal@aifoodapp.com
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

Terms.displayName = 'Terms';

export default Terms;
