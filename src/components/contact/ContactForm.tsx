import { memo, useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactFormProps {
  onSuccess?: () => void;
}

export const ContactForm = memo(({ onSuccess }: ContactFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
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
    onSuccess?.();
  };

  const formFields = [
    { label: 'Nome Completo', id: 'name', type: 'text' },
    { label: 'E-mail', id: 'email', type: 'email' },
    { label: 'Assunto', id: 'subject', type: 'text' },
  ] as const;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formFields.map(({ label, id, type }) => (
        <div key={id}>
          <Label htmlFor={id}>{label} *</Label>
          <Input
            id={id}
            type={type}
            value={formData[id]}
            onChange={(e) => setFormData({ ...formData, [id]: e.target.value })}
            required
            className="mt-1"
          />
        </div>
      ))}

      <div>
        <Label htmlFor="message">Mensagem *</Label>
        <Textarea
          id="message"
          rows={6}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
          className="mt-1 resize-none"
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg"
      >
        {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
        <Send className="ml-2 h-4 w-4" />
      </Button>
    </form>
  );
});

ContactForm.displayName = 'ContactForm';
