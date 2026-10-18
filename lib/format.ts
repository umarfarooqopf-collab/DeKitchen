export const CURRENCY_SYMBOL = process.env.NEXT_PUBLIC_CURRENCY || 'Rs.';

export function formatPrice(amount: number | string | undefined | null): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (num === undefined || num === null || isNaN(num)) {
    return `${CURRENCY_SYMBOL} 0`;
  }
  // Format with thousands separator: e.g. Rs. 1,450
  return `${CURRENCY_SYMBOL} ${Math.round(num).toLocaleString('en-PK')}`;
}
