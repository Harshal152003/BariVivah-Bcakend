"use client"
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote, HeartHandshake, Gem, MapPin, Headphones } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
  {
    id: 1,
    name: "Priya & Raj",
    location: "Mumbai, India",
    content: "We found each other through this platform and it's been a beautiful journey. The matching algorithm truly understands compatibility beyond just surface-level preferences.",
    image: "/images/couple1.jpeg",
    joined: "2022",
  },
  {
    id: 2,
    name: "Ananya & Arjun",
    location: "Delhi, India",
    content: "As working professionals, we didn't have time for traditional matchmaking. This service helped us connect meaningfully while respecting our cultural values.",
    image: "/images/couple2.jpeg",
    joined: "2021",
  },
  {
    id: 3,
    name: "Neha & Vikram",
    location: "Bangalore, India",
    content: "The detailed profiles and verification process gave us confidence in the platform. We're celebrating our first anniversary next month!",
    image: "/images/couple3.jpeg",
    joined: "2023",
  },
];

export default function UserTestimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="relative w-full overflow-hidden bg-bg-light py-24">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
        <div className="absolute -left-20 top-40 w-72 h-72 bg-secondary/10 rounded-full blur-[80px]"></div>
        <div className="absolute -right-20 bottom-40 w-80 h-80 bg-primary/10 rounded-full blur-[80px]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className={`text-center mb-16 transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
          <div className="inline-block mb-3">
            <span className="px-4 py-1 rounded-full bg-white border border-primary/20 text-primary text-sm font-medium shadow-sm">
              Real Stories
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-4 font-serif">
            Matches Made in <span className="text-primary italic">Heaven</span>
          </h2>
          <p className="text-lg text-secondary/70 max-w-2xl mx-auto font-light">
            Read heartwarming stories from couples who found their forever through BariVivah.
          </p>
        </div>

        {/* Testimonial Slider */}
        <div className="relative max-w-6xl mx-auto mb-20">
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl overflow-hidden min-h-[500px] md:min-h-[400px] border border-white/50">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out flex flex-col md:flex-row ${index === currentTestimonial ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              >
                {/* Left: Image Side */}
                <div className="w-full md:w-2/5 relative h-64 md:h-auto overflow-hidden">
                  <Image
                    width={800}
                    height={1000}
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover transition-transform duration-[10000ms] ease-linear hover:scale-110" // subtle zoom
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/60 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-white/10"></div>
                  {/* Mobile Name Overlay */}
                  <div className="absolute bottom-4 left-4 text-white md:hidden">
                    <h3 className="text-xl font-serif font-bold">{testimonial.name}</h3>
                    <p className="text-sm opacity-90">{testimonial.location}</p>
                  </div>
                </div>

                {/* Right: Content Side */}
                <div className="w-full md:w-3/5 p-8 md:p-16 flex flex-col justify-center relative">
                  {/* Background Quote Mark */}
                  <Quote className="absolute top-8 right-8 text-primary/10 w-32 h-32 md:w-40 md:h-40 -rotate-12" />

                  <div className="relative z-10">
                    <div className="hidden md:block mb-6">
                      <h3 className="text-3xl font-serif font-bold text-secondary">{testimonial.name}</h3>
                      <p className="text-primary font-medium">{testimonial.location}</p>
                    </div>

                    <div className="mb-8">
                      <Quote className="text-primary w-8 h-8 mb-4 opacity-50 rotate-180" />
                      <p className="text-xl md:text-2xl text-secondary/80 font-serif italic leading-relaxed">
                        {testimonial.content}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                      <div className="text-sm text-gray-500 font-medium tracking-wide uppercase">
                        Married since {testimonial.joined}
                      </div>
                      <div className="h-px bg-gray-300 flex-grow max-w-[50px]"></div>
                      <div className="flex text-yellow-500 gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons (Floating) */}
          <div className="absolute top-1/2 -left-4 md:-left-8 -translate-y-1/2 z-20">
            <button onClick={prevTestimonial} className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white text-secondary shadow-lg hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center border border-gray-100 group">
              <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="absolute top-1/2 -right-4 md:-right-8 -translate-y-1/2 z-20">
            <button onClick={nextTestimonial} className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white text-secondary shadow-lg hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center border border-gray-100 group">
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`transition-all duration-500 rounded-full h-1.5 ${index === currentTestimonial ? 'w-8 bg-primary' : 'w-2 bg-gray-300 hover:bg-primary/50'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto transition-all duration-1000 delay-300 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {[
            { value: "20,000+", label: "Happy Couples", Icon: HeartHandshake },
            { value: "98%", label: "Success Rate", Icon: Gem },
            { value: "50+", label: "Cities Covered", Icon: MapPin },
            { value: "24/7", label: "Dedicated Support", Icon: Headphones },
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-primary/5 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 group-hover:bg-primary/10 transition-colors"></div>

              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <stat.Icon size={24} strokeWidth={1.5} />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-secondary mb-1 font-sans group-hover:text-primary transition-colors">{stat.value}</div>
              <div className="text-sm md:text-base text-gray-500 font-medium uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}