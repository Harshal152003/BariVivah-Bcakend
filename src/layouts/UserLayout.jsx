"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { useSession } from "@/context/SessionContext";
import { ShieldAlert, ArrowRight, CheckCircle, XCircle, Menu, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function UserLayout({ children }) {
  const { isAuthenticated, loading, user, logout } = useSession();
  const [shouldRender, setShouldRender] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Check if current route is the profile page
  const isProfilePage = pathname === "/dashboard/profile/me";

  useEffect(() => {
    console.log("[Auth Debug] Current session:", {
      isAuthenticated,
      loading,
      user,
      path: pathname
    });

    if (!loading) {
      if (!isAuthenticated) {
        console.log("[Auth Debug] No session - redirecting to login");
        sessionStorage.setItem('redirectPath', pathname);
        router.replace("/login");
      } else {
        console.log("[Auth Debug] Valid session - user:", user);
        if (!user || !user.id) {
          console.log("[Auth Debug] Session exists but user data missing");
          logout();
          router.replace("/login");
        } else {
          setShouldRender(true);
        }
      }
    }
  }, [loading, isAuthenticated, user, router, pathname, logout]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'logout') {
        console.log("[Auth Debug] Received logout event from another tab");
        logout();
        router.replace("/login");
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [router, logout]);

  // Close sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (loading || !shouldRender) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Special case: allow access to profile page even if not verified and not 50% complete
  const isProfileCompletedEnough = (user?.profileCompletion || 0) >= 50;
  if (!user?.isVerified && !isProfileCompletedEnough && !isProfilePage) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50">
        <Sidebar mobileOpen={sidebarOpen} setMobileOpen={setSidebarOpen} />
        <div className="flex-1 p-6 overflow-y-auto flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl w-full bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200"
          >
            <div className="p-8 text-center">
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 mb-6">
                <ShieldAlert className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile Completion Required</h2>
              <p className="text-gray-600 mb-6">
                Please complete at least 50% of your profile to access all features. Current completion: {user?.profileCompletion || 0}%
              </p>

              <div className="space-y-4 mb-8 text-left">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-800">Complete Your Profile</h4>
                    <p className="text-sm text-gray-500">Fill in details in your profile section to reach at least 50%</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-800">Current Restrictions</h4>
                    <p className="text-sm text-gray-500">You cannot access other pages until your profile is 50% complete or verified</p>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push("/dashboard/profile/me")}
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-secondary to-primary text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all"
              >
                Complete My Profile
                <ArrowRight className="ml-2 h-4 w-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar mobileOpen={sidebarOpen} setMobileOpen={setSidebarOpen} />

      <main className="flex-1 p-4 lg:p-6 overflow-y-auto bg-gradient-to-br from-rose-50 via-white to-amber-50 relative">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between mb-4 bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-sm border border-primary/20">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-gray-600 hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            {/* <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-rose-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div> */}
            <span className="font-serif text-xl font-bold text-secondary">
              Mali<span className="text-primary">Bandhan</span>
            </span>
          </div>
          {/* Spacer for centering logic if needed, or profile icon */}
          <div className="w-9"></div>
        </div>

        {children}
      </main>
    </div>
  );
}