"use client"
import { useState, useEffect } from 'react';
import {
  User,
  Heart,
  Eye,
  CheckCircle,
  Clock,
  Crown,
  ArrowRight,
  Bell,
  MapPin,
  Calendar,
  Award,
  TrendingUp,
  Star,
  Gift,
  Sparkles,
  UserPlus,
  MessageCircle,
  Camera
} from 'lucide-react';
import { useSession } from '@/context/SessionContext';
export default function MatrimonialDashboard() {
  const [profileCompletion, setProfileCompletion] = useState(75);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useSession()
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  console.log("user = ", user)
  const quickMatches = [
    { id: 1, name: "A***a", age: 25, location: "Mumbai", compatibility: 92 },
    { id: 2, name: "P***i", age: 27, location: "Delhi", compatibility: 88 },
    { id: 3, name: "S***a", age: 24, location: "Bangalore", compatibility: 85 },
    { id: 4, name: "R***i", age: 26, location: "Pune", compatibility: 90 },
  ];

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
        <div className={`transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="bg-primary rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-serif font-bold mb-2">Welcome back, Priya! 👋</h1>
                  <p className="text-white/90">Your perfect match is just a click away</p>
                </div>
                <div className="hidden md:block">
                  <Sparkles className="w-12 h-12 text-white/50" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Completion & Stats Row */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transform transition-all duration-1000 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>

          {/* Profile Completion */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-primary/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Profile Status</h3>
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{profileCompletion}%</span>
                <span className="text-sm text-gray-500">Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${profileCompletion}%` }}
                ></div>
              </div>
              <button className="w-full bg-primary/10 text-primary py-2 rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors">
                Complete Profile
              </button>
            </div>
          </div>

          {/* Total Matches */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-primary/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Total Matches</h3>
              <Heart className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-gray-900">147</div>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                +12 this week
              </div>
            </div>
          </div>

          {/* Profile Views */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-primary/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Profile Views</h3>
              <Eye className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-gray-900">89</div>
              <div className="flex items-center text-sm text-blue-600">
                <Clock className="w-4 h-4 mr-1" />
                Last 30 days
              </div>
            </div>
          </div>

          {/* Subscription Status */}
          <div className="bg-primary rounded-xl p-6 shadow-lg text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Premium Plan</h3>
              <Crown className="w-5 h-5 text-yellow-200" />
            </div>
            <div className="space-y-2">
              <div className="text-lg font-bold">Active</div>
              <div className="text-sm text-white/80">Expires: Dec 15, 2024</div>
              <button className="w-full bg-white/20 text-white py-2 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors mt-3">
                Manage Plan
              </button>
            </div>
          </div>
        </div>

        {/* My Profile & Quick Actions */}
        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transform transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>

          {/* My Profile Card */}
          <div className="lg:col-span-1 bg-white rounded-xl p-6 shadow-lg border border-primary/20 flex items-center justify-center">
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                  <User className="w-12 h-12 text-primary" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">Priya Sharma</h3>
              <div className="space-y-1 text-sm text-gray-600 mb-4">
                <div className="flex items-center justify-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  25 years • 5'4"
                </div>
                <div className="flex items-center justify-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  Mumbai, Maharashtra
                </div>
              </div>
              <div className="flex items-center justify-center mb-4">
                <Award className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">Verified Profile</span>
              </div>
              <button className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:from-secondary/90 hover:to-primary/90 transition-all duration-300 shadow-md">
                Edit Profile
              </button>
            </div>
          </div>

          {/* Quick Match Suggestions */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-lg border border-primary/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900 text-lg">Quick Match Suggestions</h3>
              <button className="flex items-center text-primary hover:text-primary/80 font-medium">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickMatches.map((match) => (
                <div key={match.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary/50 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="text-sm font-medium text-gray-700">{match.compatibility}%</span>
                    </div>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{match.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{match.age} years • {match.location}</p>
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-primary/10 text-primary py-2 px-3 rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors">
                      <Heart className="w-4 h-4 inline mr-1" />
                      Interest
                    </button>
                    <button className="flex-1 bg-gray-50 text-gray-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity & Notifications */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 transform transition-all duration-1000 delay-400 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-rose-100/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900 text-lg">Recent Activity</h3>
              <Bell className="w-5 h-5 text-rose-500" />
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-rose-50/50 transition-colors">
                    <div className="flex-shrink-0 w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center">
                      <Icon className="w-4 h-4 text-rose-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <button className="w-full mt-4 text-rose-600 hover:text-rose-700 font-medium text-sm">
              View All Activities
            </button>
          </div>

          {/* Interests Overview */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-rose-100/50">
            <h3 className="font-bold text-gray-900 text-lg mb-6">Interests Overview</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <UserPlus className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">Interests Received</p>
                    <p className="text-sm text-gray-600">People interested in you</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">23</div>
                  <div className="text-xs text-gray-500">New: 5</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Heart className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">Interests Sent</p>
                    <p className="text-sm text-gray-600">Your sent interests</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">12</div>
                  <div className="text-xs text-gray-500">Pending: 8</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-rose-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                    <Star className="w-5 h-5 text-rose-600" />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">Mutual Matches</p>
                    <p className="text-sm text-gray-600">Perfect connections</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-rose-600">7</div>
                  <div className="text-xs text-gray-500">This month</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={`transform transition-all duration-1000 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="bg-primary rounded-xl p-6 text-white shadow-xl">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="font-serif font-bold text-xl mb-2">Ready to find your perfect match?</h3>
                <p className="text-white/90">Explore personalized matches based on your preferences</p>
              </div>
              <div className="flex space-x-3">
                <button className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-medium hover:bg-white/30 transition-all duration-300 flex items-center">
                  <Heart className="w-4 h-4 mr-2" />
                  Browse Matches
                </button>
                <button className="bg-white text-secondary px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-all duration-300 flex items-center shadow-md">
                  <Gift className="w-4 h-4 mr-2" />
                  Upgrade Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}