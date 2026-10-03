'use client';

import { useEffect, useRef } from 'react';

type LeadCaptureOptions = {
  source: string;
  data: Record<string, any>;
  customerName?: string;
  mobile?: string;
  email?: string;
  instagramId?: string;
  dob?: string;
  quantity?: number;
};

function hasMeaningfulValue(value: any): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return true;
  return value !== null && value !== undefined && String(value).trim().length > 0;
}

export function useLeadCapture(options: LeadCaptureOptions) {
  const leadIdRef = useRef<string>('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let id = sessionStorage.getItem(`ggl_lead_session_${options.source}`);
    if (!id) {
      id = `lead_session_${crypto.randomUUID()}`;
      sessionStorage.setItem(`ggl_lead_session_${options.source}`, id);
    }
    leadIdRef.current = id;
  }, []);

  useEffect(() => {
    const data = options.data || {};
    const hasInput = Object.values(data).some(hasMeaningfulValue);
    if (!hasInput) return;

    const timer = window.setTimeout(() => {
      const payload = {
        leadId: leadIdRef.current || undefined,
        customerName: options.customerName || '',
        mobile: options.mobile || '',
        email: options.email || '',
        instagramId: options.instagramId || '',
        dob: options.dob || '',
        quantity: options.quantity || 1,
        source: options.source,
        status: 'IN_PROGRESS',
        data,
      };

      fetch('/api/leads/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    }, 700);

    return () => window.clearTimeout(timer);
  }, [
    options.source,
    options.customerName,
    options.mobile,
    options.email,
    options.instagramId,
    options.dob,
    options.quantity,
    JSON.stringify(options.data),
  ]);

  useEffect(() => {
    const flush = () => {
      const data = options.data || {};
      if (!Object.values(data).some(hasMeaningfulValue)) return;
      fetch('/api/leads/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: leadIdRef.current || undefined,
          customerName: options.customerName || '',
          mobile: options.mobile || '',
          email: options.email || '',
          instagramId: options.instagramId || '',
          dob: options.dob || '',
          quantity: options.quantity || 1,
          source: options.source,
          status: 'ABANDONED',
          data,
        }),
        keepalive: true,
      }).catch(() => {});
    };
    window.addEventListener('pagehide', flush);
    return () => window.removeEventListener('pagehide', flush);
  }, [options.source, JSON.stringify(options.data), options.customerName, options.mobile, options.email, options.instagramId, options.dob, options.quantity]);
}
