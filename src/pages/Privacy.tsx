import { memo } from 'react';
import { Shield, Lock, Eye, Database, UserCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { PageTransition } from '@/components/ui/animated';
import Header from '@/components/Header';
import { PageHeader } from '@/components/shared/PageHeader';
import { PolicySection } from '@/components/shared/PolicySection';

const Privacy = memo(() => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
        <Header />

        <div className="container mx-auto px-4 pt-32 pb-20">
          <PageHeader
            icon={Shield}
            title="Política de Privacidade"
            subtitle={`Última atualização: ${new Date().toLocaleDateString('pt-BR')}`}
          />

          <div className="max-w-4xl mx-auto">
            <Card className="mb-8 border-0 shadow-xl">
              <CardContent className="p-8">
                <div className="space-y-8">
                  <PolicySection icon={Lock} title="Compromisso com sua Privacidade">
                    <p>
                      No AI Food App, levamos sua privacidade a sério. Esta política descreve como
                      coletamos, usamos e protegemos suas informações pessoais quando você utiliza
                      nossa plataforma.
                    </p>
                  </PolicySection>

                  <PolicySection icon={Database} title="Dados que Coletamos">
                    <div>
                      <h3 className="font-semibold text-lg mb-2 text-foreground">Dados de Cadastro</h3>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Nome e endereço de e-mail</li>
                        <li>Senha criptografada</li>
                        <li>Informações de perfil opcionais</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2 text-foreground">Dados de Uso</h3>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Receitas criadas e salvas</li>
                        <li>Ingredientes cadastrados</li>
                        <li>Preferências alimentares</li>
                        <li>Histórico de uso da plataforma</li>
                      </ul>
                    </div>
                  </PolicySection>

                  <PolicySection icon={Eye} title="Como Usamos seus Dados">
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Fornecer e melhorar nossos serviços</li>
                      <li>Personalizar sua experiência</li>
                      <li>Gerar receitas baseadas em seus ingredientes</li>
                      <li>Enviar notificações importantes sobre o serviço</li>
                      <li>Analisar tendências e melhorar a plataforma</li>
                    </ul>
                  </PolicySection>

                  <PolicySection icon={Shield} title="Proteção de Dados">
                    <p>
                      Implementamos medidas de segurança técnicas e organizacionais apropriadas para
                      proteger seus dados contra acesso não autorizado, alteração, divulgação ou
                      destruição. Isso inclui:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Criptografia SSL/TLS para transmissão de dados</li>
                      <li>Senhas com hash e sal (bcrypt/argon2)</li>
                      <li>Controles de acesso rígidos</li>
                      <li>Auditorias de segurança regulares</li>
                      <li>Backup automático e seguro</li>
                    </ul>
                  </PolicySection>

                  <PolicySection icon={UserCheck} title="Seus Direitos (LGPD)">
                    <p>De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Confirmar a existência de tratamento de dados</li>
                      <li>Acessar seus dados pessoais</li>
                      <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
                      <li>Solicitar a anonimização, bloqueio ou eliminação de dados</li>
                      <li>Revogar o consentimento a qualquer momento</li>
                      <li>Portabilidade dos dados a outro fornecedor</li>
                    </ul>
                  </PolicySection>

                  <PolicySection icon={Lock} title="Contato">
                    <p>
                      Para questões sobre privacidade ou para exercer seus direitos, entre em
                      contato conosco através do e-mail:{' '}
                      <a
                        href="mailto:privacidade@aifoodapp.com"
                        className="text-amber-500 hover:underline font-medium"
                      >
                        privacidade@aifoodapp.com
                      </a>
                    </p>
                  </PolicySection>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageTransition>
  );
});

Privacy.displayName = 'Privacy';

export default Privacy;
