"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  FileText,
  Download,
  Search,
  Filter,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCcw,
  IndianRupee,
  Building2,
  TrendingUp,
  MapPin,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

export default function TransactionsTab() {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalBaseAmount: 0,
    totalTax: 0,
    totalCgst: 0,
    totalSgst: 0,
    totalIgst: 0,
    capturedCount: 0,
  });
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1, limit: 15 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedTx, setSelectedTx] = useState(null);

  const fetchTransactions = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: "15",
        status: statusFilter,
        search: searchTerm,
      });
      const res = await fetch(`/api/admin/transactions?${params.toString()}`);
      const json = await res.json();
      if (json.success && json.data) {
        setTransactions(json.data.transactions || []);
        setPagination(json.data.pagination || { page: 1, total: 0, totalPages: 1, limit: 15 });
        if (json.data.stats) {
          setStats(json.data.stats);
        }
      }
    } catch (err) {
      console.error("Failed to fetch admin transactions:", err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTransactions(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchTransactions]);

  const formatCurrency = (val) => {
    const num = Number(val) || 0;
    return `₹${num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "CAPTURED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={12} className="text-emerald-600" /> Captured
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock size={12} className="text-amber-600" /> Pending
          </span>
        );
      case "FAILED":
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle size={12} className="text-rose-600" /> {status}
          </span>
        );
      case "REFUNDED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <RotateCcw size={12} className="text-purple-600" /> Refunded
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP GST & REVENUE STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Captured Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Gross Sales (Total)</p>
              <h3 className="text-2xl font-black text-gray-900 mt-1">{formatCurrency(stats.totalRevenue)}</h3>
              <p className="text-xs text-emerald-600 font-semibold mt-1">
                {stats.capturedCount} Successful Orders
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-[#FB2467] flex items-center justify-center">
              <IndianRupee size={24} />
            </div>
          </div>
        </div>

        {/* Taxable Base Amount */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Taxable Base Revenue</p>
              <h3 className="text-2xl font-black text-gray-900 mt-1">{formatCurrency(stats.totalBaseAmount)}</h3>
              <p className="text-xs text-gray-500 font-medium mt-1">Net plan revenue before GST</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>

        {/* Total 18% GST Collected */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total GST (18%)</p>
              <h3 className="text-2xl font-black text-rose-600 mt-1">{formatCurrency(stats.totalTax)}</h3>
              <p className="text-xs text-gray-500 font-medium mt-1">SAC 998599 Matchmaking</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Building2 size={24} />
            </div>
          </div>
        </div>

        {/* CGST / SGST vs IGST Tax Split */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tax Split (Audit)</p>
            <ShieldCheck size={16} className="text-emerald-600" />
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">CGST (9%) + SGST (9%):</span>
              <span className="font-bold text-gray-800">{formatCurrency(stats.totalCgst + stats.totalSgst)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">IGST (18% Inter-State):</span>
              <span className="font-bold text-gray-800">{formatCurrency(stats.totalIgst)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SEARCH, FILTER & REFRESH BAR */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by User, Phone, TxID, Invoice No, State..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FB2467]/30 focus:border-[#FB2467]"
          />
        </div>

        {/* Status Filter Tabs & Refresh */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          {["ALL", "CAPTURED", "PENDING", "FAILED", "REFUNDED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? "bg-[#FB2467] text-white shadow-sm"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              {st}
            </button>
          ))}

          <button
            onClick={() => fetchTransactions(pagination.page)}
            className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-600 transition-colors ml-1"
            title="Refresh list"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* 3. TRANSACTIONS & INVOICES DATA TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wider">
                <th className="py-3.5 px-4">Date & Time</th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Plan</th>
                <th className="py-3.5 px-4">Place of Supply</th>
                <th className="py-3.5 px-4 text-right">Tax Breakdown</th>
                <th className="py-3.5 px-4 text-right">Total Amount</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading && transactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    <RefreshCw size={24} className="animate-spin mx-auto text-[#FB2467] mb-2" />
                    Loading transaction records...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    No transactions found matching your criteria.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => {
                  const u = tx.userId || {};
                  const customerName = tx.billingDetails?.customerName || u.name || u.fullName || "Member";
                  const customerPhone = tx.billingDetails?.customerPhone || u.phone || "N/A";
                  const state = tx.billingDetails?.billingState || u.state || "Maharashtra";
                  const stateCode = tx.billingDetails?.billingStateCode || "27";
                  const planName = tx.planSnapshot?.name || "Premium Plan";

                  const gst = tx.gstBreakdown || {};
                  const basePrice = gst.baseAmount || tx.amount;
                  const totalTax = gst.totalTax || 0;
                  const isIntraState = (gst.cgst > 0 || gst.sgst > 0);

                  const invoiceNumber = tx.invoiceDetails?.invoiceNumber || tx.receipt;
                  const isCaptured = tx.status === "CAPTURED";

                  return (
                    <tr key={tx._id || tx.transactionId} className="hover:bg-gray-50/70 transition-colors">
                      {/* Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-xs text-gray-500">
                        <div className="font-semibold text-gray-900">
                          {new Date(tx.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                        <div className="text-[11px] text-gray-400">
                          {new Date(tx.createdAt).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-gray-900">{customerName}</div>
                        <div className="text-xs text-gray-500">{customerPhone}</div>
                        <div className="text-[11px] text-gray-400 font-mono">Tx: {tx.transactionId}</div>
                      </td>

                      {/* Plan */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold bg-rose-50 text-[#FB2467]">
                          {planName}
                        </span>
                      </td>

                      {/* Place of Supply */}
                      <td className="py-3.5 px-4 text-xs">
                        <div className="flex items-center gap-1 text-gray-800 font-medium">
                          <MapPin size={12} className="text-gray-400" />
                          {state}
                        </div>
                        <div className="text-[11px] text-gray-400">State Code: {stateCode}</div>
                      </td>

                      {/* Tax Breakdown */}
                      <td className="py-3.5 px-4 text-right text-xs">
                        <div className="text-gray-500">Base: {formatCurrency(basePrice)}</div>
                        <div className="font-semibold text-rose-600">
                          {isIntraState ? `CGST+SGST: ${formatCurrency(totalTax)}` : `IGST: ${formatCurrency(totalTax)}`}
                        </div>
                      </td>

                      {/* Total Amount */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="font-black text-gray-900 text-sm">
                          {formatCurrency(tx.amount)}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        {getStatusBadge(tx.status)}
                      </td>

                      {/* Invoice Download Action */}
                      <td className="py-3.5 px-4 text-center">
                        {isCaptured ? (
                          <div className="flex flex-col items-center gap-1">
                            <a
                              href={`/api/payment/invoice/${tx.transactionId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
                              title="Download Rule 46 PDF Tax Invoice"
                            >
                              <Download size={13} />
                              <span>Invoice</span>
                            </a>
                            <span className="text-[10px] font-mono text-gray-400">
                              {invoiceNumber}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 4. PAGINATION */}
        <div className="p-4 border-t border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <div>
            Showing <span className="font-bold text-gray-800">{transactions.length}</span> of{" "}
            <span className="font-bold text-gray-800">{pagination.total}</span> transactions
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchTransactions(pagination.page - 1)}
              disabled={pagination.page <= 1 || loading}
              className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 font-bold"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="font-semibold text-gray-700 px-2">
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <button
              onClick={() => fetchTransactions(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages || loading}
              className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 font-bold"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
