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
      <HeroSection onAction={handleAction} />
      {/* <QuickRegistrationForm /> */}
      <SearchMatchesWidget onAction={handleAction} />
      <WhyChooseUs />
      <HowItWorks onAction={handleAction} />
      <FeaturedProfiles onAction={handleAction} />
      {/* <SuccessStories /> */}

      <AppDownload />
      <UserTestimonials />

      <BlogPreview />
      <MembershipPlans />
      <Footer />

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
}
