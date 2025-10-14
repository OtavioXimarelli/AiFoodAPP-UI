import { memo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Cookie, Settings, Eye, ToggleLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnimatedElement, PageTransition } from '@/components/ui/animated';
import Header from '@/components/Header';

const Cookies = memo(() => {
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
                    <Cookie className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                  Política de Cookies
                </h1>
                <p className="text-xl text-muted-foreground">
                  Última atualização: {new Date().toLocaleDateString('pt-BR')}
                </p>
              </div>

              <Card className="mb-8 border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="space-y-8">
                    {/* O que são Cookies */}
                    <section>
                      <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                        <Cookie className="w-6 h-6 text-amber-500" />
                        O que são Cookies?
                      </h2>
                      <p className="text-muted-foreground leading-relaxed">
                        Cookies são pequenos arquivos de texto armazenados no seu navegador quando
                        você visita nosso site. Eles nos ajudam a melhorar sua experiência,
                        lembrando suas preferências e facilitando o uso da plataforma.
                      </p>
                    </section>

                    {/* Tipos de Cookies */}
                    <section>
                      <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                        <Settings className="w-6 h-6 text-amber-500" />
                        Tipos de Cookies que Usamos
                      </h2>

                      <div className="space-y-6">
                        {/* Cookies Essenciais */}
                        <div className="bg-muted/50 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-lg">Cookies Essenciais</h3>
                            <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                              Obrigatórios
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                            Necessários para o funcionamento básico do site.
                          </p>
                          <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 ml-4">
                            <li>Autenticação e segurança</li>
                            <li>Manutenção da sessão</li>
                            <li>Preferências de idioma</li>
                          </ul>
                        </div>

                        {/* Cookies de Funcionalidade */}
                        <div className="bg-muted/50 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-lg">Cookies de Funcionalidade</h3>
                            <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                              Recomendados
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                            Melhoram sua experiência lembrando suas escolhas.
                          </p>
                          <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 ml-4">
                            <li>Preferências de tema (claro/escuro)</li>
                            <li>Configurações de dashboard</li>
                            <li>Receitas favoritas</li>
                          </ul>
                        </div>

                        {/* Cookies de Performance */}
                        <div className="bg-muted/50 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-lg">Cookies de Performance</h3>
                            <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                              Opcionais
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                            Ajudam-nos a entender como você usa o site.
                          </p>
                          <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 ml-4">
                            <li>Análise de uso e navegação</li>
                            <li>Tempos de carregamento</li>
                            <li>Erros e bugs</li>
                          </ul>
                        </div>
                      </div>
                    </section>

                    {/* Cookies de Terceiros */}
                    <section>
                      <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                        <Eye className="w-6 h-6 text-amber-500" />
                        Cookies de Terceiros
                      </h2>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Utilizamos serviços de terceiros que podem armazenar cookies:
                      </p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                        <li>
                          <strong className="text-foreground">Google OAuth:</strong> Para
                          autenticação segura
                        </li>
                        <li>
                          <strong className="text-foreground">Serviços de Analytics:</strong> Para
                          melhorar a plataforma (se habilitado)
                        </li>
                      </ul>
                    </section>

                    {/* Controle de Cookies */}
                    <section>
                      <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                        <ToggleLeft className="w-6 h-6 text-amber-500" />
                        Controle seus Cookies
                      </h2>
                      <div className="space-y-4 text-muted-foreground">
                        <p className="leading-relaxed">
                          Você pode controlar e gerenciar cookies de várias formas:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                          <li>Através das configurações do seu navegador</li>
                          <li>Usando ferramentas de opt-out de terceiros</li>
                          <li>Limpando cookies existentes a qualquer momento</li>
                        </ul>
                        <p className="leading-relaxed">
                          <strong className="text-foreground">Importante:</strong> Desabilitar
                          cookies essenciais pode afetar o funcionamento do site e alguns recursos
                          podem não estar disponíveis.
                        </p>
                      </div>
                    </section>

                    {/* Como Desabilitar */}
                    <section>
                      <h2 className="text-2xl font-bold mb-4 text-foreground">
                        Como Desabilitar Cookies
                      </h2>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Para desabilitar cookies, acesse as configurações do seu navegador:
                      </p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                        <li>
                          <strong className="text-foreground">Chrome:</strong> Configurações →
                          Privacidade e Segurança → Cookies
                        </li>
                        <li>
                          <strong className="text-foreground">Firefox:</strong> Opções → Privacidade
                          e Segurança
                        </li>
                        <li>
                          <strong className="text-foreground">Safari:</strong> Preferências →
                          Privacidade
                        </li>
                        <li>
                          <strong className="text-foreground">Edge:</strong> Configurações →
                          Cookies e permissões de site
                        </li>
                      </ul>
                    </section>

                    {/* Duração */}
                    <section>
                      <h2 className="text-2xl font-bold mb-4 text-foreground">
                        Duração dos Cookies
                      </h2>
                      <div className="space-y-3 text-muted-foreground">
                        <p className="leading-relaxed">
                          <strong className="text-foreground">Cookies de Sessão:</strong> Expiram
                          quando você fecha o navegador
                        </p>
                        <p className="leading-relaxed">
                          <strong className="text-foreground">Cookies Persistentes:</strong> Ficam
                          armazenados por um período determinado (geralmente até 1 ano)
                        </p>
                      </div>
                    </section>

                    {/* Contato */}
                    <section>
                      <h2 className="text-2xl font-bold mb-4 text-foreground">Contato</h2>
                      <p className="text-muted-foreground leading-relaxed">
                        Para dúvidas sobre nossa Política de Cookies:{' '}
                        <a
                          href="mailto:cookies@aifoodapp.com"
                          className="text-amber-500 hover:underline font-medium"
                        >
                          cookies@aifoodapp.com
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

Cookies.displayName = 'Cookies';

export default Cookies;
