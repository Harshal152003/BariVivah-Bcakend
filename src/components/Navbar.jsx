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
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[#f8f8f8] shadow-md py-1' : 'bg-[#f8f8f8] py-2'
      }`}>
      <div className="w-full max-w-[1200px] mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center relative h-10 w-48 lg:w-56">
          <Image src={"/images/new-logo.png"} width={300} height={100} className='absolute top-1/2 -translate-y-1/2 left-0 h-16 lg:h-24 w-auto object-contain' alt='BariVivah Logo' />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {['Home', 'Search Matches', 'Success Stories', 'Membership', 'About', 'Contact'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              className={`relative text-[16.5px] font-medium transition-colors duration-300 group ${item === 'Home' ? 'text-primary' : 'text-[#5C3F43] hover:text-primary'}`}
            >
              {item}
              <span className={`absolute -bottom-1 left-0 h-[2px] bg-primary transition-all duration-300 ${item === 'Home' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </a>
          ))}
        </div>

        {/* Auth Buttons - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/login" className="px-6 py-2 text-sm text-[#5C3F43] bg-transparent border border-gray-200 rounded-full hover:bg-gray-50 transition-colors duration-300">
            Login
          </Link>
          <Link href="/register" className="px-6 py-2 text-sm bg-primary text-white rounded-full hover:bg-primary/90 transition-colors duration-300">
            Register
          </Link>
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
            {['Home', 'Search Matches', 'Success Stories', 'Membership', 'About', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className={`py-2 transition-colors duration-200 ${item === 'Home' ? 'text-primary font-bold' : 'text-[#5C3F43] hover:text-primary'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <div className="pt-2 flex flex-col space-y-3">
              <Link href="/login" className="w-full py-2 text-center text-[#5C3F43] border border-gray-200 rounded-full hover:bg-gray-50 transition-colors duration-200">
                Login
              </Link>
              <Link href="/register" className="w-full py-2 text-center bg-primary text-white rounded-full hover:bg-primary/90 transition-colors duration-200">
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
