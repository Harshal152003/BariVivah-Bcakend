"use client"
import { useState, useEffect } from 'react';
import { Heart, User, Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function MatrimonialNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-bg-light/95 shadow-md py-2' : 'bg-transparent py-4'
      }`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Image src={"/logo.png"} width={300} height={100} className='h-10 w-auto object-contain' alt='BariVivah Logo' />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {['Home', 'Browse Profiles', 'Success Stories', 'About Us', 'Contact'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="relative text-secondary font-medium hover:text-primary transition-colors duration-300 group"
            >
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </div>

        {/* Auth Buttons - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/login" className="px-4 py-2 text-primary border border-primary rounded-full hover:bg-primary/10 transition-colors duration-300">
            Login
          </Link>
          {/* <button className="px-4 py-2 bg-gradient-to-r from-primary to-primary-light text-white rounded-full hover:from-primary hover:to-secondary transition-colors duration-300 flex items-center">
            <span>Register</span>
            <User size={16} className="ml-2" />
          </button> */}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-secondary hover:text-primary transition-colors duration-200"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-bg-light shadow-lg">
          <div className="flex flex-col p-4 space-y-4">
            {['Home', 'Browse Profiles', 'Success Stories', 'About Us', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-secondary py-2 hover:text-primary transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <div className="pt-2 flex flex-col space-y-3">
              <Link href={"/login"} className="w-full py-2 text-center text-primary border border-primary rounded-full hover:bg-primary/10 transition-colors duration-200">
                Login
              </Link>

            </div>
          </div>
        </div>
      )}
    </nav>
  );
}