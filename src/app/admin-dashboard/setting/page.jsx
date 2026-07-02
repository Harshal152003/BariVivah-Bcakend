"use client";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { 
  User, 
  Shield, 
  Bell, 
  Trash2, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  MessageCircle, 
  Info, 
  LogOut,
  AlertTriangle,
  Check,
  X,
  Menu
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('account');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const router = useRouter();
  const {user} = useAuth();

  const [accountData, setAccountData] = useState({
    email: user?.email,
    phone: "+91 98765 43210"
  });

  const [privacySettings, setPrivacySettings] = useState({
    showProfileToRegistered: true,
    blurPhotoUntilAccepted: false,
    hideProfileTemporarily: false,
    contactDetailsVisibility: "Only mutual matches"
  });

  const [notificationSettings, setNotificationSettings] = useState({
    masterNotifications: true,
    emailForNewInterests: true,
    smsForChatMessages: true,
    pushForProfileViews: true,
    securityAlerts: true,
    userReports: true,
    systemStatus: true,
    newUserRegistrations: false,
    adminTasks: true
  });

  const [deleteReason, setDeleteReason] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  const handleAdminLogout = async () => {
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        router.push('/admin-login');
      } else {
        throw new Error('Admin logout failed');
      }
    } catch (error) {
      console.error('Admin logout error:', error);
    } finally {
      setShowLogoutModal(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation === 'DELETE') {
      try {
        const response = await fetch('/api/admin/delete-account', {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify({ reason: deleteReason }),
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          router.push('/admin-login');
        } else {
          throw new Error('Account deletion failed');
        }
      } catch (error) {
        console.error('Account deletion error:', error);
      } finally {
        setShowDeleteModal(false);
      }
    }
  };

  const handlePrivacyToggle = (key) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleNotificationToggle = (key) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const renderToggle = (isOn) => (
    <div className={`w-12 h-6 rounded-full ${isOn ? 'bg-red-500' : 'bg-gray-300'} relative transition-colors cursor-pointer`}>
      <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${isOn ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
    </div>
  );

  const renderCheckbox = (isChecked) => (
    <div className={`w-5 h-5 rounded ${isChecked ? 'bg-blue-500' : 'bg-gray-300'} flex items-center justify-center`}>
      {isChecked && <span className="text-white text-xs">✓</span>}
    </div>
  );

  const navigationItems = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'logout', label: 'Log Out', icon: LogOut, action: () => setShowLogoutModal(true) }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Admin Settings</h1>
        <button 
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Sidebar - Mobile */}
      {mobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="relative z-50 w-72 h-full bg-white shadow-lg">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Settings Menu</h2>
                <button 
                  onClick={() => setMobileNavOpen(false)}
                  className="p-1 rounded-md hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.action) {
                        item.action();
                      } else {
                        setActiveTab(item.id);
                      }
                      setMobileNavOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                      activeTab === item.id && !item.action
                        ? 'bg-red-50 text-red-600 border border-red-200'
                        : 'text-gray-600 hover:bg-gray-50'
                    } mb-2`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Sidebar - Desktop */}
      <div className="hidden md:flex flex-shrink-0 w-72 h-screen overflow-y-auto bg-gray-50 p-6 border-r border-gray-200">
        <div className="bg-white rounded-lg shadow-sm p-4 sticky top-6 w-full">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Navigation</h3>
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.action) {
                      item.action();
                    } else {
                      setActiveTab(item.id);
                    }
                  }}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                    activeTab === item.id && !item.action
                      ? 'bg-red-50 text-red-600 border border-red-200'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow overflow-auto">
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
          {/* Account Tab */}
          {activeTab === 'account' && (
            <div>
              <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
                <div className="flex items-center space-x-2 mb-4 md:mb-6">
                  <Mail className="text-red-500" size={20} />
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800">Email Address</h2>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-600 mb-2">Current Email</label>
                  <input
                    type="email"
                    value={accountData.email}
                    onChange={(e) => setAccountData(prev => ({...prev, email: e.target.value}))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div>
              <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
                <div className="flex items-center space-x-2 mb-4 md:mb-6">
                  <Eye className="text-red-500" size={20} />
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800">Profile Visibility</h2>
                </div>
                
                <div className="space-y-4 md:space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="w-4/5">
                      <h3 className="font-semibold text-gray-800">Admin Profile Visibility</h3>
                      <p className="text-gray-500 text-sm">Show admin profile to other admins only</p>
                    </div>
                    <button onClick={() => handlePrivacyToggle('showProfileToRegistered')}>
                      {renderToggle(privacySettings.showProfileToRegistered)}
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="w-4/5">
                      <h3 className="font-semibold text-gray-800">Admin Dashboard Access</h3>
                      <p className="text-gray-500 text-sm">Require two-factor authentication for dashboard access</p>
                    </div>
                    <button onClick={() => handlePrivacyToggle('blurPhotoUntilAccepted')}>
                      {renderToggle(privacySettings.blurPhotoUntilAccepted)}
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="w-4/5">
                      <h3 className="font-semibold text-gray-800">Admin Activity Logging</h3>
                      <p className="text-gray-500 text-sm">Log all admin actions and profile changes</p>
                    </div>
                    <button onClick={() => handlePrivacyToggle('hideProfileTemporarily')}>
                      {renderToggle(privacySettings.hideProfileTemporarily)}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
                <div className="flex items-center space-x-2 mb-4 md:mb-6">
                  <MessageCircle className="text-red-500" size={20} />
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800">Contact Details Visibility</h2>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-600 mb-2">Who can view my contact details?</label>
                  <select
                    value={privacySettings.contactDetailsVisibility}
                    onChange={(e) => setPrivacySettings(prev => ({...prev, contactDetailsVisibility: e.target.value}))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="Only mutual matches">Visible to super admins only</option>
                    <option value="All verified users">Visible to all admin levels</option>
                    <option value="Premium members only">Hidden from all users</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div>
              <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
                <div className="flex items-center space-x-2 mb-4 md:mb-6">
                  <Bell className="text-red-500" size={20} />
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800">Notification Preferences</h2>
                </div>
                
                <div className="space-y-4 md:space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="w-4/5">
                      <h3 className="font-semibold text-gray-800">Master Notifications</h3>
                      <p className="text-gray-500 text-sm">Enable or disable all notifications</p>
                    </div>
                    <button onClick={() => handleNotificationToggle('masterNotifications')}>
                      {renderToggle(notificationSettings.masterNotifications)}
                    </button>
                  </div>
                  
                  <hr className="border-gray-200" />
                  
                  <div className="flex items-center justify-between">
                    <div className="w-4/5">
                      <h3 className="font-semibold text-gray-800">Security & Login Alerts</h3>
                      <p className="text-gray-500 text-sm">Get notified of suspicious login activity and security threats</p>
                    </div>
                    <button onClick={() => handleNotificationToggle('securityAlerts')}>
                      {renderCheckbox(notificationSettings.securityAlerts)}
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="w-4/5">
                      <h3 className="font-semibold text-gray-800">User Report Notifications</h3>
                      <p className="text-gray-500 text-sm">Immediate alerts when users report issues or policy violations</p>
                    </div>
                    <button onClick={() => handleNotificationToggle('userReports')}>
                      {renderCheckbox(notificationSettings.userReports)}
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="w-4/5">
                      <h3 className="font-semibold text-gray-800">System Status Alerts</h3>
                      <p className="text-gray-500 text-sm">Get notified when the platform experiences technical issues</p>
                    </div>
                    <button onClick={() => handleNotificationToggle('systemStatus')}>
                      {renderCheckbox(notificationSettings.systemStatus)}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center space-x-3 mb-4">
              <LogOut className="text-red-500" size={24} />
              <h3 className="text-xl font-bold text-gray-800">Confirm Logout</h3>
            </div>
            
            <p className="text-gray-600 mb-6">Are you sure you want to log out from the admin dashboard?</p>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAdminLogout}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="text-red-500" size={24} />
              <h3 className="text-xl font-bold text-gray-800">Confirm Account Deletion</h3>
            </div>
            
            <p className="text-gray-600 mb-4">
              This action cannot be undone. To confirm, please type <strong>DELETE</strong> in the box below.
            </p>
            
            <input
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmation !== 'DELETE'}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                  deleteConfirmation === 'DELETE'
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}