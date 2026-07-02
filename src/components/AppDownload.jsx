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
    <div className="relative w-full overflow-hidden bg-secondary py-20 lg:px-20">
      {/* Decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-secondary/80 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-accent/30 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content - Text and Download Buttons */}
          <div className={`max-w-lg transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="inline-block mb-4">
              <span className="px-4 py-1 rounded-full bg-primary/20 text-white/90 text-sm font-medium">
                Official Mobile App
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
              Bring Your Search for Love <span className="text-primary-light">To Your Fingertips</span>
            </h2>

            <p className="text-white/80 text-lg mb-8">
              Experience seamless matchmaking with the BariVivah app. Stay connected with prospective families, manage your profile, and find your soulmate with our secure and intuitive mobile experience.
            </p>

            {/* App features list */}
            <div className="mb-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {appFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 text-white/90">
                    <CheckCircle size={18} className="text-primary-light flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* App rating */}
            <div className="flex items-center mb-8">
              <div className="flex mr-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    className="text-primary fill-primary"
                  />
                ))}
              </div>
              <span className="text-white font-medium">4.9</span>
              <span className="text-white/60 ml-1">• 10k+ Reviews</span>
            </div>

            {/* Download buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* App Store Button */}
              <button className="px-6 py-3 bg-white rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg flex items-center justify-center group">
                <div className="flex items-center">
                  <div className="mr-3">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className="text-gray-900">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-gray-600">Download on the</div>
                    <div className="text-sm font-semibold text-gray-900">App Store</div>
                  </div>
                </div>
              </button>

              {/* Google Play Button */}
              <button className="px-6 py-3 bg-white rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg flex items-center justify-center group">
                <div className="flex items-center">
                  <div className="mr-3">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className="text-gray-900">
                      <path d="M3 20.5v-17c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v17c0 .83-.67 1.5-1.5 1.5S3 21.33 3 20.5zM16.5 12L8.92 19.6c-.7.7-1.84.7-2.54 0-.7-.7-.7-1.84 0-2.54L11.98 12 6.38 6.4c-.7-.7-.7-1.84 0-2.54.7-.7 1.84-.7 2.54 0L16.5 12z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-gray-600">GET IT ON</div>
                    <div className="text-sm font-semibold text-gray-900">Google Play</div>
                  </div>
                </div>
              </button>
            </div>

            {/* QR Code option */}
            <div className="mt-8 flex items-center">
              <div className="w-16 h-16 bg-white p-1 rounded-lg shadow-lg mr-4">
                <Image
                  width={1920}
                  height={1080}
                  src="/qr.png"
                  alt="QR Code"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-white/80 text-sm">Or scan QR code</p>
                <button className="flex items-center text-primary-light text-sm font-medium mt-1 hover:text-white group">
                  Learn more <ChevronRight size={16} className="ml-1 transform group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </div>
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
                      src="/final.jpg"
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
                      src="/Finaltwo.png"
                      alt="App Screenshot"
                      className="w-full aspect-[9/16] object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Floating feature indicators */}
              <div className="absolute top-20 -left-16 z-20 hidden lg:block">
                <div className="bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg flex items-center space-x-3 transform -rotate-6">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Download size={16} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Downloads</div>
                    <div className="text-sm font-semibold">500k+</div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-20 -left-8 z-20 hidden lg:block">
                <div className="bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg flex items-center space-x-3 transform rotate-3">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Star size={16} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Success Rate</div>
                    <div className="text-sm font-semibold">92%</div>
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