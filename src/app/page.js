"use client"
import React, { useState } from 'react';
import { useSession } from "@/context/SessionContext";
import AuthModal from "@/components/AuthModal";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import QuickRegistrationForm from "@/components/QuickRegistrationForm";
import SearchMatchesWidget from "@/components/SearchMatchesWidget";
import WhyChooseUs from "@/components/WhyChooseUs";
import HowItWorks from "@/components/HowItWorks";
import FeaturedProfiles from "@/components/FeaturedProfiles";
import SuccessStories from "@/components/SuccessStories";
import MembershipPlans from "@/components/MembershipPlans";
import AppDownload from "@/components/AppDownload";
import UserTestimonials from "@/components/UserTestimonials";
import BlogPreview from "@/components/BlogPreview";
import Footer from "@/components/Footer";

export default function HomePage() {
  const { isAuthenticated } = useSession();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAction = (callback) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      if (callback) callback();
    }
  };

  return (
    <>
      <Navbar />
      <div id="home"><HeroSection onAction={handleAction} /></div>
      {/* <QuickRegistrationForm /> */}
      <div id="search-matches" className="scroll-mt-24 w-full bg-white relative z-20">
        <SearchMatchesWidget onAction={handleAction} />
      </div>
      <div id="about" className="scroll-mt-24"><WhyChooseUs /></div>
      <HowItWorks onAction={handleAction} />
      <FeaturedProfiles onAction={handleAction} />
      {/* <SuccessStories /> */}

      <AppDownload />
      <div id="success-stories" className="scroll-mt-24"><UserTestimonials /></div>

      <BlogPreview />
      <div id="membership" className="scroll-mt-24"><MembershipPlans /></div>
      <div id="contact"><Footer /></div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
}
