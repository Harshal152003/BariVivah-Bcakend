"use client";
import React, { useState, useEffect } from "react";
import { XCircle, ArrowRight, RefreshCw, AlertTriangle, Zap, Shield, CreditCard } from "lucide-react";

export default function PaymentFailure({ 
  userName = "Valued Member", 
  planName = "Premium", 
  amount = "2,999",
  transactionId = "TXN-2025-0624-001",
  errorMessage = "Payment could not be processed"
}) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [activeMessage, setActiveMessage] = useState(0);

  const failureMessages = [
    "Payment Failed 💳",
    "Let's Try Again! 🔄",
    "We're Here to Help! 💪"
  ];

  useEffect(() => {
    const messageTimer = setInterval(() => {
      setActiveMessage((prev) => (prev + 1) % failureMessages.length);
    }, 2500);
    return () => clearInterval(messageTimer);
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleRetryPayment = () => window.location.href = '/dashboard/subscription';
  const handleGoHome = () => window.location.href = '/dashboard';

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 flex items-center justify-center p-4 relative overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Simplified Background Elements */}
      <div className="absolute inset-0">
        <div
          className="absolute w-96 h-96 bg-gradient-to-r from-red-200/30 to-orange-200/30 rounded-full blur-2xl transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${-100 + mousePosition.x * 0.3}px, ${
              -100 + mousePosition.y * 0.3
            }px)`,
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-orange-200/20 to-red-200/20 rounded-full blur-2xl transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${50 - mousePosition.x * 0.2}px, ${
              50 - mousePosition.y * 0.2
            }px)`,
          }}
        />
        

        {/* Minimal Floating Decorations */}
        <div className="absolute top-16 left-16 animate-bounce opacity-30" style={{ animationDelay: "0.2s" }}>
          <AlertTriangle className="w-4 h-4 text-red-400" />
        </div>
        <div className="absolute top-20 right-20 animate-bounce opacity-30" style={{ animationDelay: "0.8s" }}>
          <RefreshCw className="w-4 h-4 text-orange-400" />
        </div>
        <div className="absolute bottom-20 left-20 animate-bounce opacity-30" style={{ animationDelay: "1.2s" }}>
          <CreditCard className="w-4 h-4 text-red-500" />
        </div>
      </div>

      {/* Main Content - Reduced Size */}
      <div className="relative z-10 w-full max-w-lg mx-auto">
        {/* Compact Failure Card */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-red-300/20 via-white/15 to-orange-300/20 rounded-3xl blur-sm group-hover:blur-md transition-all duration-500"></div>
          
          <div className="relative bg-gradient-to-br from-white/90 via-red-50/80 to-orange-50/90 backdrop-blur-xl rounded-3xl border border-red-200/50 p-10 text-center hover:from-white/95 hover:via-red-50/90 hover:to-orange-50/95 transition-all duration-500 shadow-xl hover:shadow-red-500/20">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-400/15 via-white/20 to-orange-400/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg"></div>
            
            <div className="relative z-10">
              {/* Compact Failure Icon */}
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  {/* Simplified Ripple Animation */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 bg-red-400/20 rounded-full animate-ping" style={{ animationDuration: '2s' }}></div>
                  </div>

                  {/* Fewer Floating Indicators */}
                  <div className="absolute -top-2 -right-1 animate-bounce" style={{ animationDelay: '0.3s' }}>
                    <AlertTriangle className="w-3 h-3 text-red-500 opacity-80" />
                  </div>
                  <div className="absolute -bottom-1 -left-2 animate-bounce" style={{ animationDelay: '1s' }}>
                    <RefreshCw className="w-3 h-3 text-orange-500 opacity-80" />
                  </div>

                  {/* Compact Failure Circle */}
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 via-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-all duration-300">
                      <XCircle 
                        className="w-8 h-8 text-white animate-pulse relative z-10" 
                        fill="currentColor"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Compact Dynamic Messages */}
              <div className="mb-4">
                <div className="relative h-8 mb-3">
                  {failureMessages.map((message, index) => (
                    <h1
                      key={index}
                      className={`absolute inset-0 text-3xl font-bold transition-all duration-500 flex items-center justify-center ${
                        index === activeMessage
                          ? "opacity-100 transform translate-y-0 scale-100"
                          : "opacity-0 transform translate-y-2 scale-95"
                      }`}
                    >
                      <span className="bg-gradient-to-r from-red-700 via-orange-600 to-red-800 bg-clip-text text-transparent">
                        {message}
                      </span>
                    </h1>
                  ))}
                </div>

                <p className={`text-base mb-4 transition-all duration-500 ${
                  isHovered ? "text-red-800" : "text-red-700"
                }`}>
                  Don't worry {userName}!
                </p>
              </div>

              {/* Compact Error Details */}
              <div className="bg-gradient-to-r from-red-100/70 to-orange-100/70 rounded-xl p-3 mb-4 border border-red-200/40">
                <p className="text-red-700 text-xs mb-1"><strong>Error:</strong> {errorMessage}</p>
                <p className="text-red-600 text-xs">ID: {transactionId}</p>
              </div>

              {/* Compact Action Buttons */}
              <div className="space-y-2 mb-4">
                {/* Primary Retry Button */}
                <button 
                  onClick={handleRetryPayment}
                  className="w-full group relative overflow-hidden bg-gradient-to-r from-red-500 via-orange-500 to-red-600 hover:from-red-600 hover:via-orange-600 hover:to-red-700 rounded-xl px-4 py-3 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-red-500/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <span className="relative flex items-center justify-center space-x-2 text-white font-semibold text-sm">
                    <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                    <span>Try Again</span>
                  </span>
                </button>

                {/* Compact Home Button */}
                <button 
                  onClick={handleGoHome}
                  className="w-full text-red-600 hover:text-red-700 text-xs font-medium transition-colors duration-300 py-1"
                >
                  <span className="flex items-center justify-center space-x-1">
                    <span>Go to Homepage</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </button>
              </div>

              {/* Compact Support Features */}
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2 bg-gradient-to-b from-red-100/60 to-orange-100/60 rounded-lg border border-red-200/40">
                  <Shield className="w-4 h-4 text-red-600 mx-auto mb-1" />
                  <span className="text-xs text-red-700">Secure</span>
                </div>
                <div className="text-center p-2 bg-gradient-to-b from-orange-100/60 to-red-100/60 rounded-lg border border-orange-200/40">
                  <RefreshCw className="w-4 h-4 text-orange-600 mx-auto mb-1" />
                  <span className="text-xs text-orange-700">Retry</span>
                </div>
                <div className="text-center p-2 bg-gradient-to-b from-red-100/60 to-orange-100/60 rounded-lg border border-red-200/40">
                  <CreditCard className="w-4 h-4 text-red-600 mx-auto mb-1" />
                  <span className="text-xs text-red-700">Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Footer Brand */}
        <div className="text-center mt-5">
          <h2 className="text-xl font-bold mb-1">
            <span className="bg-gradient-to-r from-red-600 via-red-500 to-red-700 bg-clip-text text-transparent">
              BariVivah
            </span>
          </h2>
          <p className="text-red-600 text-xs font-medium">
            We're here to help! 💪
          </p>
        </div>
      </div>
    </div>
  );
}