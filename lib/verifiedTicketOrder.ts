/** Trust gateway order notes and captured payment, never browser-supplied ticket quantities. */
export function verifiedTicketOrder(order: any, payment: any, orderId: string, paymentId: string): { quantity: number; amount: number } | null {
  const quantity = Number(order?.notes?.quantity);
  const paise = Number(order?.amount);
  if (order?.id !== orderId || payment?.id !== paymentId || payment?.order_id !== orderId || payment?.status !== 'captured') return null;
  if (order?.currency !== 'INR' || payment?.currency !== 'INR' || !Number.isSafeInteger(quantity) || quantity < 1 || quantity > 10) return null;
  if (!Number.isSafeInteger(paise) || paise !== quantity * 14900 || Number(payment?.amount) !== paise) return null;
  return { quantity, amount: paise / 100 };
}
