'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatINR } from '@/lib/helpers';
import { TrendingUp, Search, ArrowLeft, Loader2, RefreshCw } from 'lucide-react';

export default function OrdersLedgerPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Refund Modal State
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [newStatus, setNewStatus] = useState('REFUNDED');
  const [refundNotes, setRefundNotes] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({ status: statusFilter, search });
      const res = await fetch(`/api/admin/orders?${query.toString()}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;

    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          newStatus,
          refundNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update order');

      alert(data.message);
      setSelectedOrder(null);
      fetchOrders();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Link href="/admin" className="inline-flex items-center gap-1 text-xs text-amber-400 font-bold hover:underline mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-black text-white">Orders & Payment Ledger</h1>
        </div>

        <button onClick={fetchOrders} className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-300 flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-amber-400" /> Refresh Ledger
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-amber-500/20 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchOrders()}
            placeholder="Search by Customer Name, Email, Order #, Razorpay Order ID..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-semibold focus:outline-none"
        >
          <option value="">All Payment Statuses</option>
          <option value="PAID">PAID</option>
          <option value="PENDING">PENDING</option>
          <option value="FAILED">FAILED</option>
          <option value="REFUNDED">REFUNDED</option>
        </select>
      </div>

      {/* Ledger Table */}
      <div className="glass-panel rounded-3xl border border-amber-500/30 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-amber-400 mx-auto mb-2" /> Loading ledger...
          </div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-sm">No payment orders recorded.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-amber-400 font-extrabold uppercase border-b border-slate-800">
                <tr>
                  <th className="p-4">Order Number</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Event</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Razorpay Order ID</th>
                  <th className="p-4">Payment ID</th>
                  <th className="p-4">Payment Status</th>
                  <th className="p-4">Email Delivery</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-amber-300">{o.order_number}</td>
                    <td className="p-4">
                      <div className="font-bold text-white text-sm">{o.customer_name}</div>
                      <div className="text-[11px] text-slate-400">{o.customer_email} • {o.customer_phone}</div>
                    </td>
                    <td className="p-4 font-semibold text-slate-300">{o.event_title}</td>
                    <td className="p-4 font-black text-amber-400 text-sm">{formatINR(o.total_amount)}</td>
                    <td className="p-4 font-mono text-[10px] text-slate-400">{o.razorpay_order_id}</td>
                    <td className="p-4 font-mono text-[10px] text-slate-400">{o.razorpay_payment_id || 'N/A'}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                        o.payment_status === 'PAID' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                        o.payment_status === 'REFUNDED' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' :
                        'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      }`}>
                        {o.payment_status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        o.confirmation_email_status === 'SENT' ? 'bg-emerald-500/20 text-emerald-300' :
                        o.confirmation_email_status === 'FAILED' ? 'bg-red-500/20 text-red-300 font-black' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {o.confirmation_email_status || 'PENDING'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => { setSelectedOrder(o); setNewStatus(o.payment_status); setRefundNotes(''); }}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
                      >
                        Manage Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* UPDATE STATUS / REFUND MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full p-6 rounded-3xl border border-amber-500/40 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-bold text-amber-400 font-mono">{selectedOrder.order_number}</span>
                <h3 className="text-lg font-black text-white">Manage Order Payment</h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <div className="text-xs space-y-1 bg-slate-900 p-4 rounded-xl">
              <div>Customer: <strong className="text-white">{selectedOrder.customer_name}</strong></div>
              <div>Amount: <strong className="text-amber-400">{formatINR(selectedOrder.total_amount)}</strong></div>
              <div>Current Status: <strong className="text-emerald-400">{selectedOrder.payment_status}</strong></div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Set New Payment Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold"
                >
                  <option value="PAID">PAID</option>
                  <option value="REFUNDED">REFUNDED</option>
                  <option value="FAILED">FAILED</option>
                  <option value="PENDING">PENDING</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Refund / Update Reason Notes</label>
                <textarea
                  rows={3}
                  value={refundNotes}
                  onChange={(e) => setRefundNotes(e.target.value)}
                  placeholder="Reason for status change or refund transaction ID..."
                  className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setSelectedOrder(null)} className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs">
                Cancel
              </button>
              <button onClick={handleUpdateStatus} className="px-6 py-2 rounded-xl bg-amber-500 text-black font-extrabold text-xs">
                UPDATE ORDER STATUS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
