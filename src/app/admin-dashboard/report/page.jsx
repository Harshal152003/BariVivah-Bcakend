"use client";
import React, { useState, useEffect } from 'react';
import {
  Flag,
  AlertTriangle,
  ShieldOff,
  CheckCircle,
  Clock,
  Search,
  ChevronDown,
  ChevronUp,
  User,
  Phone,
  Calendar,
  AlertCircle,
  Check,
  X,
  RefreshCw,
  Eye,
} from 'lucide-react';

export default function ReportsAndComplaintsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ groupedReports: [], rawReports: [], stats: {} });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [expandedCandidateId, setExpandedCandidateId] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [actionModal, setActionModal] = useState({ open: false, type: null, candidate: null });
  const [actionNote, setActionNote] = useState('');

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/reports');
      const result = await res.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch admin reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleExecuteAction = async () => {
    if (!actionModal.candidate || !actionModal.type) return;

    const candidateId = actionModal.candidate.candidate?._id || actionModal.candidate.candidate?.id;
    setActionLoadingId(candidateId);

    try {
      const res = await fetch('/api/admin/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: actionModal.type, // 'block', 'resolve', 'dismiss'
          candidateId,
          note: actionNote,
        }),
      });

      const result = await res.json();
      if (result.success) {
        setActionModal({ open: false, type: null, candidate: null });
        setActionNote('');
        fetchReports();
      } else {
        alert(result.message || 'Action failed.');
      }
    } catch (err) {
      console.error('Action failed:', err);
      alert('Network error executing admin action.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filtered List Computation
  const groupedReports = data.groupedReports || [];

  const filteredGroupedReports = groupedReports.filter((item) => {
    const candidate = item.candidate || {};
    const nameMatch = (candidate.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const phoneMatch = (candidate.phone || '').includes(searchQuery);
    const reasonMatch = item.reasons.some((r) => r.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSearch = nameMatch || phoneMatch || reasonMatch;

    if (!matchesSearch) return false;

    if (statusFilter === 'HighRisk') return item.reportCount >= 3;
    if (statusFilter === 'Pending') return item.pendingCount > 0;
    if (statusFilter === 'Blocked') return candidate.isBlocked || candidate.accountStatus === 'Blocked';

    return true;
  });

  const stats = data.stats || { totalReports: 0, totalReportedProfiles: 0, highRiskCount: 0, pendingCount: 0 };

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-8 bg-slate-50 min-h-screen">
      {/* Top Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-2.5 bg-rose-100 text-rose-600 rounded-xl">
              <Flag className="w-7 h-7" />
            </div>
            Reports & Complaints Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor spam callers, repeated harassment complaints, and take swift moderation actions.
          </p>
        </div>

        <button
          onClick={fetchReports}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition shadow-sm text-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Reports</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats.totalReports}</h3>
            <p className="text-xs text-rose-500 font-medium mt-1">Registered User Complaints</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Flag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Reported Profiles</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats.totalReportedProfiles}</h3>
            <p className="text-xs text-amber-500 font-medium mt-1">Unique Candidate Accounts</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-rose-200 bg-rose-50/40 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-rose-600">High Risk (3+ Reports)</p>
            <h3 className="text-3xl font-bold text-rose-700 mt-1">{stats.highRiskCount}</h3>
            <p className="text-xs text-rose-600 font-medium mt-1">Requires Urgent Action</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-200">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pending Review</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats.pendingCount}</h3>
            <p className="text-xs text-blue-500 font-medium mt-1">Awaiting Moderation</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {[
            { id: 'All', label: 'All Complaints' },
            { id: 'Pending', label: 'Pending Review' },
            { id: 'HighRisk', label: '🚩 High Risk (3+ Reports)' },
            { id: 'Blocked', label: 'Blocked Profiles' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                statusFilter === tab.id
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidate, phone or reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </div>

      {/* Main Reported Candidates List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-rose-500 mb-3" />
            <p className="font-medium text-sm">Loading complaints data...</p>
          </div>
        ) : filteredGroupedReports.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <CheckCircle className="w-12 h-12 mx-auto text-emerald-500 mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No Reports Found</h3>
            <p className="text-xs text-slate-400 mt-1">There are no reported profiles matching your selected criteria.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredGroupedReports.map((group) => {
              const candidate = group.candidate || {};
              const candidateId = String(candidate._id || candidate.id);
              const isExpanded = expandedCandidateId === candidateId;
              const isBlocked = candidate.isBlocked || candidate.accountStatus === 'Blocked';
              const isHighRisk = group.reportCount >= 3;

              return (
                <div key={candidateId} className="transition-all hover:bg-slate-50/50">
                  {/* Candidate Header Row */}
                  <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Candidate Info */}
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={candidate.profilePhoto || '/images/default-avatar.png'}
                          alt={candidate.name}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100"
                          onError={(e) => {
                            e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(candidate.name || 'User');
                          }}
                        />
                        {isBlocked && (
                          <span className="absolute -top-1 -right-1 bg-slate-900 text-white text-[10px] p-1 rounded-full border border-white">
                            <ShieldOff className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-base">{candidate.name || 'Unnamed Candidate'}</h4>
                          {isBlocked ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-900 text-white">
                              BLOCKED
                            </span>
                          ) : candidate.isVerified ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700">
                              VERIFIED
                            </span>
                          ) : null}
                        </div>

                        <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                          <span className="flex items-center gap-1 font-medium text-slate-700">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            {candidate.phone || 'N/A'}
                          </span>
                          <span>•</span>
                          <span>{candidate.currentCity || candidate.city || 'City N/A'}</span>
                          <span>•</span>
                          <span>{candidate.gender || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Report Stats & Reasons Pills */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <div
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                          isHighRisk
                            ? 'bg-rose-600 text-white animate-pulse shadow-md shadow-rose-200'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        <Flag className="w-3.5 h-3.5" />
                        {group.reportCount} {group.reportCount === 1 ? 'Report' : 'Reports'}
                      </div>

                      <div className="flex items-center gap-1 flex-wrap">
                        {group.reasons.map((r, i) => (
                          <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[11px] font-semibold">
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => setExpandedCandidateId(isExpanded ? null : candidateId)}
                        className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200/80 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        {isExpanded ? 'Hide Complaints' : 'Inspect Complaints'}
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {!isBlocked && (
                        <button
                          onClick={() => setActionModal({ open: true, type: 'block', candidate: group })}
                          className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                        >
                          <ShieldOff className="w-3.5 h-3.5" />
                          Block Candidate
                        </button>
                      )}

                      <button
                        onClick={() => setActionModal({ open: true, type: 'resolve', candidate: group })}
                        className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-1 transition"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Mark Reviewed
                      </button>
                    </div>
                  </div>

                  {/* Expanded Complaints Log Drawer */}
                  {isExpanded && (
                    <div className="bg-slate-50/80 p-5 border-t border-slate-100 space-y-3">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Detailed User Complaint History ({group.reportsList.length})
                      </h5>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {group.reportsList.map((rpt) => (
                          <div key={rpt._id} className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="px-2.5 py-0.5 bg-rose-50 text-rose-700 font-bold text-[11px] rounded-md">
                                {rpt.reason}
                              </span>
                              <span className="text-[11px] text-slate-400 font-medium">
                                {new Date(rpt.createdAt).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>

                            {rpt.description ? (
                              <p className="text-xs text-slate-700 font-normal italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                "{rpt.description}"
                              </p>
                            ) : (
                              <p className="text-xs text-slate-400 italic">No additional note provided.</p>
                            )}

                            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                              <span>
                                Reported by: <strong className="text-slate-800">{rpt.reporter?.name || 'Member'}</strong> ({rpt.reporter?.phone || 'No phone'})
                              </span>
                              <span
                                className={`font-bold ${
                                  rpt.status === 'Pending' ? 'text-amber-600' : rpt.status === 'Blocked' ? 'text-rose-600' : 'text-emerald-600'
                                }`}
                              >
                                {rpt.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Admin Action Confirmation Modal */}
      {actionModal.open && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                {actionModal.type === 'block' ? (
                  <>
                    <ShieldOff className="w-5 h-5 text-rose-600" />
                    Block Candidate Account
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    Mark Complaints as Reviewed
                  </>
                )}
              </h3>
              <button
                onClick={() => setActionModal({ open: false, type: null, candidate: null })}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-slate-600">
              {actionModal.type === 'block' ? (
                <>
                  Are you sure you want to block <strong>{actionModal.candidate?.candidate?.name}</strong>? This candidate will no longer be able to log in or message members on BariVivah.
                </>
              ) : (
                <>
                  Mark all complaints for <strong>{actionModal.candidate?.candidate?.name}</strong> as reviewed and resolved?
                </>
              )}
            </p>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Admin Action Note (Optional):</label>
              <textarea
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                placeholder="e.g. Verified repeated harassment calls, user suspended..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                rows={3}
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setActionModal({ open: false, type: null, candidate: null })}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
              >
                Cancel
              </button>

              <button
                onClick={handleExecuteAction}
                disabled={actionLoadingId !== null}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold text-white transition flex items-center justify-center gap-2 ${
                  actionModal.type === 'block' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {actionLoadingId ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : actionModal.type === 'block' ? (
                  'Confirm Block'
                ) : (
                  'Confirm Mark Reviewed'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
