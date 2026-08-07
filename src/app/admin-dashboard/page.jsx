// app/admin-dashboard/page.jsx
"use client"
import { useState, useEffect } from 'react';
import { Users, Crown, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(4);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/dashboard');
        
        if (!response.ok) throw new Error('Failed to fetch dashboard data');
        
        const result = await response.json();
        if (!result.success) throw new Error(result.message || 'Data fetch failed');

        setData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  console.log(data)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-dark"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center max-w-md p-6 rounded-xl bg-primary-dark/5 border border-primary-dark/20">
          <h2 className="text-xl font-bold text-primary-dark mb-2">Error loading dashboard</h2>
          <p className="text-primary-dark/80 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary-dark text-white rounded-lg hover:bg-primary-dark/90 transition-all shadow hover:shadow-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  // Stats configuration
 const stats = [
  { 
    title: 'Total Users', 
    value: data?.stats?.totalUsers.toLocaleString(), 
    change: data?.stats?.changes?.totalUsers, 
    icon: Users, 
    bgColor: 'bg-[#E8F5E9]',
    textColor: 'text-[#2E7D32]',
    iconColor: 'bg-[#2E7D32]'
  },
  { 
    title: 'Premium Users', 
    value: data?.stats?.subscribedUsers.toLocaleString(), 
    change: data?.stats?.changes?.subscribedUsers, 
    icon: Crown, 
    bgColor: 'bg-[#E3F2FD]',
    textColor: 'text-[#1565C0]',
    iconColor: 'bg-[#1565C0]'
  },
  
  { 
    title: 'Revenue (₹)', 
    value: data?.stats?.revenue.toLocaleString(), 
    change: data?.stats?.changes?.revenue, 
    icon: DollarSign, 
    bgColor: 'bg-[#F3E5F5]',
    textColor: 'text-[#7B1FA2]',
    iconColor: 'bg-[#7B1FA2]'
  }
];

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = data.recentUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(data.recentUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 space-y-8">
     
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.change.startsWith('+');
          
          return (
            <div 
              key={index} 
              className={`${stat.bgColor} rounded-xl p-5 shadow-sm border border-gray-100`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className={`text-3xl font-bold ${stat.textColor} mt-2`}>{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.iconColor} text-white`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
                <span className="text-xs text-gray-500 ml-2">vs last week</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Users Table - Matched exactly to reference image */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                {/* <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {user.profilePhoto ? (
                          <img src={user.profilePhoto} alt={user.name} className="h-full w-full object-cover" />
                        ) : (
                          <Users className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.isVerified ? 'bg-green-100 text-green-800' : 
                      user.name ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.isVerified ? 'Active' : user.name ? 'Pending' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                    {user.subscription?.plan || 'Free'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString('en-US')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                    {new Date(user.lastLogin || user.createdAt).toLocaleDateString('en-US')}
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <button className="text-rose-600 hover:text-rose-900">Edit</button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button 
              onClick={() => paginate(currentPage - 1)} 
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </button>
            <button 
              onClick={() => paginate(currentPage + 1)} 
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{' '}
                <span className="font-medium">{Math.min(indexOfLastUser, data.recentUsers.length)}</span> of{' '}
                <span className="font-medium">{data.recentUsers.length}</span> users
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === number
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {number}
                  </button>
                ))}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}