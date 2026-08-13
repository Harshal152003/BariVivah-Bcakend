"use client";

import { useState, useEffect } from "react";
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  Check,
  X,
  FileText,
  Camera,
  User as UserIcon,
} from "lucide-react";

export default function AdminVerificationsPage() {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("Pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [rejectReason, setRejectReason] = useState("Face mismatch with profile photos");
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/verifications?status=${statusFilter}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setVerifications(data.users || []);
      } else {
        setVerifications([]);
      }
    } catch (err) {
      console.error("Failed to fetch verifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, [statusFilter]);

  const handleAction = async (userId, action) => {
    try {
      setProcessing(true);
      const res = await fetch(`/api/admin/verifications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          action,
          rejectReason: action === "reject" ? rejectReason : null,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: "success", text: data.message });
        setSelectedUser(null);
        fetchVerifications();
      } else {
        setMessage({ type: "error", text: data.error || "Action failed" });
      }
    } catch (err) {
      console.error("Verification Action Error:", err);
      setMessage({ type: "error", text: "Network failure while processing action." });
    } finally {
      setProcessing(false);
    }
  };

  const filteredVerifications = verifications.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(term)) ||
      (u.phone && u.phone.includes(term)) ||
      (u.email && u.email.toLowerCase().includes(term))
    );
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-[#F26492]" /> Profile Verification Queue
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Review live selfie poses and government ID submissions to issue verified trust badges.
          </p>
        </div>

        <button
          onClick={fetchVerifications}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#F26492]" : ""}`} /> Refresh Queue
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl mb-6 flex items-center justify-between ${
            message.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-rose-50 border border-rose-200 text-rose-800"
          }`}
        >
          <p className="text-sm font-semibold">{message.text}</p>
          <button onClick={() => setMessage(null)} className="text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {["Pending", "Verified", "Rejected", "all"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                statusFilter === st
                  ? "bg-[#F26492] text-white shadow-md shadow-pink-100"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {st === "all" ? "All Requests" : st}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26492]"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#F26492] mb-2" />
            <p className="text-sm font-medium">Loading verification submissions...</p>
          </div>
        ) : filteredVerifications.length === 0 ? (
          <div className="p-12 text-center">
            <ShieldCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-700">No {statusFilter} Verifications Found</h3>
            <p className="text-xs text-gray-400 mt-1">Submissions will appear here when users submit verification requests.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-100">
                  <th className="py-3.5 px-6">Candidate</th>
                  <th className="py-3.5 px-4">Submitted Live Selfie</th>
                  <th className="py-3.5 px-4">Govt ID Doc</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Submitted At</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredVerifications.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50/50 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {u.profilePhoto ? (
                          <img src={u.profilePhoto} alt={u.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-pink-50 text-[#F26492] flex items-center justify-center font-bold">
                            {u.name ? u.name.charAt(0) : "U"}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-gray-900">{u.name || "Candidate User"}</p>
                          <p className="text-xs text-gray-500">{u.phone} • {u.gender || "Gender N/A"}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      {u.verificationSelfieUrl ? (
                        <div className="relative group w-14 h-14 rounded-lg overflow-hidden border border-pink-200">
                          <img src={u.verificationSelfieUrl} alt="Selfie Pose" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                            <Camera className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">No Selfie</span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      {u.verificationDocUrl ? (
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-amber-600" />
                          <span className="text-xs font-semibold text-gray-700">{u.verificationDocType || "Govt ID"}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">None Uploaded</span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          u.verificationStatus === "Verified"
                            ? "bg-emerald-100 text-emerald-800"
                            : u.verificationStatus === "Pending"
                            ? "bg-amber-100 text-amber-800"
                            : u.verificationStatus === "Rejected"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {u.verificationStatus === "Verified" && <CheckCircle className="w-3.5 h-3.5" />}
                        {u.verificationStatus === "Rejected" && <XCircle className="w-3.5 h-3.5" />}
                        {u.verificationStatus || "Unverified"}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-xs text-gray-500">
                      {u.verificationSubmittedAt ? new Date(u.verificationSubmittedAt).toLocaleDateString() : "N/A"}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedUser(u)}
                        className="px-3.5 py-1.5 bg-[#F26492] text-white text-xs font-bold rounded-lg hover:bg-pink-600 transition shadow-sm inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Review Submission
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Side-by-Side Verification Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 p-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-[#F26492]" /> Verification Review: {selectedUser.name}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Phone: {selectedUser.phone} • Email: {selectedUser.email || "N/A"}</p>
              </div>
              <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* 3-Column Side-by-Side Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Box 1: Profile Photo */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-center">
                <p className="text-xs font-bold text-gray-600 uppercase mb-3 flex items-center justify-center gap-1">
                  <UserIcon className="w-4 h-4 text-blue-600" /> Primary Profile Photo
                </p>
                {selectedUser.profilePhoto ? (
                  <img src={selectedUser.profilePhoto} alt="Profile" className="w-full h-64 object-cover rounded-lg border border-gray-300" />
                ) : (
                  <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                    No Profile Image
                  </div>
                )}
              </div>

              {/* Box 2: Live Selfie Pose Photo */}
              <div className="bg-pink-50/50 p-4 rounded-xl border border-pink-200 text-center">
                <p className="text-xs font-bold text-[#F26492] uppercase mb-3 flex items-center justify-center gap-1">
                  <Camera className="w-4 h-4" /> Live Pose Selfie
                </p>
                {selectedUser.verificationSelfieUrl ? (
                  <img src={selectedUser.verificationSelfieUrl} alt="Selfie Pose" className="w-full h-64 object-cover rounded-lg border border-pink-300" />
                ) : (
                  <div className="w-full h-64 bg-pink-100/50 rounded-lg flex items-center justify-center text-pink-400 text-sm">
                    No Live Selfie Captured
                  </div>
                )}
              </div>

              {/* Box 3: Government ID Document */}
              <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200 text-center">
                <p className="text-xs font-bold text-amber-700 uppercase mb-3 flex items-center justify-center gap-1">
                  <FileText className="w-4 h-4" /> {selectedUser.verificationDocType || "Govt ID"} Image
                </p>
                {selectedUser.verificationDocUrl ? (
                  <img src={selectedUser.verificationDocUrl} alt="Govt ID" className="w-full h-64 object-cover rounded-lg border border-amber-300" />
                ) : (
                  <div className="w-full h-64 bg-amber-100/40 rounded-lg flex items-center justify-center text-amber-600 text-sm">
                    No Document Uploaded
                  </div>
                )}
              </div>
            </div>

            {/* Approval / Rejection Actions Footer */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1 w-full">
                <label className="block text-xs font-bold text-gray-700 mb-1">Rejection Reason (If Rejecting)</label>
                <select
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg text-xs p-2.5 focus:ring-2 focus:ring-[#F26492]"
                >
                  <option value="Face mismatch with profile photo">Face mismatch with profile photo</option>
                  <option value="Blurry selfie image or unreadable camera pose">Blurry selfie image or unreadable camera pose</option>
                  <option value="Incorrect hand gesture pose">Incorrect hand gesture pose</option>
                  <option value="Name / Age mismatch on Government Document">Name / Age mismatch on Government Document</option>
                </select>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  disabled={processing}
                  onClick={() => handleAction(selectedUser._id, "reject")}
                  className="flex-1 md:flex-none px-5 py-2.5 bg-rose-600 text-white font-bold text-xs rounded-xl hover:bg-rose-700 transition shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" /> Reject Submission
                </button>

                <button
                  disabled={processing}
                  onClick={() => handleAction(selectedUser._id, "approve")}
                  className="flex-1 md:flex-none px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" /> Approve & Issue Trust Badge
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
