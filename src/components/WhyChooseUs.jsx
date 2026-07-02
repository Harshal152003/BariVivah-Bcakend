"use client"
import { useState, useEffect } from 'react';
import { Shield, Users, Lock, Smartphone, HeartHandshake, Sparkles } from 'lucide-react';

export default function WhyChooseUs() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const features = [
    {
      icon: Shield,
      title: "Verified Profiles",
      description: "We strictly verify every profile to ensure a safe and trustworthy community for your search."
    },
    {
      icon: Lock,
      title: "100% Privacy",
      description: "Your personal details are safe with us. You have complete control over who sees your information."
    },
    {
      icon: Users,
      title: "Community Match",
      description: "Connect with families that share your values, culture, and traditions for a perfect bond."
    },
    {
      icon: Smartphone,
      title: "Easy to Use",
      description: "Our seamless mobile-friendly design lets you find your soulmate anytime, anywhere."
    }
  ];

  return (
    <div className="relative py-24 w-full bg-white overflow-hidden">
      {/* Background Decor - Creative Floral Theme - MAX DENSITY */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        {/* 1. Large Organic Gradients base */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] opacity-60 mix-blend-multiply animate-pulse" style={{ animationDuration: '7s' }}></div>
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] opacity-60 mix-blend-multiply animate-pulse" style={{ animationDuration: '10s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-pink-200/20 rounded-full blur-[80px] opacity-40 mix-blend-overlay"></div>

        {/* 2. Complex Hanging Vines (Top Left) */}
        <svg className="absolute -top-10 -left-10 w-[400px] h-[400px] text-secondary/10 transform -rotate-12" viewBox="0 0 400 400" fill="none">
          <path d="M50 0 Q80 100 150 150 T300 250" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M100 80 Q50 100 60 140" stroke="currentColor" strokeWidth="1.5" />
          <path d="M120 120 Q80 150 90 190" stroke="currentColor" strokeWidth="1.5" />
          <path d="M180 180 Q150 220 160 260" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="60" cy="140" r="4" fill="currentColor" className="text-secondary/30" />
          <circle cx="90" cy="190" r="3" fill="currentColor" className="text-primary/30" />
          <circle cx="160" cy="260" r="5" fill="currentColor" className="text-secondary/30" />
        </svg>

        {/* 3. Rising Flower Stalks (Bottom Right) */}
        <svg className="absolute -bottom-20 -right-20 w-[500px] h-[500px] text-primary/10" viewBox="0 0 500 500" fill="none">
          <path d="M400 500 Q350 350 300 250 T200 100" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M450 500 Q420 400 380 320" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

          {/* Leaves on main stalk */}
          <path d="M330 300 Q360 280 350 250" stroke="currentColor" strokeWidth="1.5" />
          <path d="M310 270 Q280 260 270 230" stroke="currentColor" strokeWidth="1.5" />

          {/* Bud at top */}
          <circle cx="200" cy="100" r="8" fill="currentColor" className="text-primary/20" />
          <circle cx="380" cy="320" r="5" fill="currentColor" className="text-secondary/20" />
        </svg>

        {/* 4. Abstract Wave Patterns (Middle) */}
        <div className="absolute top-1/4 right-0 w-full h-24 opacity-10">
          <svg width="100%" height="100%" preserveAspectRatio="none">
            <path d="M0 20 Q 300 80 600 20 T 1200 50" stroke="#7E5D8C" strokeWidth="1" fill="none" />
          </svg>
        </div>
        <div className="absolute bottom-1/3 left-0 w-full h-32 opacity-10">
          <svg width="100%" height="100%" preserveAspectRatio="none">
            <path d="M0 60 Q 400 0 800 60 T 1600 30" stroke="#D982B2" strokeWidth="1" fill="none" />
          </svg>
        </div>

        {/* 5. Scattered Floating Petals */}
        {[...Array(8)].map((_, i) => (
          <svg
            key={`petal-${i}`}
            className="absolute text-secondary/10 animate-pulse"
            style={{
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 80 + 10}%`,
              width: `${Math.random() * 20 + 10}px`,
              height: `${Math.random() * 20 + 10}px`,
              transform: `rotate(${Math.random() * 360}deg)`,
              animationDelay: `${i * 0.5}s`
            }}
            viewBox="0 0 24 24" fill="currentColor"
          >
            <path d="M12 2C8 2 8 8 8 8C8 8 2 8 2 12C2 16 8 16 8 16C8 16 8 22 12 22C16 22 16 16 16 16C16 16 22 16 22 12C22 8 16 8 16 8C16 8 16 2 12 2Z" />
          </svg>
        ))}

        {/* 6. Sparkle Clusters */}
        <div className="absolute top-20 right-20 flex gap-4 opacity-30">
          <Sparkles size={16} className="text-primary animate-bounce delay-100" />
          <Sparkles size={24} className="text-secondary animate-pulse" />
        </div>
        <div className="absolute bottom-40 left-20 flex gap-6 opacity-30">
          <Sparkles size={20} className="text-secondary animate-bounce delay-700" />
          <Sparkles size={12} className="text-primary animate-pulse" />
        </div>

        {/* 7. Geometric Accents */}
        <div className="absolute top-40 left-10 w-2 h-2 rounded-full bg-secondary/40"></div>
        <div className="absolute top-42 left-14 w-3 h-3 rounded-full bg-primary/40"></div>

        <div className="absolute bottom-60 right-10 w-16 h-16 border-2 border-primary/5 rounded-full"></div>
        <div className="absolute bottom-52 right-16 w-8 h-8 border border-secondary/10 rounded-full"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">

        {/* Header Section */}
        <div className={`text-center mb-20 transition-all duration-700 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles size={14} />
            <span className="uppercase tracking-wider text-xs">Why We Are Special</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-secondary mb-6">
            Trusted by Thousands of Families
          </h2>
          <p className="text-lg text-secondary/70 max-w-2xl mx-auto font-light leading-relaxed">
            We bring together tradition and technology to help you write your beautiful love story. Here is why BariVivah is the right choice for you.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group bg-bg-light/50 border border-white/60 p-8 rounded-3xl transition-all duration-500 hover:shadow-xl hover:bg-white hover:-translate-y-2 relative overflow-hidden ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{ transitionDelay: `${150 * index}ms` }}
            >
              {/* Hover Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10">
                <feature.icon className="text-primary" size={32} strokeWidth={1.5} />
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-xl font-serif font-semibold text-secondary mb-3 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-secondary/70 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}