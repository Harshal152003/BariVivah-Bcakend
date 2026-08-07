"use client"
import { useState, useEffect } from 'react';
import { ShieldCheck, Users, Lock, Brain } from 'lucide-react';

export default function WhyChooseUs() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const features = [
    {
      icon: ShieldCheck,
      title: "Verified Members",
      description: "Every profile is manually screened and phone-verified to ensure authenticity."
    },
    {
      icon: Lock,
      title: "100% Privacy",
      description: "Control who sees your photos and contact details with advanced privacy settings."
    },
    {
      icon: Brain,
      title: "Smart Matchmaking",
      description: "Our AI-driven algorithm finds compatible matches based on your preferences."
    },
    {
      icon: Users,
      title: "Trusted Community",
      description: "Join a community of genuine individuals and families seeking meaningful connections."
    }
  ];

  return (
    <div className="relative py-20 w-full bg-white overflow-hidden">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10">

        {/* Header Section */}
        <div className={`text-center mb-16 transition-all duration-700 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-3xl md:text-[40px] font-bold text-gray-900 mb-4 tracking-tight">
            Why Choose Bari Vivah
          </h2>
          <p className="text-base md:text-[17px] text-[#5C3F43] max-w-3xl mx-auto font-normal leading-relaxed">
            We combine traditional values with modern technology to provide you with the most reliable matrimony experience.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-[#f8f8f8] border border-gray-100/80 p-10 lg:p-12 min-h-[320px] rounded-[24px] transition-all duration-500 hover:shadow-sm hover:-translate-y-1 relative ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{ transitionDelay: `${150 * index}ms` }}
            >
              {/* Icon */}
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center mb-8 ring-8 ring-[#FFEBEF]">
                <feature.icon className="text-white" size={18} strokeWidth={2.5} />
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-[22px] font-semibold text-gray-900 mb-3 leading-tight pr-4">
                  {feature.title}
                </h3>
                <p className="text-[#5C3F43] text-[15px] leading-relaxed">
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
