"use client"
import { useState, useEffect } from 'react';
import { ArrowRight, Heart } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function MatrimonialHero({ onAction }) {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative w-full flex bg-white overflow-hidden pt-4 lg:pt-8">

      {/* Hero Content */}
      <div className="w-full max-w-[1200px] relative z-10 mx-auto px-6 pt-8 lg:pt-12 pb-12 lg:pb-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* Left Side: Text Content */}
          <div className={`flex-1 text-center lg:text-left space-y-8 transition-all duration-1000 transform ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>

            <h1 
              className="text-gray-900 font-bold"
              style={{ 
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontSize: '60px',
                lineHeight: '70px',
                letterSpacing: '-0.25px',
                verticalAlign: 'middle'
              }}
            >
              Find Your <br className="hidden lg:block"/>
              <span className="whitespace-nowrap"><span className="text-primary">Perfect</span> Life Partner</span>
            </h1>

            <p className="text-[17px] text-[#5C3F43] max-w-lg mx-auto lg:mx-0 font-sans leading-relaxed">
              Join India's most trusted premium matchmaking service.<br className="hidden lg:block"/>
              Discover thousands of verified profiles tailored to your<br className="hidden lg:block"/>
              community and preferences.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button 
                onClick={() => onAction ? onAction(() => router.push('/dashboard')) : router.push('/dashboard')}
                className="px-7 py-3.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-sm flex items-center gap-2 group min-w-[180px] justify-center"
              >
                <span className="font-medium text-base">Create Free Profile</span>
                <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
              </button>

              <button 
                onClick={() => onAction ? onAction(() => router.push('/matches')) : router.push('/matches')}
                className="px-7 py-3.5 bg-white text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-sm min-w-[180px]"
              >
                <span className="font-medium text-base">Browse Matches</span>
              </button>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-[42px] h-[42px] rounded-full border-2 border-white relative overflow-hidden bg-gray-200 shadow-sm">
                    <Image width={42} height={42} src={`/people/rohan.jpg`} alt="Member" className="w-full h-full object-cover" />
                  </div>
                ))}
                <div className="w-[42px] h-[42px] rounded-full border-2 border-white relative overflow-hidden bg-pink-50 flex items-center justify-center z-10 shadow-sm">
                  <span className="text-[11px] font-bold text-primary">+2M</span>
                </div>
              </div>
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start text-yellow-400 gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-[18px] h-[18px] fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  ))}
                </div>
                <p className="text-sm text-[#5C3F43] font-medium">Trusted by millions</p>
              </div>
            </div>
          </div>

          {/* Right Side: Image Composition */}
          <div className={`flex-1 relative w-full max-w-xl lg:max-w-none lg:pl-16 transition-all duration-1000 delay-300 transform ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            <div className="relative z-10">
              {/* Main Image Frame */}
              <div className="relative w-full max-w-[544px] mx-auto opacity-100">
                <img
                  src="/images/image_230.png"
                  alt="Happy Couple"
                  className="w-full h-auto object-contain rounded-xl"
                />

                {/* Badge 1: Top Left */}
                <div className="absolute top-[15%] -left-8 md:-left-12 bg-white px-5 py-3 rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex items-center gap-3 animate-float-slow z-20 border border-gray-100">
                  <div className="w-[32px] h-[32px] rounded-full bg-[#FFEBEF] flex items-center justify-center text-primary">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#5C3F43] uppercase tracking-widest font-semibold mb-0.5">Status</p>
                    <p className="text-[14px] font-bold text-gray-900 leading-none">100% Verified</p>
                  </div>
                </div>

                {/* Badge 2: Bottom Left */}
                <div className="absolute bottom-[20%] -left-6 md:-left-10 bg-white px-5 py-4 rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex items-center gap-3 animate-float-medium z-20 border border-gray-100">
                  <div className="w-[36px] h-[36px] rounded-full border-[2.5px] border-primary flex items-center justify-center">
                    <span className="text-primary font-bold text-[13px]">98%</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#5C3F43] uppercase tracking-widest font-semibold mb-0.5">Match</p>
                    <p className="text-[14px] font-bold text-gray-900 leading-none">Compatibility</p>
                  </div>
                </div>

                {/* Badge 3: Middle Right */}
                <div className="absolute top-[55%] -right-8 md:-right-12 bg-white px-4 py-3 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex items-center gap-2.5 animate-float-fast z-20 border border-gray-100">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E]"></div>
                  <span className="text-[14px] font-bold text-gray-900 leading-none">Online Now</span>
                </div>
              </div>

              {/* Decorative Elements behind text/image (Removed for flat white bg) */}

              {/* Floral decoration removed as requested */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
