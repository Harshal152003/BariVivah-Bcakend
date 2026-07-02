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
    <div className="relative min-h-[90vh] w-full flex items-center justify-center bg-bg-light overflow-hidden pt-10">
      {/* Background Pattern Layer */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/background-pattern.jpg')] bg-cover bg-center"></div>
      </div>

      {/* Hero Content */}
      <div className="container relative z-10 mx-auto px-6 py-12 lg:py-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* Left Side: Text Content */}
          <div className={`flex-1 text-center lg:text-left space-y-8 transition-all duration-1000 transform ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-primary/20 backdrop-blur-sm self-center lg:self-start mx-auto lg:mx-0 shadow-sm">
              <Heart size={16} className="text-secondary fill-secondary" />
              <span className="text-secondary font-medium text-sm tracking-wide uppercase">Trusted Matrimony Service</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-serif font-bold text-secondary leading-tight">
              Begin Your Journey to <br />
              <span className="text-primary italic relative">
                Forever
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/30" viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.00025 6.99997C25.7509 2.15575 102.49 2.48835 200.001 6.99997" stroke="currentColor" strokeWidth="3" /></svg>
              </span>
            </h1>

            <p className="text-lg md:text-xl text-secondary/70 max-w-2xl mx-auto lg:mx-0 font-sans leading-relaxed">
              Discover a Match Made in Heaven. We blend tradition with modern matchmaking to help you find a partner who shares your values, dreams, and culture.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button 
                onClick={() => onAction ? onAction(() => router.push('/dashboard')) : router.push('/dashboard')}
                className="px-8 py-4 bg-secondary text-white rounded-full hover:bg-secondary/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center gap-3 group min-w-[180px] justify-center"
              >
                <span className="font-medium text-lg">Find a Match</span>
                <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform" />
              </button>

              <button 
                onClick={() => onAction ? onAction(() => {
                  const section = document.getElementById('how-it-works');
                  if (section) section.scrollIntoView({ behavior: 'smooth' });
                }) : null}
                className="px-8 py-4 bg-white text-secondary border border-secondary/20 rounded-full hover:bg-primary/5 transition-all duration-300 shadow-md hover:shadow-lg min-w-[180px]"
              >
                <span className="font-medium text-lg">How It Works</span>
              </button>
            </div>

            <div className="pt-8 flex items-center justify-center lg:justify-start gap-6">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-2 border-bg-light relative overflow-hidden bg-gray-200">
                    <Image width={100} height={100} src={`/people/rohan.jpg`} alt="Member" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-secondary">20k+</p>
                <p className="text-sm text-secondary/60">Success Stories</p>
              </div>
            </div>
          </div>

          {/* Right Side: Image Composition */}
          <div className={`flex-1 relative w-full max-w-xl lg:max-w-none transition-all duration-1000 delay-300 transform ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            <div className="relative z-10">
              {/* Main Image Frame (Arch Shape) */}
              <div className="relative w-full aspect-[3/4] md:aspect-[4/5] lg:aspect-[3/4] rounded-t-[10rem] rounded-b-[2rem] overflow-hidden border-[8px] border-white shadow-2xl">
                <img
                  src="/images/HeroImage.png"
                  alt="Happy Couple"
                  className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/40 via-transparent to-transparent"></div>

                {/* Floating Badge Bottom */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-lg border border-white/50 w-[80%]">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-secondary/60 uppercase tracking-wider font-semibold">Match Rate</p>
                      <p className="text-2xl font-bold text-primary">98.5%</p>
                    </div>
                    <div className="h-10 w-[1px] bg-secondary/10"></div>
                    <div>
                      <p className="text-xs text-secondary/60 uppercase tracking-wider font-semibold">Verified Profiles</p>
                      <p className="text-2xl font-bold text-secondary">100%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements behind text/image */}
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10"></div>
              <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -z-10"></div>

              {/* Floral decoration (CSS shapes or SVG) */}
              <svg className="absolute -top-6 -left-6 w-24 h-24 text-primary opacity-80" viewBox="0 0 100 100" fill="currentColor">
                <path d="M50 0 C60 20 80 20 100 20 C80 40 80 60 100 80 C80 80 60 80 50 100 C40 80 20 80 0 80 C20 60 20 40 0 20 C20 20 40 20 50 0 Z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
