"use client"
import { useState, useEffect } from 'react';
import {
  User, Heart, Eye, CheckCircle, Clock, Crown, ArrowRight, Bell, MapPin, Calendar, Award, TrendingUp, Star, Gift, Sparkles, UserPlus, MessageCircle, Camera, Phone, Shield
} from 'lucide-react';
import { useSession } from '@/context/SessionContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function MatrimonialDashboard() {
  const { user } = useSession();
  const router = useRouter()
  const [userData, setUserData] = useState({ name: '', profileCompletion: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/users/me');
      if (!response.ok) throw new Error('Failed to fetch user data');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return { name: 'User', profileCompletion: 0 };
    }
  };

  useEffect(() => {
    const loadData = async () => {
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      const data = await fetchUserData();
      setUserData({
        name: data.name || user?.name || 'User',
        profileCompletion: data.profileCompletion || 75
      });
      setIsLoaded(true);
    };

    loadData();
  }, [user]);


  // Get subscription plan display name and status
  const getSubscriptionInfo = () => {
    if (!user?.subscription) return { plan: 'Free Plan', status: 'Inactive', color: 'bg-gray-500' };

    const { plan, isSubscribed, expiresAt } = user.subscription;
    const expiryDate = new Date(expiresAt);
    const isExpired = expiryDate < new Date();

    return {
      plan: plan || 'Basic Plan',
      status: isSubscribed && !isExpired ? 'Active' : 'Expired',
      expiryDate: expiryDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      color: isSubscribed && !isExpired ? 'bg-primary' : 'bg-primary'
    };
  };

  const subscriptionInfo = getSubscriptionInfo();

  // Skeleton components
  const SkeletonCard = ({ className = '', height = 'h-32' }) => (
    <div className={`bg-gray-200 rounded-xl animate-pulse ${height} ${className}`}></div>
  );

  const SkeletonCircle = ({ size = 'w-12 h-12' }) => (
    <div className={`bg-gray-200 rounded-full animate-pulse ${size}`}></div>
  );

  const SkeletonText = ({ width = 'w-full', height = 'h-4' }) => (
    <div className={`bg-gray-200 rounded animate-pulse ${width} ${height} mb-2`}></div>
  );

  const recentActivity = [
    { type: "view", message: "Someone viewed your profile", time: "2 hours ago", icon: Eye },
    { type: "interest", message: "New interest received", time: "5 hours ago", icon: Heart },
    { type: "match", message: "You have a new match!", time: "1 day ago", icon: Star },
    { type: "message", message: "Someone sent you a message", time: "2 days ago", icon: MessageCircle },
  ];

  return (
    <div className="min-h-screen bg-[#FFFFFF] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Section */}
        {!isLoaded ? (
          <SkeletonCard height="h-32" />
        ) : (
          <div className={`transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="bg-primary rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-serif font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
                    <p className="text-rose-100">Your perfect match is just a click away</p>
                  </div>
                  <div className="hidden md:block">
                    <Sparkles className="w-12 h-12 text-rose-200" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Status & Subscription Row */}
        {!isLoaded ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transform transition-all duration-1000 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            {/* Profile Status */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-rose-100/50 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Profile Status</h3>
                <div className="flex items-center space-x-1">
                  {user?.isVerified ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <Clock className="w-5 h-5 text-orange-500" />
                  )}
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Verification</span>
                  <span className={`text-sm font-medium ${user?.isVerified ? 'text-green-600' : 'text-orange-600'}`}>
                    {user?.isVerified ? 'Verified' : 'Pending'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Phone</span>
                  <div className="flex items-center">
                    {user?.phoneIsVerified ? (
                      <Shield className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <Phone className="w-4 h-4 text-orange-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${user?.phoneIsVerified ? 'text-green-600' : 'text-orange-600'}`}>
                      {user?.phoneIsVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-rose-100/50 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Contact Info</h3>
                <Phone className="w-5 h-5 text-secondary" />
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Phone Number</div>
                  <div className="text-sm font-medium text-gray-900">{user?.phone}</div>
                </div>

              </div>
            </div>

            {/* Subscription Status */}
            <div className={`${subscriptionInfo.color} rounded-xl p-6 shadow-lg text-white`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">{subscriptionInfo.plan}</h3>
                <Crown className="w-5 h-5 text-yellow-200" />
              </div>
              <div className="space-y-2">
                <div className="text-lg font-bold">{subscriptionInfo.status}</div>
                {user?.subscription?.isSubscribed && (
                  <div className="text-sm text-white/80">
                    Expires: {subscriptionInfo.expiryDate}
                  </div>
                )}
                <Link
                  href={"/dashboard/subscription"}
                  className="inline-block w-full p-3 bg-white/20 text-white rounded-lg text-sm font-medium hover:bg-white/30 transition-colors mt-3 text-center"
                >
                  {subscriptionInfo.status === 'Active' ? 'Manage Plan' : 'Upgrade Now'}
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* My Profile & Quick Actions */}
        {!isLoaded ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <SkeletonCard height="h-64" />
            <div className="lg:col-span-2 space-y-4">
              <SkeletonText width="w-1/3" height="h-6" />
              <SkeletonCard height="h-48" />
            </div>
          </div>
        ) : (
          <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transform transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            {/* My Profile Card */}
            <div className="lg:col-span-1 bg-white rounded-xl p-6 shadow-lg border border-rose-100/50">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  {user?.profilePhoto ? (
                    <img
                      src={user.profilePhoto}
                      alt={user.name}
                      className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-rose-100"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-primary-light to-white rounded-full flex items-center justify-center mx-auto border-4 border-rose-50">
                      <User className="w-12 h-12 text-primary" />
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                </div>
                <h3 className="font-bold text-secondary text-lg mb-1">{user?.name}</h3>
                <div className="flex items-center justify-center mb-2">
                  <Award className="w-4 h-4 text-green-500 mr-1" />
                  <span className={`text-sm ${user?.isVerified ? "text-green-600" : "text-orange-500"} font-medium`}>
                    {user?.isVerified ? "Verified Profile" : "Pending Verification"}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mb-4">
                  {subscriptionInfo.plan} Member
                </div>
                <Link href="/dashboard/profile/me" className="w-full block bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary/90 transition-all duration-300 text-center shadow-md">
                  Edit Profile
                </Link>
              </div>
            </div>

            {/* Quick Actions Dashboard */}
            <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-lg border border-rose-100/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900 text-lg">Quick Actions</h3>
              </div>

              <div className="flex flex-col gap-4 mb-6">
                <Link href={"/dashboard/matches"} className="flex items-center p-4 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors group border border-rose-100">
                  <div className="p-2 bg-white rounded-full mr-4 shadow-sm group-hover:scale-110 transition-transform">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-secondary">Browse Matches</div>
                    <div className="text-sm text-gray-600">Find your perfect match</div>
                  </div>
                </Link>

                <Link href={"/dashboard/interests"} className="flex items-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors group border border-indigo-100">
                  <div className="p-2 bg-white rounded-full mr-4 shadow-sm group-hover:scale-110 transition-transform">
                    <UserPlus className="w-6 h-6 text-secondary" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-secondary">Interests</div>
                    <div className="text-sm text-gray-600">Manage interests</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}



        {/* Call to Action */}
        {!isLoaded ? (
          <SkeletonCard height="h-24" />
        ) : (
          <div className={`transform transition-all duration-1000 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="bg-primary rounded-xl p-6 text-white shadow-xl">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <h3 className="font-serif font-bold text-xl mb-2">Ready to find your perfect match?</h3>
                  <p className="text-rose-100">Explore personalized matches based on your preferences</p>
                </div>
                <div className="flex space-x-3">
                  <Link href={"/dashboard/matches"} className="cursor-pointer bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-medium hover:bg-white/30 transition-all duration-300 flex items-center">
                    <Heart className="w-4 h-4 mr-2" />
                    Browse Matches
                  </Link>
                  {subscriptionInfo.status !== 'Active' && (
                    <button className="bg-white text-secondary px-6 py-3 rounded-lg font-medium hover:bg-rose-50 transition-all duration-300 flex items-center shadow-lg">
                      <Gift className="w-4 h-4 mr-2" />
                      Upgrade Plan
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}