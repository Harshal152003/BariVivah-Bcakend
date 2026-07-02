"use client"
import { useState, useEffect } from 'react';
import { 
  Users, 
  CheckCircle, 
  Crown,
  Settings,
  Shield,
  BarChart3,
  Flag,
  Bell,
  Menu,
  X
} from 'lucide-react';
import { FaRupeeSign } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/context/AuthContext';

export default function AdminLayout({ children }) {
  const [activeTab, setActiveTab] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const Router = useRouter();
  const { user, loading } = useAuth();
  const [filteredSections, setFilteredSections] = useState([]);

  const allAdminSections = [
    { id: 'overview', label: 'Dashboard Overview', icon: BarChart3, route: "/admin-dashboard", permissionKey: "overview" },
    { id: 'user-management', label: 'User Management', icon: Users, route: "/admin-dashboard/user-management", permissionKey: "userManagement" },
    { id: 'emp-management', label: 'Emp Management', icon: Users, route: "/admin-dashboard/emp-management", permissionKey: "empManagement" },
    { id: 'form-management', label: 'Form Management', icon: Users, route: "/admin-dashboard/form-builder", permissionKey: "formManagement" },
    { id: 'Verification', label: 'Profile Verification', icon: CheckCircle, route: "/admin-dashboard/verification", permissionKey: "verification" },
    { id: 'Payment', label: 'Payments & Plans', icon: FaRupeeSign, route: "/admin-dashboard/payment", permissionKey: "payment" },
    { id: 'Report', label: 'Reports & Complaints', icon: Flag, route: "/admin-dashboard/report", permissionKey: "report" },
    { id: 'setting', label: 'System Settings', icon: Settings, route: "/admin-dashboard/setting", permissionKey: "setting" },
  ];

  useEffect(() => {
    if (!loading && !user) {
      Router.push('/admin-login');
      return;
    }

    if (user) {
      if (user.role === 'admin') {
        setFilteredSections(allAdminSections);
        setActiveTab('overview');
        Router.push("/admin-dashboard");
      } else if (user.role === 'Employee') {
        // Always include System Settings regardless of permissions
        const systemSettings = allAdminSections.find(section => section.id === 'setting');
        
        // Filter other sections based on permissions
        const allowedSections = allAdminSections.filter(section => {
          return section.id === 'setting' || user.permissions?.[section.permissionKey];
        });
        
        // Ensure System Settings is included (in case it was filtered out)
        if (!allowedSections.some(section => section.id === 'setting')) {
          allowedSections.push(systemSettings);
        }
        
        setFilteredSections(allowedSections);
        
        if (allowedSections.length > 0) {
          setActiveTab(allowedSections[0].id);
          Router.push(allowedSections[0].route);
        } else {
          Router.push('/unauthorized');
        }
      } else {
        Router.push('/');
      }
    }
  }, [user, loading]);

  if (loading || !user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-rose-50/50 via-white to-amber-50/30">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-amber-500 rounded-lg flex items-center justify-center">
              <Crown className="w-4 h-4 text-white" />
            </div>
            <h2 className="font-bold text-gray-900">Admin Panel</h2>
          </div>
          <button 
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Sidebar - Mobile */}
          {isMobileSidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50">
              <div className="w-64 bg-white h-full shadow-xl animate-slide-in">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-amber-500 rounded-lg flex items-center justify-center">
                        <Crown className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="font-bold text-gray-900">Admin Panel</h2>
                        <p className="text-xs text-gray-500">
                          {user.role === 'admin' ? 'Matrimonial Platform' : `Employee: ${user.name}`}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsMobileSidebarOpen(false)}
                      className="p-1 rounded-md hover:bg-gray-100"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>

                <div className="p-4 overflow-y-auto h-[calc(100%-180px)]">
                  <div className="space-y-2">
                    {filteredSections.map((section) => {
                      const Icon = section.icon;
                      return (
                        <button
                          key={section.id}
                          onClick={() => {
                            setActiveTab(section.id);
                            Router.push(section.route);
                            setIsMobileSidebarOpen(false);
                          }}
                          className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                            activeTab === section.id 
                              ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-lg' 
                              : 'hover:bg-rose-50 text-gray-700 hover:text-gray-900'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{section.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-4 border-t border-gray-200">
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-green-800">System Online</span>
                    </div>
                    <p className="text-xs text-green-600 mt-1">All services running smoothly</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sidebar - Desktop */}
          <div className="hidden lg:block w-64 bg-white shadow-xl border-r border-rose-100/50 min-h-screen">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-amber-500 rounded-lg flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">Admin Panel</h2>
                  <p className="text-xs text-gray-500">
                    {user.role === 'admin' ? 'Matrimonial Platform' : `Employee: ${user.name}`}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="space-y-2">
                {filteredSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => {
                        setActiveTab(section.id);
                        Router.push(section.route);
                      }}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                        activeTab === section.id 
                          ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-lg' 
                          : 'hover:bg-rose-50 text-gray-700 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{section.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 mt-auto">
              <div className="bg-green-50 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-800">System Online</span>
                </div>
                <p className="text-xs text-green-600 mt-1">All services running smoothly</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Top Header */}
            <div className="bg-rose-500 shadow-lg rounded-lg mx-2 lg:mx-6 mt-2 lg:mt-4 p-4 lg:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                <div className="mb-4 lg:mb-0">
                  <h1 className="text-xl lg:text-2xl font-bold text-white">
                    {filteredSections.find(s => s.id === activeTab)?.label || 'Dashboard'}
                  </h1>
                  <p className="text-white">Welcome back, {user.name}</p>
                </div>
                
                <div className="flex items-center justify-between lg:space-x-4">
                 
                  
                  <div className="flex items-center space-x-3 ml-4 lg:ml-0">
                    <div className="text-right hidden sm:block">
                      <p className="font-medium text-white text-sm">
                        {user.role === 'admin' ? 'Super Admin' : 'Employee'}
                      </p>
                      <p className="text-xs text-white">{user.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Page Content */}
            <div className="p-4 lg:p-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}