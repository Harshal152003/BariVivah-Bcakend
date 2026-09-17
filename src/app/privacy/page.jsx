"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ShieldCheck,
  Lock,
  Eye,
  Database,
  UserCheck,
  Server,
  FileCheck,
  Cookie,
  Mail,
  Phone,
  Building,
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  Shield,
  FileText,
  AlertCircle,
  Search,
  Printer,
  BookOpen,
  Clock,
  Copy,
  Check,
  X,
  ChevronDown,
  MapPin,
  Sparkles,
} from "lucide-react";

export default function PrivacyPolicyPage() {
  const lastUpdated = "September 15, 2026";
  const effectiveDate = "September 15, 2026";

  const [activeSection, setActiveSection] = useState("preamble");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  const sections = [
    { id: "preamble", title: "Preamble & Commitment", number: "0" },
    { id: "info-collect", title: "1. Information We Collect", number: "1" },
    { id: "how-we-use", title: "2. How We Use Your Information", number: "2" },
    { id: "info-sharing", title: "3. Information Sharing & Disclosure", number: "3" },
    { id: "privacy-controls", title: "4. Privacy Settings & User Control", number: "4" },
    { id: "data-security", title: "5. Data Security & Encryption", number: "5" },
    { id: "data-retention", title: "6. Data Retention Policy", number: "6" },
    { id: "cookies", title: "7. Cookies & Tracking Technologies", number: "7" },
    { id: "your-rights", title: "8. Your Rights under DPDP Act 2023", number: "8" },
    { id: "policy-changes", title: "9. Policy Changes & Notifications", number: "9" },
    { id: "grievance-officer", title: "10. Grievance Redressal Officer", number: "10" },
  ];

  // Active section tracking via IntersectionObserver
  useEffect(() => {
    const handleObserver = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: "-20% 0px -65% 0px",
      threshold: 0,
    });

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Copy link handler
  const handleCopySectionLink = (id) => {
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}/privacy#${id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2200);
    });
  };

  // Filtered sections based on live search
  const filteredToc = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const q = searchQuery.toLowerCase();
    return sections.filter((s) => s.title.toLowerCase().includes(q));
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[#FDFCFD] text-[#1E1B2E] flex flex-col selection:bg-rose-100 selection:text-rose-900 font-sans antialiased">
      <Navbar />

      {/* Breadcrumb & Document Status Bar */}
      <div className="pt-24 border-b border-slate-200/70 bg-white/95 backdrop-blur-sm sticky top-0 z-30 print:hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 truncate">
            <Link
              href="/"
              className="hover:text-primary transition-colors flex items-center gap-1 font-medium shrink-0"
            >
              <ArrowLeft size={14} /> Home
            </Link>
            <ChevronRight size={12} className="text-slate-400 shrink-0" />
            <span className="text-slate-500 font-medium">Legal</span>
            <ChevronRight size={12} className="text-slate-400 shrink-0" />
            <span className="text-[#1E1B2E] font-semibold truncate">
              Privacy Policy
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Mobile TOC Trigger */}
            <button
              type="button"
              onClick={() => setMobileTocOpen(!mobileTocOpen)}
              className="lg:hidden px-3 py-1.5 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <BookOpen size={14} className="text-primary" />
              <span>Contents</span>
              <ChevronDown
                size={12}
                className={`transition-transform duration-200 ${mobileTocOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            {/* Print Action */}
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-md border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 flex items-center gap-1.5 transition-colors"
              title="Print or Save as PDF"
            >
              <Printer size={13} className="text-slate-500" />
              <span className="hidden sm:inline">Print Document</span>
            </button>
          </div>
        </div>

        {/* Mobile TOC Drawer */}
        {mobileTocOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white px-4 py-3 max-h-64 overflow-y-auto space-y-1 shadow-lg">
            {sections.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setMobileTocOpen(false)}
                className={`block px-3 py-2 rounded text-xs font-medium transition-colors ${activeSection === item.id
                  ? "bg-rose-50 text-primary font-bold"
                  : "text-slate-600 hover:bg-slate-50"
                  }`}
              >
                {item.title}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Main Document Viewport */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 lg:py-14">

        {/* Document Header (Editorial Style) */}
        <header className="mb-12 pb-8 border-b border-slate-200/80">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck size={13} className="text-primary" /> Data Protection & Privacy Notice
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200/60">
              <Lock size={12} className="text-emerald-600" /> DPDP Act 2023 Compliant
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1E1B2E] tracking-tight mb-4">
            Privacy Policy & Data Protection Charter
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed mb-6">
            At <strong className="text-slate-900 font-bold">Bari Vivah Matrimony</strong>, your privacy and trust are our highest priorities.
            This charter details our data handling, processing, protection, and security practices in compliance with the{" "}
            <em>Digital Personal Data Protection (DPDP) Act, 2023</em> and <em>Information Technology Act, 2000</em>.
          </p>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-500 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <Clock size={14} className="text-slate-400" />
              <span><strong>Last Updated:</strong> {lastUpdated}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span><strong>Effective Date:</strong> {effectiveDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span><strong>Data Fiduciary:</strong> Barivivah Matrimony (Pune, India)</span>
            </div>
          </div>
        </header>

        {/* 2-Column Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* Sticky Left Navigation (Desktop) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-36 space-y-6 print:hidden">
            <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs space-y-4">

              {/* Search Filter */}
              <div>
                <label htmlFor="toc-search-privacy" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Jump to Section
                </label>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    id="toc-search-privacy"
                    type="text"
                    placeholder="Search terms e.g. cookies, Aadhaar, delete..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>

              {/* Navigation List */}
              <nav className="space-y-0.5 max-h-[50vh] overflow-y-auto pr-1">
                {filteredToc.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`group flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${isActive
                        ? "bg-rose-50 text-primary font-bold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                        }`}
                    >
                      <span className="truncate">{item.title}</span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 ml-2" />
                      )}
                    </a>
                  );
                })}
              </nav>

              {/* Quick Privacy Highlights Card */}
              <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-primary" /> Core Privacy Principles
                </div>
                <ul className="space-y-1.5 text-[11.5px] leading-relaxed text-slate-600">
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span><strong>No Data Reselling:</strong> We never sell personal data to third-party telemarketers.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span><strong>Contact Masking:</strong> Phone numbers are locked behind verified unlock tokens.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span><strong>Right to Erasure:</strong> Delete your profile data permanently through settings.</span>
                  </li>
                </ul>
              </div>

              {/* Contact / Grievance Help Desk */}
              <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600 space-y-1">
                <p className="font-semibold text-slate-900">Privacy Assistance</p>
                <p className="text-[11.5px] text-slate-500">
                  Email our Data Grievance Officer at{" "}
                  <a href="mailto:support@barivivah.in" className="text-primary font-semibold hover:underline">
                    support@barivivah.in
                  </a>
                </p>
              </div>

            </div>
          </aside>

          {/* Right Column: Detailed Editorial Sections */}
          <div className="lg:col-span-8 space-y-12">

            {/* 0. Preamble & Commitment */}
            <section id="preamble" className="scroll-mt-36 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h2 className="text-xl font-bold text-[#1E1B2E]">
                  Preamble & Commitment to Member Privacy
                </h2>
                <button
                  type="button"
                  onClick={() => handleCopySectionLink("preamble")}
                  className="text-slate-400 hover:text-primary transition-colors p-1 rounded"
                  title="Copy link to this section"
                >
                  {copiedId === "preamble" ? (
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <Check size={12} /> Copied
                    </span>
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>

              <div className="text-sm leading-relaxed text-slate-700 space-y-3">
                <p>
                  At <strong>Bari Vivah Matrimony</strong> (<em className="font-medium text-slate-900">"We," "Us,"</em> or{" "}
                  <em className="font-medium text-slate-900">"Our"</em>), we understand that matrimonial matchmaking involves sensitive, deeply personal information. We treat your personal data with the highest degree of confidentiality, security, and integrity.
                </p>
                <p>
                  This Privacy Policy applies to all services offered on <span className="text-primary font-semibold">www.barivivah.in</span> and associated mobile applications. It describes what information we collect, how it is processed to deliver verified matches, and the rights you hold as a <strong>Data Principal</strong> under Indian Law.
                </p>
              </div>
            </section>

            {/* 1. Information We Collect */}
            <section id="info-collect" className="scroll-mt-36 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h2 className="text-xl font-bold text-[#1E1B2E]">
                  1. Information We Collect
                </h2>
                <button
                  type="button"
                  onClick={() => handleCopySectionLink("info-collect")}
                  className="text-slate-400 hover:text-primary transition-colors p-1 rounded"
                >
                  {copiedId === "info-collect" ? (
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <Check size={12} /> Copied
                    </span>
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed">
                To create matrimonial profiles and calculate compatibility scores, we collect the following structured categories of data:
              </p>

              {/* Data Breakdown Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-100/75 border-b border-slate-200 text-slate-900 font-bold">
                      <th className="py-2.5 px-4">Category</th>
                      <th className="py-2.5 px-4">Specific Data Elements</th>
                      <th className="py-2.5 px-4">Primary Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-slate-900">Personal & Identity</td>
                      <td className="py-2.5 px-4 text-xs">Full Name, Gender, Date of Birth, Marital Status, Candidate Photographs, Mother Tongue</td>
                      <td className="py-2.5 px-4 text-slate-600 text-xs">Profile Creation & Identification</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-slate-900">Contact Details</td>
                      <td className="py-2.5 px-4 text-xs">Mobile Phone Number, Email Address, Current City, State, Permanent Address</td>
                      <td className="py-2.5 px-4 text-slate-600 text-xs">Account Authentication & Contact Unlocks</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-slate-900">Community & Astro</td>
                      <td className="py-2.5 px-4 text-xs">Religion, Caste (Bari / sub-caste), Gotra, Rashi, Manglik Status, Birth Time & Place</td>
                      <td className="py-2.5 px-4 text-slate-600 text-xs">Cultural Compatibility Matching</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-slate-900">Education & Career</td>
                      <td className="py-2.5 px-4 text-xs">Highest Degree, College, Occupation, Employer/Sector, Annual Income</td>
                      <td className="py-2.5 px-4 text-slate-600 text-xs">Partner Preference Filtering</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-slate-900">Verification Proofs</td>
                      <td className="py-2.5 px-4 text-xs">Govt-issued ID (Optional) & Live Pose Selfie Photo</td>
                      <td className="py-2.5 px-4 text-slate-600 text-xs">Granting "Verified" Trust Badges</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-slate-900">Technical Metadata</td>
                      <td className="py-2.5 px-4 text-xs">IP Address, Device Model, Browser Agent, Access Logs, Session Tokens</td>
                      <td className="py-2.5 px-4 text-slate-600 text-xs">Fraud Prevention & Security Auditing</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 2. How We Use Information */}
            <section id="how-we-use" className="scroll-mt-36 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h2 className="text-xl font-bold text-[#1E1B2E]">
                  2. How We Use Your Information
                </h2>
                <button
                  type="button"
                  onClick={() => handleCopySectionLink("how-we-use")}
                  className="text-slate-400 hover:text-primary transition-colors p-1 rounded"
                >
                  {copiedId === "how-we-use" ? (
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <Check size={12} /> Copied
                    </span>
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed">
                We process your personal information strictly for lawful, legitimate matchmaking purposes:
              </p>

              <div className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/80">
                  <strong className="text-slate-900 block mb-0.5">💍 Matchmaking Discovery & Algorithms:</strong>
                  <span>Displaying your profile to verified opposite-gender candidates and calculating mutual compatibility scores based on preferences (age, education, city, caste).</span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/80">
                  <strong className="text-slate-900 block mb-0.5">🔔 Communication & Notifications:</strong>
                  <span>Delivering transactional OTPs, incoming connection requests, match acceptance notifications, and subscription status updates via Push, SMS, WhatsApp, and Email.</span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/80">
                  <strong className="text-slate-900 block mb-0.5">🛡️ Safety & Account Verification:</strong>
                  <span>Authenticating candidate profiles, validating mobile ownership, screening reports of fraudulent behavior, and protecting members from bad actors.</span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/80">
                  <strong className="text-slate-900 block mb-0.5">📜 Legal & Statutory Compliance:</strong>
                  <span>Maintaining statutory invoice audit logs (GST compliance) and fulfilling lawful disclosure requests from statutory enforcement bodies.</span>
                </div>
              </div>
            </section>

            {/* 3. Information Sharing */}
            <section id="info-sharing" className="scroll-mt-36 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h2 className="text-xl font-bold text-[#1E1B2E]">
                  3. Information Sharing & Disclosure
                </h2>
                <button
                  type="button"
                  onClick={() => handleCopySectionLink("info-sharing")}
                  className="text-slate-400 hover:text-primary transition-colors p-1 rounded"
                >
                  {copiedId === "info-sharing" ? (
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <Check size={12} /> Copied
                    </span>
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>

              <div className="p-4 bg-emerald-50 border-l-4 border-emerald-600 rounded-r-lg text-xs sm:text-sm text-emerald-950">
                <strong>Our Ironclad Guarantee:</strong> We do NOT sell, lease, trade, or monetize your personal details with third-party telemarketers, brokers, or external advertising networks.
              </div>

              <div className="text-sm leading-relaxed text-slate-700 space-y-3">
                <p>
                  <strong>3.1. Other Platform Members:</strong> Other authenticated members can view your public matrimonial card in accordance with your privacy settings. Sensitive phone numbers and addresses remain locked until unlocked via our verified subscription contact system.
                </p>
                <p>
                  <strong>3.2. Operational Service Providers:</strong> We share necessary data with trusted infrastructure vendors strictly to execute platform services:
                </p>
                <ul className="list-disc pl-5 text-xs sm:text-sm text-slate-600 space-y-1">
                  <li><strong>Razorpay:</strong> Encrypted transaction processing for premium plan subscriptions.</li>
                  <li><strong>SMS & WhatsApp Relays:</strong> Fast2SMS and transactional communication relays for OTP and match delivery.</li>
                  <li><strong>Cloudinary & AWS:</strong> Encrypted cloud storage for verified profile photographs.</li>
                </ul>
                <p>
                  <strong>3.3. Legal Mandates:</strong> We may disclose information if required under Indian law, court order, or to prevent financial fraud and protect member safety.
                </p>
              </div>
            </section>

            {/* 4. Privacy Settings & Control */}
            <section id="privacy-controls" className="scroll-mt-36 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h2 className="text-xl font-bold text-[#1E1B2E]">
                  4. Privacy Settings & User Control
                </h2>
                <button
                  type="button"
                  onClick={() => handleCopySectionLink("privacy-controls")}
                  className="text-slate-400 hover:text-primary transition-colors p-1 rounded"
                >
                  {copiedId === "privacy-controls" ? (
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <Check size={12} /> Copied
                    </span>
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed">
                You maintain direct control over your profile visibility through your Account Settings:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <h4 className="font-bold text-slate-900">📸 Photo Visibility</h4>
                  <p className="text-slate-600 text-xs">Configure photo visibility: visible to all members, registered members only, or blurred until mutual connection is accepted.</p>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <h4 className="font-bold text-slate-900">📞 Contact Protection</h4>
                  <p className="text-slate-600 text-xs">Your raw mobile number and email are hidden and only shared when explicitly unlocked by verified members.</p>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <h4 className="font-bold text-slate-900">🗑️ Profile Deletion</h4>
                  <p className="text-slate-600 text-xs">Permanently delete your profile or hide your candidate card from search feeds anytime in one click.</p>
                </div>
              </div>
            </section>

            {/* 5. Data Security */}
            <section id="data-security" className="scroll-mt-36 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h2 className="text-xl font-bold text-[#1E1B2E]">
                  5. Data Security & Encryption Standards
                </h2>
                <button
                  type="button"
                  onClick={() => handleCopySectionLink("data-security")}
                  className="text-slate-400 hover:text-primary transition-colors p-1 rounded"
                >
                  {copiedId === "data-security" ? (
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <Check size={12} /> Copied
                    </span>
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>

              <div className="text-sm leading-relaxed text-slate-700 space-y-3">
                <p>
                  Bari Vivah deploys multi-layered technical and organizational security controls to protect your data against unauthorized access, loss, alteration, or disclosure:
                </p>
                <ul className="list-disc pl-5 text-xs sm:text-sm text-slate-600 space-y-1.5">
                  <li><strong>256-Bit SSL/TLS Encryption:</strong> All data transmitted between your browser/mobile app and our servers is encrypted in transit.</li>
                  <li><strong>Encrypted Databases:</strong> Sensitive verification documents and authentication credentials are encrypted at rest.</li>
                  <li><strong>Access Controls:</strong> Strict role-based permissions ensuring only authorized moderation staff review ID verification submissions.</li>
                  <li><strong>Continuous Security Auditing:</strong> Regular vulnerability assessments, Web Application Firewalls (WAF), and automated DDoS mitigation.</li>
                </ul>
              </div>
            </section>

            {/* 6. Data Retention */}
            <section id="data-retention" className="scroll-mt-36 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h2 className="text-xl font-bold text-[#1E1B2E]">
                  6. Data Retention & Archival Policy
                </h2>
                <button
                  type="button"
                  onClick={() => handleCopySectionLink("data-retention")}
                  className="text-slate-400 hover:text-primary transition-colors p-1 rounded"
                >
                  {copiedId === "data-retention" ? (
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <Check size={12} /> Copied
                    </span>
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>

              <p className="text-sm leading-relaxed text-slate-700">
                We retain your personal matrimonial data for as long as your account is active and necessary to provide services. When you delete your account, your profile is immediately purged from search indexes. Minimal transaction records and invoices are retained strictly as required by Indian taxation and corporate record-keeping laws.
              </p>
            </section>

            {/* 7. Cookies */}
            <section id="cookies" className="scroll-mt-36 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h2 className="text-xl font-bold text-[#1E1B2E]">
                  7. Cookies & Local Storage Technologies
                </h2>
                <button
                  type="button"
                  onClick={() => handleCopySectionLink("cookies")}
                  className="text-slate-400 hover:text-primary transition-colors p-1 rounded"
                >
                  {copiedId === "cookies" ? (
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <Check size={12} /> Copied
                    </span>
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>

              <p className="text-sm leading-relaxed text-slate-700">
                We use strictly necessary session cookies and local storage tokens to recognize your authenticated session, preserve UI preferences, and enhance performance. You may disable cookies in your browser settings, though doing so may prevent certain matchmaking tools from functioning smoothly.
              </p>
            </section>

            {/* 8. Your Rights (DPDP Act) */}
            <section id="your-rights" className="scroll-mt-36 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h2 className="text-xl font-bold text-[#1E1B2E]">
                  8. Your Rights under the DPDP Act, 2023
                </h2>
                <button
                  type="button"
                  onClick={() => handleCopySectionLink("your-rights")}
                  className="text-slate-400 hover:text-primary transition-colors p-1 rounded"
                >
                  {copiedId === "your-rights" ? (
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <Check size={12} /> Copied
                    </span>
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed">
                As a <strong>Data Principal</strong> under Indian law, you are entitled to exercise the following statutory rights:
              </p>

              <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                  <strong>Right to Access & Summary:</strong> Request a summary of personal data processed by Bari Vivah and the identities of third-party processors.
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                  <strong>Right to Correction & Erasure:</strong> Update outdated personal particulars or request immediate erasure of your profile.
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                  <strong>Right to Withdraw Consent:</strong> Revoke processing consent by deactivating or deleting your account.
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                  <strong>Right of Grievance Redressal:</strong> Seek speedy resolution of data complaints through our Grievance Officer.
                </div>
              </div>
            </section>

            {/* 9. Policy Changes */}
            <section id="policy-changes" className="scroll-mt-36 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h2 className="text-xl font-bold text-[#1E1B2E]">
                  9. Policy Changes & Notifications
                </h2>
                <button
                  type="button"
                  onClick={() => handleCopySectionLink("policy-changes")}
                  className="text-slate-400 hover:text-primary transition-colors p-1 rounded"
                >
                  {copiedId === "policy-changes" ? (
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <Check size={12} /> Copied
                    </span>
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>

              <p className="text-sm leading-relaxed text-slate-700">
                Bari Vivah Matrimony reserves the right to amend this Privacy Policy periodically to reflect technological advancements or statutory amendments. Material updates will be communicated through registered email or a prominent notification banner upon logging in.
              </p>
            </section>

            {/* 10. Grievance Redressal Officer */}
            <section id="grievance-officer" className="scroll-mt-36 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h2 className="text-xl font-bold text-[#1E1B2E]">
                  10. Data Protection & Grievance Redressal Officer
                </h2>
                <button
                  type="button"
                  onClick={() => handleCopySectionLink("grievance-officer")}
                  className="text-slate-400 hover:text-primary transition-colors p-1 rounded"
                >
                  {copiedId === "grievance-officer" ? (
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <Check size={12} /> Copied
                    </span>
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                In compliance with the <em>Information Technology Act, 2000</em> and the <em>Digital Personal Data Protection Act, 2023</em>, the official details of the Grievance Officer are published below:
              </p>

              {/* Official Contact Card (Editorial Border Style) */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 space-y-3 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <Building size={16} className="text-primary mt-0.5 shrink-0" />
                  <div>
                    <span className="text-slate-500 block text-[11px] uppercase tracking-wider font-semibold">Data Fiduciary</span>
                    <strong className="text-slate-900">Bari Vivah Matrimony</strong>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail size={16} className="text-primary mt-0.5 shrink-0" />
                  <div>
                    <span className="text-slate-500 block text-[11px] uppercase tracking-wider font-semibold">Grievance & Privacy Email</span>
                    <a href="mailto:support@barivivah.in" className="text-primary font-bold hover:underline">
                      support@barivivah.in
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone size={16} className="text-primary mt-0.5 shrink-0" />
                  <div>
                    <span className="text-slate-500 block text-[11px] uppercase tracking-wider font-semibold">Support Helpline</span>
                    <a href="tel:+919168319090" className="text-primary font-bold hover:underline">
                      +91 9168319090
                    </a>{" "}
                    <span className="text-slate-400">/ 1800 123 4567</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-primary mt-0.5 shrink-0" />
                  <div>
                    <span className="text-slate-500 block text-[11px] uppercase tracking-wider font-semibold">Jurisdiction & Office Address</span>
                    <span className="text-slate-800">Pune, Maharashtra 411051, India</span>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
