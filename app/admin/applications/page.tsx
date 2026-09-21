'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText, Search, Filter, Tag, MessageSquare, Phone, Mail,
  ExternalLink, Eye, CheckCircle2, ShieldCheck, ArrowLeft, Loader2, Award
} from 'lucide-react';

export default function ApplicationsManagerPage() {
  const [appType, setAppType] = useState<'performer' | 'guest' | 'sponsor' | 'event'>('performer');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<any[]>([]);

  // Selected Item Modal
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [newStatus, setNewStatus] = useState('');
  const [newTags, setNewTags] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    fetchApplications();
  }, [appType, statusFilter]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        type: appType,
        search,
        status: statusFilter,
      });

      const res = await fetch(`/api/admin/applications?${query.toString()}`);
      const data = await res.json();
      if (data.success) {
        setItems(data.items);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item: any) => {
    setSelectedItem(item);
    setNewStatus(item.status);
    setNewTags(item.tags || '');
    setIsFeatured(Boolean(item.is_featured));
    setNoteText('');
  };

  const handleUpdate = async () => {
    if (!selectedItem) return;

    try {
      const res = await fetch('/api/admin/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: appType,
          appId: selectedItem.app_id,
          status: newStatus,
          tags: newTags,
          isFeatured,
          note: noteText,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Update failed');

      alert('Application updated successfully!');
      setSelectedItem(null);
      fetchApplications();
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
          <h1 className="text-3xl font-black text-white">Application Manager</h1>
        </div>

        {/* Tab Stream Selectors */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold">
          {[
            { id: 'performer', label: 'Performers' },
            { id: 'guest', label: 'Guests' },
            { id: 'sponsor', label: 'Sponsors' },
            { id: 'event', label: 'Show Bookings' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setAppType(tab.id as any); setStatusFilter(''); }}
              className={`px-4 py-2 rounded-xl transition-all ${
                appType === tab.id ? 'bg-amber-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Controls */}
      <div className="glass-panel p-4 rounded-2xl border border-amber-500/20 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchApplications()}
            placeholder="Search by name, email, App ID, city..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-semibold focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="SUBMITTED">SUBMITTED</option>
          <option value="UNDER REVIEW">UNDER REVIEW</option>
          <option value="SHORTLISTED">SHORTLISTED</option>
          <option value="INTERVIEW / AUDITION">INTERVIEW / AUDITION</option>
          <option value="APPROVED">APPROVED</option>
          <option value="REJECTED">REJECTED</option>
          <option value="ON HOLD">ON HOLD</option>
        </select>
      </div>

      {/* Table List */}
      <div className="glass-panel rounded-3xl border border-amber-500/30 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-amber-400 mx-auto mb-2" /> Loading applications...
          </div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-sm">No applications found matching criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-amber-400 font-extrabold uppercase border-b border-slate-800">
                <tr>
                  <th className="p-4">App ID</th>
                  <th className="p-4">Applicant / Name</th>
                  <th className="p-4">Category / Talent</th>
                  <th className="p-4">City</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Quick Communication</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {items.map((item) => {
                  const phoneNum = (item.whatsapp || item.phone || '').replace(/[^0-9]/g, '');
                  return (
                    <tr key={item.app_id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="p-4 font-mono font-bold text-amber-300">{item.app_id}</td>
                      <td className="p-4">
                        <div className="font-bold text-white text-sm">{item.full_name || item.company_name || item.org_name}</div>
                        <div className="text-[11px] text-slate-400">{item.email || item.biz_email}</div>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-white">{item.talent_category || item.category || item.sponsorship_type || item.event_type}</span>
                        {item.primary_talent && <div className="text-[10px] text-slate-400">{item.primary_talent}</div>}
                      </td>
                      <td className="p-4 text-slate-300">{item.city}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${item.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {/* Quick WhatsApp Action */}
                          {phoneNum && (
                            <a
                              href={`https://wa.me/${phoneNum}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-black font-bold text-[10px] flex items-center gap-1"
                            >
                              <Phone className="w-3 h-3" /> WhatsApp
                            </a>
                          )}
                          {/* Email Action */}
                          {(item.email || item.biz_email) && (
                            <a
                              href={`mailto:${item.email || item.biz_email}`}
                              className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white font-bold text-[10px] flex items-center gap-1"
                            >
                              <Mail className="w-3 h-3" /> Email
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="px-3 py-1.5 rounded-xl bg-amber-500 text-black font-extrabold text-xs inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> Manage
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MANAGE APPLICATION MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl border border-amber-500/40 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase font-mono">{selectedItem.app_id}</span>
                <h3 className="text-xl font-black text-white">{selectedItem.full_name || selectedItem.company_name || selectedItem.org_name}</h3>
              </div>
              <button onClick={() => setSelectedItem(null)} className="text-slate-400 hover:text-white font-bold text-lg">✕</button>
            </div>

            {/* Profile Overview */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
              <div><span className="text-slate-400 block">Email:</span> <strong className="text-white">{selectedItem.email || selectedItem.biz_email}</strong></div>
              <div><span className="text-slate-400 block">WhatsApp:</span> <strong className="text-white">{selectedItem.whatsapp}</strong></div>
              <div><span className="text-slate-400 block">City:</span> <strong className="text-white">{selectedItem.city}</strong></div>
              <div><span className="text-slate-400 block">Category:</span> <strong className="text-amber-400">{selectedItem.talent_category || selectedItem.sponsorship_type || selectedItem.category}</strong></div>
            </div>

            {/* Submissions & Docs */}
            {(selectedItem.doc_url || selectedItem.profile_photo_url || selectedItem.press_kit_url || selectedItem.brand_deck_url) && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-amber-400 uppercase">Uploaded Files</h4>
                <div className="flex flex-wrap gap-2 text-xs">
                  {selectedItem.profile_photo_url && (
                    <a href={selectedItem.profile_photo_url} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-xl bg-slate-800 text-amber-300 underline flex items-center gap-1">
                      <ExternalLink className="w-3.5 h-3.5" /> View Photo
                    </a>
                  )}
                  {selectedItem.doc_url && (
                    <a href={selectedItem.doc_url} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-xl bg-slate-800 text-amber-300 underline flex items-center gap-1">
                      <ExternalLink className="w-3.5 h-3.5" /> View Confidential ID / Doc
                    </a>
                  )}
                  {selectedItem.press_kit_url && (
                    <a href={selectedItem.press_kit_url} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-xl bg-slate-800 text-amber-300 underline flex items-center gap-1">
                      <ExternalLink className="w-3.5 h-3.5" /> View Press Kit
                    </a>
                  )}
                  {selectedItem.brand_deck_url && (
                    <a href={selectedItem.brand_deck_url} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-xl bg-slate-800 text-amber-300 underline flex items-center gap-1">
                      <ExternalLink className="w-3.5 h-3.5" /> View Brand Deck
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Status Change & Tagging Form */}
            <div className="space-y-4 pt-4 border-t border-slate-800 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Update Application Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold"
                >
                  <option value="SUBMITTED">SUBMITTED</option>
                  <option value="UNDER REVIEW">UNDER REVIEW</option>
                  <option value="SHORTLISTED">SHORTLISTED</option>
                  <option value="INTERVIEW / AUDITION">INTERVIEW / AUDITION</option>
                  <option value="APPROVED">APPROVED (Featured on Site)</option>
                  <option value="REJECTED">REJECTED</option>
                  <option value="ON HOLD">ON HOLD</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Internal Tags (Comma Separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="VIP, Urgent, High Priority, Shortlisted"
                  className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer font-bold text-amber-400">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 accent-amber-500"
                />
                <span>Feature on Homepage Spotlight Grid</span>
              </label>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Add Internal Admin Note</label>
                <textarea
                  rows={2}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Notes regarding audition schedule, call logs..."
                  className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button onClick={() => setSelectedItem(null)} className="px-5 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs">
                Cancel
              </button>
              <button onClick={handleUpdate} className="px-6 py-2.5 rounded-xl bg-amber-500 text-black font-extrabold text-xs">
                SAVE CHANGES
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
