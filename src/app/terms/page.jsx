"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Scale,
  Shield,
  ShieldCheck,
  Check,
  AlertTriangle,
  ArrowLeft,
  ChevronRight,
  Copy,
  CheckCircle2,
  Search,
  Printer,
  BookOpen,
  Clock,
  FileText,
  Building,
  Phone,
  Mail,
  MapPin,
  X,
  ExternalLink,
  ChevronDown,
} from "lucide-react";

export default function TermsOfServicePage() {
  const lastUpdated = "August 16, 2026";
  const effectiveDate = "August 16, 2026";

  const [activeSection, setActiveSection] = useState("preamble");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  const sections = [
    { id: "preamble", title: "Preamble & Legal Acceptance", number: "0" },
    { id: "eligibility", title: "1. Eligibility & Legal Age", number: "1" },
    { id: "registration", title: "2. Registration & Account Security", number: "2" },
    { id: "role", title: "3. Intermediary Status & Verification", number: "3" },
    { id: "conduct", title: "4. Code of Conduct & Content Policy", number: "4" },
    { id: "privacy-consent", title: "5. DPDP Act 2023 Consent & Processing", number: "5" },
    { id: "membership", title: "6. Membership Packages & Refund Policy", number: "6" },
    { id: "termination", title: "7. Suspension & Profile Deletion", number: "7" },
    { id: "liability", title: "8. Limitation of Liability & Disclaimers", number: "8" },
    { id: "governing-law", title: "9. Governing Law & Dispute Resolution", number: "9" },
    { id: "grievance", title: "10. Grievance Redressal Officer", number: "10" },
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
    const url = `${window.location.origin}/terms#${id}`;
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
              Terms of Service
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
                className={`transition-transform duration-200 ${
                  mobileTocOpen ? "rotate-180" : ""
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
                className={`block px-3 py-2 rounded text-xs font-medium transition-colors ${
                  activeSection === item.id
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
              <Scale size={13} className="text-primary" /> Statutory Legal Policy
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200/60">
              <CheckCircle2 size={12} className="text-emerald-600" /> Active & Enforceable
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1E1B2E] tracking-tight mb-4">
            Terms of Service & Membership Agreement
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed mb-6">
            These Terms and Conditions constitute a legally binding agreement between you and{" "}
            <strong className="text-slate-900 font-bold">Bari Vivah Matrimony</strong> regarding your registration, profile creation, and matchmaking services on{" "}
            <span className="text-primary font-semibold">www.barivivah.in</span>.
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
              <span><strong>Governing Law:</strong> Republic of India (DPDP Act 2023 / IT Act 2000)</span>
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
                <label htmlFor="toc-search" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Jump to Section
                </label>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    id="toc-search"
                    type="text"
                    placeholder="Search terms e.g. refund, age..."
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
                      className={`group flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                        isActive
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

              {/* Quick Legal Highlights Card */}
              <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-primary" /> Key Takeaways
                </div>
                <ul className="space-y-1.5 text-[11.5px] leading-relaxed text-slate-600">
                  <li className="flex items-start gap-1.5">
                    <span className="text-primary font-bold">•</span>
                    <span><strong>Age Requirement:</strong> 18+ for Females, 21+ for Males.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-primary font-bold">•</span>
                    <span><strong>Intermediary:</strong> Platform provides matches; independent background check recommended.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-primary font-bold">•</span>
                    <span><strong>Refunds:</strong> Non-refundable once contact unlock tokens/plans are activated.</span>
                  </li>
                </ul>
              </div>

              {/* Contact / Help Desk */}
              <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600 space-y-1">
                <p className="font-semibold text-slate-900">Legal Questions?</p>
                <p className="text-[11.5px] text-slate-500">
                  Email our compliance desk at{" "}
                  <a href="mailto:support@barivivah.in" className="text-primary font-semibold hover:underline">
                    support@barivivah.in
                  </a>
                </p>
              </div>

            </div>
          </aside>

          {/* Right Column: Editorial Clauses */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* 0. Preamble & Acceptance */}
            <section id="preamble" className="scroll-mt-36 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h2 className="text-xl font-bold text-[#1E1B2E]">
                  Preamble & Agreement to Terms
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
                  Welcome to <strong>Bari Vivah Matrimony</strong> (hereinafter referred to as{" "}
                  <em className="font-medium text-slate-900">"Bari Vivah," "Website," "Company," "We," "Us,"</em> or{" "}
                  <em className="font-medium text-slate-900">"Our"</em>). By accessing, browsing, registering an account on{" "}
                  <span className="text-primary font-semibold">www.barivivah.in</span>, or using our mobile applications, you agree to be bound by the following Terms and Conditions, Community Guidelines, and provide your explicit consent for data processing under Indian Law.
                </p>
                <p>
                  These Terms of Service govern your membership and use of all related digital matchmaking tools, verified candidate profiles, contact unlocking mechanisms, and matchmaking algorithms.
                </p>
              </div>

              <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg text-xs sm:text-sm text-amber-950 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-900">
                  <AlertTriangle size={15} className="text-amber-600 shrink-0" />
                  <span>Mandatory Acceptance Notice</span>
                </div>
                <p className="text-amber-900/90 leading-relaxed">
                  If you do not agree to all terms, conditions, and privacy policies set forth herein, you must immediately refrain from registering or using the Bari Vivah website and applications.
                </p>
              </div>
            </section>

            {/* 1. Eligibility */}
            <section id="eligibility" className="scroll-mt-36 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h2 className="text-xl font-bold text-[#1E1B2E]">
                  1. Eligibility & Minimum Age
                </h2>
                <button
                  type="button"
                  onClick={() => handleCopySectionLink("eligibility")}
                  className="text-slate-400 hover:text-primary transition-colors p-1 rounded"
                  title="Copy link to this section"
                >
                  {copiedId === "eligibility" ? (
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <Check size={12} /> Copied
                    </span>
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed">
                Membership and access to Bari Vivah is strictly restricted to individuals who fulfill the following statutory and policy qualifications:
              </p>

              {/* Structured Table for Eligibility */}
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-100/75 border-b border-slate-200 text-slate-900 font-bold">
                      <th className="py-2.5 px-4">Eligibility Criterion</th>
                      <th className="py-2.5 px-4">Statutory Requirement</th>
                      <th className="py-2.5 px-4">Verification Mode</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-slate-900">Legal Age (Female)</td>
                      <td className="py-2.5 px-4">Minimum 18 completed years</td>
                      <td className="py-2.5 px-4 text-slate-500">Date of Birth & ID Proof</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-slate-900">Legal Age (Male)</td>
                      <td className="py-2.5 px-4">Minimum 21 completed years</td>
                      <td className="py-2.5 px-4 text-slate-500">Date of Birth & ID Proof</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-slate-900">Marital Purpose</td>
                      <td className="py-2.5 px-4">Solemnization of lawful marriage</td>
                      <td className="py-2.5 px-4 text-slate-500">Registration declaration</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-slate-900">Citizenship / Status</td>
                      <td className="py-2.5 px-4">Indian Citizen, PIO, or NRI</td>
                      <td className="py-2.5 px-4 text-slate-500">Profile verification</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Any account created by a minor, or found misrepresenting age, marital status (e.g. concealing existing marriage), or identity, will be permanently terminated with immediate effect.
              </p>
            </section>

            {/* 2. Registration & Account Security */}
            <section id="registration" className="scroll-mt-36 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h2 className="text-xl font-bold text-[#1E1B2E]">
                  2. Registration & Account Security
                </h2>
                <button
                  type="button"
                  onClick={() => handleCopySectionLink("registration")}
                  className="text-slate-400 hover:text-primary transition-colors p-1 rounded"
                >
                  {copiedId === "registration" ? (
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
                  <strong>2.1. Truthful Representations:</strong> You agree to provide true, accurate, current, and verifiable information during registration (including candidate photograph, family particulars, educational qualifications, caste, and contact details).
                </p>
                <p>
                  <strong>2.2. Login Credentials Confidentiality:</strong> You are solely responsible for maintaining the strict confidentiality of your OTPs, passwords, and Unique Profile ID (e.g. <code>BV-XXXXXX</code>). You must not disclose or share login credentials with any third party.
                </p>
                <p>
                  <strong>2.3. Account Responsibility:</strong> Any action, inquiry, message, or connection request initiated under your authenticated mobile number or credentials will be deemed executed directly by you or your authorized family guardian.
                </p>
              </div>
            </section>

            {/* 3. Intermediary Status */}
            <section id="role" className="scroll-mt-36 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h2 className="text-xl font-bold text-[#1E1B2E]">
                  3. Role of Bari Vivah (Intermediary Status)
                </h2>
                <button
                  type="button"
                  onClick={() => handleCopySectionLink("role")}
                  className="text-slate-400 hover:text-primary transition-colors p-1 rounded"
                >
                  {copiedId === "role" ? (
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <Check size={12} /> Copied
                    </span>
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>

              <div className="space-y-4 text-sm leading-relaxed text-slate-700">
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-lg space-y-1.5">
                  <h4 className="font-bold text-slate-900">
                    Intermediary Status under Section 79 of the IT Act, 2000
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Bari Vivah acts strictly as an electronic intermediary and discovery platform. We provide tools for community members to publish profiles and explore mutual matrimonial compatibility. <strong>We do not act as marriage brokers or match guarantors.</strong>
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-lg space-y-1.5">
                  <h4 className="font-bold text-slate-900">
                    No Guarantee of Marriage Proposals or Compatibility
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Bari Vivah does not guarantee that registered members will find a compatible life partner, receive responses to connection requests, or conclude a marriage alliance. Match compatibility percentages are calculated algorithmically based solely on user-submitted preferences.
                  </p>
                </div>

                <div className="p-4 bg-rose-50/60 border border-rose-200/70 rounded-lg space-y-1.5 text-slate-800">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck size={16} className="text-primary shrink-0" />
                    Independent Verification Advisory
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    While Bari Vivah offers verification trust badges based on submitted government IDs and live photos, <strong>all members and their families are strongly urged to conduct independent reference checks</strong>, physical residential visits, financial verification, and due diligence before finalizing any matrimonial alliance.
                  </p>
                </div>
              </div>
            </section>

            {/* 4. Code of Conduct */}
            <section id="conduct" className="scroll-mt-36 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h2 className="text-xl font-bold text-[#1E1B2E]">
                  4. User Conduct & Content Policy
                </h2>
                <button
                  type="button"
                  onClick={() => handleCopySectionLink("conduct")}
                  className="text-slate-400 hover:text-primary transition-colors p-1 rounded"
                >
                  {copiedId === "conduct" ? (
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <Check size={12} /> Copied
                    </span>
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed">
                To preserve a respectful and safe matrimonial environment, all members agree <strong>NOT</strong> to:
              </p>

              <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                <div className="p-3 bg-white border border-slate-200 rounded-md flex items-start gap-2.5">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span><strong>Defamatory or Obscene Content:</strong> Upload, publish, or transmit vulgar, pornographic, abusive, blasphemous, or racially/ethnically offensive material.</span>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-md flex items-start gap-2.5">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span><strong>Fake Profiles & Impersonation:</strong> Create fictitious accounts, post photographs of celebrities or third parties without consent, or misrepresent family wealth.</span>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-md flex items-start gap-2.5">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span><strong>Financial Solicitation & Fraud:</strong> Ask other members for money, financial loans, travel reimbursements, gifts, or commercial investments.</span>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-md flex items-start gap-2.5">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span><strong>Harassment & Stalking:</strong> Continue contacting, messaging, or calling any member who has explicitly declined or rejected a connection request.</span>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-md flex items-start gap-2.5">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span><strong>Commercial Advertisements & Spam:</strong> Use contact information gained through the platform to sell services, promote commercial products, or broadcast chain messages.</span>
                </div>
              </div>
            </section>

            {/* 5. Privacy & DPDP Consent */}
            <section id="privacy-consent" className="scroll-mt-36 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h2 className="text-xl font-bold text-[#1E1B2E]">
                  5. Privacy & DPDP Act 2023 Consent
                </h2>
                <button
                  type="button"
                  onClick={() => handleCopySectionLink("privacy-consent")}
                  className="text-slate-400 hover:text-primary transition-colors p-1 rounded"
                >
                  {copiedId === "privacy-consent" ? (
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <Check size={12} /> Copied
                    </span>
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed">
                In compliance with the <em>Digital Personal Data Protection (DPDP) Act, 2023</em>, you grant your <strong>Explicit and Informed Consent</strong> to Bari Vivah for the following processing activities:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/70 space-y-1">
                  <h4 className="font-bold text-slate-900">A. Data Collection</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Collecting candidate details (Name, DOB, Religion, Caste, Income, Profession, Horoscope, and Photos) for matchmaking.
                  </p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/70 space-y-1">
                  <h4 className="font-bold text-slate-900">B. Profile Visibility</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Displaying your profile to verified community members based on your configured privacy settings.
                  </p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/70 space-y-1">
                  <h4 className="font-bold text-slate-900">C. Multi-Channel Alerts</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Receiving match notifications, OTPs, SMS, WhatsApp updates, and emails regarding account activity.
                  </p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/70 space-y-1">
                  <h4 className="font-bold text-slate-900">D. Secure Infrastructure</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Sharing payment metadata with PCI-DSS compliant payment gateways (Razorpay) for membership checkout.
                  </p>
                </div>
              </div>
            </section>

            {/* 6. Membership & Refunds */}
            <section id="membership" className="scroll-mt-36 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h2 className="text-xl font-bold text-[#1E1B2E]">
                  6. Membership Fees, Invoicing & Refund Policy
                </h2>
                <button
                  type="button"
                  onClick={() => handleCopySectionLink("membership")}
                  className="text-slate-400 hover:text-primary transition-colors p-1 rounded"
                >
                  {copiedId === "membership" ? (
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <Check size={12} /> Copied
                    </span>
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>

              <div className="space-y-3 text-sm leading-relaxed text-slate-700">
                <p>
                  <strong>6.1. Nature of Services:</strong> Bari Vivah offers both free discovery tier and premium membership plans (providing benefits such as direct contact unlocks, verified profile filters, and priority placement).
                </p>
                <p>
                  <strong>6.2. Strict Non-Refundable Policy:</strong> Because membership grants immediate digital access to private candidate profiles and contact unlock credits, <strong>all membership fees are strictly non-refundable once paid and activated</strong>. No pro-rata refunds will be issued for early account deletion or finding a partner prior to plan expiration.
                </p>
                <p>
                  <strong>6.3. Payment Disputes:</strong> If you notice an unauthorized or duplicate debit, you must notify our billing desk in writing within <strong>7 days</strong> of the transaction date with invoice details.
                </p>
                <p>
                  <strong>6.4. Statutory GST Invoicing:</strong> All subscription fees are inclusive/exclusive of applicable Goods and Services Tax (SAC 998599). Computer-generated digital tax invoices are available in your Account Invoices section.
                </p>
              </div>
            </section>

            {/* 7. Termination */}
            <section id="termination" className="scroll-mt-36 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h2 className="text-xl font-bold text-[#1E1B2E]">
                  7. Account Termination & Profile Deletion
                </h2>
                <button
                  type="button"
                  onClick={() => handleCopySectionLink("termination")}
                  className="text-slate-400 hover:text-primary transition-colors p-1 rounded"
                >
                  {copiedId === "termination" ? (
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <Check size={12} /> Copied
                    </span>
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>

              <div className="space-y-3 text-sm leading-relaxed text-slate-700">
                <p>
                  <strong>7.1. Termination for Violation:</strong> Bari Vivah reserves the right to suspend or terminate your membership without notice or refund if you breach these terms, post fraudulent details, or receive multiple verified member complaints.
                </p>
                <p>
                  <strong>7.2. Voluntary Deletion:</strong> You have the right to permanently delete your profile at any time through Account Settings. Upon deletion, your candidate card will be removed from all searches immediately.
                </p>
              </div>
            </section>

            {/* 8. Limitation of Liability */}
            <section id="liability" className="scroll-mt-36 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h2 className="text-xl font-bold text-[#1E1B2E]">
                  8. Limitation of Liability & Indemnity
                </h2>
                <button
                  type="button"
                  onClick={() => handleCopySectionLink("liability")}
                  className="text-slate-400 hover:text-primary transition-colors p-1 rounded"
                >
                  {copiedId === "liability" ? (
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <Check size={12} /> Copied
                    </span>
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>

              <p className="text-sm leading-relaxed text-slate-700">
                To the maximum extent permitted by Indian Law, <strong>Bari Vivah Matrimony</strong>, its directors, officers, and technical team shall not be liable for any indirect, punitive, incidental, special, or consequential damages, loss of reputation, or financial losses arising from:
              </p>

              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
                <li>Personal meetings, financial exchanges, or matrimonial agreements conducted outside the platform.</li>
                <li>Misrepresentations or inaccurate information posted by other registered users.</li>
                <li>Temporary service interruptions, scheduled server maintenance, or telecommunication failures.</li>
              </ul>
            </section>

            {/* 9. Governing Law & Jurisdiction */}
            <section id="governing-law" className="scroll-mt-36 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h2 className="text-xl font-bold text-[#1E1B2E]">
                  9. Governing Law & Exclusive Jurisdiction
                </h2>
                <button
                  type="button"
                  onClick={() => handleCopySectionLink("governing-law")}
                  className="text-slate-400 hover:text-primary transition-colors p-1 rounded"
                >
                  {copiedId === "governing-law" ? (
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <Check size={12} /> Copied
                    </span>
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>

              <p className="text-sm leading-relaxed text-slate-700">
                This Agreement and all associated relationship policies shall be governed by, interpreted, and construed in accordance with the substantive laws of the <strong>Republic of India</strong>. Any dispute, difference, controversy, or claim arising out of or relating to this Agreement shall be subject to the exclusive territorial jurisdiction of the competent civil courts in <strong>Pune, Maharashtra, India</strong>.
              </p>
            </section>

            {/* 10. Grievance Redressal */}
            <section id="grievance" className="scroll-mt-36 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h2 className="text-xl font-bold text-[#1E1B2E]">
                  10. Grievance Redressal Officer
                </h2>
                <button
                  type="button"
                  onClick={() => handleCopySectionLink("grievance")}
                  className="text-slate-400 hover:text-primary transition-colors p-1 rounded"
                >
                  {copiedId === "grievance" ? (
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <Check size={12} /> Copied
                    </span>
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                In compliance with the <em>Information Technology Act, 2000</em>, Information Technology (Intermediary Guidelines) Rules, and the <em>Digital Personal Data Protection Act, 2023</em>, the designated Grievance Officer details are published below:
              </p>

              {/* Official Contact Card (Editorial Border Style) */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 space-y-3 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <Building size={16} className="text-primary mt-0.5 shrink-0" />
                  <div>
                    <span className="text-slate-500 block text-[11px] uppercase tracking-wider font-semibold">Entity</span>
                    <strong className="text-slate-900">Bari Vivah Matrimony</strong>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail size={16} className="text-primary mt-0.5 shrink-0" />
                  <div>
                    <span className="text-slate-500 block text-[11px] uppercase tracking-wider font-semibold">Grievance & Support Email</span>
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
                    <span className="text-slate-500 block text-[11px] uppercase tracking-wider font-semibold">Jurisdiction & Office</span>
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
