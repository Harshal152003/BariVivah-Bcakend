"use client"
import React from 'react';
import { Heart, Mail, MapPin, Phone } from 'lucide-react';
import {
  Facebook as LucideFacebook,
  Twitter as LucideTwitter,
  Instagram as LucideInstagram,
  Linkedin as LucideLinkedin
} from 'lucide-react';
const Footer = () => {
  return (
    <footer className="relative w-full bg-secondary text-white pt-24 pb-12 overflow-hidden">
      {/* Decorative floral backgrounds */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-500/10 rounded-full blur-[80px] pointer-events-none mix-blend-screen"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">

          {/* Brand Column (Span 4) */}
          <div className="lg:col-span-4 space-y-6 pr-4">
            <div className="inline-flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Heart className="text-primary-light fill-primary-light" size={20} />
              </div>
              <span className="text-3xl font-serif font-bold tracking-wide">BariVivah</span>
            </div>

            <p className="text-white/70 leading-relaxed font-light text-lg">
              We believe every love story is beautiful, but yours is our favorite. Bringing families together with trust, tradition, and technology since 2010.
            </p>

            <div className="flex space-x-3 pt-4">
              {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => {
                const Icon = {
                  facebook: LucideFacebook,
                  twitter: LucideTwitter,
                  instagram: LucideInstagram,
                  linkedin: LucideLinkedin
                }[social];

                return (
                  <a key={social} href="#" className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 hover:bg-primary hover:border-primary flex items-center justify-center transition-all duration-300 group">
                    <Icon className="w-5 h-5 text-white/70 group-hover:text-white" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Spacer (Span 1) */}
          <div className="hidden lg:block lg:col-span-1"></div>

          {/* Links Column 1 (Span 2) */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-xl font-serif font-medium text-primary-light relative inline-block pb-2">
              Company
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-primary"></span>
            </h4>
            <ul className="space-y-3">
              {['About Us', 'Success Stories', 'Awards', 'Careers', 'Blog'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white/70 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 2 (Span 2) */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-xl font-serif font-medium text-primary-light relative inline-block pb-2">
              Support
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-primary"></span>
            </h4>
            <ul className="space-y-3">
              {['Help Center', 'Safety Tips', 'Terms of Service', 'Privacy Policy', 'Report Misuse'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white/70 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column (Span 3) */}
          <div className="lg:col-span-3 space-y-6">
            <h4 className="text-xl font-serif font-medium text-primary-light relative inline-block pb-2">
              Get in Touch
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-primary"></span>
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 group">
                <MapPin className="text-primary mt-1 group-hover:text-primary-light transition-colors" size={20} />
                <span className="text-white/70 text-sm leading-relaxed">
                  123, Pride World City,<br />Charholi Budruk, Pune, Maharashtra 412105
                </span>
              </li>
              <li className="flex items-center space-x-3 group">
                <Mail className="text-primary group-hover:text-primary-light transition-colors" size={20} />
                <a href="mailto:support@barivivah.com" className="text-white/70 hover:text-white transition-colors text-sm">
                  support@barivivah.com
                </a>
              </li>
              <li className="flex items-center space-x-3 group">
                <Phone className="text-primary group-hover:text-primary-light transition-colors" size={20} />
                <a href="tel:+919876543210" className="text-white/70 hover:text-white transition-colors text-sm">
                  +91 98765 43210
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter / App Download Bar */}
        <div className="bg-primary/10 rounded-2xl p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative mb-12 border border-white/5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

          <div className="relative z-10 text-center md:text-left">
            <h5 className="text-xl font-serif font-semibold mb-1">Download Our App</h5>
            <p className="text-white/60 text-sm">Get matches on the go. Available for iOS and Android.</p>
          </div>

          <div className="relative z-10 flex gap-4">
            <button className="flex items-center px-4 py-2 bg-black rounded-lg hover:bg-black/80 transition-colors border border-white/10">
              <span className="text-xs text-left">
                <span className="block text-[10px] text-white/60">Download on the</span>
                <span className="font-semibold">App Store</span>
              </span>
            </button>
            <button className="flex items-center px-4 py-2 bg-black rounded-lg hover:bg-black/80 transition-colors border border-white/10">
              <span className="text-xs text-left">
                <span className="block text-[10px] text-white/60">Get it on</span>
                <span className="font-semibold">Google Play</span>
              </span>
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-white/50">
          <p>© {new Date().getFullYear()} BariVivah. All rights reserved.</p>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <a 
              href="/admin-login" 
              className="text-white/40 hover:text-white transition-colors duration-200 text-xs font-medium"
            >
              Admin Login
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;