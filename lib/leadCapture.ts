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
  if (value === null || value === undefined || typeof value === 'boolean' || typeof value === 'number') return false;
  if (Array.isArray(value)) return value.some(hasMeaningfulValue);
  if (typeof value === 'object') return Object.values(value).some(hasMeaningfulValue);
  return String(value).trim().length > 0;
}

function hasUserEnteredData(data: Record<string, any>): boolean {
  const ignored = new Set(['duration', 'budget', 'termsAccepted']);
  return Object.entries(data).some(([key, value]) => !ignored.has(key) && hasMeaningfulValue(value));
}

export function useLeadCapture(options: LeadCaptureOptions) {
  // A unique ID per mounted application form prevents different applicants in the same tab
  // from overwriting each other's leads.
  const leadIdRef = useRef<string>('');
  if (!leadIdRef.current && typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    leadIdRef.current = `lead_session_${crypto.randomUUID()}`;
  }

  const latestRef = useRef(options);
  latestRef.current = options;

  useEffect(() => {
    const saveLead = (status: 'IN_PROGRESS' | 'ABANDONED') => {
      const current = latestRef.current;
      const data = current.data || {};
      if (!hasUserEnteredData(data)) return;
      const payload = {
        leadId: leadIdRef.current || undefined,
        customerName: current.customerName || '',
        mobile: current.mobile || '',
        email: current.email || '',
        instagramId: current.instagramId || '',
        dob: current.dob || '',
        quantity: current.quantity || 1,
        source: current.source,
        status,
        data,
      };
      return fetch('/api/leads/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch((error) => {
        console.error('Could not save application lead:', error);
      });
    };

    const timer = window.setTimeout(() => { void saveLead('IN_PROGRESS'); }, 350);
    const flush = () => { void saveLead('ABANDONED'); };
    window.addEventListener('pagehide', flush);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('pagehide', flush);
    };
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
}
