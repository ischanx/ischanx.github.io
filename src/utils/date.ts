import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export function formatDate(date: Date, formatStr?: string): string {
  return format(date, formatStr || 'yyyy年MM月dd日', { locale: zhCN });
}

export function formatDateTime(date: Date): string {
  return format(date, 'yyyy年MM月dd日 HH:mm', { locale: zhCN });
} 