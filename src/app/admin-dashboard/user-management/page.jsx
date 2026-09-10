"use client";
import { useState, useEffect } from "react";
import {
  UserPlus,
  Download,
  Search,
  Filter,
  Users,
  Eye,
  Edit3,
  Ban,
  Crown,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Heart,
  HelpCircle,
  Calendar,
  MapPin,
  Phone,
  Mail,
  FileText,
  Sparkles,
  ShieldAlert,
} from "lucide-react";

export default function UserManagement() {
  const [viewMode, setViewMode] = useState("active"); // "active" | "deleted"
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]); // Store all users for filtering
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // Deleted Accounts state
  const [deletedAccounts, setDeletedAccounts] = useState([]);
  const [deletedLoading, setDeletedLoading] = useState(false);
  const [deletedSearch, setDeletedSearch] = useState("");
  const [deletedReasonFilter, setDeletedReasonFilter] = useState("All");
  const [deletedStats, setDeletedStats] = useState({ totalAll: 0, marriedCount: 0, otherCount: 0 });
  const [selectedDeletedAccount, setSelectedDeletedAccount] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [planFilter, setPlanFilter] = useState("All Plans");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const usersPerPage = 10;

  const fetchDeletedAccounts = async () => {
    try {
      setDeletedLoading(true);
      const response = await fetch(`/api/admin/deleted-accounts?limit=all`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setDeletedAccounts(data.data);
          if (data.stats) {
            setDeletedStats(data.stats);
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch deleted accounts:", err);
    } finally {
      setDeletedLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedAccounts();
  }, []);
  
  // Modify the fetchUsers function to fetch all users at once
const fetchUsers = async (page = 1) => {
  try {
    setLoading(true);
    // Remove pagination parameters to get all users
    const response = await fetch(`/api/users/fetchAllUsers?limit=all`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    
    const data = await response.json();
    
    if (data.success && Array.isArray(data.data)) {
      // Transform API data to match UI expectations
      const transformedUsers = (data.data || []).map(user => ({
        id: user._id,
        name: user.name || 'N/A',
        email: user.phone, // Using phone as email since API doesn't have email
        phone: user.phone,
        status: user.isVerified ? 'Active' : (user.verificationStatus === 'Pending' ? 'Pending' : 'Inactive'),
        plan: user.subscription?.plan || 'Free',
        joined: new Date(user.createdAt).toLocaleDateString('en-US'),
        age: user.dob ? Math.floor((new Date() - new Date(user.dob)) / (365.25 * 24 * 60 * 60 * 1000)) : 'N/A',
        dob: user.dob ? new Date(user.dob).toLocaleDateString('en-US') : 'N/A',
        address: user.location?.currentCity
          ? `${user.location.currentCity}${user.location.state ? `, ${user.location.state}` : ''}`
          : (user.currentCity || 'N/A'),
        gpsVerified: Boolean(user.location?.latitude && user.location?.longitude),
        education: user.education || 'N/A',
        familyBackground: user.occupation || 'N/A',
        height: user.height || 'N/A',
        hobbies: 'N/A', // API doesn't have hobbies field
        gender: user.gender || 'N/A',
        maritalStatus: user.maritalStatus || 'N/A',
        motherTongue: user.motherTongue || 'N/A',
        religion: user.religion || 'N/A',
        caste: user.caste || 'N/A',
        subCaste: user.subCaste || 'N/A',
        gothra: user.gothra || 'N/A',
        college: user.college || 'N/A',
        workSector: user.workSector || 'N/A',
        fieldOfStudy: user.fieldOfStudy || 'N/A',
        profilePhoto : user.profilePhoto || '',
        income: user.income || 'N/A',
        lastLogin: user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('en-US') : 'Never',
        isVerified: user.isVerified,
        phoneIsVerified: user.phoneIsVerified,
        verificationStatus: user.verificationStatus || 'Unverified',
        adminWillFill: user.profileSetup?.willAdminFill || false
      }));
      
      setUsers(transformedUsers);
      setAllUsers(transformedUsers); // Store all users for client-side filtering
      setTotalUsers(transformedUsers.length); // Use the length of all users
      setTotalPages(Math.ceil(transformedUsers.length / usersPerPage)); // Calculate pages based on all users
      setCurrentPage(page); // Keep the current page functionality
    } else {
      throw new Error('API response indicates failure');
    }
  } catch (err) {
    setError(err.message);
    console.error('Error fetching users:', err);
  } finally {
    setLoading(false);
  }
};

  // Apply filters
  const applyFilters = () => {
    let filtered = [...allUsers];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(term) || 
        user.email.toLowerCase().includes(term) ||
        user.phone.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (statusFilter !== "All Status") {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    // Apply plan filter
    if (planFilter !== "All Plans") {
      filtered = filtered.filter(user => user.plan === planFilter);
    }

    setUsers(filtered);
    setTotalUsers(filtered.length);
    setTotalPages(Math.ceil(filtered.length / usersPerPage));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Load users on component mount
  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  // Apply filters when filter criteria change
  useEffect(() => {
    if (allUsers.length > 0) {
      applyFilters();
    }
  }, [searchTerm, statusFilter, planFilter]);

  // Pagination handlers
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle view user details
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setEditingUser(null);
  };

  // Handle edit user
  const handleEditUser = (user) => {
    setEditingUser(user);
    setEditFormData(user);
    setSelectedUser(null);
  };

  // Handle save edited user
  const handleSaveEdit = () => {
    setUsers(users.map(user => 
      user.name === editingUser.name ? { ...user, ...editFormData } : user
    ));
    setEditingUser(null);
  };

  const handleExportUser = async (user) => {
    console.log("user ==========",user)
    try {
      const response = await fetch('/api/users/generatePdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userData: user }),
      });

      const data = await response.json();

      if (data.success) {
        // Create a download link
        const link = document.createElement('a');
        link.href = `data:application/pdf;base64,${data.pdf}`;
        link.download = data.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error('Failed to generate PDF');
      }
    } catch (error) {
      console.error('Error exporting user:', error);
    }
  };

  // Handle toggle admin can fill
  const handleToggleAdminFill = async (userId, currentValue) => {
    try {
      const response = await fetch('/api/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          profileSetup: {
            willAdminFill: !currentValue
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update admin fill setting');
      }

      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, adminWillFill: !currentValue } : user
      ));
      setAllUsers(allUsers.map(user => 
        user.id === userId ? { ...user, adminWillFill: !currentValue } : user
      ));

    } catch (error) {
      console.error("Error updating admin fill setting:", error);
    }
  };

  // Handle ban/suspend user
  const handleBanUser = (userName) => {
    setUsers(users.map(user => 
      user.name === userName ? { ...user, status: "Suspended" } : user
    ));
  };

  // Get unique statuses and plans for filter dropdowns
  const uniqueStatuses = ["All Status", ...new Set(allUsers.map(user => user.status))];
  const uniquePlans = ["All Plans", ...new Set(allUsers.map(user => user.plan))];

  // Calculate display range for pagination
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = Math.min(startIndex + usersPerPage, totalUsers);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
        <span className="ml-2 text-gray-600">Loading users...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error: {error}</p>
        <button 
          onClick={() => fetchUsers(currentPage)}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // Compute filtered deleted accounts
  const filteredDeletedAccounts = deletedAccounts.filter((account) => {
    const matchesSearch =
      !deletedSearch.trim() ||
      (account.name && account.name.toLowerCase().includes(deletedSearch.toLowerCase())) ||
      (account.phone && account.phone.includes(deletedSearch)) ||
      (account.email && account.email.toLowerCase().includes(deletedSearch.toLowerCase())) ||
      (account.profileId && account.profileId.toLowerCase().includes(deletedSearch.toLowerCase())) ||
      (account.reasonText && account.reasonText.toLowerCase().includes(deletedSearch.toLowerCase())) ||
      (account.city && account.city.toLowerCase().includes(deletedSearch.toLowerCase()));

    const matchesReason =
      deletedReasonFilter === "All" || account.reasonCategory === deletedReasonFilter;

    return matchesSearch && matchesReason;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card with View Mode Switcher */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-rose-100/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">User Management</h2>
            <p className="text-gray-600">
              {viewMode === "active"
                ? `Manage all active registered members and their profiles (${totalUsers} active users)`
                : `Review permanent account deletion records and candidate feedback (${deletedStats.totalAll} deleted accounts)`}
            </p>
          </div>
        </div>

        {/* View Mode Toggle Tabs */}
        <div className="flex items-center space-x-3 mt-6 border-b border-gray-100 pb-4">
          <button
            onClick={() => setViewMode("active")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
              viewMode === "active"
                ? "bg-rose-600 text-white shadow-md shadow-rose-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Active Members ({totalUsers})</span>
          </button>
          <button
            onClick={() => {
              setViewMode("deleted");
              fetchDeletedAccounts();
            }}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
              viewMode === "deleted"
                ? "bg-rose-600 text-white shadow-md shadow-rose-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Trash2 className="w-4 h-4" />
            <span>Deleted Accounts ({deletedStats.totalAll})</span>
          </button>
        </div>

        {viewMode === "active" ? (
          /* Active Users Filters */
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {uniqueStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <select 
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
            >
              {uniquePlans.map(plan => (
                <option key={plan} value={plan}>{plan}</option>
              ))}
            </select>
          </div>
        ) : (
          /* Deleted Accounts Filters & KPI Cards */
          <div className="space-y-5 mt-4">
            {/* KPI Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center font-bold">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase">Total Deleted</p>
                  <p className="text-xl font-bold text-slate-900">{deletedStats.totalAll}</p>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold">
                  <Heart className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                </div>
                <div>
                  <p className="text-xs text-emerald-700 font-medium uppercase">💍 Got Married / Found Match</p>
                  <p className="text-xl font-bold text-emerald-900">{deletedStats.marriedCount}</p>
                </div>
              </div>

              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-rose-200 text-rose-800 flex items-center justify-center font-bold">
                  <HelpCircle className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <p className="text-xs text-rose-700 font-medium uppercase">📝 Other Reasons</p>
                  <p className="text-xl font-bold text-rose-900">{deletedStats.otherCount}</p>
                </div>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search deleted accounts (Name, Phone, Profile ID, Reason)..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
                  value={deletedSearch}
                  onChange={(e) => setDeletedSearch(e.target.value)}
                />
              </div>
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
                value={deletedReasonFilter}
                onChange={(e) => setDeletedReasonFilter(e.target.value)}
              >
                <option value="All">All Reasons ({deletedStats.totalAll})</option>
                <option value="Married">💍 Got Married ({deletedStats.marriedCount})</option>
                <option value="Other">📝 Other Reason ({deletedStats.otherCount})</option>
              </select>
              <button
                onClick={fetchDeletedAccounts}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        )}
      </div>

      {viewMode === "active" ? (
        /* Active Users Table */
        <div className="bg-white rounded-xl shadow-lg border border-rose-100/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">User</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Plan</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Joined</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Last Login</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Admin Can Fill</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(startIndex, endIndex).map((user, index) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-rose-50/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-rose-100 to-amber-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-rose-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            {user.phone ? `+91 ${user.phone}` : user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : user.status === 'Pending' 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.plan === 'Premium' || user.plan === 'Gold'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.plan === 'Premium' || user.plan === 'Gold' ? <Crown className="w-3 h-3 mr-1" /> : null}
                        {user.plan}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {user.joined}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {user.lastLogin}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={user.adminWillFill}
                          onChange={(e) => handleToggleAdminFill(user.id, user.adminWillFill)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
                      </label>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-rose-600"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-blue-600"
                          title="Edit User"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleBanUser(user.name)}
                          className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-red-600"
                          title="Suspend User"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Enhanced Pagination */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {startIndex + 1} to {endIndex} of {totalUsers} users
              </p>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 border rounded-lg text-sm font-medium flex items-center ${
                    currentPage === 1 
                      ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </button>
                
                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => goToPage(pageNumber)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium ${
                          currentPage === pageNumber
                            ? 'bg-rose-500 text-white'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>
                
                <button 
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 border rounded-lg text-sm font-medium flex items-center ${
                    currentPage === totalPages 
                      ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Deleted Accounts Table View */
        <div className="bg-white rounded-xl shadow-lg border border-rose-100/50 overflow-hidden">
          {deletedLoading ? (
            <div className="flex items-center justify-center p-12 text-gray-500">
              <Loader2 className="w-6 h-6 animate-spin text-rose-500 mr-2" />
              <span>Loading deleted accounts archive...</span>
            </div>
          ) : filteredDeletedAccounts.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Trash2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="font-semibold text-gray-700">No deleted accounts found</p>
              <p className="text-xs text-gray-400 mt-1">
                {deletedSearch ? 'Try adjusting your search criteria' : 'No account deletions recorded yet.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Candidate</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Contact / City</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Reason Category</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">User Reason / Feedback</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Deleted On</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDeletedAccounts.map((account) => (
                    <tr key={account._id || account.userId} className="border-b border-gray-100 hover:bg-rose-50/20 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-slate-200 to-rose-100 rounded-full flex items-center justify-center text-slate-700 font-bold text-sm">
                            {account.name ? account.name.charAt(0).toUpperCase() : 'M'}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{account.name || 'Candidate'}</p>
                            <p className="text-xs text-rose-600 font-bold tracking-wider">
                              ID: {account.profileId || `BV-${account.userId ? account.userId.slice(-5).toUpperCase() : 'N/A'}`}
                            </p>
                            {account.gender && (
                              <p className="text-[11px] text-gray-400">{account.gender}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm">
                          <p className="text-gray-900 font-medium">
                            {account.phone ? `+91 ${account.phone.replace('+91', '')}` : 'No phone'}
                          </p>
                          <p className="text-xs text-gray-500">{account.email || 'No email'}</p>
                          {account.city && (
                            <p className="text-xs text-slate-600 mt-0.5">📍 {account.city}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {account.reasonCategory === 'Married' ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <Heart className="w-3 h-3 mr-1 text-emerald-600 fill-emerald-600" />
                            💍 Got Married
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
                            <HelpCircle className="w-3 h-3 mr-1 text-rose-600" />
                            📝 Other Reason
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 max-w-xs">
                        <p className="text-sm text-gray-800 line-clamp-2" title={account.reasonText}>
                          {account.reasonText || 'No specific explanation given.'}
                        </p>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600 whitespace-nowrap">
                        <p className="font-medium text-gray-900">
                          {account.deletedAt ? new Date(account.deletedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {account.deletedAt ? new Date(account.deletedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : ''}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => setSelectedDeletedAccount(account)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Details</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* View User Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-gray-800/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-rose-100/50 w-full max-w-4xl overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-rose-50 to-amber-50 px-6 py-4 border-b border-rose-100 flex justify-between items-center sticky top-0">
              <div>
                <h3 className="text-xl font-bold text-rose-800">User Profile</h3>
                <p className="text-sm text-rose-600/80">Detailed information about {selectedUser.name}</p>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-rose-400 hover:text-rose-600 transition-colors p-1 rounded-full hover:bg-rose-100/50"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User Avatar and Basic Info */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-rose-200 to-amber-200 rounded-full flex items-center justify-center shadow-md">
                    <Users className="w-8 h-8 text-rose-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{selectedUser.name}</h4>
                    <div className="flex space-x-2 mt-1">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedUser.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : selectedUser.status === "Pending"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {selectedUser.status}
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedUser.plan === "Premium" || selectedUser.plan === "Gold"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {selectedUser.plan === "Premium" || selectedUser.plan === "Gold" ? (
                          <Crown className="w-3 h-3 mr-1" />
                        ) : null}
                        {selectedUser.plan}
                      </span>
                      {selectedUser.isVerified && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Check className="w-3 h-3 mr-1" />
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="mt-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedUser.adminWillFill}
                          onChange={(e) => handleToggleAdminFill(selectedUser.id, selectedUser.adminWillFill)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
                        <span className="ml-3 text-sm font-medium text-gray-700">
                          Admin Can Fill
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Personal Details Card */}
                <div className="bg-gray-50/70 rounded-lg p-4 border border-gray-100">
                  <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                    <Users className="h-4 w-4 mr-2 text-rose-500" />
                    Personal Details
                  </h5>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500">Age</p>
                      <p className="font-medium">{selectedUser.age}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Gender</p>
                      <p className="font-medium">{selectedUser.gender}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Date of Birth</p>
                      <p className="font-medium">{selectedUser.dob}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Marital Status</p>
                      <p className="font-medium">{selectedUser.maritalStatus}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Height</p>
                      <p className="font-medium">{selectedUser.height}</p>
                    </div>
                  </div>
                </div>

                {/* Religious Details Card */}
                <div className="bg-gray-50/70 rounded-lg p-4 border border-gray-100">
                  <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                    <Crown className="h-4 w-4 mr-2 text-rose-500" />
                    Religious & Cultural Details
                  </h5>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500">Religion</p>
                      <p className="font-medium">{selectedUser.religion}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Caste</p>
                      <p className="font-medium">{selectedUser.caste}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Sub Caste</p>
                      <p className="font-medium">{selectedUser.subCaste}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Gothra</p>
                      <p className="font-medium">{selectedUser.gothra}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-500">Mother Tongue</p>
                      <p className="font-medium">{selectedUser.motherTongue}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                {/* Address Card */}
                <div className="bg-gray-50/70 rounded-lg p-4 border border-gray-100">
                  <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Location
                  </h5>
                  <p className="text-sm">{selectedUser.address}</p>
                </div>

                {/* Education & Career Card */}
                <div className="bg-gray-50/70 rounded-lg p-4 border border-gray-100">
                  <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                    Education & Career
                  </h5>
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-1 gap-2">
                      <div>
                        <p className="text-gray-500">Education</p>
                        <p className="font-medium">{selectedUser.education}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Field of Study</p>
                        <p className="font-medium">{selectedUser.fieldOfStudy}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">College</p>
                        <p className="font-medium">{selectedUser.college}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Occupation</p>
                        <p className="font-medium">{selectedUser.familyBackground}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Work Sector</p>
                        <p className="font-medium">{selectedUser.workSector}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Income</p>
                        <p className="font-medium">{selectedUser.income}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Details Card */}
                <div className="bg-gray-50/70 rounded-lg p-4 border border-gray-100">
                  <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Account Information
                  </h5>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500">Joined</p>
                      <p className="font-medium">{selectedUser.joined}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Last Login</p>
                      <p className="font-medium">{selectedUser.lastLogin}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Verification Status</p>
                      <p className="font-medium">{selectedUser.verificationStatus}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Phone Verified</p>
                      <p className="font-medium">{selectedUser.phoneIsVerified ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-3 border-t border-rose-100 flex justify-end space-x-3 sticky bottom-0">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
              >
                Close
              </button>
             <button 
                className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                onClick={() => handleEditUser(selectedUser)}
              >
                Edit User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-gray-800/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-rose-100/50 w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-rose-50 to-amber-50 px-6 py-4 border-b border-rose-100 flex justify-between items-center sticky top-0">
              <div>
                <h3 className="text-xl font-bold text-rose-800">Edit User</h3>
                <p className="text-sm text-rose-600/80">Update information for {editingUser.name}</p>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="text-rose-400 hover:text-rose-600 transition-colors p-1 rounded-full hover:bg-rose-100/50"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name || ''}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      name="status"
                      value={editFormData.status || ''}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Pending">Pending</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
                    <select
                      name="plan"
                      value={editFormData.plan || ''}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    >
                      <option value="Free">Free</option>
                      <option value="Premium">Premium</option>
                      <option value="Gold">Gold</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
                  <select
                    name="plan"
                    value={editFormData.plan || ''}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  >
                    <option value="Free">Free</option>
                    <option value="Premium">Premium</option>
                    <option value="Gold">Gold</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    name="gender"
                    value={editFormData.gender || ''}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                  <input
                    type="text"
                    name="education"
                    value={editFormData.education || ''}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={editFormData.address || ''}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                  <input
                    type="text"
                    name="familyBackground"
                    value={editFormData.familyBackground || ''}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-3 border-t border-rose-100 flex justify-end space-x-3 sticky bottom-0">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deleted Account Details Modal */}
      {selectedDeletedAccount && (
        <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-rose-100 w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4 text-white flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-rose-400">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Deleted Account Details</h3>
                  <p className="text-xs text-slate-300">
                    ID: {selectedDeletedAccount.profileId || `BV-${selectedDeletedAccount.userId?.slice(-5).toUpperCase() || 'N/A'}`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDeletedAccount(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5 overflow-y-auto">
              {/* Deletion Reason Hero Banner */}
              <div className={`p-4 rounded-xl border ${
                selectedDeletedAccount.reasonCategory === 'Married'
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-rose-50 border-rose-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                    selectedDeletedAccount.reasonCategory === 'Married'
                      ? 'bg-emerald-200 text-emerald-900'
                      : 'bg-rose-200 text-rose-900'
                  }`}>
                    {selectedDeletedAccount.reasonCategory === 'Married' ? (
                      <>
                        <Heart className="w-3.5 h-3.5 mr-1 text-emerald-700 fill-emerald-700" />
                        💍 Got Married / Found Match
                      </>
                    ) : (
                      <>
                        <HelpCircle className="w-3.5 h-3.5 mr-1 text-rose-700" />
                        📝 Other Reason
                      </>
                    )}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Deleted on {selectedDeletedAccount.deletedAt ? new Date(selectedDeletedAccount.deletedAt).toLocaleString('en-IN') : 'N/A'}
                  </span>
                </div>
                <div className="mt-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">User Explanation / Feedback:</p>
                  <p className="text-sm text-slate-800 bg-white/80 p-3 rounded-lg border border-slate-200/60 leading-relaxed font-medium">
                    "{selectedDeletedAccount.reasonText || 'No custom reason specified by user.'}"
                  </p>
                </div>
              </div>

              {/* Candidate Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Member Details</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-xs text-slate-400">Full Name</p>
                      <p className="font-semibold text-slate-800">{selectedDeletedAccount.name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Gender</p>
                      <p className="font-medium text-slate-700">{selectedDeletedAccount.gender || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Location / City</p>
                      <p className="font-medium text-slate-700">📍 {selectedDeletedAccount.city || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Contact & Account</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-xs text-slate-400">Mobile Phone</p>
                      <p className="font-semibold text-slate-800">
                        {selectedDeletedAccount.phone ? `+91 ${selectedDeletedAccount.phone.replace('+91', '')}` : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Email Address</p>
                      <p className="font-medium text-slate-700">{selectedDeletedAccount.email || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Plan at Deletion</p>
                      <p className="font-medium text-slate-700">{selectedDeletedAccount.plan || 'Free'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Original Registration Timestamp */}
              <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-500 flex justify-between items-center">
                <span>Original Registration Date:</span>
                <span className="font-medium text-gray-700">
                  {selectedDeletedAccount.registeredAt ? new Date(selectedDeletedAccount.registeredAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedDeletedAccount(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}