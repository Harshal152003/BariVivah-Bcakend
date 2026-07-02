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
      className="hidden md:flex md:w-1/2 relative overflow-hidden bg-gradient-to-br from-red-500 via-red-600 to-red-800"
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
      <div className="relative  flex items-center justify-center w-full p-12">
        <div className="text-white text-center max-w-lg">
          {/* Image Container with Advanced Hover Effects */}
          <div className="mb-8 flex justify-center">
            <div
              className={`relative group cursor-pointer transition-all duration-700 ${
                isHovered ? "scale-105" : "scale-100"
              }`}
              style={{
                filter: isHovered
                  ? "drop-shadow(0 25px 50px rgba(255,255,255,0.1))"
                  : "none",
              }}
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-orange-400/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 scale-110" />

              {/* Rotating Border */}
              <div
                className="absolute inset-0 rounded-3xl bg-gradient-to-r from-pink-400 via-red-400 to-orange-400 opacity-0 group-hover:opacity-20 transition-opacity duration-700 animate-pulse"
                style={{ padding: "2px" }}
              >
                <div className="w-full h-full rounded-3xl bg-transparent" />
              </div>

              {/* Image with Hover Effects */}
              <div className="relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 p-4 group-hover:bg-white/15 transition-all duration-700">
                <Image
                  src="/assest/loginpng.png"
                  alt="BariVivah Logo"
                  width={255}
                  height={100}
                  className={`w-auto h-auto max-w-full transition-all duration-700 ${
                    isHovered ? "scale-110 rotate-1" : "scale-100 rotate-0"
                  }`}
                  style={{
                    filter: isHovered
                      ? "brightness(1.1) contrast(1.1)"
                      : "brightness(1) contrast(1)",
                  }}
                />
              </div>

              {/* Floating Action Hint */}
              <div
                className={`absolute -bottom-4 left-1/2 transform -translate-x-1/2 transition-all duration-500 ${
                  isHovered
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-2"
                }`}
              >
                <div className="bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
                  <span className="text-sm text-white/90 flex items-center space-x-1">
                    <span>Discover Love</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Brand Section */}
          <div className="mb-8">
            <h1
              className={`text-5xl font-bold mb-4 transition-all duration-700 ${
                isHovered ? "scale-105 text-white" : "scale-100 text-white/95"
              }`}
            >
              <span className="bg-gradient-to-r from-white via-pink-100 to-orange-100 bg-clip-text text-transparent">
                BariVivah
              </span>
            </h1>

            {/* Animated Tagline */}
            <div className="relative h-8 mb-4">
              <p
                className={`text-xl transition-all duration-700 ${
                  isHovered ? "text-white" : "text-white/90"
                }`}
              >
                Find Your Perfect Match
              </p>
            </div>

            {/* Rotating Features */}
            <div className="relative h-6 mb-6">
              {features.map((feature, index) => (
                <p
                  key={index}
                  className={`absolute inset-0 text-white/80 text-sm transition-all duration-700 flex items-center justify-center ${
                    index === activeFeature
                      ? "opacity-100 transform translate-y-0"
                      : "opacity-0 transform translate-y-4"
                  }`}
                >
                  {feature}
                </p>
              ))}
            </div>
          </div>

          {/* Feature Dots */}
          <div className="flex justify-center space-x-2">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveFeature(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeFeature
                    ? "bg-white w-8"
                    : "bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
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
