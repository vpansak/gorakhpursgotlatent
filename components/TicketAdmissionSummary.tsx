import { getTicketQuantity } from '@/lib/ticketQuantity';

export default function TicketAdmissionSummary({ quantity }: { quantity: unknown }) {
  const count = getTicketQuantity(quantity);
  return (
    <div className="rounded-xl border-2 border-amber-400/70 bg-amber-400/10 px-4 py-3 text-center">
      <div className="text-xl font-black text-amber-300">TICKETS × {count}</div>
      <div className="text-sm font-bold text-white">{count === 1 ? '1 व्यक्ति का टिकट' : `${count} लोगों का टिकट`}</div>
    </div>
  );
}
