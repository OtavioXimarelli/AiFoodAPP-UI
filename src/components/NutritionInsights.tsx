import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, Zap, Shield } from 'lucide-react';

const NutritionInsights = () => {
  const insights = [
    {
      icon: <Target className="h-6 w-6 text-primary" />,
      title: 'Meta Calórica',
      description: 'Você está 85% da sua meta diária',
      value: 85,
      status: 'Excelente',
    },
    {
      icon: <Zap className="h-6 w-6 text-yellow-500" />,
      title: 'Energia',
      description: 'Carboidratos balanceados para energia sustentada',
      value: 70,
      status: 'Bom',
    },
    {
      icon: <Shield className="h-6 w-6 text-blue-500" />,
      title: 'Proteínas',
      description: 'Excelente aporte proteico para recuperação',
      value: 92,
      status: 'Ótimo',
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-green-500" />,
      title: 'Micronutrientes',
      description: 'Rica em vitaminas e minerais essenciais',
      value: 78,
      status: 'Bom',
    },
  ];

  const nutritionTips = [
    'Suas receitas são ricas em proteínas de alta qualidade',
    'Boa variedade de vegetais garante vitaminas essenciais',
    'Carboidratos complexos fornecem energia duradoura',
    'Baixo teor de sódio - ideal para saúde cardiovascular',
  ];

  return (
    <section id="insights" className="py-16 bg-gradient-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-foreground mb-4">Insights Nutricionais</h3>
          <p className="text-muted-foreground text-lg">
            Análise detalhada dos benefícios das suas receitas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {insights.map((insight, index) => (
            <Card key={index} className="shadow-card text-center">
              <CardHeader className="pb-3">
                <div className="flex justify-center mb-2">{insight.icon}</div>
                <CardTitle className="text-lg">{insight.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Progress value={insight.value} className="h-2" />
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                  <Badge
                    variant={insight.value >= 80 ? 'default' : 'secondary'}
                    className={insight.value >= 80 ? 'bg-primary' : ''}
                  >
                    {insight.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Dicas Personalizadas da IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nutritionTips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-accent">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-accent-foreground">{tip}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default NutritionInsights;
