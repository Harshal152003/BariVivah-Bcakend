"use client";
import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import TrademarkLogo from "@/components/TrademarkLogo";
import { 
  Smartphone, 
  Download, 
  ShieldCheck, 
  Sparkles, 
  Heart, 
  MessageCircle, 
  FileText, 
  Users, 
  QrCode, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink,
  ChevronRight
} from "lucide-react";

function DownloadAppContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type"); // 'registered' or 'login'
  const isRegistered = type === "registered";

  const [apkDownloading, setApkDownloading] = useState(false);
  const [apkDownloaded, setApkDownloaded] = useState(false);

  const handleApkDownload = (e) => {
    e.preventDefault();
    setApkDownloading(true);
    setTimeout(() => {
      setApkDownloading(false);
      setApkDownloaded(true);
      setTimeout(() => setApkDownloaded(false), 4000);
    }, 1200);
  };

  const appFeatures = [
    {
      icon: ShieldCheck,
      title: "100% Verified Profiles",
      desc: "Connect with genuine, government-ID verified community matches safely.",
      color: "from-rose-500 to-pink-500",
      bg: "bg-rose-50 text-rose-600"
    },
    {
      icon: MessageCircle,
      title: "Instant Chat & Express Interest",
      desc: "Send connection requests and chat directly with compatible partners in real-time.",
      color: "from-pink-500 to-rose-600",
      bg: "bg-pink-50 text-pink-600"
    },
    {
      icon: Users,
      title: "Discover Nearby Matches",
      desc: "Find compatible matches nearby within your community with smart radius filters.",
      color: "from-amber-500 to-rose-500",
      bg: "bg-amber-50 text-amber-600"
    },
    {
      icon: FileText,
      title: "1-Click Biodata PDF",
      desc: "Generate and share elegant, professionally formatted matrimony biodatas instantly.",
      color: "from-rose-600 to-red-600",
      bg: "bg-red-50 text-red-600"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF5F7] via-white to-[#FFF0F4] text-gray-900 flex flex-col justify-between selection:bg-rose-200">
      {/* Top Navbar */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-rose-100/80 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <TrademarkLogo width={180} href="/" priority />
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-[#FB2467] border border-rose-200/60">
              <Sparkles size={13} className="text-[#FB2467]" /> Official Mobile App
            </span>
            <Link
              href="/"
              className="text-xs sm:text-sm font-medium text-gray-600 hover:text-[#FB2467] transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
        {/* Banner Card */}
        <div className="relative overflow-hidden bg-white rounded-3xl shadow-xl shadow-rose-100/70 border border-rose-100 p-6 sm:p-10 lg:p-12 mb-10">
          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-rose-200/40 to-pink-300/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-amber-200/30 to-rose-200/20 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 flex flex-col items-start text-left space-y-5">
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-[#FB2467] text-xs sm:text-sm font-bold tracking-wide uppercase">
                {isRegistered ? "🎉 Registration Successful!" : "👋 Welcome Back!"}
              </div>

              {/* Headings */}
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-tight font-serif">
                  {isRegistered ? (
                    <>
                      Your Profile is Ready! <br />
                      <span className="bg-gradient-to-r from-[#FB2467] to-rose-600 bg-clip-text text-transparent">
                        Continue on the App
                      </span>
                    </>
                  ) : (
                    <>
                      Experience BariVivah <br />
                      <span className="bg-gradient-to-r from-[#FB2467] to-rose-600 bg-clip-text text-transparent">
                        On Your Smartphone
                      </span>
                    </>
                  )}
                </h1>
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-xl leading-relaxed">
                  {isRegistered
                    ? "Congratulations! Your account has been registered. Download the official BariVivah mobile app to browse verified profiles, connect instantly, and manage your partner preferences on the go."
                    : "To give you the smoothest, fastest, and most secure matrimonial matchmaking experience, all features and matches are available exclusively on our official mobile app."}
                </p>
              </div>

              {/* Download Buttons Section */}
              <div className="w-full pt-3 space-y-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Download & Install Free App:
                </p>

                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  {/* Google Play Store */}
                  <a
                    href="https://play.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 px-5 py-3.5 bg-gray-900 hover:bg-black text-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 border border-gray-800"
                  >
                    <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                      <path d="M3.609 1.814L13.792 12 3.61 22.186a2.38 2.38 0 0 1-.61-1.63V3.444c0-.623.224-1.2.61-1.63z" fill="#00E676" />
                      <path d="M17.556 8.236l-3.764 3.764 3.764 3.764 4.28-2.427c.97-.55.97-1.451 0-2.001l-4.28-3.1z" fill="#FFD600" />
                      <path d="M3.609 1.814c.382-.424.966-.648 1.62-.277l12.327 6.699-3.764 3.764L3.609 1.814z" fill="#00B0FF" />
                      <path d="M13.792 12l3.764 3.764-12.327 6.7c-.654.37-1.238.146-1.62-.278L13.792 12z" fill="#FF3D00" />
                    </svg>
                    <div className="text-left">
                      <div className="text-[10px] text-gray-300 uppercase leading-none font-medium">GET IT ON</div>
                      <div className="text-sm sm:text-base font-bold text-white leading-tight">Google Play</div>
                    </div>
                  </a>

                  {/* Apple App Store */}
                  <a
                    href="https://www.apple.com/app-store/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 px-5 py-3.5 bg-gray-900 hover:bg-black text-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 border border-gray-800"
                  >
                    <svg className="w-7 h-7 fill-current text-white" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.65 1.35-.58.67-1.09 1.74-0.95 2.77.99.08 2.04-.52 2.68-1.27z"/>
                    </svg>
                    <div className="text-left">
                      <div className="text-[10px] text-gray-300 uppercase leading-none font-medium">Download on the</div>
                      <div className="text-sm sm:text-base font-bold text-white leading-tight">App Store</div>
                    </div>
                  </a>

                  {/* Direct APK Download Button */}
                  <button
                    onClick={handleApkDownload}
                    disabled={apkDownloading}
                    className="group inline-flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-rose-500 to-[#FB2467] hover:from-rose-600 hover:to-[#e01a5b] text-white rounded-2xl shadow-md hover:shadow-rose-200 transition-all duration-200 transform hover:-translate-y-0.5 font-semibold text-sm sm:text-base cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                      <Download size={16} className={apkDownloading ? "animate-bounce" : ""} />
                    </div>
                    <div className="text-left">
                      <div className="text-[10px] text-rose-100 uppercase leading-none font-medium">DIRECT INSTALL</div>
                      <div className="text-sm sm:text-base font-bold text-white leading-tight">
                        {apkDownloading ? "Starting..." : apkDownloaded ? "Downloaded!" : "Download APK"}
                      </div>
                    </div>
                  </button>
                </div>

                {apkDownloaded && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold animate-fade-in">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    APK download link initiated. Check your downloads folder!
                  </div>
                )}
              </div>
            </div>

            {/* Right Visual / QR Section */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="relative bg-gradient-to-b from-rose-50 to-white p-6 rounded-3xl border border-rose-100/80 shadow-lg text-center max-w-xs w-full">
                <div className="w-12 h-12 rounded-2xl bg-[#FB2467] text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-rose-200">
                  <Smartphone size={24} />
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-1">Scan to Install</h3>
                <p className="text-xs text-gray-500 mb-4">Point your mobile camera to quickly install BariVivah on your device</p>

                <div className="bg-white p-3 rounded-2xl shadow-inner border border-rose-100 inline-block mb-3">
                  <Image
                    src="/qr.png"
                    alt="Scan QR Code to Download App"
                    width={160}
                    height={160}
                    className="w-36 h-36 object-contain rounded-lg"
                    priority
                  />
                </div>

                <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-rose-600">
                  <Sparkles size={13} />
                  <span>Supports Android 8.0+ & iOS 14+</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="mb-12">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-serif">
              Why use the BariVivah Mobile App?
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Built specifically for seamless, privacy-first community matchmaking
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {appFeatures.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="bg-white p-6 rounded-2xl border border-rose-100/70 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-start text-left space-y-3"
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${f.bg}`}>
                    <Icon size={22} />
                  </div>
                  <h3 className="font-bold text-gray-900 text-base">{f.title}</h3>
                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Community Trust Strip */}
        <div className="bg-gradient-to-r from-rose-50 via-pink-50 to-rose-50 rounded-2xl border border-rose-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-[#FB2467] flex-shrink-0">
              <Heart size={20} className="fill-current" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Dedicated Community Matrimony</h4>
              <p className="text-xs text-gray-500">Trusted by thousands of families across India for verified matches.</p>
            </div>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FB2467] hover:underline"
          >
            Learn more about BariVivah <ChevronRight size={14} />
          </Link>
        </div>
      </main>

      {/* Clean Brand Footer */}
      <footer className="w-full bg-white border-t border-rose-100 py-6 text-center text-xs text-gray-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} BariVivah. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <Link href="/" className="hover:text-gray-600 transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link href="/" className="hover:text-gray-600 transition-colors">Terms of Service</Link>
            <span>•</span>
            <Link href="/" className="hover:text-gray-600 transition-colors">Contact Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function DownloadAppPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-rose-500" />
      </div>
    }>
      <DownloadAppContent />
    </Suspense>
  );
}
