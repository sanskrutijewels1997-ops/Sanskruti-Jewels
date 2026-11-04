import type { DeletedItem } from '../types';

/** How long a deleted item can be restored from Recently deleted. */
export const RECOVERY_DAYS = 30;

const DAY_MS = 24 * 60 * 60 * 1000;

export function daysLeft(deletedAt: string, now = Date.now()) {
  return Math.ceil((new Date(deletedAt).getTime() + RECOVERY_DAYS * DAY_MS - now) / DAY_MS);
}

/** Separates items still in their recovery window from those due for removal. */
export function splitExpired(items: DeletedItem[]) {
  const sorted = [...items].sort((a, b) => b.deletedAt.localeCompare(a.deletedAt));
  return {
    active: sorted.filter((i) => daysLeft(i.deletedAt) > 0),
    expired: sorted.filter((i) => daysLeft(i.deletedAt) <= 0)
  };
}
