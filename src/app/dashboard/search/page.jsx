"use client"
import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  User,
  Heart,
  Eye,
  Bookmark,
  MapPin,
  GraduationCap,
  Briefcase,
  Calendar,
  Award,
  Star,
  ChevronDown,
  ChevronUp,
  X,
  SlidersHorizontal,
  Grid3X3,
  List,
  ArrowUpDown,
  CheckCircle,
  Lock,
  Camera,
  Clock,
  TrendingUp,
  Settings,
  RotateCcw,
  Crown,
  Sparkles
} from 'lucide-react';

export default function SearchProfilesPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [resultsCount, setResultsCount] = useState(247);
  const [isLoading, setIsLoading] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    ageRange: [22, 35],
    heightRange: [150, 180],
    religion: '',
    caste: '',
    location: '',
    education: '',
    profession: '',
    incomeRange: [0, 50],
    lifestyle: {
      vegetarian: false,
      nonSmoker: false,
      nonDrinker: false,
      manglik: false
    },
    preferences: {
      verifiedOnly: false,
      withPhotoOnly: true,
      activeRecently: false
    }
  });

  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    community: true,
    location: true,
    education: false,
    lifestyle: false,
    preferences: false
  });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Sample profile data
  const sampleProfiles = [
    {
      id: 1,
      name: "A***a S***a",
      age: 25,
      height: "5'4\"",
      caste: "Bari",
      city: "Mumbai",
      education: "MBA",
      profession: "Marketing Manager",
      company: "Tech Corp",
      verified: true,
      premium: false,
      lastActive: "2 hours ago",
      compatibility: 92,
      hasPhoto: true,
      isBlurred: false
    },
    {
      id: 2,
      name: "P***i G***a",
      age: 27,
      height: "5'3\"",
      caste: "Bari",
      city: "Delhi",
      education: "B.Tech",
      profession: "Software Engineer",
      company: "IT Solutions",
      verified: true,
      premium: true,
      lastActive: "1 day ago",
      compatibility: 88,
      hasPhoto: true,
      isBlurred: false
    },
    {
      id: 3,
      name: "S***a P***l",
      age: 24,
      height: "5'2\"",
      caste: "Bari",
      city: "Bangalore",
      education: "M.Com",
      profession: "Chartered Accountant",
      company: "Finance Ltd",
      verified: false,
      premium: false,
      lastActive: "3 days ago",
      compatibility: 85,
      hasPhoto: false,
      isBlurred: true
    },
    {
      id: 4,
      name: "R***i K***r",
      age: 26,
      height: "5'5\"",
      caste: "Bari",
      city: "Pune",
      education: "MBBS",
      profession: "Doctor",
      company: "City Hospital",
      verified: true,
      premium: true,
      lastActive: "5 hours ago",
      compatibility: 90,
      hasPhoto: true,
      isBlurred: false
    }
  ];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  useEffect(() => {
    setIsLoaded(true);
    // Only run this on client side
    setIsMobile(window.innerWidth < 1024);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const resetFilters = () => {
    setFilters({
      ageRange: [22, 35],
      heightRange: [150, 180],
      religion: '',
      caste: '',
      location: '',
      education: '',
      profession: '',
      incomeRange: [0, 50],
      lifestyle: {
        vegetarian: false,
        nonSmoker: false,
        nonDrinker: false,
        manglik: false
      },
      preferences: {
        verifiedOnly: false,
        withPhotoOnly: true,
        activeRecently: false
      }
    });
  };

  const FilterSection = ({ title, section, children }) => (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => toggleSection(section)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {expandedSections[section] ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>
      {expandedSections[section] && (
        <div className="pb-4 space-y-4">
          {children}
        </div>
      )}
    </div>
  );

  const ProfileCard = ({ profile }) => (
    <div className="bg-white rounded-xl shadow-lg border border-rose-100/50 hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="relative">
        {/* Profile Image */}
        <div className="aspect-[4/5] bg-gradient-to-br from-rose-100 to-amber-100 flex items-center justify-center relative">
          {profile.hasPhoto ? (
            <div className={`w-full h-full flex items-center justify-center ${profile.isBlurred ? 'blur-md' : ''}`}>
              <User className="w-16 h-16 text-primary" />
            </div>
          ) : (
            <div className="text-center">
              <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No Photo</p>
            </div>
          )}

          {/* Overlay for locked profiles */}
          {profile.isBlurred && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
                <Lock className="w-6 h-6 text-gray-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600 text-center">Upgrade to view</p>
              </div>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col space-y-1">
            {profile.verified && (
              <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified
              </div>
            )}
            {profile.premium && (
              <div className="bg-gradient-to-r from-primary to-secondary text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </div>
            )}
          </div>

          {/* Compatibility Score */}
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
            <div className="flex items-center">
              <Star className="w-3 h-3 text-yellow-500 mr-1" />
              <span className="text-xs font-medium text-gray-700">{profile.compatibility}%</span>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-gray-900">{profile.name}</h3>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500">{profile.lastActive}</span>
            </div>
          </div>

          <div className="space-y-1 text-sm text-gray-600 mb-3">
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              <span>{profile.age} years • {profile.height}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              <span>{profile.city} • {profile.caste}</span>
            </div>
            <div className="flex items-center">
              <GraduationCap className="w-3 h-3 mr-1" />
              <span>{profile.education}</span>
            </div>
            <div className="flex items-center">
              <Briefcase className="w-3 h-3 mr-1" />
              <span>{profile.profession}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button className="flex-1 bg-rose-50 text-rose-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-rose-100 transition-colors flex items-center justify-center">
              <Heart className="w-4 h-4 mr-1" />
              Interest
            </button>
            <button className="flex-1 bg-gray-50 text-gray-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
              View Profile
            </button>
            <button className="bg-gray-50 text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/50 via-white to-amber-50/30">
      <div className="max-w-7xl mx-auto p-6">

        {/* Header Section */}
        <div className={`transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="bg-gradient-to-r from-secondary to-primary rounded-2xl p-6 text-white shadow-xl relative overflow-hidden mb-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <h1 className="text-2xl font-serif font-bold mb-2">Find Your Perfect Match</h1>
              <p className="text-rose-100">Discover profiles that align with your preferences</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* Filter Sidebar */}
          <div className={`lg:w-80 transform transition-all duration-1000 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>

            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full bg-white rounded-xl p-4 shadow-lg border border-rose-100/50 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <Filter className="w-5 h-5 text-rose-500 mr-2" />
                  <span className="font-semibold text-gray-900">Filters</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Filter Panel */}
            <div className={`bg-white rounded-xl shadow-lg border border-rose-100/50 ${showFilters || !isMobile ? 'block' : 'hidden'} lg:block`}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                  <button
                    onClick={resetFilters}
                    className="flex items-center text-rose-600 hover:text-rose-700 text-sm font-medium"
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Reset
                  </button>
                </div>

                <div className="space-y-0">

                  {/* Basic Filters */}
                  <FilterSection title="Basic Details" section="basic">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Age Range</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="range"
                          min="18"
                          max="60"
                          value={filters.ageRange[0]}
                          className="flex-1"
                          onChange={(e) => setFilters(prev => ({
                            ...prev,
                            ageRange: [parseInt(e.target.value), prev.ageRange[1]]
                          }))}
                        />
                        <span className="text-sm text-gray-600 min-w-[60px]">
                          {filters.ageRange[0]} - {filters.ageRange[1]} years
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Height Range</label>
                      <div className="flex space-x-2">
                        <select className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm">
                          <option>4'6" - 5'0"</option>
                          <option>5'0" - 5'6"</option>
                          <option>5'6" - 6'0"</option>
                          <option>6'0" - 6'6"</option>
                        </select>
                      </div>
                    </div>
                  </FilterSection>

                  {/* Community Filter Removed (Dedicated to Bari Hindu community) */}

                  {/* Location Filters */}
                  <FilterSection title="Location" section="location">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        placeholder="Enter city name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm">
                        <option value="">Any State</option>
                        <option>Maharashtra</option>
                        <option>Delhi</option>
                        <option>Karnataka</option>
                        <option>Gujarat</option>
                        <option>Tamil Nadu</option>
                      </select>
                    </div>
                  </FilterSection>

                  {/* Education & Profession */}
                  <FilterSection title="Education & Profession" section="education">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm">
                        <option value="">Any Education</option>
                        <option>Bachelor's</option>
                        <option>Master's</option>
                        <option>PhD</option>
                        <option>Professional Degree</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Profession</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm">
                        <option value="">Any Profession</option>
                        <option>Software Engineer</option>
                        <option>Doctor</option>
                        <option>Teacher</option>
                        <option>Business</option>
                        <option>Government Job</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Income Range (Lakhs/year)</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm">
                        <option value="">Any Income</option>
                        <option>0-5 Lakhs</option>
                        <option>5-10 Lakhs</option>
                        <option>10-20 Lakhs</option>
                        <option>20+ Lakhs</option>
                      </select>
                    </div>
                  </FilterSection>

                  {/* Lifestyle */}
                  <FilterSection title="Lifestyle" section="lifestyle">
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.lifestyle.vegetarian}
                          onChange={(e) => setFilters(prev => ({
                            ...prev,
                            lifestyle: { ...prev.lifestyle, vegetarian: e.target.checked }
                          }))}
                          className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Vegetarian only</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.lifestyle.nonSmoker}
                          onChange={(e) => setFilters(prev => ({
                            ...prev,
                            lifestyle: { ...prev.lifestyle, nonSmoker: e.target.checked }
                          }))}
                          className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Non-smoker</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.lifestyle.nonDrinker}
                          onChange={(e) => setFilters(prev => ({
                            ...prev,
                            lifestyle: { ...prev.lifestyle, nonDrinker: e.target.checked }
                          }))}
                          className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Non-drinker</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.lifestyle.manglik}
                          onChange={(e) => setFilters(prev => ({
                            ...prev,
                            lifestyle: { ...prev.lifestyle, manglik: e.target.checked }
                          }))}
                          className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Manglik only</span>
                      </label>
                    </div>
                  </FilterSection>

                  {/* Preferences */}
                  <FilterSection title="Preferences" section="preferences">
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.preferences.verifiedOnly}
                          onChange={(e) => setFilters(prev => ({
                            ...prev,
                            preferences: { ...prev.preferences, verifiedOnly: e.target.checked }
                          }))}
                          className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Verified profiles only</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.preferences.withPhotoOnly}
                          onChange={(e) => setFilters(prev => ({
                            ...prev,
                            preferences: { ...prev.preferences, withPhotoOnly: e.target.checked }
                          }))}
                          className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">With photos only</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.preferences.activeRecently}
                          onChange={(e) => setFilters(prev => ({
                            ...prev,
                            preferences: { ...prev.preferences, activeRecently: e.target.checked }
                          }))}
                          className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Active in last 30 days</span>
                      </label>
                    </div>
                  </FilterSection>
                </div>

                {/* Apply Filters Button */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button className="w-full bg-gradient-to-r from-secondary to-primary text-white py-3 rounded-lg font-medium hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Search Results */}
          <div className={`flex-1 transform transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>

            {/* Search Bar & Controls */}
            <div className="bg-white rounded-xl shadow-lg border border-rose-100/50 p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">

                {/* Search Input */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, caste, city..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>

                {/* Sort & View Controls */}
                <div className="flex space-x-3">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  >
                    <option value="relevance">Sort by Relevance</option>
                    <option value="newest">Newest First</option>
                    <option value="age_low">Age: Low to High</option>
                    <option value="age_high">Age: High to Low</option>
                    <option value="recently_active">Recently Active</option>
                  </select>

                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-3 ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                      <Grid3X3 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-3 ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Results Count */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center text-sm text-gray-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>{resultsCount} profiles found</span>
                </div>
                <div className="flex items-center text-sm text-rose-600">
                  <Sparkles className="w-4 h-4 mr-1" />
                  <span>Upgrade to see more matches</span>
                </div>
              </div>
            </div>

            {/* Results Grid */}
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
              {sampleProfiles.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </div>

            {/* Load More Button */}
            <div className="text-center mt-8">
              <button
                onClick={() => setIsLoading(true)}
                disabled={isLoading}
                className="bg-white border border-rose-200 text-primary px-8 py-3 rounded-lg font-medium hover:bg-rose-50 hover:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Loading...' : 'Load More Profiles'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}