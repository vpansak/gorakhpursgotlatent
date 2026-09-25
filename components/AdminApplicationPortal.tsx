'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  FileSpreadsheet, Download, RefreshCw, Search, Phone, MessageSquare,
  Eye, CheckCircle2, ShieldCheck, UserCheck, Users, Briefcase, Award,
  ExternalLink, Filter, Sparkles, Check, ChevronRight, X, Clock, HelpCircle,
  FileText, Sliders, Calculator, Copy, Mail, RotateCcw, CreditCard, CheckCheck, Trash2
} from 'lucide-react';
import { downloadCategoryExcel, downloadMasterExcel } from '@/lib/excel-export';

interface AdminApplicationPortalProps {
  session: {
    full_name: string;
    role: string;
    email?: string;
  };
  initialData: {
    performers: any[];
    sponsors: any[];
    team: any[];
    guests: any[];
  };
}

type TabType = 'performer' | 'sponsor' | 'team' | 'guest' | 'computerji';

export default function AdminApplicationPortal({ session, initialData }: AdminApplicationPortalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('performer');
  const [data, setData] = useState(initialData);
  const [computerJiScores, setComputerJiScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [readFilter, setReadFilter] = useState<'ALL' | 'UNREAD' | 'READ'>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [refunding, setRefunding] = useState(false);

  // Modal State
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [noteText, setNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [exportingMaster, setExportingMaster] = useState(false);

  // Fetch Computer Ji scores from API (with 10-day TTL auto-cleanup)
  const fetchComputerJiScores = async () => {
    try {
      const res = await fetch('/api/computerji/scores');
      const json = await res.json();
      if (json.success && json.data) {
        setComputerJiScores(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch computerji scores:', err);
    }
  };

  useEffect(() => {
    fetchComputerJiScores();
  }, []);

  // Fetch updated data from API
  const refreshAllData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/malik/applications?type=all');
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      }
      await fetchComputerJiScores();
    } catch (err) {
      console.error('Failed to refresh applications:', err);
    } finally {
      setLoading(false);
    }
  };

  // Delete single computerji score record
  const handleDeleteComputerJiScore = async (contestantId: number) => {
    if (!confirm(`Kya aap Contestant #${contestantId} ka score record delete karna chahte hain?`)) return;
    try {
      const res = await fetch(`/api/computerji/scores?id=${contestantId}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setComputerJiScores((prev) => prev.filter((it) => it.contestant_id !== contestantId));
      }
    } catch (err) {
      console.error('Failed to delete computerji score:', err);
    }
  };

  // Toggle Read / Unread Status (Unread on top, Read on bottom)
  const handleToggleRead = async (item: any) => {
    const newReadState = !item.is_read;
    const appId = item.app_id || item.id;

    // Optimistically update local state so row instantly moves
    setData((prev) => {
      const listKey = activeTab === 'performer' ? 'performers' : activeTab === 'sponsor' ? 'sponsors' : activeTab === 'team' ? 'team' : 'guests';
      const updated = ((prev as any)[listKey] || []).map((it: any) => {
        if ((it.app_id || it.id) === appId) {
          return {
            ...it,
            is_read: newReadState ? 1 : 0,
            read_at: newReadState ? new Date().toISOString() : null,
          };
        }
        return it;
      });
      return { ...prev, [listKey]: updated };
    });

    if (selectedItem && (selectedItem.app_id || selectedItem.id) === appId) {
      setSelectedItem((prev: any) => (prev ? { ...prev, is_read: newReadState ? 1 : 0 } : null));
    }

    try {
      await fetch('/api/malik/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: activeTab,
          id: appId,
          isRead: newReadState,
        }),
      });
    } catch (err) {
      console.error('Failed to update read status:', err);
    }
  };

  // Permanently Delete Application (Performer, Sponsor, Team, Guest)
  const handleDeleteApplication = async (item: any) => {
    const appId = item.app_id || item.id;
    const name = item.full_name || item.company_name || item.stage_name || appId;
    if (!confirm(`Kya aap ${name} (${appId}) ki application permanently DELETE karna chahte hain?`)) return;

    try {
      const res = await fetch(`/api/malik/applications?type=${activeTab}&appId=${encodeURIComponent(appId)}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        setData((prev) => {
          const listKey = activeTab === 'performer' ? 'performers' : activeTab === 'sponsor' ? 'sponsors' : activeTab === 'team' ? 'team' : 'guests';
          const updated = ((prev as any)[listKey] || []).filter((it: any) => (it.app_id || it.id) !== appId);
          return { ...prev, [listKey]: updated };
        });
        if (selectedItem && (selectedItem.app_id || selectedItem.id) === appId) {
          setSelectedItem(null);
        }
      } else {
        alert(json.error || 'Failed to delete application');
      }
    } catch (err: any) {
      console.error('Delete error:', err);
      alert(`Error deleting application: ${err.message}`);
    }
  };

  // Copy Razorpay Payment ID to clipboard
  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Process Razorpay Refund
  const handleProcessRefund = async (appId: string, applicantName: string) => {
    const reason = prompt(
      `Razorpay Refund initiate karein ${applicantName} (${appId}) ke liye?\nReason enter karein (e.g. Episode 1 full / audition slot not available):`,
      'Performer slots full refund'
    );
    if (!reason) return;

    setRefunding(true);
    try {
      const res = await fetch('/api/malik/applications/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appId, refundReason: reason }),
      });
      const resData = await res.json();
      if (res.ok && resData.success) {
        alert(`✅ Refund Successful! Razorpay Refund ID: ${resData.refundId}`);
        refreshAllData();
        if (selectedItem && selectedItem.app_id === appId) {
          setSelectedItem((prev: any) =>
            prev
              ? {
                  ...prev,
                  status: 'REFUNDED',
                  payment_status: 'REFUNDED',
                  application_status: 'REFUNDED',
                  refund_id: resData.refundId,
                }
              : null
          );
        }
      } else {
        alert(`❌ Refund Failed: ${resData.error || 'Server error'}`);
      }
    } catch (err: any) {
      alert(`Error processing refund: ${err.message}`);
    } finally {
      setRefunding(false);
    }
  };

  // Get current list
  const currentList = useMemo(() => {
    if (activeTab === 'performer') return data.performers || [];
    if (activeTab === 'sponsor') return data.sponsors || [];
    if (activeTab === 'team') return data.team || [];
    if (activeTab === 'guest') return data.guests || [];
    if (activeTab === 'computerji') return computerJiScores || [];
    return [];
  }, [activeTab, data, computerJiScores]);

  // Filter & Sort items: Unread at TOP (is_read = 0), Read at BOTTOM (is_read = 1)
  const filteredItems = useMemo(() => {
    const list = currentList.filter((item) => {
      // Computer Ji custom search
      if (activeTab === 'computerji') {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        const name = (item.contestant_name || '').toLowerCase();
        const contact = (item.phone || '').toLowerCase();
        const cat = (item.category || '').toLowerCase();
        const idStr = String(item.contestant_id || '');
        const resStr = (item.result || '').toLowerCase();
        return name.includes(q) || contact.includes(q) || cat.includes(q) || idStr.includes(q) || resStr.includes(q);
      }

      // Read filter
      if (readFilter === 'UNREAD') {
        if (item.is_read) return false;
      } else if (readFilter === 'READ') {
        if (!item.is_read) return false;
      }

      // Status filter
      if (statusFilter !== 'ALL') {
        const itemStatus = item.application_status || item.payment_status || item.status || '';
        if (itemStatus !== statusFilter) return false;
      }

      // Search query (Email, Name, Phone, App ID, Razorpay ID)
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const email = (item.email || item.biz_email || '').toLowerCase();
        const name = (item.full_name || item.company_name || item.stage_name || '').toLowerCase();
        const contact = (item.mobile_number || item.whatsapp_number || item.whatsapp || item.phone || '').toLowerCase();
        const city = (item.city || item.location || item.address || '').toLowerCase();
        const appId = (item.app_id || item.id || '').toLowerCase();
        const paymentId = (item.payment_id || item.razorpay_payment_id || '').toLowerCase();
        const orderId = (item.order_id || item.razorpay_order_id || '').toLowerCase();
        const category = (item.performance_category || item.category || item.industry || item.sponsorship_type || '').toLowerCase();

        return (
          email.includes(q) ||
          name.includes(q) ||
          contact.includes(q) ||
          city.includes(q) ||
          appId.includes(q) ||
          paymentId.includes(q) ||
          orderId.includes(q) ||
          category.includes(q)
        );
      }

      return true;
    });

    if (activeTab === 'computerji') return list;

    // CRITICAL SORT: Unread (is_read=0 or null) on TOP, Read (is_read=1) on BOTTOM, then newest created_at
    return [...list].sort((a, b) => {
      const aRead = a.is_read ? 1 : 0;
      const bRead = b.is_read ? 1 : 0;
      if (aRead !== bRead) {
        return aRead - bRead; // 0 before 1
      }
      const aTime = new Date(a.created_at || 0).getTime();
      const bTime = new Date(b.created_at || 0).getTime();
      return bTime - aTime;
    });
  }, [currentList, activeTab, statusFilter, readFilter, search]);

  // Counts
  const unreadCount = useMemo(() => {
    return currentList.filter((item) => !item.is_read).length;
  }, [currentList]);

  const readCount = useMemo(() => {
    return currentList.filter((item) => Boolean(item.is_read)).length;
  }, [currentList]);

  // Single Category Excel Download
  const handleDownloadExcel = () => {
    downloadCategoryExcel(filteredItems, activeTab);
  };

  // Master Workbook Download (All 4 sheets)
  const handleDownloadMaster = async () => {
    setExportingMaster(true);
    try {
      downloadMasterExcel(data);
    } catch (err) {
      console.error('Master export error:', err);
    } finally {
      setExportingMaster(false);
    }
  };

  // Open modal
  const handleOpenItem = (item: any) => {
    setSelectedItem(item);
    setNewStatus(item.application_status || item.status || 'UNDER_REVIEW');
    setNoteText('');
    setSaveSuccess(false);
  };

  // Save Status & Note
  const handleSaveStatus = async () => {
    if (!selectedItem) return;
    setSavingNote(true);
    try {
      const res = await fetch('/api/malik/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: activeTab,
          appId: selectedItem.app_id,
          status: newStatus,
          note: noteText || undefined,
        }),
      });
      const resData = await res.json();
      if (resData.success) {
        setSaveSuccess(true);
        // Update local state
        setData((prev) => {
          const listKey = activeTab === 'performer' ? 'performers' : activeTab === 'sponsor' ? 'sponsors' : activeTab === 'team' ? 'team' : 'guests';
          const updated = ((prev as any)[listKey] || []).map((it: any) => {
            if (it.app_id === selectedItem.app_id) {
              return { ...it, status: newStatus, application_status: newStatus };
            }
            return it;
          });
          return { ...prev, [listKey]: updated };
        });
        setTimeout(() => setSaveSuccess(false), 2500);
      } else {
        alert(resData.error || 'Failed to update status');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating application status');
    } finally {
      setSavingNote(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* PERMANENT ARCHIVE ASSURANCE BANNER */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-amber-950/30 border border-emerald-500/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <span>Neon Cloud Permanent Data Archive Active</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-bold uppercase">
                100% Secure & Permanent
              </span>
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Sabhi performer, sponsor, team aur judge applications Neon PostgreSQL database me permanently saved hain. Koi bhi data delete nahi kiya jayega.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleDownloadMaster}
            disabled={exportingMaster}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            title="Download all 4 application categories in 1 complete Excel workbook"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>{exportingMaster ? 'Generating...' : 'Master Excel Sheet (.xlsx)'}</span>
          </button>

          <button
            onClick={refreshAllData}
            disabled={loading}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
            title="Refresh latest applications"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* 5 CORE CATEGORY STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Performers */}
        <button
          onClick={() => { setActiveTab('performer'); setStatusFilter('ALL'); setReadFilter('ALL'); setSearch(''); }}
          className={`p-4 rounded-2xl text-left transition-all cursor-pointer border ${
            activeTab === 'performer'
              ? 'bg-amber-500/15 border-amber-500 shadow-lg shadow-amber-500/10'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">1. PERFORMERS</span>
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">{data.performers?.length || 0}</div>
          <p className="text-[10px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> 100% Paid Auditions (₹199)
          </p>
        </button>

        {/* Sponsors */}
        <button
          onClick={() => { setActiveTab('sponsor'); setStatusFilter('ALL'); setReadFilter('ALL'); setSearch(''); }}
          className={`p-4 rounded-2xl text-left transition-all cursor-pointer border ${
            activeTab === 'sponsor'
              ? 'bg-blue-500/15 border-blue-500 shadow-lg shadow-blue-500/10'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">2. SPONSORS</span>
            <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-300">
              <Briefcase className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">{data.sponsors?.length || 0}</div>
          <p className="text-[10px] text-slate-400 mt-1">Brand & Partner Inquiries</p>
        </button>

        {/* Join Team */}
        <button
          onClick={() => { setActiveTab('team'); setStatusFilter('ALL'); setReadFilter('ALL'); setSearch(''); }}
          className={`p-4 rounded-2xl text-left transition-all cursor-pointer border ${
            activeTab === 'team'
              ? 'bg-purple-500/15 border-purple-500 shadow-lg shadow-purple-500/10'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">3. JOIN TEAM</span>
            <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">{data.team?.length || 0}</div>
          <p className="text-[10px] text-slate-400 mt-1">Crew & Volunteer Applicants</p>
        </button>

        {/* Judges / VIPs */}
        <button
          onClick={() => { setActiveTab('guest'); setStatusFilter('ALL'); setReadFilter('ALL'); setSearch(''); }}
          className={`p-4 rounded-2xl text-left transition-all cursor-pointer border ${
            activeTab === 'guest'
              ? 'bg-emerald-500/15 border-emerald-500 shadow-lg shadow-emerald-500/10'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">4. JUDGES & VIPS</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">{data.guests?.length || 0}</div>
          <p className="text-[10px] text-slate-400 mt-1">Guest & Panel Nominations</p>
        </button>

        {/* Computer Ji Live Scores */}
        <button
          onClick={() => { setActiveTab('computerji'); setStatusFilter('ALL'); setReadFilter('ALL'); setSearch(''); }}
          className={`p-4 rounded-2xl text-left transition-all cursor-pointer border ${
            activeTab === 'computerji'
              ? 'bg-amber-500/20 border-amber-400 shadow-lg shadow-amber-500/15'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">5. COMPUTER JI</span>
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
              <Sliders className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">{computerJiScores.length}</div>
          <p className="text-[10px] text-amber-400 font-semibold mt-1">Live Scores (10-Day Retention)</p>
        </button>
      </div>

      {/* MAIN APPLICATION CONSOLE */}
      <div className="glass-panel p-5 sm:p-7 rounded-3xl border border-white/10 space-y-5">
        {/* TABS HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: 'performer', label: '🎤 Performers (कलाकार - Paid)', count: data.performers?.length || 0 },
              { id: 'sponsor', label: '🤝 Sponsors (स्पॉन्सर)', count: data.sponsors?.length || 0 },
              { id: 'team', label: '👥 Join Team (टीम सदस्य)', count: data.team?.length || 0 },
              { id: 'guest', label: '⚖️ Judges & VIPs (जज / पैनल)', count: data.guests?.length || 0 },
              { id: 'computerji', label: '💻 Computer Ji Scores (10-दिन डेटा)', count: computerJiScores.length },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as TabType);
                    setStatusFilter('ALL');
                    setReadFilter('ALL');
                    setSearch('');
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20 scale-[1.02]'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/5'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                    isActive ? 'bg-black text-amber-400 font-extrabold' : 'bg-white/10 text-slate-300'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* SINGLE CATEGORY EXCEL DOWNLOAD BUTTON */}
          <button
            onClick={handleDownloadExcel}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs flex items-center gap-2 shadow-md transition-all shrink-0 cursor-pointer self-start md:self-auto"
            title={`Download ${activeTab.toUpperCase()} applications directly as Microsoft Excel (.xlsx)`}
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>Download {activeTab === 'performer' ? 'Performers' : activeTab === 'sponsor' ? 'Sponsors' : activeTab === 'team' ? 'Team' : activeTab === 'guest' ? 'Judges' : 'Computer Ji Scores'} Excel Sheet (.xlsx)</span>
          </button>
        </div>

        {/* TOOLBAR: SEARCH, FILTERS & STATS */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-black/40 p-3.5 rounded-2xl border border-white/5">
          {/* Search Bar - Supports Email, Name, Mobile, App ID, Razorpay ID */}
          <div className="flex items-center gap-2 flex-1 max-w-lg bg-slate-900/90 px-3.5 py-2.5 rounded-xl border border-slate-700/80 focus-within:border-amber-400 transition-colors">
            <Search className="w-4 h-4 text-amber-400 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Email (e.g. rahul@gmail.com), Name, Mobile, App ID, Razorpay ID..."
              className="w-full bg-transparent text-xs text-white placeholder:text-slate-500 focus:outline-none"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-xs text-slate-400 hover:text-white cursor-pointer px-1">
                ✕
              </button>
            )}
          </div>

          {/* Filters & Toggles */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Read / Unread Status Filter Toggle */}
            <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-700">
              <button
                onClick={() => setReadFilter('ALL')}
                className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                  readFilter === 'ALL' ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({currentList.length})
              </button>
              <button
                onClick={() => setReadFilter('UNREAD')}
                className={`px-3 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer ${
                  readFilter === 'UNREAD' ? 'bg-blue-500 text-white shadow-md' : 'text-slate-400 hover:text-blue-300'
                }`}
                title="Show Unread only (Top of list)"
              >
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                Unread ({unreadCount})
              </button>
              <button
                onClick={() => setReadFilter('READ')}
                className={`px-3 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer ${
                  readFilter === 'READ' ? 'bg-emerald-500 text-black shadow-md' : 'text-slate-400 hover:text-emerald-300'
                }`}
                title="Show Read only (Bottom of list)"
              >
                <Check className="w-3 h-3" />
                Read ({readCount})
              </button>
            </div>

            {/* Status Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-xs text-white font-semibold focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-slate-900">All Statuses</option>
                {activeTab === 'performer' && (
                  <>
                    <option value="PAYMENT_VERIFIED" className="bg-slate-900">PAYMENT_VERIFIED</option>
                    <option value="PAID" className="bg-slate-900">PAID</option>
                    <option value="UNDER_REVIEW" className="bg-slate-900">UNDER_REVIEW</option>
                    <option value="SHORTLISTED" className="bg-slate-900">SHORTLISTED</option>
                    <option value="REFUNDED" className="bg-slate-900">REFUNDED</option>
                  </>
                )}
                {activeTab === 'sponsor' && (
                  <>
                    <option value="NEW_LEAD" className="bg-slate-900">NEW_LEAD</option>
                    <option value="IN_DISCUSSION" className="bg-slate-900">IN_DISCUSSION</option>
                    <option value="CONFIRMED" className="bg-slate-900">CONFIRMED</option>
                  </>
                )}
                {activeTab === 'team' && (
                  <>
                    <option value="RECEIVED" className="bg-slate-900">RECEIVED</option>
                    <option value="INTERVIEW_SCHEDULED" className="bg-slate-900">INTERVIEW_SCHEDULED</option>
                    <option value="SELECTED" className="bg-slate-900">SELECTED</option>
                  </>
                )}
                {activeTab === 'guest' && (
                  <>
                    <option value="PENDING_REVIEW" className="bg-slate-900">PENDING_REVIEW</option>
                    <option value="INVITED" className="bg-slate-900">INVITED</option>
                    <option value="CONFIRMED" className="bg-slate-900">CONFIRMED</option>
                  </>
                )}
              </select>
            </div>

            <div className="text-[11px] text-slate-400 font-mono pl-2">
              Showing <strong className="text-white">{filteredItems.length}</strong> records
            </div>
          </div>
        </div>

        {/* APPLICANTS DATA TABLE */}
        <div className="overflow-x-auto rounded-2xl border border-white/10 shadow-inner">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#0b0e18] text-slate-400 font-black uppercase tracking-wider border-b border-white/10 text-[11px]">
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4">App ID</th>
                <th className="py-3.5 px-4">Applicant / Name & Email</th>
                <th className="py-3.5 px-4">Contact (Call & WhatsApp)</th>
                {activeTab === 'performer' && (
                  <>
                    <th className="py-3.5 px-4">Category & Talent</th>
                    <th className="py-3.5 px-4">City</th>
                    <th className="py-3.5 px-4">Razorpay Payment & ID</th>
                  </>
                )}
                {activeTab === 'sponsor' && (
                  <>
                    <th className="py-3.5 px-4">Contact Person</th>
                    <th className="py-3.5 px-4">Sponsorship Type</th>
                    <th className="py-3.5 px-4">Budget / Package</th>
                  </>
                )}
                {activeTab === 'team' && (
                  <>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">City / Address</th>
                    <th className="py-3.5 px-4">Skills / Role</th>
                  </>
                )}
                {activeTab === 'guest' && (
                  <>
                    <th className="py-3.5 px-4">Stage Name</th>
                    <th className="py-3.5 px-4">Profession / Category</th>
                    <th className="py-3.5 px-4">City</th>
                  </>
                )}
                {activeTab === 'computerji' && (
                  <>
                    <th className="py-3.5 px-4">Panel Judge Scores</th>
                    <th className="py-3.5 px-4 text-center">Avg Score</th>
                    <th className="py-3.5 px-4 text-center">Prediction</th>
                    <th className="py-3.5 px-4 text-center">Verdict</th>
                    <th className="py-3.5 px-4">Time Saved</th>
                    <th className="py-3.5 px-4">10-Day Retention</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </>
                )}
                {activeTab !== 'computerji' && (
                  <>
                    <th className="py-3.5 px-4 text-center">Mark as Read</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-14 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="w-8 h-8 text-slate-600" />
                      <span className="text-sm font-bold text-slate-300">No applications found</span>
                      <span className="text-xs text-slate-500">Only verified paid applications are displayed in this portal</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => {
                  if (activeTab === 'computerji') {
                    return (
                      <tr
                        key={item.contestant_id}
                        className="hover:bg-slate-900/60 transition-colors border-l-2 border-l-transparent hover:border-l-amber-500"
                      >
                        <td className="py-3.5 px-4 text-center text-slate-500 font-mono text-[11px]">
                          {idx + 1}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-amber-400 text-xs whitespace-nowrap">
                          #{item.contestant_id}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-black text-white text-sm">{item.contestant_name}</div>
                          <div className="text-[11px] text-amber-300 font-semibold">{item.category}</div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-white font-bold">{item.phone}</span>
                            {item.phone && (
                              <div className="flex items-center gap-1">
                                <a
                                  href={`https://wa.me/${String(item.phone).replace(/[^0-9]/g, '')}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-400 transition-colors"
                                  title="Chat on WhatsApp"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                </a>
                                <a
                                  href={`tel:${item.phone}`}
                                  className="p-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 transition-colors"
                                  title="Call phone"
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1 max-w-[220px]">
                            {Object.entries(item.judge_scores || {}).map(([jId, score]) => (
                              <span
                                key={jId}
                                className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-slate-300"
                              >
                                {jId.replace(/^j_/, '')}: <strong className="text-amber-300">{score as string}</strong>
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono font-black text-amber-400 text-sm">
                          {item.rounded_average} <span className="text-[10px] text-slate-500">/ 10</span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono font-black text-white text-sm">
                          {item.contestant_score || '—'}
                        </td>
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          {item.result === 'WIN' ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              🎉 WIN (MATCH)
                            </span>
                          ) : item.result === 'LOSE' ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-red-500/20 text-red-400 border border-red-500/30">
                              ❌ MISMATCH
                            </span>
                          ) : (
                            <span className="text-slate-500 font-mono text-xs">—</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-300 whitespace-nowrap">
                          {item.saved_at}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                            ⏳ {item.days_left ?? 10} दिन शेष (Auto-delete)
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => handleDeleteComputerJiScore(item.contestant_id)}
                            className="px-2.5 py-1 rounded-lg bg-red-950/60 hover:bg-red-800 border border-red-500/40 text-red-300 hover:text-white text-[11px] font-bold transition-all cursor-pointer"
                            title="Delete this score"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  }

                  const appId = item.app_id || item.id || `APP-${idx + 1}`;
                  const name = item.full_name || item.company_name || item.stage_name || 'N/A';
                  const phoneNum = (item.whatsapp_number || item.whatsapp || item.mobile_number || item.phone || '').replace(/[^0-9]/g, '');
                  const displayPhone = item.mobile_number || item.phone || item.whatsapp_number || item.whatsapp || 'N/A';
                  const email = item.email || item.biz_email || '';
                  const status = item.application_status || item.payment_status || item.status || 'RECEIVED';
                  const isPaid = item.payment_status === 'PAID' || item.payment_status === 'PAYMENT_VERIFIED';
                  const isUnread = !item.is_read;

                  return (
                    <tr
                      key={appId}
                      className={`transition-colors border-l-4 ${
                        isUnread
                          ? 'border-l-blue-400 bg-blue-500/[0.04] hover:bg-blue-500/[0.08]'
                          : 'border-l-transparent hover:bg-slate-900/60 opacity-80 hover:opacity-100'
                      }`}
                    >
                      {/* S.No */}
                      <td className="py-3.5 px-4 text-center text-slate-500 font-mono text-[11px]">
                        {idx + 1}
                      </td>

                      {/* App ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-400 text-xs whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {isUnread && <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0 animate-ping" title="Unread Application (Top)" />}
                          <span>{appId}</span>
                        </div>
                      </td>

                      {/* Name & Email */}
                      <td className="py-3.5 px-4">
                        <div className="font-black text-white text-sm">{name}</div>
                        {email && (
                          <div className="text-[11px] text-amber-200/90 font-mono flex items-center gap-1 mt-0.5 truncate max-w-[200px]" title={email}>
                            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{email}</span>
                          </div>
                        )}
                      </td>

                      {/* Contact with WhatsApp & Call button */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-white font-bold">{displayPhone}</span>
                          {phoneNum && (
                            <div className="flex items-center gap-1">
                              <a
                                href={`https://wa.me/${phoneNum}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-400 transition-colors"
                                title="Chat on WhatsApp"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </a>
                              <a
                                href={`tel:${phoneNum}`}
                                className="p-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 transition-colors"
                                title="Call phone"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Dynamic Columns per tab */}
                      {activeTab === 'performer' && (
                        <>
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-amber-300">{item.performance_category || 'Talent'}</span>
                            {item.performance_title && (
                              <div className="text-[10px] text-slate-300 italic truncate max-w-[180px]">
                                {item.performance_title}
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-slate-300">{item.city || 'Gorakhpur'}</td>
                          <td className="py-3.5 px-4 font-mono text-[11px]">
                            <div className="space-y-1">
                              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 inline-flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> ₹{item.payment_amount || 199} PAID
                              </span>
                              {item.payment_id ? (
                                <div className="flex items-center gap-1">
                                  <span className="text-[10px] font-mono text-amber-300 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 truncate max-w-[130px]" title={item.payment_id}>
                                    {item.payment_id}
                                  </span>
                                  <button
                                    onClick={() => copyToClipboard(item.payment_id)}
                                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                                    title="Copy Razorpay Payment ID for refund"
                                  >
                                    {copiedId === item.payment_id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[9px] text-slate-500 font-mono block">Order: {item.order_id || 'N/A'}</span>
                              )}
                            </div>
                          </td>
                        </>
                      )}

                      {activeTab === 'sponsor' && (
                        <>
                          <td className="py-3.5 px-4 text-slate-300">{item.contact_person || '—'}</td>
                          <td className="py-3.5 px-4 font-semibold text-amber-300">{item.sponsorship_type || item.industry || 'Brand'}</td>
                          <td className="py-3.5 px-4 font-mono text-emerald-400 font-bold">{item.budget_est || item.preferred_package || 'Discuss'}</td>
                        </>
                      )}

                      {activeTab === 'team' && (
                        <>
                          <td className="py-3.5 px-4 text-slate-300 truncate max-w-[160px]">{item.email}</td>
                          <td className="py-3.5 px-4 text-slate-300 truncate max-w-[160px]">{item.address || 'Gorakhpur'}</td>
                          <td className="py-3.5 px-4 text-slate-300 truncate max-w-[160px]">{item.about || 'Crew Member'}</td>
                        </>
                      )}

                      {activeTab === 'guest' && (
                        <>
                          <td className="py-3.5 px-4 text-slate-300">{item.stage_name || '—'}</td>
                          <td className="py-3.5 px-4 font-semibold text-amber-300">{item.profession || item.category || 'VIP'}</td>
                          <td className="py-3.5 px-4 text-slate-300">{item.city || 'Gorakhpur'}</td>
                        </>
                      )}

                      {/* MARK AS READ / UNREAD BUTTON (Moves row to bottom when marked as read) */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {isUnread ? (
                          <button
                            onClick={() => handleToggleRead(item)}
                            className="px-2.5 py-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 border border-blue-500/50 text-[10px] font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-105 mx-auto"
                            title="Niche bhejne ke liye click karein (Mark as Read)"
                          >
                            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                            <span>Mark as Read</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggleRead(item)}
                            className="px-2.5 py-1 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 text-[10px] font-semibold flex items-center gap-1 transition-all cursor-pointer mx-auto"
                            title="Upar lane ke liye click karein (Mark Unread)"
                          >
                            <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Read</span>
                          </button>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                          status === 'REFUNDED'
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                            : isPaid || status === 'APPROVED' || status === 'CONFIRMED' || status === 'SELECTED' || status === 'PAYMENT_VERIFIED'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : status === 'SHORTLISTED'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : status === 'REJECTED'
                            ? 'bg-red-500/20 text-red-300 border-red-500/40'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}>
                          {status}
                        </span>
                      </td>

                      {/* Action: View Modal & Delete */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenItem(item)}
                            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs inline-flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>View Details</span>
                          </button>
                          <button
                            onClick={() => handleDeleteApplication(item)}
                            className="p-1.5 rounded-xl bg-red-950/60 hover:bg-red-800 border border-red-500/40 text-red-300 hover:text-white transition-all cursor-pointer"
                            title="Permanently delete application"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Note */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/5 gap-2">
          <span>Unread applications top par rahenge. &quot;Mark as Read&quot; click karte hi entry neeche chali jayegi.</span>
          <span className="text-emerald-400 font-semibold">Razorpay IDs available for instant full slot refunds.</span>
        </div>
      </div>

      {/* FULL APPLICATION DETAILS MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 rounded-3xl border border-amber-500/40 space-y-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-400 uppercase font-mono">{selectedItem.app_id}</span>
                  {!selectedItem.is_read ? (
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] font-black uppercase">
                      UNREAD (TOP)
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold uppercase">
                      READ
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-black text-white mt-1">
                  {selectedItem.full_name || selectedItem.company_name || selectedItem.stage_name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Applied on: {selectedItem.created_at ? new Date(selectedItem.created_at).toLocaleString('en-IN') : 'Recent'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleRead(selectedItem)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                    !selectedItem.is_read
                      ? 'bg-blue-500 text-white border-blue-400 shadow-md'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                  title="Toggle Read / Unread"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>{!selectedItem.is_read ? 'Mark as Read' : 'Mark as Unread'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteApplication(selectedItem)}
                  className="px-3 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-800 border border-red-500/50 text-red-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Permanently Delete Application"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>

                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* FULL DETAILS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs bg-slate-900/90 p-4.5 rounded-2xl border border-slate-800">
              <div>
                <span className="text-slate-400 block text-[11px]">Primary Contact (Phone):</span>
                <strong className="text-white text-sm">
                  {selectedItem.mobile_number || selectedItem.phone || 'N/A'}
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">WhatsApp Number:</span>
                <strong className="text-emerald-400 text-sm">
                  {selectedItem.whatsapp_number || selectedItem.whatsapp || selectedItem.mobile_number || 'N/A'}
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Email Address:</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <strong className="text-white font-mono">{selectedItem.email || selectedItem.biz_email || 'N/A'}</strong>
                  {selectedItem.email && (
                    <button
                      onClick={() => copyToClipboard(selectedItem.email)}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                      title="Copy email address"
                    >
                      {copiedId === selectedItem.email ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  )}
                </div>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">City / Location:</span>
                <strong className="text-white">{selectedItem.city || selectedItem.location || selectedItem.address || 'Gorakhpur'}</strong>
              </div>

              {/* Performer Specific */}
              {activeTab === 'performer' && (
                <>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Category:</span>
                    <strong className="text-amber-400 font-bold">{selectedItem.performance_category}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Performance Title:</span>
                    <strong className="text-white">{selectedItem.performance_title || 'Solo Act'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Duration & Age:</span>
                    <strong className="text-white">{selectedItem.performance_duration || '2 Min'} • Age: {selectedItem.age || 'N/A'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Performers Count:</span>
                    <strong className="text-white">{selectedItem.performer_count || 1} Person</strong>
                  </div>
                </>
              )}

              {/* Sponsor Specific */}
              {activeTab === 'sponsor' && (
                <>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Contact Person:</span>
                    <strong className="text-white">{selectedItem.contact_person} ({selectedItem.designation || 'Owner'})</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Industry / Sector:</span>
                    <strong className="text-amber-400">{selectedItem.industry || 'Commercial'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Sponsorship Type:</span>
                    <strong className="text-white">{selectedItem.sponsorship_type}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Estimated Budget:</span>
                    <strong className="text-emerald-400">{selectedItem.budget_est || selectedItem.preferred_package}</strong>
                  </div>
                </>
              )}

              {/* Team Specific */}
              {activeTab === 'team' && (
                <>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Date of Birth:</span>
                    <strong className="text-white">{selectedItem.dob || 'N/A'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Skills & Passion:</span>
                    <strong className="text-amber-400">{selectedItem.about || 'Crew Volunteer'}</strong>
                  </div>
                </>
              )}

              {/* Guest Specific */}
              {activeTab === 'guest' && (
                <>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Stage / Public Name:</span>
                    <strong className="text-white">{selectedItem.stage_name || 'N/A'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Profession / Field:</span>
                    <strong className="text-amber-400">{selectedItem.profession || selectedItem.category}</strong>
                  </div>
                </>
              )}
            </div>

            {/* Description & Bio */}
            {(selectedItem.performance_description || selectedItem.about || selectedItem.short_intro || selectedItem.why_ggl || selectedItem.additional_message) && (
              <div className="space-y-2 text-xs bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                <span className="text-amber-400 font-bold uppercase block text-[11px]">Application Description & Notes</span>
                <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {selectedItem.additional_message || selectedItem.performance_description || selectedItem.about || selectedItem.short_intro || selectedItem.why_ggl}
                </p>
              </div>
            )}

            {/* Social Media & Media Links */}
            {(selectedItem.instagram_url || selectedItem.youtube_url || selectedItem.brand_deck_url || selectedItem.website) && (
              <div className="space-y-2 text-xs bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                <span className="text-amber-400 font-bold uppercase block text-[11px]">Profiles & Verification Links</span>
                <div className="flex flex-wrap items-center gap-3">
                  {selectedItem.instagram_url && (
                    <a
                      href={selectedItem.instagram_url.startsWith('http') ? selectedItem.instagram_url : `https://instagram.com/${selectedItem.instagram_url.replace('@', '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Instagram
                    </a>
                  )}
                  {selectedItem.youtube_url && (
                    <a
                      href={selectedItem.youtube_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> YouTube
                    </a>
                  )}
                  {selectedItem.brand_deck_url && (
                    <a
                      href={selectedItem.brand_deck_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Brand Deck
                    </a>
                  )}
                  {selectedItem.website && (
                    <a
                      href={selectedItem.website}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Website
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Razorpay Payment & Refund Card (For Performers) */}
            {activeTab === 'performer' && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-amber-950/30 border border-emerald-500/40 text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5 text-xs">
                    <CreditCard className="w-4 h-4" /> Razorpay Payment & Refund Details
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase">
                    {selectedItem.payment_status || 'PAID'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300 bg-black/40 p-3 rounded-xl border border-white/5 font-mono text-[11px]">
                  <div>
                    <span className="text-slate-500 block text-[10px]">RAZORPAY PAYMENT ID (FOR REFUND):</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <strong className="text-amber-300 text-xs break-all">{selectedItem.payment_id || selectedItem.razorpay_payment_id || 'N/A'}</strong>
                      {selectedItem.payment_id && (
                        <button
                          onClick={() => copyToClipboard(selectedItem.payment_id)}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white shrink-0 cursor-pointer"
                          title="Copy Payment ID"
                        >
                          {copiedId === selectedItem.payment_id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px]">RAZORPAY ORDER ID:</span>
                    <strong className="text-white text-xs block mt-0.5 break-all">{selectedItem.order_id || 'N/A'}</strong>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px]">FEE AMOUNT PAID:</span>
                    <strong className="text-emerald-400 text-xs block mt-0.5">₹{selectedItem.payment_amount || 199} INR</strong>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px]">VERIFIED AT:</span>
                    <span className="text-slate-300 text-xs block mt-0.5">
                      {selectedItem.payment_verified_at ? new Date(selectedItem.payment_verified_at).toLocaleString('en-IN') : 'Verified'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <p className="text-[11px] text-amber-200/90 leading-tight">
                    💡 Slot full hone par ya performer shortlist na hone par is Payment ID se Razorpay Dashboard me refund initiate karein.
                  </p>

                  {selectedItem.payment_status === 'REFUNDED' || selectedItem.status === 'REFUNDED' ? (
                    <span className="px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold text-xs shrink-0 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> REFUNDED ({selectedItem.refund_id || 'PROCESSED'})
                    </span>
                  ) : (
                    <button
                      onClick={() => handleProcessRefund(selectedItem.app_id, selectedItem.full_name)}
                      disabled={refunding || !selectedItem.payment_id}
                      className="px-4 py-2 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-500/50 text-red-200 font-extrabold text-xs flex items-center gap-1.5 shrink-0 transition-all cursor-pointer disabled:opacity-50"
                      title="Refund customer fee via Razorpay"
                    >
                      <RotateCcw className={`w-3.5 h-3.5 ${refunding ? 'animate-spin' : ''}`} />
                      <span>{refunding ? 'Processing Refund...' : 'Initiate Razorpay Refund'}</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* STATUS UPDATE & INTERNAL NOTE (NO DELETION) */}
            <div className="space-y-4 pt-4 border-t border-slate-800 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1.5">Update Application Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold focus:outline-none"
                >
                  <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                  <option value="SHORTLISTED">SHORTLISTED</option>
                  <option value="CONFIRMED">CONFIRMED / SELECTED</option>
                  <option value="PAYMENT_VERIFIED">PAYMENT_VERIFIED</option>
                  <option value="REJECTED">REJECTED</option>
                  <option value="REFUNDED">REFUNDED</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1.5">Add Internal Admin Note</label>
                <textarea
                  rows={2}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Notes regarding audition call, interview time, or feedback..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none"
                />
              </div>

              {saveSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Status and note updated successfully in Neon Database!</span>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Protected Record (Permanent Storage)</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleSaveStatus}
                  disabled={savingNote}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs cursor-pointer shadow-lg transition-all"
                >
                  {savingNote ? 'Saving Changes...' : 'Save Updates'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
