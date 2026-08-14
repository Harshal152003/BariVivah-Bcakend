"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Heart, Sparkles, Users, Star, ArrowRight } from "lucide-react";

export default function AuthBanner() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    "Trusted by thousands",
    "Verified profiles only",
    "AI-powered matching",
    "Success stories daily",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div
      className="hidden md:flex md:w-1/2 relative overflow-hidden bg-white"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Dynamic Gradient Orbs */}
        <div
          className="absolute  bg-gradient-to-r from-pink-500/30 to-orange-500/30 rounded-full blur-3xl transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${-150 + mousePosition.x * 0.5}px, ${
              -150 + mousePosition.y * 0.5
            }px)`,
          }}
        />
        <div
          className="absolute bottom-0 right-0  bg-gradient-to-r from-red-400/20 to-pink-400/20 rounded-full blur-3xl transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${100 - mousePosition.x * 0.3}px, ${
              100 - mousePosition.y * 0.3
            }px)`,
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative flex items-end justify-center w-full p-6 h-full pb-12">
        <div className="text-gray-900 text-center w-full max-w-2xl">
          {/* Image Container with Advanced Hover Effects */}
          <div className="mb-8 flex justify-center">
            <div className="relative group cursor-pointer">
              {/* Image with Hover Effects */}
              <div className="relative overflow-hidden bg-transparent transition-all duration-700">
                <Image
                  src="/admin-login-slide-5.svg"
                  alt="Admin Login Banner"
                  width={750}
                  height={1030}
                  priority
                  className="w-11/12 mx-auto h-auto"
                />
              </div>
            </div>
          </div>


        </div>
      </div>

      {/* Bottom Logo */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
        <Image
          src="/admin-login-logo-bottom.svg"
          alt="BariVivah Logo"
          width={250}
          height={80}
          className="h-16 md:h-20 w-auto object-contain opacity-90"
        />
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-6 right-6 text-white/20 animate-pulse">
        <Heart className="w-8 h-8" />
      </div>
      <div
        className="absolute bottom-6 left-6 text-white/20 animate-pulse"
        style={{ animationDelay: "1s" }}
      >
        <Sparkles className="w-6 h-6" />
      </div>
    </div>
  );
}
