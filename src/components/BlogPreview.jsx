"use client"
import React, { useState, useEffect } from 'react';
import { ArrowRight, Clock, Calendar, Bookmark, Share2 } from 'lucide-react';

const featuredPost = {
  id: 1,
  title: "The Changing Face of Arranged Marriages: Tradition Meets Technology",
  category: "Relationship Trends",
  excerpt: "Discover how modern matchmaking apps are reshaping the age-old tradition of arranged marriages, giving you more control while honoring family values.",
  image: "/wedding_guide.png",
  readTime: "8 min read",
  date: "June 15, 2024",
  author: "Sonia Kapoor"
};

const recentPosts = [
  {
    id: 2,
    title: "10 Essential Questions for Your First Meeting",
    category: "Dating Advice",
    readTime: "5 min read",
    image: "/tradition_modernity.png",
    date: "June 10, 2024"
  },
  {
    id: 3,
    title: "Understanding Kundali Matching in 2024",
    category: "Astrology",
    readTime: "6 min read",
    image: "/at.png",
    date: "June 05, 2024"
  },
  {
    id: 4,
    title: "How to Plan a Budget Wedding looks Regal",
    category: "Wedding Planning",
    readTime: "4 min read",
    image: "/wp.png",
    date: "May 28, 2024"
  }
];

export default function BlogPreview() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        {/* Minimal Header */}
        <div className={`flex flex-col md:flex-row justify-between items-end mb-12 transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="max-w-xl">
            <span className="text-primary font-bold tracking-widest uppercase text-xs mb-3 block">Our Journal</span>
            <h2 className="text-4xl md:text-5xl font-sans font-bold text-gray-900 leading-tight tracking-tight">
              Wedding & <span className="text-primary">Relationship</span> Guide
            </h2>
          </div>
          <button className="hidden md:flex items-center gap-2 text-sm font-medium text-[#5C3F43] hover:text-primary transition-colors group">
            View All Articles
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Main Featured Article (Cleaner: Text below image) */}
          <div className={`lg:col-span-7 group cursor-pointer transition-all duration-700 delay-200 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="relative h-[320px] md:h-[380px] rounded-[2rem] overflow-hidden mb-8">
              <img
                src={featuredPost.image}
                alt={featuredPost.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

            </div>

            <div className="pr-4">
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                <span className="font-medium text-primary uppercase text-xs tracking-wider">{featuredPost.category}</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span>{featuredPost.date}</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span>{featuredPost.readTime}</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-sans font-bold text-gray-900 mb-4 leading-tight group-hover:text-primary transition-colors tracking-tight">
                {featuredPost.title}
              </h3>
              <p className="text-[#5C3F43] text-lg font-light leading-relaxed mb-6">
                {featuredPost.excerpt}
              </p>
              <span className="inline-flex items-center gap-2 text-primary font-medium border-b border-primary/20 hover:border-primary pb-0.5 transition-all">
                Read Story <ArrowRight size={18} />
              </span>
            </div>
          </div>

          {/* Sidebar List (Cleaner: No boxes, just separators) */}
          <div className={`lg:col-span-5 flex flex-col h-full`}>
            <div className="space-y-8 flex-grow">
              {recentPosts.map((post, index) => (
                <div
                  key={post.id}
                  className={`flex gap-6 group cursor-pointer pb-8 border-b border-gray-100 last:border-0 last:pb-0 transition-all duration-300 transform ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
                  style={{ transitionDelay: `${400 + (index * 150)}ms` }}
                >
                  <div className="w-28 h-28 flex-shrink-0 rounded-2xl overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-primary text-xs font-bold uppercase tracking-wider mb-2">{post.category}</span>
                    <h4 className="text-xl font-sans font-bold text-gray-900 mb-2 leading-snug group-hover:text-primary transition-colors">
                      {post.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-auto">
                      <span>{post.readTime}</span>
                      <span>•</span>
                      <span>{post.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Newsletter (Cleaner: Minimalist box) */}
            <div className={`mt-10 bg-[#f8f8f8] rounded-2xl p-8 transition-all duration-700 delay-700 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <h4 className="text-xl font-sans font-bold text-gray-900 mb-2">Subscribe to our newsletter</h4>
              <p className="text-[#5C3F43] text-sm mb-4">Weekly advice for your journey to forever.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Email address" className="bg-white border-0 rounded-lg px-4 py-3 text-sm w-full focus:ring-2 focus:ring-primary/20 shadow-sm" />
                <button className="bg-primary hover:bg-primary/90 text-white px-5 rounded-lg transition-colors font-medium shadow-sm">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile View All Button */}
        <div className="mt-12 text-center md:hidden">
          <button className="inline-flex items-center gap-2 text-gray-900 font-medium text-sm hover:text-primary transition-colors">
            View All Articles <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
