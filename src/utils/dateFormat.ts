import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Formate une date en temps relatif court (ex: "Il y a 2h")
 */
export function formatRelativeDate(date: Date): string {
  const formattedDate = formatDistanceToNow(new Date(date), {
    locale: fr,
  })
    .replace('environ ', '')
    .replace(' jours', 'j')
    .replace(' jour', 'j')
    .replace(' heures', 'h')
    .replace(' heure', 'h')
    .replace(' minutes', 'min')
    .replace(' minute', 'min');

  return `Il y a ${formattedDate}`;
}
