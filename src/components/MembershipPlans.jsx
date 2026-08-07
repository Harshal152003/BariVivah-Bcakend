"use client"
import React, { useState, useEffect } from 'react';
import { Check, Crown, Star, Sparkles, Heart } from 'lucide-react';

const plans = [
    {
        name: "Free",
        price: "₹0",
        duration: "Unlimited",
        features: [
            "Create Profile",
            "Browse Profiles",
            "Send Interest (Limited)",
            "Shortlist Profiles"
        ],
        cta: "Get Started",
        popular: false,
        color: "border-gray-200"
    },
    {
        name: "Gold",
        price: "₹2,500",
        duration: "3 Months",
        features: [
            "All Free Features",
            "Send Unlimited Messages",
            "View Contact Numbers",
            "Profile Highlighter",
            "Priority Support"
        ],
        cta: "Choose Gold",
        popular: true,
        color: "border-yellow-400"
    },
    {
        name: "Platinum",
        price: "₹5,000",
        duration: "6 Months",
        features: [
            "All Gold Features",
            "Dedicated Relationship Manager",
            "Background Verification",
            "Highlighted Profile",
            "Advanced Privacy Settings"
        ],
        cta: "Choose Platinum",
        popular: false,
        color: "border-gray-300" // Silver/Platinum tone
    }
];

export default function MembershipPlans() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Background Decorative */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#f8f8f8] rounded-full blur-[120px]"></div>
            </div>

            <div className="w-full max-w-[1200px] mx-auto px-6 relative z-10">
                <div className={`text-center mb-16 transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <span className="px-4 py-1 rounded-full bg-[#f8f8f8] text-primary text-sm font-medium shadow-sm">
                        Pricing Plans
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-4 font-sans tracking-tight">
                        Invest in Your <span className="text-primary">Future</span>
                    </h2>
                    <p className="text-lg text-[#5C3F43] max-w-2xl mx-auto">
                        Choose a plan that brings you closer to your soulmate.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative bg-white rounded-3xl p-8 transition-all duration-300 hover:shadow-2xl hover:scale-105 border-2 flex flex-col justify-between
                            border-gray-100
                            ${plan.popular
                                    ? 'shadow-xl z-10 hover:border-yellow-500'
                                    : 'shadow-md hover:border-primary/50'
                                } 
                            ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                            style={{ transitionDelay: `${index * 150}ms` }}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-6 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                                    <Sparkles size={14} className="animate-pulse" /> Most Popular
                                </div>
                            )}

                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-sans font-bold text-gray-900 mb-2">{plan.name}</h3>
                                <div className="text-4xl font-bold text-primary mb-1">{plan.price}</div>
                                <div className="text-sm text-gray-400 font-medium uppercase tracking-wider">{plan.duration}</div>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center text-[#5C3F43] text-sm">
                                        <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${plan.popular ? 'bg-primary/20 text-primary' : 'bg-gray-100 text-[#5C3F43]'}`}>
                                            <Check size={12} strokeWidth={3} />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button className={`w-full py-3.5 rounded-xl font-bold transition-all duration-300 ${plan.popular ? 'bg-primary text-white hover:shadow-lg hover:bg-primary/90' : 'bg-gray-50 text-gray-900 hover:bg-gray-100 border border-gray-200'}`}>
                                {plan.cta}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
