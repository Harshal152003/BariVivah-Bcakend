"use client"
import React, { useState, useEffect } from 'react';
import { UserPlus, Search, MessageCircleHeart, Gem } from 'lucide-react';

const steps = [
    {
        id: 1,
        title: "Create Profile",
        description: "Register for free & create your profile",
        icon: UserPlus,
        color: "bg-blue-100 text-blue-600"
    },
    {
        id: 2,
        title: "Search Matches",
        description: "Search matches by your preference",
        icon: Search,
        color: "bg-pink-100 text-pink-600"
    },
    {
        id: 3,
        title: "Interact",
        description: "Connect & Chat with verified members",
        icon: MessageCircleHeart,
        color: "bg-purple-100 text-purple-600"
    },
    {
        id: 4,
        title: "Marriage",
        description: "Find your perfect match & get married",
        icon: Gem,
        color: "bg-red-100 text-red-600"
    }
];

export default function HowItWorks() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <section id="how-it-works" className="py-20 bg-white relative overflow-hidden">
            {/* Background Florals */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[80px] translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className={`text-center mb-16 transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <span className="px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">Simple Process</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-secondary mt-4 mb-4 font-serif">
                        How it <span className="text-primary italic">Works</span>
                    </h2>
                    <p className="text-lg text-secondary/70 max-w-2xl mx-auto">
                        3 easy steps to find your life partner.
                    </p>
                </div>

                <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 dashed-line z-0"></div>

                    {steps.map((step, index) => (
                        <div
                            key={step.id}
                            className={`relative z-10 flex flex-col items-center text-center transition-all duration-700 delay-${index * 200} transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                        >
                            <div className={`w-24 h-24 rounded-full ${step.color} flex items-center justify-center mb-6 shadow-md border-4 border-white relative group transition-transform duration-300 hover:scale-110`}>
                                <div className="absolute inset-0 rounded-full border border-current opacity-20 scale-125 group-hover:scale-110 transition-transform duration-500"></div>
                                <step.icon size={32} strokeWidth={1.5} />
                                <div className="absolute -bottom-2 bg-white px-2 py-0.5 rounded-full text-xs font-bold border border-gray-100 shadow-sm">0{step.id}</div>
                            </div>
                            <h3 className="text-xl font-bold text-secondary mb-2 font-serif">{step.title}</h3>
                            <p className="text-secondary/60 text-sm max-w-[200px]">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
