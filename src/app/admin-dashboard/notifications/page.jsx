"use client";
import React, { useState, useEffect } from "react";
import {
  Bell,
  Send,
  Users,
  User,
  Radio,
  Sparkles,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Info,
  Crown,
  FileText,
  Clock,
  ExternalLink,
  RefreshCw,
  Plus,
  ChevronRight,
  Eye,
  X,
} from "lucide-react";

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("ALL");

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "ADMIN_BROADCAST",
    priority: "NORMAL",
    recipientType: "ALL", // 'ALL' | 'SPECIFIC' | 'GROUP'
    targetGroup: "ALL",
    userQuery: "",
    actionUrl: "",
  });

  // User search autocomplete state
  const [searchingUser, setSearchingUser] = useState(false);
  const [userSearchResults, setUserSearchResults] = useState([]);
  const [selectedRecipientUser, setSelectedRecipientUser] = useState(null);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    broadcasts: 0,
    specific: 0,
    groups: 0,
  });

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/notifications?limit=50");
      const data = await res.json();
      if (data.success && data.data) {
        setNotifications(data.data);
        const allNotifs = data.data;
        setStats({
          total: allNotifs.length,
          broadcasts: allNotifs.filter((n) => n.recipientType === "ALL").length,
          specific: allNotifs.filter((n) => n.recipientType === "SPECIFIC").length,
          groups: allNotifs.filter((n) => n.recipientType === "GROUP").length,
        });
      }
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Search users when typing in SPECIFIC mode
  useEffect(() => {
    if (formData.recipientType !== "SPECIFIC" || !formData.userQuery.trim() || selectedRecipientUser) {
      setUserSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setSearchingUser(true);
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(formData.userQuery.trim())}&limit=5`);
        const data = await res.json();
        if (data.success && data.data) {
          setUserSearchResults(data.data);
        }
      } catch (e) {
        console.error("User search error:", e);
      } finally {
        setSearchingUser(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [formData.userQuery, formData.recipientType, selectedRecipientUser]);

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.message.trim()) {
      alert("Please provide both Title and Message");
      return;
    }

    if (formData.recipientType === "SPECIFIC" && !formData.userQuery.trim() && !selectedRecipientUser) {
      alert("Please select a recipient user");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title: formData.title,
        message: formData.message,
        type: formData.type,
        priority: formData.priority,
        recipientType: formData.recipientType,
        targetGroup: formData.targetGroup,
        userQuery: selectedRecipientUser ? selectedRecipientUser._id : formData.userQuery,
        actionUrl: formData.actionUrl || null,
      };

      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        alert("🎉 Notification successfully created and sent!");
        setIsComposerOpen(false);
        setFormData({
          title: "",
          message: "",
          type: "ADMIN_BROADCAST",
          priority: "NORMAL",
          recipientType: "ALL",
          targetGroup: "ALL",
          userQuery: "",
          actionUrl: "",
        });
        setSelectedRecipientUser(null);
        fetchNotifications();
      } else {
        alert(`Error: ${data.message || "Failed to send notification"}`);
      }
    } catch (err) {
      alert("Network error sending notification");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredNotifications = notifications.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.recipientUser?.name && item.recipientUser.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.recipientUser?.profileId && item.recipientUser.profileId.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = selectedTypeFilter === "ALL" || item.type === selectedTypeFilter;

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-pink-50 rounded-xl">
              <Bell className="w-6 h-6 text-[#FB2467]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Broadcasts & Push Notifications</h1>
              <p className="text-sm text-gray-500">
                Send system-wide broadcasts, account reports, or group alerts to all platform users.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchNotifications}
            className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={() => setIsComposerOpen(true)}
            className="flex items-center space-x-2 px-5 py-2.5 bg-[#FB2467] hover:bg-[#e01e5a] text-white rounded-xl font-semibold shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>New Broadcast / Alert</span>
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-semibold uppercase text-gray-400">Total Notifications</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-semibold uppercase text-pink-500">📢 All Users Broadcasts</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.broadcasts}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-semibold uppercase text-blue-500">👤 User Specific Reports</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.specific}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-semibold uppercase text-emerald-500">👥 Group Segment Alerts</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.groups}</p>
        </div>
      </div>

      {/* Main Content: Table & Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Filters Bar */}
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, message, or user name / ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FB2467]"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 font-medium">Type:</span>
            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 bg-white focus:outline-none focus:border-[#FB2467]"
            >
              <option value="ALL">All Categories</option>
              <option value="ADMIN_BROADCAST">📢 Announcement</option>
              <option value="ACCOUNT_REPORT">📋 Account Report</option>
              <option value="SUBSCRIPTION">👑 Subscription</option>
              <option value="SYSTEM_ALERT">⚠️ Security / Alert</option>
            </select>
          </div>
        </div>

        {/* Notifications Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/75 text-xs uppercase font-semibold text-gray-500 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3.5">Notification</th>
                <th className="px-6 py-3.5">Target Audience</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Priority</th>
                <th className="px-6 py-3.5">Sent Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    Loading notifications...
                  </td>
                </tr>
              ) : filteredNotifications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    No notifications found matching your search.
                  </td>
                </tr>
              ) : (
                filteredNotifications.map((notif) => (
                  <tr key={notif._id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 max-w-md">
                      <div className="font-semibold text-gray-900">{notif.title}</div>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{notif.message}</p>
                      {notif.actionUrl && (
                        <span className="inline-flex items-center text-[11px] text-[#FB2467] font-medium mt-1">
                          Action: {notif.actionUrl}
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {notif.recipientType === "ALL" && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-pink-50 text-[#FB2467]">
                          📢 All Platform Users
                        </span>
                      )}
                      {notif.recipientType === "GROUP" && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                          👥 Group: {notif.targetGroup?.replace("_", " ")}
                        </span>
                      )}
                      {notif.recipientType === "SPECIFIC" && (
                        <div className="text-xs">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full font-semibold bg-blue-50 text-blue-700">
                            👤 {notif.recipientUser?.name || "Single User"}
                          </span>
                          {notif.recipientUser?.profileId && (
                            <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                              {notif.recipientUser.profileId}
                            </p>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-gray-700">
                        {notif.type === "ADMIN_BROADCAST" && "📢 Announcement"}
                        {notif.type === "ACCOUNT_REPORT" && "📋 Account Report"}
                        {notif.type === "SUBSCRIPTION" && "👑 Subscription"}
                        {notif.type === "SYSTEM_ALERT" && "⚠️ Security Alert"}
                        {notif.type === "GENERAL" && "ℹ️ General"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                          notif.priority === "URGENT"
                            ? "bg-red-100 text-red-700"
                            : notif.priority === "HIGH"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {notif.priority}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(notif.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Composer Modal */}
      {isComposerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-pink-50 to-white">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-[#FB2467] text-white rounded-xl shadow-md">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Send Notification / Broadcast</h3>
                  <p className="text-xs text-gray-500">
                    Publish instant notifications directly to member home screens & bell drawers.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsComposerOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSendNotification} className="p-6 overflow-y-auto space-y-5 flex-1">
              {/* Recipient Targeting Selector */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-2">
                  1. Target Audience
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, recipientType: "ALL" });
                      setSelectedRecipientUser(null);
                    }}
                    className={`p-3.5 rounded-xl border flex flex-col items-center justify-center text-center transition ${
                      formData.recipientType === "ALL"
                        ? "border-[#FB2467] bg-pink-50/50 text-[#FB2467] font-bold shadow-sm"
                        : "border-gray-200 hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <Radio className="w-5 h-5 mb-1.5" />
                    <span className="text-xs">Broadcast (All)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, recipientType: "SPECIFIC" })}
                    className={`p-3.5 rounded-xl border flex flex-col items-center justify-center text-center transition ${
                      formData.recipientType === "SPECIFIC"
                        ? "border-[#FB2467] bg-pink-50/50 text-[#FB2467] font-bold shadow-sm"
                        : "border-gray-200 hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <User className="w-5 h-5 mb-1.5" />
                    <span className="text-xs">Specific User</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, recipientType: "GROUP" });
                      setSelectedRecipientUser(null);
                    }}
                    className={`p-3.5 rounded-xl border flex flex-col items-center justify-center text-center transition ${
                      formData.recipientType === "GROUP"
                        ? "border-[#FB2467] bg-pink-50/50 text-[#FB2467] font-bold shadow-sm"
                        : "border-gray-200 hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <Users className="w-5 h-5 mb-1.5" />
                    <span className="text-xs">User Segment</span>
                  </button>
                </div>
              </div>

              {/* Specific User Search (If selected) */}
              {formData.recipientType === "SPECIFIC" && (
                <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-100 space-y-3">
                  <label className="block text-xs font-bold text-blue-900">
                    Search Candidate (Name, Phone, or Profile ID like BV-10245)
                  </label>

                  {selectedRecipientUser ? (
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200 shadow-sm">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-800 text-sm">
                          {selectedRecipientUser.name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{selectedRecipientUser.name}</p>
                          <p className="text-xs text-gray-500 font-mono">
                            {selectedRecipientUser.profileId} • {selectedRecipientUser.phone}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRecipientUser(null);
                          setFormData({ ...formData, userQuery: "" });
                        }}
                        className="text-xs text-red-500 hover:text-red-700 font-semibold"
                      >
                        Change
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Type candidate Name or BV-XXXXXX..."
                        value={formData.userQuery}
                        onChange={(e) => setFormData({ ...formData, userQuery: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white border border-blue-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                      />

                      {searchingUser && (
                        <span className="absolute right-3 top-3 text-xs text-blue-400 animate-pulse font-medium">
                          Searching...
                        </span>
                      )}

                      {userSearchResults.length > 0 && (
                        <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden divide-y divide-gray-100">
                          {userSearchResults.map((u) => (
                            <button
                              key={u._id}
                              type="button"
                              onClick={() => {
                                setSelectedRecipientUser(u);
                                setFormData({ ...formData, userQuery: u.profileId || u.name });
                                setUserSearchResults([]);
                              }}
                              className="w-full px-4 py-2.5 text-left hover:bg-blue-50/50 flex items-center justify-between text-xs"
                            >
                              <div>
                                <span className="font-bold text-gray-900">{u.name}</span>
                                <span className="text-gray-500 ml-2">({u.gender}, {u.currentCity || "India"})</span>
                              </div>
                              <span className="font-mono font-semibold text-[#FB2467]">{u.profileId}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Group Selector (If selected) */}
              {formData.recipientType === "GROUP" && (
                <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-100 space-y-2">
                  <label className="block text-xs font-bold text-emerald-900">
                    Select Target User Segment
                  </label>
                  <select
                    value={formData.targetGroup}
                    onChange={(e) => setFormData({ ...formData, targetGroup: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-emerald-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="FREE_USERS">Free Tier Users (Encourage Upgrades)</option>
                    <option value="PREMIUM_USERS">Premium Active Members</option>
                    <option value="FEMALE">Female Candidates Only</option>
                    <option value="MALE">Male Candidates Only</option>
                    <option value="UNVERIFIED">Unverified Profiles (Prompt Document Submission)</option>
                    <option value="VERIFIED">Verified Profiles</option>
                  </select>
                </div>
              )}

              {/* Type & Priority Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">
                    Notification Category
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 bg-white focus:outline-none focus:border-[#FB2467]"
                  >
                    <option value="ADMIN_BROADCAST">📢 Platform Announcement</option>
                    <option value="ACCOUNT_REPORT">📋 Account Report / Status</option>
                    <option value="SUBSCRIPTION">👑 Plan / Subscription Notice</option>
                    <option value="SYSTEM_ALERT">⚠️ Security / System Alert</option>
                    <option value="GENERAL">ℹ️ General Information</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">
                    Priority Level
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 bg-white focus:outline-none focus:border-[#FB2467]"
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">High (Prominent)</option>
                    <option value="URGENT">Urgent (Immediate Highlight)</option>
                  </select>
                </div>
              </div>

              {/* Title & Message */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">
                  Notification Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Happy Ganesh Chaturthi from BariVivah Team!"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FB2467]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">
                  Message Content *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Write your detailed broadcast message or account report note..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FB2467]"
                />
              </div>

              {/* Optional App Route Link */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">
                  Optional App Action Route (Deep Link)
                </label>
                <select
                  value={formData.actionUrl}
                  onChange={(e) => setFormData({ ...formData, actionUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 bg-white focus:outline-none focus:border-[#FB2467]"
                >
                  <option value="">None (Standard View)</option>
                  <option value="/(dashboard)/subscription">👑 Open Premium Membership Plans</option>
                  <option value="/(dashboard)/invoices">🧾 Open Invoices & Tax Receipts</option>
                  <option value="/(dashboard)/verification">🛡️ Open Profile Verification</option>
                  <option value="/(dashboard)/account-settings">⚙️ Open Account Settings</option>
                </select>
              </div>

              {/* Live Preview Card */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <p className="text-[11px] font-bold uppercase text-gray-400 mb-2">
                  📱 Mobile In-App Preview
                </p>
                <div className="bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm flex items-start space-x-3">
                  <div className="p-2 bg-pink-50 rounded-lg text-[#FB2467]">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-sm">{formData.title || "Notification Title"}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{formData.message || "Your message preview will appear here..."}</p>
                    <p className="text-[10px] text-gray-400 mt-1.5">Just now • BariVivah Admin</p>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsComposerOpen(false)}
                  className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center space-x-2 px-6 py-2.5 bg-[#FB2467] hover:bg-[#e01e5a] text-white rounded-xl font-bold shadow-md transition text-sm disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? "Publishing..." : "Send Broadcast Now"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
