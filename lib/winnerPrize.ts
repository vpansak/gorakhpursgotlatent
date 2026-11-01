/** Episode 2 performer prize announcement. Display calculation only; not an automatic payout. */
export const WINNER_PRIZE_MULTIPLIER = 3;
export const WINNER_PRIZE_SUMMARY = 'Episode 2 ke officially declared winner ko usi episode ke liye apne verified performer participation payment ka 3× total prize milega.';
export const WINNER_PRIZE_DETAILS = 'Yeh total prize amount hai. Payment karna winner banne ya selection ki guarantee nahi hai. Prize settlement ki process aur timing GGL team official channel par confirm karegi.';
export function winnerPrizeAmount(amount: number | string): number | null {
  if (typeof amount === 'string' && !/^\d+(\.\d{1,2})?$/.test(amount.trim())) return null;
  const value = Number(amount);
  const paise = Math.round(value * 100);
  if (!Number.isFinite(value) || paise <= 0 || !Number.isSafeInteger(paise * WINNER_PRIZE_MULTIPLIER)) return null;
  return paise * WINNER_PRIZE_MULTIPLIER / 100;
}
