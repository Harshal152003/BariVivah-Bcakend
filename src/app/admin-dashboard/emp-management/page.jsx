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
  BarChart3,
  CheckCircle,
  Flag,
  Settings,
  Shield,
  Key,
  Mail,
  Phone,
  Calendar,
  MapPin
} from "lucide-react";

export default function EmployeeManagement() {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [addFormData, setAddFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'Employee',
    status: 'Active',
    permissions: {
      overview: false,
      userManagement: false,
      verification: false,
      payment: false,
      report: false,
      setting: false
    }
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const employeesPerPage = 4;

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [roleFilter, setRoleFilter] = useState('All Roles');

  // Admin sections for permissions
  const adminSections = [
    { id: 'overview', label: 'Dashboard Overview', icon: BarChart3, route: "/admin-dashboard" },
    { id: 'userManagement', label: 'User Management', icon: Users, route: "/admin-dashboard/user-management" },
    { id: 'verification', label: 'Profile Verification', icon: CheckCircle, route: "/admin-dashboard/verification" },
    { id: 'payment', label: 'Payments & Plans', icon: Shield, route: "/admin-dashboard/payment" },
    { id: 'report', label: 'Reports & Complaints', icon: Flag, route: "/admin-dashboard/report" },
    { id: 'setting', label: 'System Settings', icon: Settings, route: "/admin-dashboard/setting" },
  ];

  // Fetch employees from API
  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `/api/employees?page=${currentPage}&limit=${employeesPerPage}`;
      
      if (searchTerm) {
        url += `&search=${searchTerm}`;
      }
      
      if (statusFilter !== 'All Status') {
        url += `&status=${statusFilter}`;
      }
      
      if (roleFilter !== 'All Roles') {
        url += `&role=${roleFilter}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }
      const data = await response.json();
      
      setEmployees(data.data);
      setTotalEmployees(data.pagination.totalEmployees);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch employees on component mount and when filters/pagination changes
  useEffect(() => {
    fetchEmployees();
  }, [currentPage, searchTerm, statusFilter, roleFilter]);

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

  // Handle view employee details
  const handleViewEmployee = async (employee) => {
    try {
      const response = await fetch(`/api/employees/${employee._id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch employee details');
      }
      const data = await response.json();
      setSelectedEmployee(data.data);
      setEditingEmployee(null);
      setShowAddModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle edit employee
  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setEditFormData({
      ...employee,
      permissions: employee.permissions || {
        overview: false,
        userManagement: false,
        verification: false,
        payment: false,
        report: false,
        setting: false
      }
    });
    setSelectedEmployee(null);
    setShowAddModal(false);
  };

  // Handle save edited employee
  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`/api/employees/${editingEmployee._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });

      if (!response.ok) {
        throw new Error('Failed to update employee');
      }

      await fetchEmployees();
      setEditingEmployee(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle ban/suspend employee
  const handleBanEmployee = async (employeeId) => {
    try {
      const response = await fetch(`/api/employees/${employeeId}/suspend`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Failed to suspend employee');
      }

      await fetchEmployees();
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle delete employee
  const handleDeleteEmployee = async (employeeId) => {
    try {
      const response = await fetch(`/api/employees/${employeeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete employee');
      }

      await fetchEmployees();
      setSelectedEmployee(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle add employee
  const handleAddEmployee = async () => {
    if (addFormData.password !== addFormData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add employee');
      }

      await fetchEmployees();
      
      // Reset form
      setAddFormData({
        name: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'Employee',
        status: 'Active',
        permissions: {
          overview: false,
          userManagement: false,
          verification: false,
          payment: false,
          report: false,
          setting: false
        }
      });
      setShowAddModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle input change in edit form
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('permissions.')) {
      const permissionKey = name.split('.')[1];
      setEditFormData({
        ...editFormData,
        permissions: {
          ...editFormData.permissions,
          [permissionKey]: checked
        }
      });
    } else {
      setEditFormData({
        ...editFormData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  // Handle input change in add form
  const handleAddChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('permissions.')) {
      const permissionKey = name.split('.')[1];
      setAddFormData({
        ...addFormData,
        permissions: {
          ...addFormData.permissions,
          [permissionKey]: checked
        }
      });
    } else {
      setAddFormData({
        ...addFormData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  // Handle role filter change
  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#FB2467]" />
        <span className="ml-2 text-gray-600">Loading employees...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error: {error}</p>
        <button 
          onClick={fetchEmployees}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Employee Management Header */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-rose-100/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Employee Management</h2>
            <p className="text-gray-600">Manage all employees and their access permissions ({totalEmployees} total employees)</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-[#FB2467] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#FB2467] transition-colors flex items-center"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Employee
            </button>
            
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FB2467] focus:border-transparent"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <select 
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FB2467] focus:border-transparent"
            value={statusFilter}
            onChange={handleStatusFilterChange}
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
            <option>Suspended</option>
          </select>
          <select 
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FB2467] focus:border-transparent"
            value={roleFilter}
            onChange={handleRoleFilterChange}
          >
            <option>All Roles</option>
            <option>Employee</option>
          </select>
          
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-white rounded-xl shadow-lg border border-rose-100/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Employee</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Role</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Department</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Last Login</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee._id} className="border-b border-gray-100 hover:bg-rose-50/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-rose-100 to-amber-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-[#FB2467]" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{employee.name}</p>
                        <p className="text-sm text-gray-500">@{employee.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        employee.role === "Admin"
                          ? "bg-purple-100 text-purple-800"
                          : employee.role === "Manager"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {employee.role === "Admin" && <Crown className="w-3 h-3 mr-1" />}
                      {employee.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        employee.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : employee.status === "Inactive"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {employee.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">{employee.department}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {employee.lastLogin ? new Date(employee.lastLogin).toLocaleString() : 'Never'}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-700 p-1"
                        onClick={() => handleViewEmployee(employee)}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-gray-600 hover:text-gray-700 p-1"
                        onClick={() => handleEditEmployee(employee)}
                      >
                        <Edit3 className="w-4 h-4" />
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
              Showing {Math.min((currentPage - 1) * employeesPerPage + 1, totalEmployees)} to {Math.min(currentPage * employeesPerPage, totalEmployees)} of {totalEmployees} employees
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
                          ? 'bg-[#FB2467] text-white'
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

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-800/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-rose-100/50 w-full max-w-4xl overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-[#FFFFFF] px-6 py-4 border-b border-rose-100 flex justify-between items-center sticky top-0">
              <div>
                <h3 className="text-xl font-bold text-[#FB2467]">Add New Employee</h3>
                <p className="text-sm text-[#FB2467]/80">Create a new employee account with access permissions</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-[#FB2467] transition-colors p-1 rounded-full hover:bg-rose-100/50"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-[#FB2467]" />
                  Basic Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={addFormData.name}
                      onChange={handleAddChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FB2467] focus:border-transparent"
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={addFormData.username}
                      onChange={handleAddChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FB2467] focus:border-transparent"
                      placeholder="Enter username"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={addFormData.email}
                      onChange={handleAddChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FB2467] focus:border-transparent"
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={addFormData.phone}
                      onChange={handleAddChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FB2467] focus:border-transparent"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      name="role"
                      value={addFormData.role}
                      onChange={handleAddChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FB2467] focus:border-transparent"
                    >
                      <option value="Employee">Employee</option>
                      {/* <option value="Manager">Manager</option>
                      <option value="Admin">Admin</option> */}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      name="status"
                      value={addFormData.status}
                      onChange={handleAddChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FB2467] focus:border-transparent"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Password Section */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Key className="w-5 h-5 mr-2 text-[#FB2467]" />
                  Password Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={addFormData.password}
                      onChange={handleAddChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FB2467] focus:border-transparent"
                      placeholder="Enter password"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={addFormData.confirmPassword}
                      onChange={handleAddChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FB2467] focus:border-transparent"
                      placeholder="Confirm password"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Permissions Section */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-[#FB2467]" />
                  Access Permissions
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {adminSections.map((section) => {
                    const IconComponent = section.icon;
                    return (
                      <div key={section.id} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id={`add-${section.id}`}
                          name={`permissions.${section.id}`}
                          checked={addFormData.permissions[section.id]}
                          onChange={handleAddChange}
                          className="w-4 h-4 text-[#FB2467] bg-gray-100 border-gray-300 rounded focus:ring-[#FB2467] focus:ring-2"
                        />
                        <label htmlFor={`add-${section.id}`} className="flex items-center text-sm font-medium text-gray-700 cursor-pointer">
                          <IconComponent className="w-4 h-4 mr-2 text-gray-500" />
                          {section.label}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-3 border-t border-rose-100 flex justify-end space-x-3 sticky bottom-0">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FB2467]"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEmployee}
                className="px-4 py-2 text-sm font-medium text-white bg-[#FB2467] rounded-lg hover:bg-[#FB2467]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FB2467]"
              >
                Create Employee
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Employee Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-gray-800/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-rose-100/50 w-full max-w-4xl overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-[#FFFFFF] px-6 py-4 border-b border-rose-100 flex justify-between items-center sticky top-0">
              <div>
                <h3 className="text-xl font-bold text-[#FB2467]">Employee Profile</h3>
                <p className="text-sm text-[#FB2467]/80">Detailed information about {selectedEmployee.name}</p>
              </div>
              <button
                onClick={() => setSelectedEmployee(null)}
                className="text-gray-400 hover:text-[#FB2467] transition-colors p-1 rounded-full hover:bg-rose-100/50"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Employee Avatar and Basic Info */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-rose-200 to-amber-200 rounded-full flex items-center justify-center shadow-md">
                    <Users className="w-8 h-8 text-[#FB2467]" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{selectedEmployee.name}</h4>
                    <p className="text-gray-600">@{selectedEmployee.username}</p>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                        selectedEmployee.role === "Admin"
                          ? "bg-purple-100 text-purple-800"
                          : selectedEmployee.role === "Manager"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {selectedEmployee.role === "Admin" && <Crown className="w-3 h-3 mr-1" />}
                      {selectedEmployee.role}
                    </span>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-[#FB2467]" />
                    Contact Information
                  </h5>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      {selectedEmployee.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      {selectedEmployee.phone}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      {selectedEmployee.department}
                    </div>
                  </div>
                </div>

                {/* Employment Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-[#FB2467]" />
                    Employment Details
                  </h5>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Position:</span>
                      <span className="text-gray-900">{selectedEmployee.position}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Joined:</span>
                      <span className="text-gray-900">
                        {new Date(selectedEmployee.joined).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Last Login:</span>
                      <span className="text-gray-900">
                        {selectedEmployee.lastLogin ? new Date(selectedEmployee.lastLogin).toLocaleString() : 'Never'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Status:</span>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          selectedEmployee.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : selectedEmployee.status === "Inactive"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {selectedEmployee.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Permissions */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-[#FB2467]" />
                    Access Permissions
                  </h5>
                  <div className="space-y-3">
                    {adminSections.map((section) => {
                      const IconComponent = section.icon;
                      const hasPermission = selectedEmployee.permissions?.[section.id] || false;
                      return (
                        <div key={section.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <IconComponent className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700">{section.label}</span>
                          </div>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              hasPermission
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {hasPermission ? (
                              <>
                                <Check className="w-3 h-3 mr-1" />
                                Granted
                              </>
                            ) : (
                              <>
                                <X className="w-3 h-3 mr-1" />
                                Denied
                              </>
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-3 border-t border-rose-100 flex justify-between sticky bottom-0">
              <button
                onClick={() => handleDeleteEmployee(selectedEmployee._id)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete Employee
              </button>
              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FB2467]"
                >
                  Close
                </button>
                <button
                  onClick={() => handleEditEmployee(selectedEmployee)}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#FB2467] rounded-lg hover:bg-[#FB2467]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FB2467]"
                >
                  Edit Employee
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {editingEmployee && (
        <div className="fixed inset-0 bg-gray-800/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-rose-100/50 w-full max-w-4xl overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-[#FFFFFF] px-6 py-4 border-b border-rose-100 flex justify-between items-center sticky top-0">
              <div>
                <h3 className="text-xl font-bold text-[#FB2467]">Edit Employee</h3>
                <p className="text-sm text-[#FB2467]/80">Update employee information and permissions</p>
                              </div>
              <button
                onClick={() => setEditingEmployee(null)}
                className="text-gray-400 hover:text-[#FB2467] transition-colors p-1 rounded-full hover:bg-rose-100/50"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-[#FB2467]" />
                  Basic Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FB2467] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={editFormData.username}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FB2467] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editFormData.email}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FB2467] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={editFormData.phone}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FB2467] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      name="role"
                      value={editFormData.role}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FB2467] focus:border-transparent"
                    >
                      <option value="Employee">Employee</option>
                      <option value="Manager">Manager</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      name="status"
                      value={editFormData.status}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FB2467] focus:border-transparent"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Permissions Section */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-[#FB2467]" />
                  Access Permissions
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {adminSections.map((section) => {
                    const IconComponent = section.icon;
                    return (
                      <div key={section.id} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id={`edit-${section.id}`}
                          name={`permissions.${section.id}`}
                          checked={editFormData.permissions[section.id]}
                          onChange={handleEditChange}
                          className="w-4 h-4 text-[#FB2467] bg-gray-100 border-gray-300 rounded focus:ring-[#FB2467] focus:ring-2"
                        />
                        <label htmlFor={`edit-${section.id}`} className="flex items-center text-sm font-medium text-gray-700 cursor-pointer">
                          <IconComponent className="w-4 h-4 mr-2 text-gray-500" />
                          {section.label}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-3 border-t border-rose-100 flex justify-end space-x-3 sticky bottom-0">
              <button
                onClick={() => setEditingEmployee(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FB2467]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 text-sm font-medium text-white bg-[#FB2467] rounded-lg hover:bg-[#FB2467]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FB2467]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}