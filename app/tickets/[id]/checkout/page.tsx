'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { formatINR } from '@/lib/helpers';
import { Ticket, ShieldCheck, Lock, Loader2, ArrowLeft, AlertCircle } from 'lucide-react';

function CheckoutContent({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryIdParam = searchParams.get('category') || '';

  const [eventId, setEventId] = useState('');
  const [eventData, setEventData] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(categoryIdParam);
  const [quantity, setQuantity] = useState(1);

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    params.then((p) => {
      setEventId(p.id);
      fetchEvent(p.id);
    });
  }, [params]);

  const fetchEvent = async (id: string) => {
    try {
      const res = await fetch('/api/events/active');
      const data = await res.json();
      if (data.success) {
        setEventData(data.event);
        setCategories(data.categories);
        if (!selectedCategoryId && data.categories.length > 0) {
          setSelectedCategoryId(data.categories[0].id);
        }
      }
    } catch (err) {
      setError('Error loading event categories');
    }
  };

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId) || categories[0];
  const unitPrice = selectedCategory ? selectedCategory.price : 0;
  const totalAmount = unitPrice * quantity;

  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!customerName || !customerEmail || !customerPhone) {
      setError('Please fill in all attendee contact details');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: eventData.id,
          categoryId: selectedCategoryId,
          quantity,
          customerName,
          customerEmail,
          customerPhone,
        }),
      });

      const orderResult = await res.json();
      if (!res.ok) throw new Error(orderResult.error || 'Failed to create payment order');

      if (typeof window !== 'undefined' && (window as any).Razorpay && orderResult.keyId) {
        const options = {
          key: orderResult.keyId,
          amount: orderResult.amountPaise,
          currency: 'INR',
          name: "Gorakhpur's Got Latent",
          description: `${orderResult.eventName} - ${orderResult.categoryName} (${quantity} Tickets)`,
          image: '/logo.png',
          order_id: orderResult.razorpayOrderId,
          prefill: {
            name: customerName,
            email: customerEmail,
            contact: customerPhone,
          },
          theme: {
            color: '#FFD700',
          },
          handler: async function (response: any) {
            await verifyAndCompletePayment({
              orderId: orderResult.orderId,
              categoryId: selectedCategoryId,
              quantity,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
          setError(`Payment Failed: ${response.error.description || 'Transaction declined'}`);
          setLoading(false);
        });
        rzp.open();
      } else {
        await verifyAndCompletePayment({
          orderId: orderResult.orderId,
          categoryId: selectedCategoryId,
          quantity,
          razorpayOrderId: orderResult.razorpayOrderId,
          razorpayPaymentId: `pay_sim_${Date.now()}`,
          razorpaySignature: 'simulated_signature',
        });
      }
    } catch (err: any) {
      setError(err.message || 'Checkout failed');
      setLoading(false);
    }
  };

  const verifyAndCompletePayment = async (payload: any) => {
    try {
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Payment signature verification failed');

      router.push(`/tickets/confirmation/${data.orderId}`);
    } catch (err: any) {
      setError(err.message || 'Payment verification failed');
      setLoading(false);
    }
  };

  if (!eventData) {
    return (
      <div className="py-20 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-400 mx-auto" />
      </div>
    );
  }

  return (
    <form onSubmit={handleProceedToPayment} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Col: Attendee Form */}
      <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 space-y-6">
        <h3 className="text-lg font-bold text-amber-400 border-b border-amber-500/20 pb-2">
          1. Attendee Contact Details
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Vikramaditya Singh"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="vikram@gmail.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">WhatsApp / Phone *</label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <h3 className="text-lg font-bold text-amber-400 border-b border-amber-500/20 pb-2 pt-4">
          2. Ticket Tier & Quantity
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Select Category Tier</label>
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold focus:border-amber-400 focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id} disabled={c.available_qty <= 0}>
                  {c.name} - {formatINR(c.price)} ({c.available_qty} left)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Quantity</label>
            <div className="flex items-center gap-3">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setQuantity(num)}
                  className={`w-12 h-12 rounded-xl border font-bold text-sm transition-all ${
                    quantity === num
                      ? 'bg-amber-500 text-black border-amber-400 shadow-md'
                      : 'bg-slate-900 text-white border-slate-700 hover:border-amber-400'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Col: Order Summary & Razorpay Trigger */}
      <div className="glass-panel p-6 rounded-3xl border border-amber-500/30 space-y-6 flex flex-col justify-between">
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white uppercase tracking-wider gold-gradient-text">
            ORDER SUMMARY
          </h3>

          <div className="space-y-2 text-xs text-slate-300 border-b border-slate-800 pb-4">
            <div className="flex justify-between">
              <span>Event:</span>
              <span className="font-bold text-white">{eventData.title}</span>
            </div>
            <div className="flex justify-between">
              <span>Pass Category:</span>
              <span className="font-bold text-amber-400">{selectedCategory?.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Unit Price:</span>
              <span>{formatINR(unitPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>Quantity:</span>
              <span>{quantity} Ticket(s)</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-lg font-black text-white">
            <span>Total Amount:</span>
            <span className="text-2xl text-amber-400">{formatINR(totalAmount)}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <Lock className="w-3.5 h-3.5" /> 256-Bit SSL Encrypted Razorpay Checkout
            </span>
            <p>Supports UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, Net Banking & Wallets.</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-black font-extrabold text-base flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,215,0,0.4)] hover:scale-[1.02] transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> VERIFYING ORDER...
            </>
          ) : (
            <>
              <Ticket className="w-5 h-5" /> PAY {formatINR(totalAmount)} VIA RAZORPAY
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <Link href="/tickets" className="inline-flex items-center gap-1 text-xs text-amber-400 font-bold hover:underline">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Ticket Categories
      </Link>

      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-white">Ticket Checkout</h1>
        <p className="text-xs sm:text-sm text-slate-300">Complete attendee information to initiate secure Razorpay payment.</p>
      </div>

      <Suspense fallback={<div className="py-12 text-center text-slate-400">Loading checkout...</div>}>
        <CheckoutContent params={params} />
      </Suspense>
    </div>
  );
}
