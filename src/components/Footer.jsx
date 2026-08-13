"use client"
import React from 'react';
import { Phone, Mail, Share2 } from 'lucide-react';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t-2 border-[#FFEBEF] pt-16 pb-8">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-6 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 lg:pr-8 flex flex-col space-y-3">
            <div className="-mb-10 -ml-2">
              <Image 
                src={"/images/new-logo.png"} 
                width={300} 
                height={100} 
                className="h-24 lg:h-40 w-auto object-contain" 
                alt="BariVivah Logo" 
              />
            </div>
            <p className="text-[#5C3F43] text-[15px] leading-relaxed">
              India's premier matrimony platform dedicated to helping you find your perfect life partner through verified, trusted connections.
            </p>
            <div className="flex space-x-6 pt-2">
              <button className="text-primary hover:text-primary/80 transition-colors">
                <Share2 size={22} strokeWidth={2.5} />
              </button>
              <button className="text-primary hover:text-primary/80 transition-colors">
                <Mail size={22} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Company Column */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h4 className="text-xl font-bold text-primary mb-6">Company</h4>
            <ul className="space-y-4">
              {['About Us', 'Success Stories', 'Careers', 'Contact Us'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-[#5C3F43] hover:text-primary transition-colors text-[15px]">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Help Column */}
          <div className="lg:col-span-2 lg:col-start-8">
            <h4 className="text-xl font-bold text-primary mb-6">Legal & Help</h4>
            <ul className="space-y-4">
              {['Privacy Policy', 'Terms of Service', 'Help Center', 'Safety Tips'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-[#5C3F43] hover:text-primary transition-colors text-[15px]">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-3 lg:col-start-10">
            <h4 className="text-xl font-bold text-primary mb-6">Contact</h4>
            <ul className="space-y-5">
              <li className="flex items-center space-x-3">
                <Phone className="text-[#5C3F43]" size={18} />
                <a href="tel:18001234567" className="text-[#5C3F43] hover:text-primary transition-colors text-[15px]">
                  1800 123 4567
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="text-[#5C3F43]" size={18} />
                <a href="mailto:support@barivivah.in" className="text-[#5C3F43] hover:text-primary transition-colors text-[15px]">
                  support@barivivah.in
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t-2 border-[#FFEBEF] pt-8 flex flex-col md:flex-row justify-between items-center text-center">
          <p className="text-[#5C3F43] text-[15px]">
            © {new Date().getFullYear()} Bari Vivah Matrimony. All rights reserved.
          </p>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <a
              href="/admin-login"
              className="text-[#5C3F43] hover:text-primary transition-colors duration-200 text-[15px]"
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
