"use client"
import { useState, useEffect } from 'react';
import { Star, Download, CheckCircle, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function AppDownloadSection() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // App features list
  const appFeatures = [
    "Real-time match notifications",
    "Secure chat with families",
    "Video calling for verification",
    "Advanced compatibility filters"
  ];

  return (
    <div className="relative w-full overflow-hidden bg-[#FB2467] py-20 lg:px-20">
      {/* Decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-3/4 -translate-y-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/20 blur-[120px]"></div>
      </div>

      <div className="w-full max-w-[1200px] mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content - Text and Download Buttons */}
          <div className={`max-w-lg transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="inline-block mb-6">
              <span className="px-4 py-1.5 rounded-full bg-white/10 text-white/90 text-sm font-medium border border-white/10 shadow-sm">
                Mobile Experience
              </span>
            </div>

            <h2 className="text-4xl md:text-[42px] font-bold text-[#FFFFFF] mb-6 leading-[1.2] tracking-tight">
              Find Your Perfect Match <br/>
              <span className="text-yellow-400">Anytime, Anywhere</span>
            </h2>

            <p className="text-white/90 text-[17px] mb-10 leading-relaxed max-w-[460px]">
              Take your search for love on the go with our feature-rich mobile app. Get instant notifications, browse profiles, and connect with potential matches—all from your smartphone.
            </p>

            {/* App features list */}
            <div className="mb-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                <div className="flex items-start space-x-3 text-white">
                  <CheckCircle size={20} className="text-[#FFFFFF] flex-shrink-0 mt-0.5" />
                  <span className="text-[15px] font-medium">Instant match notifications</span>
                </div>
                <div className="flex items-start space-x-3 text-white">
                  <CheckCircle size={20} className="text-[#FFFFFF] flex-shrink-0 mt-0.5" />
                  <span className="text-[15px] font-medium leading-snug">Private chat with potential<br/>matches</span>
                </div>
                <div className="flex items-start space-x-3 text-white">
                  <CheckCircle size={20} className="text-[#FFFFFF] flex-shrink-0 mt-0.5" />
                  <span className="text-[15px] font-medium">Verify profiles with video calls</span>
                </div>
                <div className="flex items-start space-x-3 text-white">
                  <CheckCircle size={20} className="text-[#FFFFFF] flex-shrink-0 mt-0.5" />
                  <span className="text-[15px] font-medium leading-snug">Search filters for better<br/>compatibility</span>
                </div>
              </div>
            </div>

            {/* App rating */}
            <div className="flex items-center mb-2">
              <div className="flex mr-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={20}
                    className="text-[#FFFFFF] fill-[#FFFFFF] -mr-0.5"
                  />
                ))}
              </div>
              <span className="text-white font-bold text-lg">4.9</span>
              <span className="text-white/80 font-medium ml-2 text-[15px]">• 10k+ Reviews</span>
            </div>

            {/* Download buttons & QR Code */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-center sm:items-stretch">
              {/* App Store Button */}
              <button className="hover:opacity-80 transition-opacity duration-300 flex items-center justify-center bg-transparent p-0 border-none shadow-none">
                <img
                  src="/app_store_badge.svg"
                  alt="Download on the App Store"
                  className="w-[130px] h-auto object-contain"
                />
              </button>

              {/* Google Play Button */}
              <button className="hover:opacity-80 transition-opacity duration-300 flex items-center justify-center bg-transparent p-0 border-none shadow-none">
                <img
                  src="/google_play_badge.svg"
                  alt="Get it on Google Play"
                  className="w-[130px] h-auto object-contain"
                />
              </button>


            </div>
          </div>

          {/* Right Content - Phone Mockup */}
          <div className={`flex justify-center  transition-all duration-1000 delay-300 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="relative">
              {/* Main phone mockup */}
              <div className="relative z-10">
                <div className="w-64 md:w-72 bg-gray-900 rounded-[3rem] p-3 shadow-xl">
                  <div className="w-full rounded-[2.5rem] overflow-hidden border-8 border-gray-900">
                    <Image
                      width={1920}
                      height={1080}
                      src="/final_vibrant_pink.jpg"
                      alt="App Screenshot"
                      className="w-full aspect-[9/17] object-cover"
                    />
                  </div>
                  <div className="flex justify-center mt-4 mb-1">
                    <div className="w-16 h-1 bg-gray-800 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Second phone (tilted in background) */}
              <div className="absolute -right-20 top-20 -z-10 hidden md:block">
                <div className="w-64 transform -rotate-6 bg-gray-900 rounded-[3rem] p-3 opacity-70 shadow-xl">
                  <div className="w-full rounded-[2.5rem] overflow-hidden border-8 border-gray-900">
                    <Image
                      width={1920}
                      height={1080}
                      src="/Finaltwo_vibrant_pink.png"
                      alt="App Screenshot"
                      className="w-full aspect-[9/16] object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Floating feature indicators */}
              <div className="absolute top-20 -left-16 z-20 hidden lg:block">
                <div className="bg-[#FFFFFF] p-3 rounded-xl shadow-lg flex items-center space-x-3 transform -rotate-6">
                  <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                    <Download size={16} className="text-[#FB2467]" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#FB2467]">Downloads</div>
                    <div className="text-sm font-bold text-[#FB2467]">1M+</div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-20 -left-8 z-20 hidden lg:block">
                <div className="bg-[#FFFFFF] p-3 rounded-xl shadow-lg flex items-center space-x-3 transform rotate-3">
                  <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                    <Star size={16} className="text-[#FB2467]" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#FB2467]">Success Rate</div>
                    <div className="text-sm font-bold text-[#FB2467]">94%</div>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -z-10 -bottom-10 -left-10 w-40 h-40 rounded-full border-8 border-primary/20 opacity-60"></div>
              <div className="absolute -z-10 top-10 right-10 w-24 h-24 rounded-full border-8 border-accent/20 opacity-50"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
