import { memo } from 'react';
import { FileText, Scale, AlertCircle, Ban, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { PageTransition } from '@/components/ui/animated';
import Header from '@/components/Header';
import { PageHeader } from '@/components/shared/PageHeader';
import { PolicySection } from '@/components/shared/PolicySection';

const Terms = memo(() => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
        <Header />

        <div className="container mx-auto px-4 pt-32 pb-20">
          <PageHeader
            icon={FileText}
            title="Termos de Uso"
            subtitle={`Última atualização: ${new Date().toLocaleDateString('pt-BR')}`}
          />

          <div className="max-w-4xl mx-auto">
            <Card className="mb-8 border-0 shadow-xl">
              <CardContent className="p-8">
                <div className="space-y-8">
                  <PolicySection icon={Scale} title="Aceitação dos Termos">
                    <p>
                      Ao acessar e usar o AI Food App, você concorda em cumprir e estar vinculado
                      a estes Termos de Uso. Se você não concordar com algum destes termos, não
                      deve usar nossa plataforma.
                    </p>
                  </PolicySection>

                  <PolicySection icon={FileText} title="Descrição do Serviço">
                    <p className="mb-4">
                      O AI Food App é uma plataforma que utiliza inteligência artificial para:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Gerar receitas personalizadas baseadas em ingredientes disponíveis</li>
                      <li>Gerenciar inventário de alimentos</li>
                      <li>Fornecer análises nutricionais</li>
                      <li>Sugerir planejamento de refeições</li>
                    </ul>
                  </PolicySection>

                  <PolicySection icon={Shield} title="Conta de Usuário">
                    <p className="mb-4">
                      Para usar certos recursos, você deve criar uma conta. Você é responsável por:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Manter a confidencialidade de sua senha</li>
                      <li>Todas as atividades realizadas em sua conta</li>
                      <li>Notificar-nos imediatamente sobre qualquer uso não autorizado</li>
                      <li>Fornecer informações precisas e atualizadas</li>
                    </ul>
                  </PolicySection>

                  <PolicySection icon={AlertCircle} title="Uso Aceitável">
                    <p className="mb-4">
                      Você concorda em usar o AI Food App apenas para fins legais e de acordo com
                      estes Termos. Você não deve:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Violar qualquer lei ou regulamento aplicável</li>
                      <li>Interferir no funcionamento do serviço</li>
                      <li>Transmitir vírus ou códigos maliciosos</li>
                      <li>Usar o serviço para fins comerciais sem autorização</li>
                      <li>Copiar, modificar ou distribuir o conteúdo sem permissão</li>
                    </ul>
                  </PolicySection>

                  <PolicySection icon={Shield} title="Propriedade Intelectual">
                    <p>
                      Todo o conteúdo, recursos e funcionalidades do AI Food App são propriedade
                      exclusiva da plataforma e estão protegidos por leis de direitos autorais e
                      outras leis de propriedade intelectual. As receitas geradas pela IA são de
                      uso pessoal do usuário.
                    </p>
                  </PolicySection>

                  <PolicySection icon={Ban} title="Isenção de Responsabilidade">
                    <p className="mb-4">
                      O AI Food App é fornecido "como está" e "conforme disponível". Não
                      garantimos:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Que o serviço será ininterrupto ou livre de erros</li>
                      <li>A precisão completa das receitas ou informações nutricionais</li>
                      <li>Que o conteúdo gerado atenderá suas necessidades específicas</li>
                    </ul>
                    <p className="font-medium text-foreground mt-4">
                      Importante: Consulte sempre um profissional de saúde para orientações
                      nutricionais personalizadas, especialmente se você tiver restrições
                      alimentares ou condições de saúde.
                    </p>
                  </PolicySection>

                  <PolicySection icon={Scale} title="Lei Aplicável">
                    <p>
                      Estes Termos são regidos pelas leis da República Federativa do Brasil.
                      Quaisquer disputas serão resolvidas nos tribunais competentes do Brasil.
                    </p>
                  </PolicySection>

                  <PolicySection icon={FileText} title="Contato">
                    <p>
                      Para questões sobre estes Termos de Uso, entre em contato:{' '}
                      <a
                        href="mailto:legal@aifoodapp.com"
                        className="text-amber-500 hover:underline font-medium"
                      >
                        legal@aifoodapp.com
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

Terms.displayName = 'Terms';

export default Terms;
