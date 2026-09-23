'use client';

import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet, Folder, Download, Check, AlertCircle, Search,
  RefreshCw, CheckCircle2, Eye, ExternalLink, Filter, ChevronRight, Phone, MessageSquare
} from 'lucide-react';

interface SheetFolder {
  id: 'performersPaid' | 'sponsors' | 'panel' | 'team' | 'orders';
  type: string;
  name: string;
  s3Path: string;
  s3Url: string;
  badge: string;
}

const FOLDERS: SheetFolder[] = [
  {
    id: 'performersPaid',
    type: 'performer',
    name: 'Paid Performers (₹199 Paid)',
    s3Path: 'performers/paid/',
    s3Url: 'https://br-shy-meadow-b5n9zrpd.storage.c-7.us-east-2.aws.neon.tech/gorakhpur-got-latent/sheets/performers/paid_performers.csv',
    badge: '₹199 PAID AUDITIONS'
  },
  {
    id: 'sponsors',
    type: 'sponsor',
    name: 'Brand Sponsors & Partners',
    s3Path: 'sponsors/',
    s3Url: 'https://br-shy-meadow-b5n9zrpd.storage.c-7.us-east-2.aws.neon.tech/gorakhpur-got-latent/sheets/sponsors/sponsors.csv',
    badge: 'SPONSOR LEADS'
  },
  {
    id: 'panel',
    type: 'guest',
    name: 'Judges & VIP Panel',
    s3Path: 'panel/',
    s3Url: 'https://br-shy-meadow-b5n9zrpd.storage.c-7.us-east-2.aws.neon.tech/gorakhpur-got-latent/sheets/panel/panel_guests.csv',
    badge: 'CELEBRITY / GUEST'
  },
  {
    id: 'team',
    type: 'team',
    name: 'Join Team / Volunteers',
    s3Path: 'team/',
    s3Url: 'https://br-shy-meadow-b5n9zrpd.storage.c-7.us-east-2.aws.neon.tech/gorakhpur-got-latent/sheets/team/team_applications.csv',
    badge: 'CREW APPLICANTS'
  },
  {
    id: 'orders',
    type: 'order',
    name: 'Ticket Sales & Orders',
    s3Path: 'orders/',
    s3Url: 'https://br-shy-meadow-b5n9zrpd.storage.c-7.us-east-2.aws.neon.tech/gorakhpur-got-latent/sheets/orders/ticket_orders.csv',
    badge: 'TICKET BUYERS'
  }
];

export default function MalikExcelSheets() {
  const [activeFolder, setActiveFolder] = useState<SheetFolder>(FOLDERS[0]);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchItems = async (folder = activeFolder) => {
    setLoading(true);
    try {
      if (folder.id === 'orders') {
        const res = await fetch('/api/malik/orders?limit=100');
        const data = await res.json();
        if (data.success) {
          setItems(data.orders || []);
        }
      } else {
        const res = await fetch(`/api/malik/applications?type=${folder.type}`);
        const data = await res.json();
        if (data.success) {
          let list = data.items || [];
          if (folder.id === 'performersPaid') {
            // Filter only paid performers
            list = list.filter((p: any) => p.payment_status === 'PAID' || p.payment_status === 'PAYMENT_VERIFIED');
          }
          setItems(list);
        }
      }
    } catch (err) {
      console.error('Error fetching sheet items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(activeFolder);
  }, [activeFolder.id]);

  const handleToggleRead = async (item: any) => {
    const itemId = item.app_id || item.order_number || item.id;
    const currentRead = Number(item.is_read) === 1;
    const nextRead = !currentRead;

    setTogglingId(itemId);
    // Optimistic UI update
    setItems(prev => prev.map(i => {
      const id = i.app_id || i.order_number || i.id;
      if (id === itemId) {
        return { ...i, is_read: nextRead ? 1 : 0 };
      }
      return i;
    }));

    try {
      const res = await fetch('/api/malik/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: activeFolder.type,
          id: itemId,
          isRead: nextRead
        })
      });
      const data = await res.json();
      if (!data.success) {
        // Revert on error
        setItems(prev => prev.map(i => {
          const id = i.app_id || i.order_number || i.id;
          if (id === itemId) {
            return { ...i, is_read: currentRead ? 1 : 0 };
          }
          return i;
        }));
      }
    } catch (err) {
      console.error('Error marking as read:', err);
    } finally {
      setTogglingId(null);
    }
  };

  const filteredItems = items.filter(item => {
    if (!search.trim()) return true;
    const query = search.toLowerCase();
    const name = (item.full_name || item.company_name || item.customer_name || '').toLowerCase();
    const contact = (item.mobile_number || item.whatsapp_number || item.whatsapp || item.customer_phone || '').toLowerCase();
    const email = (item.email || item.biz_email || item.customer_email || '').toLowerCase();
    const id = (item.app_id || item.order_number || '').toLowerCase();
    return name.includes(query) || contact.includes(query) || email.includes(query) || id.includes(query);
  });

  const unreadCount = filteredItems.filter(i => Number(i.is_read) !== 1).length;
  const readCount = filteredItems.filter(i => Number(i.is_read) === 1).length;

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 space-y-6 shadow-2xl">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <FileSpreadsheet className="w-6 h-6" />
            </span>
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                Neon Cloud Folders & Live Interactive Excel Sheets
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time synchronized records with interactive <strong className="text-emerald-400">Mark as Read (Green)</strong> and <strong className="text-red-400">Unread (Red)</strong> status.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-black flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
            <span>{unreadCount} NEW / UNREAD</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-black flex items-center gap-1.5 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{readCount} NOTED / READ</span>
          </div>
          <a
            href={activeFolder.s3Url}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs flex items-center gap-2 shadow-md transition-all shrink-0"
          >
            <Download className="w-4 h-4" /> Download S3 CSV
          </a>
        </div>
      </div>

      {/* 5 FOLDER TABS (Neon S3 Folders) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/5">
        {FOLDERS.map(f => {
          const isActive = f.id === activeFolder.id;
          return (
            <button
              key={f.id}
              onClick={() => {
                setActiveFolder(f);
                setSearch('');
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20 scale-[1.02]'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              <Folder className={`w-4 h-4 ${isActive ? 'fill-black' : 'text-amber-400'}`} />
              <span>{f.name}</span>
            </button>
          );
        })}
      </div>

      {/* Toolbar: Search, S3 Path info, Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-black/40 p-3.5 rounded-2xl border border-white/10">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, mobile number, city, or ID..."
            className="w-full bg-transparent text-xs text-white placeholder:text-slate-500 focus:outline-none"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-xs text-slate-500 hover:text-white">
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-400">
          <span className="font-mono text-[11px]">
            S3 Folder: <strong className="text-amber-400">{activeFolder.s3Path}</strong>
          </span>
          <button
            onClick={() => fetchItems(activeFolder)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
            title="Refresh Table"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* INTERACTIVE EXCEL SPREADSHEET TABLE */}
      <div className="overflow-x-auto rounded-2xl border border-white/10 shadow-inner">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#0b0e18] text-slate-400 font-black uppercase tracking-wider border-b border-white/10 text-[11px]">
              <th className="py-3.5 px-4 w-36">Action / Status</th>
              <th className="py-3.5 px-4">ID</th>
              <th className="py-3.5 px-4">Name / Title</th>
              <th className="py-3.5 px-4">Contact (Mobile / WhatsApp)</th>
              {activeFolder.id === 'performersPaid' && (
                <>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">City</th>
                  <th className="py-3.5 px-4">Payment Info</th>
                </>
              )}
              {activeFolder.id === 'sponsors' && (
                <>
                  <th className="py-3.5 px-4">Contact Person</th>
                  <th className="py-3.5 px-4">Sponsorship Type</th>
                  <th className="py-3.5 px-4">Budget</th>
                </>
              )}
              {activeFolder.id === 'panel' && (
                <>
                  <th className="py-3.5 px-4">Stage Name</th>
                  <th className="py-3.5 px-4">Profession / Category</th>
                  <th className="py-3.5 px-4">City</th>
                </>
              )}
              {activeFolder.id === 'team' && (
                <>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Address</th>
                  <th className="py-3.5 px-4">About / Skills</th>
                </>
              )}
              {activeFolder.id === 'orders' && (
                <>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Razorpay Payment ID</th>
                  <th className="py-3.5 px-4">Status</th>
                </>
              )}
              <th className="py-3.5 px-4 text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin text-amber-400" />
                    <span>Loading spreadsheet rows from Neon...</span>
                  </div>
                </td>
              </tr>
            ) : filteredItems.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500">
                  No records found in folder <strong className="text-amber-400">{activeFolder.s3Path}</strong>
                </td>
              </tr>
            ) : (
              filteredItems.map((item, idx) => {
                const isRead = Number(item.is_read) === 1;
                const itemId = item.app_id || item.order_number || item.id;
                const contactNumber = item.whatsapp_number || item.mobile_number || item.whatsapp || item.customer_phone || '';

                return (
                  <tr
                    key={itemId || idx}
                    className={`transition-all duration-200 border-l-4 ${
                      isRead
                        ? 'bg-emerald-950/25 hover:bg-emerald-950/40 border-l-emerald-500 text-emerald-100'
                        : 'bg-red-950/25 hover:bg-red-950/40 border-l-red-500 text-red-100'
                    }`}
                  >
                    {/* Mark As Read Checkbox & Toggle */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleRead(item)}
                        disabled={togglingId === itemId}
                        className={`px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm ${
                          isRead
                            ? 'bg-emerald-500 text-black hover:bg-emerald-400'
                            : 'bg-red-600 text-white hover:bg-red-500 animate-pulse'
                        }`}
                        title={isRead ? 'Click to mark as Unread' : 'Click to mark as Read'}
                      >
                        {isRead ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>NOTED ✓</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>MARK READ</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* ID */}
                    <td className="py-3 px-4 font-mono font-bold text-amber-400">
                      {item.app_id || item.order_number || item.id}
                    </td>

                    {/* Name */}
                    <td className="py-3 px-4">
                      <div className="font-black text-white text-sm">
                        {item.full_name || item.company_name || item.customer_name || 'N/A'}
                      </div>
                      {item.email && <div className="text-[10px] text-slate-400 truncate max-w-[180px]">{item.email}</div>}
                    </td>

                    {/* Contact with WhatsApp Link */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-white font-bold">{contactNumber || 'N/A'}</span>
                        {contactNumber && (
                          <a
                            href={`https://wa.me/${contactNumber.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 transition-colors"
                            title="Chat on WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Category Specific Columns */}
                    {activeFolder.id === 'performersPaid' && (
                      <>
                        <td className="py-3 px-4 font-semibold text-amber-300">{item.performance_category}</td>
                        <td className="py-3 px-4 text-slate-300">{item.city}</td>
                        <td className="py-3 px-4 font-mono text-[11px]">
                          <span className="text-emerald-400 font-bold">₹{item.payment_amount || '199'} PAID</span>
                          <span className="block text-[9px] text-slate-400 truncate max-w-[120px]">
                            {item.payment_id || 'RZP'}
                          </span>
                        </td>
                      </>
                    )}

                    {activeFolder.id === 'sponsors' && (
                      <>
                        <td className="py-3 px-4 text-slate-300">{item.contact_person}</td>
                        <td className="py-3 px-4 font-semibold text-amber-300">{item.sponsorship_type}</td>
                        <td className="py-3 px-4 font-mono text-emerald-400">{item.budget_est}</td>
                      </>
                    )}

                    {activeFolder.id === 'panel' && (
                      <>
                        <td className="py-3 px-4 text-slate-300">{item.stage_name || '—'}</td>
                        <td className="py-3 px-4 font-semibold text-amber-300">{item.category || item.profession}</td>
                        <td className="py-3 px-4 text-slate-300">{item.city}</td>
                      </>
                    )}

                    {activeFolder.id === 'team' && (
                      <>
                        <td className="py-3 px-4 text-slate-300">{item.email}</td>
                        <td className="py-3 px-4 text-slate-300 max-w-[150px] truncate">{item.address}</td>
                        <td className="py-3 px-4 text-slate-300 max-w-[150px] truncate">{item.about || 'Crew volunteer'}</td>
                      </>
                    )}

                    {activeFolder.id === 'orders' && (
                      <>
                        <td className="py-3 px-4 font-mono font-black text-emerald-400">₹{item.total_amount}</td>
                        <td className="py-3 px-4 font-mono text-slate-300">{item.razorpay_payment_id || 'PENDING'}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.payment_status === 'PAID' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            {item.payment_status}
                          </span>
                        </td>
                      </>
                    )}

                    {/* Date */}
                    <td className="py-3 px-4 text-right font-mono text-[10px] text-slate-400 whitespace-nowrap">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 pt-2 gap-2 border-t border-white/5">
        <span>Showing {filteredItems.length} rows in folder {activeFolder.s3Path}</span>
        <span>Green = Read / Noted & Checked • Red = New / Unread Applicant</span>
      </div>
    </div>
  );
}
