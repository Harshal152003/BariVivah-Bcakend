"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import TrademarkLogo from "@/components/TrademarkLogo";
import { 
  Smartphone, 
  Download, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  Heart,
  ArrowRight,
  ShieldCheck
} from "lucide-react";

function ProfileRedirectContent() {
  const searchParams = useSearchParams();
  const profileId = searchParams.get("profileid") || searchParams.get("id") || "";
  const [attempted, setAttempted] = useState(false);
  const [apkDownloading, setApkDownloading] = useState(false);
  const [apkDownloaded, setApkDownloaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);

    if (isMobile) {
      // 1. Try launching via app custom URI scheme
      const customSchemeUri = `barivivahmobileapp://profile?id=${encodeURIComponent(profileId)}`;
      
      if (isAndroid) {
        // Android Intent URI (Directly launches app if installed, or falls back to Play Store)
        const intentUri = `intent://profile?id=${encodeURIComponent(profileId)}#Intent;scheme=barivivahmobileapp;package=com.barivivah.app;end`;
        window.location.href = intentUri;
      } else {
        window.location.href = customSchemeUri;
      }

      setAttempted(true);
    }
  }, [profileId]);

  const handleOpenAppManually = () => {
    const isAndroid = /Android/i.test(navigator.userAgent);
    if (isAndroid) {
      window.location.href = `intent://profile?id=${encodeURIComponent(profileId)}#Intent;scheme=barivivahmobileapp;package=com.barivivah.app;end`;
    } else {
      window.location.href = `barivivahmobileapp://profile?id=${encodeURIComponent(profileId)}`;
    }
  };

  const handleApkDownload = (e) => {
    e.preventDefault();
    setApkDownloading(true);
    setTimeout(() => {
      setApkDownloading(false);
      setApkDownloaded(true);
      setTimeout(() => setApkDownloaded(false), 4000);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF5F7] via-white to-[#FFF0F4] text-gray-900 flex flex-col justify-between selection:bg-rose-200">
      {/* Top Navbar */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-rose-100/80 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <TrademarkLogo width={180} href="/" priority />
          <Link
            href="/"
            className="text-xs sm:text-sm font-medium text-gray-600 hover:text-[#FB2467] transition-colors"
          >
            Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-xl mx-auto px-4 py-10 sm:py-16 w-full flex flex-col items-center text-center justify-center">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-rose-100 shadow-xl shadow-rose-100/60 w-full relative overflow-hidden">
          {/* Decorative blur */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-rose-200/40 rounded-full blur-2xl pointer-events-none -mr-12 -mt-12" />

          <div className="relative z-10 flex flex-col items-center space-y-5">
            {/* App Icon Circle */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-rose-500 to-[#FB2467] text-white flex items-center justify-center shadow-lg shadow-rose-200 animate-bounce-short">
              <Smartphone size={32} />
            </div>

            {profileId && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/80 text-[#FB2467] text-xs font-bold uppercase tracking-wider">
                <ShieldCheck size={14} /> Profile ID: {profileId}
              </div>
            )}

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 font-serif">
                Opening in BariVivah App...
              </h1>
              <p className="text-gray-500 text-sm sm:text-base max-w-sm">
                If the candidate's profile does not open automatically, tap the button below or install the official app.
              </p>
            </div>

            {/* Primary Action Button */}
            <div className="w-full space-y-3 pt-2">
              <button
                onClick={handleOpenAppManually}
                className="w-full py-4 px-6 bg-gradient-to-r from-rose-500 to-[#FB2467] hover:from-rose-600 hover:to-[#e01a5b] text-white font-bold text-base rounded-2xl shadow-md hover:shadow-lg shadow-rose-200/60 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <span>Open in BariVivah App</span>
                <ArrowRight size={18} />
              </button>

              <div className="relative my-4 flex items-center justify-center">
                <div className="border-t border-gray-200 w-full" />
                <span className="bg-white px-3 text-xs text-gray-400 uppercase font-semibold">
                  or get the app
                </span>
              </div>

              {/* Store buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Google Play */}
                <a
                  href="https://play.google.com/store/apps/details?id=com.synture.barivivah"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 px-4 py-3 bg-gray-900 hover:bg-black text-white rounded-xl text-xs sm:text-sm font-bold shadow transition-colors"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a2.38 2.38 0 0 1-.61-1.63V3.444c0-.623.224-1.2.61-1.63z" fill="#00E676" />
                    <path d="M17.556 8.236l-3.764 3.764 3.764 3.764 4.28-2.427c.97-.55.97-1.451 0-2.001l-4.28-3.1z" fill="#FFD600" />
                    <path d="M3.609 1.814c.382-.424.966-.648 1.62-.277l12.327 6.699-3.764 3.764L3.609 1.814z" fill="#00B0FF" />
                    <path d="M13.792 12l3.764 3.764-12.327 6.7c-.654.37-1.238.146-1.62-.278L13.792 12z" fill="#FF3D00" />
                  </svg>
                  <span>Google Play</span>
                </a>

                {/* Direct APK */}
                <button
                  onClick={handleApkDownload}
                  disabled={apkDownloading}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-rose-50 hover:bg-rose-100 text-[#FB2467] border border-rose-200 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-colors cursor-pointer"
                >
                  <Download size={16} className={apkDownloading ? "animate-bounce" : ""} />
                  <span>{apkDownloading ? "Downloading..." : apkDownloaded ? "Downloaded!" : "Download APK"}</span>
                </button>
              </div>

              {apkDownloaded && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mt-2">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  APK download link started!
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-gray-400">
        <p>© {new Date().getFullYear()} BariVivah. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default function ProfileRedirectPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-rose-500" />
      </div>
    }>
      <ProfileRedirectContent />
    </Suspense>
  );
}
