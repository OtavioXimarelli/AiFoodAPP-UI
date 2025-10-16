import { differenceInDays, addDays, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface ExpirationStatus {
  status: 'expired' | 'expiring' | 'fresh' | 'unknown' | 'invalid';
  color: string;
  text: string;
  icon: string;
  daysUntilExpiration?: number;
}

/**
 * Calculate expiration status for a food item
 * @param expiration - ISO date string
 * @returns ExpirationStatus object with status info
 */
export function getExpirationStatus(expiration: string): ExpirationStatus {
  if (!expiration || typeof expiration !== 'string') {
    return {
      status: 'unknown',
      color: 'bg-gray-500',
      text: '❓ Sem data',
      icon: '❓',
    };
  }

  const expirationDate = new Date(expiration);

  if (isNaN(expirationDate.getTime())) {
    return {
      status: 'invalid',
      color: 'bg-gray-500',
      text: '❓ Data inválida',
      icon: '❓',
    };
  }

  const today = new Date();
  const daysUntilExpiration = differenceInDays(expirationDate, today);

  if (daysUntilExpiration < 0) {
    return {
      status: 'expired',
      color: 'bg-red-500',
      text: '⚠️ Vencido',
      icon: '🚨',
      daysUntilExpiration,
    };
  } else if (daysUntilExpiration <= 3) {
    return {
      status: 'expiring',
      color: 'bg-red-500',
      text: `⏰ ${daysUntilExpiration} ${daysUntilExpiration === 1 ? 'dia restante' : 'dias restantes'}`,
      icon: '⚠️',
      daysUntilExpiration,
    };
  } else {
    return {
      status: 'fresh',
      color: 'bg-green-500',
      text: `✅ ${daysUntilExpiration} dias restantes`,
      icon: '✅',
      daysUntilExpiration,
    };
  }
}

/**
 * Quick date presets for common expiration periods
 */
export const DATE_PRESETS = [
  { label: 'Hoje', days: 0 },
  { label: '3 dias', days: 3 },
  { label: '1 semana', days: 7 },
  { label: '1 mês', days: 30 },
] as const;

/**
 * Format a date to Brazilian Portuguese format
 */
export function formatDatePtBR(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) {
    return 'Data inválida';
  }
  return format(dateObj, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
}

/**
 * Format a date to short format (dd/MM/yyyy)
 */
export function formatDateShort(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) {
    return 'Data inválida';
  }
  return format(dateObj, 'dd/MM/yyyy', { locale: ptBR });
}

/**
 * Get date from days in the future
 */
export function getDateFromDays(days: number): string {
  return addDays(new Date(), days).toISOString().split('T')[0];
}
