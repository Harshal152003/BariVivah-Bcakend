"use client"
import { useState, useEffect } from 'react';
import {
  User, Heart, Eye, CheckCircle, X, Clock, MapPin, Calendar,
  Briefcase, Shield, ThumbsUp, ThumbsDown, Send, Mail, Droplet, Users, Home, GraduationCap, DollarSign, Star,
  Loader2, RefreshCw, Search, ChevronDown, ChevronUp, Phone, Globe, MessageSquare, Lock
} from 'lucide-react';
import { useSession } from '@/context/SessionContext';
import { motion, AnimatePresence } from 'framer-motion';
import ContextualSubscriptionModal from '@/components/ContextualSubscriptionModal';
export default function InterestsPage() {
  const { user } = useSession();
  const [activeTab, setActiveTab] = useState('received');
  const [sentInterests, setSentInterests] = useState([]);
  const [receivedInterests, setReceivedInterests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [expandedImage, setExpandedImage] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    professional: false,
    family: false,
    lifestyle: false
  });
  const [hasSubscription, setHasSubscription] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  //sample
  // Check user's subscription status
  const checkSubscription = async () => {
    try {
      setCheckingSubscription(true);
      const isActive = user?.subscription?.isSubscribed || user?.user?.subscription?.isSubscribed;
      setHasSubscription(isActive);
    } catch (err) {
      console.error('Error checking subscription:', err);
      setHasSubscription(false);
    } finally {
      setCheckingSubscription(false);
    }
  };

  // Mask first name while keeping last name visible
  // UPDATED: Now shows First Name and hides Last Name (e.g. "Rahul S.") or just First Name "Rahul"
  const maskLastName = (fullName) => {
    if (!fullName) return 'User';
    const names = fullName.trim().split(/\s+/);
    if (names.length > 0) {
      // Return first name unmasked
      return names[0];
    }
    return 'User';
  };

  // Calculate age from date of birth
  const calculateAge = (dateString) => {
    if (!dateString) return 'N/A';
    const birthDate = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Fetch interests from API
  const fetchInterests = async (type) => {
    try {
      if (!user?.id ? user.id : user?.user?.id) return [];
      const endpoint = type === 'send'
        ? `/api/interest/send?userId=${user?.id ? user.id : user.user.id}`
        : `/api/interest/received?userId=${user?.id ? user.id : user.user.id}`;
      const response = await fetch(endpoint);
      const data = await response.json();
      if (!response.ok) throw new Error('Failed to fetch data');
      return await data;
    } catch (err) {
      throw err;
    }
  };

  // Load all interest data
  const loadAllData = async () => {
    if (!user?.id ? user.id : user?.user?.id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const [sent, received] = await Promise.all([
        fetchInterests('send'),
        fetchInterests('received')
      ]);
      setSentInterests(sent.interests || []);
      setReceivedInterests(received.interests || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Refresh data
  const handleRefresh = () => {
    setIsRefreshing(true);
    loadAllData();
  };

  // Handle interest actions (accept/decline/cancel)
  const handleInterestAction = async (action, interestId) => {
    try {
      const response = await fetch('/api/interest/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action, interestId })
      });
      if (!response.ok) throw new Error('Action failed');
      loadAllData();
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle viewing profile with subscription check
  const handleViewProfile = (person, type) => {
    if (!hasSubscription) {
      window.location.href = '/dashboard/subscription';
      return;
    }
    const profileData = type === 'sent' ? person.receiver : person.sender;
    setSelectedProfile({
      ...profileData,
      image: profileData?.profilePhoto || profileData?.image,
      interestStatus: person.status
    });
    setShowModal(true);
  };

  // Toggle profile sections
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Initialize component
  useEffect(() => {
    if (user) {
      checkSubscription();
      loadAllData();
    }
  }, [user]);

  // Get status badge component
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" /> Pending
        </span>;
      case 'accepted':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" /> Accepted
        </span>;
      case 'declined':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <X className="w-3 h-3 mr-1" /> Declined
        </span>;
      default: return null;
    }
  };

  // Get badge style based on type
  const getBadgeStyle = (badge) => {
    switch (badge) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Premium': return 'bg-amber-100 text-amber-800';
      case 'Verified': return 'bg-green-100 text-green-800';
      case 'Recently Active': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Interest Card Component
  const InterestCard = ({ person, type }) => {
    const profile = type === 'sent' ? person.receiver : person.sender;
    const profileImage = profile?.profilePhoto || profile?.image;

    return (
      <motion.div
        className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-md sm:shadow-lg border border-rose-100/50 hover:shadow-sm sm:hover:shadow-xl transition-all duration-300 hover:border-rose-200"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
          {/* Profile Image with blur effect for non-subscribers */}
          <div className="relative flex-shrink-0 self-center sm:self-start">
            <motion.div
              className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-rose-100 to-amber-100 rounded-full flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 hover:ring-rose-300 transition-all ${!hasSubscription && profileImage ? 'blur-sm' : ''
                }`}
              onClick={() => {
                if (!hasSubscription) {
                  window.location.href = '/dashboard/subscription';
                  return;
                }
                profileImage && setExpandedImage(profileImage);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {profileImage ? (
                <>
                  <img
                    src={profileImage}
                    alt={profile?.name}
                    className="w-full h-full object-cover"
                  />
                  {!hasSubscription && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Lock className="w-5 h-5 text-white" />
                    </div>
                  )}
                </>
              ) : (
                <User className="w-6 h-6 sm:w-8 sm:h-8 text-rose-500" />
              )}
            </motion.div>
            {profile?.isOnline && (
              <motion.div
                className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" }}
              />
            )}
          </div>

          {/* Profile Details */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 space-y-2 sm:space-y-0">
              <div className="space-y-1">
                <div className="flex items-center justify-center sm:justify-start space-x-2 mb-1">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 text-center sm:text-left">
                    {hasSubscription ? profile?.name : maskLastName(profile?.name)}
                  </h3>
                  {profile?.badges?.includes('Verified') && <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />}
                </div>
                <div className="flex flex-wrap justify-center sm:justify-start items-center space-x-2 sm:space-x-4 text-xs sm:text-sm text-gray-600 mb-2 gap-y-1">
                  <span className="flex items-center">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    {calculateAge(profile?.dob)} years
                  </span>
                  {profile?.caste && <span>{profile?.caste}</span>}
                </div>
                <div className="flex flex-wrap justify-center sm:justify-start items-center text-xs sm:text-sm text-gray-600 mb-2 gap-x-2 gap-y-1">
                  {profile?.currentCity && (
                    <span className="flex items-center">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      {profile?.currentCity}
                    </span>
                  )}
                  {(profile?.occupation || profile?.education) && (
                    <span className="flex items-center">
                      <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      {profile?.occupation}{profile?.occupation && profile?.education && ' • '}{profile?.education}
                    </span>
                  )}
                </div>
              </div>
              <div className="self-center sm:self-start">{getStatusBadge(person.status)}</div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-3 border-t border-gray-100 space-y-2 sm:space-y-0">
              <div className="text-xs text-gray-500">
                {type === 'sent' ? `Sent: ${new Date(person.createdAt).toLocaleDateString()}` :
                  `Received: ${new Date(person.createdAt).toLocaleDateString()}`}
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                {type === 'received' && person.status === 'pending' && (
                  <>
                    {!hasSubscription ? (
                      /* Unsubscribed User Actions */
                      <>
                        <motion.button
                          onClick={() => handleInterestAction('declined', person._id)}
                          className="flex items-center px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <X className="w-4 h-4 mr-1.5" /> Not Interested
                        </motion.button>

                        <motion.button
                          onClick={() => {
                            setSelectedProfile(null); // Clear detailed profile
                            setShowModal(true); // Show upgrade modal
                          }}
                          className="flex items-center px-4 py-2 bg-gradient-to-r from-secondary to-primary text-white rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Lock className="w-4 h-4 mr-1.5" /> View Full Profile
                        </motion.button>
                      </>
                    ) : (
                      /* Subscribed User Actions */
                      <>
                        <motion.button
                          onClick={() => handleInterestAction('declined', person._id)}
                          className="flex items-center px-2 sm:px-3 py-1 bg-red-50 text-red-600 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium hover:bg-red-100 transition-colors"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <ThumbsDown className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> Decline
                        </motion.button>
                        <motion.button
                          onClick={() => handleInterestAction('accepted', person._id)}
                          className="flex items-center px-2 sm:px-3 py-1 bg-green-50 text-green-600 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium hover:bg-green-100 transition-colors"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> Accept
                        </motion.button>
                      </>
                    )}
                  </>
                )}

                {(type === 'sent' || (type === 'received' && hasSubscription)) && (
                  <motion.button
                    onClick={() => handleViewProfile(person, type)}
                    className="flex items-center px-2 sm:px-3 py-1 bg-white text-secondary border border-gray-200 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium hover:bg-rose-50 hover:border-rose-200 transition-colors shadow-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={checkingSubscription}
                  >
                    {checkingSubscription ? (
                      <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 animate-spin" />
                    ) : (
                      <>
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> View Profile
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const ProfileDetailItem = ({ icon: Icon, label, value }) => (
    <motion.div
      className="flex items-start mb-3"
      whileHover={{ x: 5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Icon className="w-5 h-5 text-rose-500 mt-0.5 mr-3 flex-shrink-0" />
      <div>
        <div className="text-sm font-medium text-gray-500">{label}</div>
        <div className="text-gray-900">{value || 'Not specified'}</div>
      </div>
    </motion.div>
  );

  const ProfileSection = ({ title, children, sectionKey }) => (
    <div className="mb-6">
      <motion.button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full text-left mb-3"
        whileHover={{ color: "#f43f5e" }}
      >
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        {expandedSections[sectionKey] ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </motion.button>
      <AnimatePresence>
        {expandedSections[sectionKey] && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden pl-2"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const getTabData = () => activeTab === 'sent' ? sentInterests : receivedInterests;
  const getTabStats = () => ({
    pendingSent: sentInterests?.filter(p => p.status === 'pending').length,
    pendingReceived: receivedInterests?.filter(p => p.status === 'pending').length
  });

  const stats = getTabStats();

  if (isLoading && !isRefreshing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          {/* Simple Spinner */}
          <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto mb-4"></div>

          {/* Loading Text */}
          <p className="text-gray-600 text-lg">Loading your Interests</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading interests</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-rose-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-rose-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/50 via-white to-amber-50/30 p-6">
      {/* Expanded Image Viewer */}
      <AnimatePresence>
        {expandedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/80 z-60 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setExpandedImage(null)}
          >
            <motion.div
              className="relative bg-white rounded-lg shadow-xl border-2 border-rose-500 overflow-hidden w-full max-w-md mx-4"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ type: "spring" }}
            >
              {/* Header */}
              <div className="bg-rose-500 p-2 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-white" />
                  <span className="text-white font-medium">Profile Picture</span>
                </div>
                <motion.button
                  onClick={() => setExpandedImage(null)}
                  className="p-1 rounded-full hover:bg-rose-600 transition-colors"
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.8 }}
                >
                  <X className="w-4 h-4 text-white" />
                </motion.button>
              </div>

              {/* Image container */}
              <div className="p-4">
                <div className="relative pt-[100%]">
                  <img
                    src={expandedImage}
                    alt="Expanded profile"
                    className="absolute top-0 left-0 w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="bg-rose-50 p-3 border-t border-rose-200 flex justify-center">
                <span className="text-rose-800 text-sm font-medium">
                  BariVivah Matrimony
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto space-y-6">
        <motion.div
          className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg sm:shadow-xl border border-rose-100/50 relative overflow-hidden"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-rose-50 rounded-full blur-xl sm:blur-2xl opacity-50"></div>
          <div className="relative z-10">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">💌 Interests</h1>
                <p className="text-sm sm:text-base text-gray-600">Manage your sent and received interests</p>
              </div>

              <div className="flex items-center gap-2 sm:gap-4 self-end xl:self-auto">
                <div className="flex justify-start space-x-2 sm:space-x-6">
                  <div className="bg-rose-50 rounded-lg px-3 sm:px-4 py-2 border border-rose-100 min-w-[90px] sm:min-w-[100px] text-center shadow-sm">
                    <div className="text-xs text-rose-600 font-medium whitespace-nowrap">Pending Received</div>
                    <div className="text-lg sm:text-xl font-bold text-rose-900 mt-1">{stats.pendingReceived || 0}</div>
                  </div>
                  <div className="bg-amber-50 rounded-lg px-3 sm:px-4 py-2 border border-amber-100 min-w-[90px] sm:min-w-[100px] text-center shadow-sm">
                    <div className="text-xs text-amber-600 font-medium whitespace-nowrap">Pending Sent</div>
                    <div className="text-lg sm:text-xl font-bold text-amber-900 mt-1">{stats.pendingSent || 0}</div>
                  </div>
                </div>

                <motion.button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="p-2 ml-2 bg-white rounded-full text-gray-500 hover:text-rose-600 hover:bg-rose-50 transition-colors border border-gray-200 shadow-sm"
                  whileHover={{ rotate: 180 }}
                  whileTap={{ scale: 0.8 }}
                >
                  <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl shadow-lg border border-rose-100/50"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'received', label: 'Received', icon: Mail, count: receivedInterests.length },
                { id: 'sent', label: 'Sent', icon: Send, count: sentInterests.length }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${activeTab === tab.id
                      ? 'bg-rose-50 text-primary'
                      : 'bg-gray-100 text-gray-600'
                      }`}>
                      {tab.count}
                    </span>
                  </motion.button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {getTabData().length === 0 ? (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-rose-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {activeTab === 'sent' ? 'No Interests Sent Yet' : 'No Interests Received Yet'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {activeTab === 'sent'
                    ? 'Start browsing profiles and express your interest!'
                    : 'Your perfect match might be just around the corner!'}
                </p>

              </motion.div>
            ) : (
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {getTabData()?.map((person, index) => (
                  <InterestCard
                    key={person._id}
                    person={person}
                    type={activeTab}
                    custom={index}
                  />
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Profile Modal with Framer Motion */}
      <AnimatePresence>
        <ContextualSubscriptionModal
          isOpen={showModal && !selectedProfile}
          onClose={() => setShowModal(false)}
        />
        {showModal && selectedProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-secondary to-primary p-4 z-10">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white">
                    {selectedProfile.name}'s Profile
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-1 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>

              {/* Scrollable Content Area */}
              <div className="overflow-y-auto flex-1 p-6">
                {/* Profile Header */}
                <div className="flex items-start mb-6">
                  <div className="relative mr-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-rose-100 to-amber-100 rounded-full flex items-center justify-center overflow-hidden">
                      <img
                        src={selectedProfile?.image || selectedProfile?.profilePhoto}
                        alt={selectedProfile.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {selectedProfile.name}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <span className="mr-3">{calculateAge(selectedProfile.dob)} years</span>
                      <span>{selectedProfile.height}</span>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                {hasSubscription && selectedProfile.interestStatus === 'accepted' && (
                  <div className="mb-6 bg-green-50 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <Lock className="w-4 h-4 text-green-700" />
                      </div>
                      <h4 className="font-semibold text-lg text-green-900">Contact Information</h4>
                    </div>
                    <div className="text-sm text-green-700 mb-4 bg-white/50 p-2 rounded-lg border border-green-100">
                      Contact details are visible because this interest is accepted.
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ProfileDetailItem icon={Phone} label="Phone Number" value={selectedProfile.phone} />
                      <ProfileDetailItem icon={Mail} label="Email Address" value={selectedProfile.email} />
                    </div>
                  </div>
                )}

                {/* Basic Information */}
                <div className="mb-6">
                  <h4 className="font-semibold text-lg mb-3 text-gray-800 border-b pb-2">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ProfileDetailItem icon={Calendar} label="Date of Birth"
                      value={new Date(selectedProfile.dob).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    />
                    <ProfileDetailItem icon={MapPin} label="Birth Place" value={selectedProfile.birthPlace} />
                    <ProfileDetailItem icon={Droplet} label="Blood Group" value={selectedProfile.bloodGroup} />
                    <ProfileDetailItem icon={User} label="Gender" value={selectedProfile.gender} />
                    <ProfileDetailItem icon={Shield} label="Religion" value={selectedProfile.religion} />
                    <ProfileDetailItem icon={Shield} label="Caste" value={selectedProfile.caste} />
                    <ProfileDetailItem icon={Shield} label="Sub Caste" value={selectedProfile.subCaste} />
                    <ProfileDetailItem icon={Shield} label="Marital Status" value={selectedProfile.maritalStatus} />
                  </div>
                </div>

                {/* Family Details */}
                <div className="mb-6">
                  <h4 className="font-semibold text-lg mb-3 text-gray-800 border-b pb-2">Family Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ProfileDetailItem icon={User} label="Father's Name" value={selectedProfile.fatherName} />
                    <ProfileDetailItem icon={User} label="Mother's Name" value={selectedProfile.mother} />
                    <ProfileDetailItem icon={Users} label="Brothers" value={selectedProfile.brothers} />
                    <ProfileDetailItem icon={Users} label="Sisters" value={selectedProfile.sisters} />
                    <ProfileDetailItem icon={Home} label="Native City" value={selectedProfile.nativeCity} />
                  </div>
                </div>

                {/* Professional Information */}
                <div className="mb-6">
                  <h4 className="font-semibold text-lg mb-3 text-gray-800 border-b pb-2">Professional Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ProfileDetailItem icon={Briefcase} label="Occupation" value={selectedProfile.occupation} />
                    <ProfileDetailItem icon={Briefcase} label="Company" value={selectedProfile.company} />
                    <ProfileDetailItem icon={GraduationCap} label="Education" value={selectedProfile.education} />
                    <ProfileDetailItem icon={GraduationCap} label="College" value={selectedProfile.college} />
                    <ProfileDetailItem icon={DollarSign} label="Income" value={selectedProfile.income} />
                  </div>
                </div>

                {/* Astrological Details */}
                <div className="mb-6">
                  <h4 className="font-semibold text-lg mb-3 text-gray-800 border-b pb-2">Astrological Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ProfileDetailItem icon={Star} label="Rashi" value={selectedProfile.rashi} />
                    <ProfileDetailItem icon={Star} label="Nakshatra" value={selectedProfile.nakshira} />
                    <ProfileDetailItem icon={Star} label="Gothra" value={selectedProfile.gothra} />
                    <ProfileDetailItem icon={Star} label="Gotra Devak" value={selectedProfile.gotraDevak} />
                    <ProfileDetailItem icon={Star} label="Charan" value={selectedProfile.charan} />
                    <ProfileDetailItem icon={Star} label="Gan" value={selectedProfile.gan} />
                    <ProfileDetailItem icon={Star} label="Nadi" value={selectedProfile.nadi} />
                    <ProfileDetailItem icon={Star} label="Mangal" value={selectedProfile.mangal ? "Yes" : "No"} />
                  </div>
                </div>

                {/* Preferences */}
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-gray-800 border-b pb-2">Preferences</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ProfileDetailItem icon={Heart} label="Expected Caste" value={selectedProfile.expectedCaste} />
                    <ProfileDetailItem icon={Heart} label="Expected Education" value={selectedProfile.expectedEducation} />
                    <ProfileDetailItem icon={Heart} label="Expected Height" value={selectedProfile.expectedHeight} />
                    <ProfileDetailItem icon={Heart} label="Expected Income" value={selectedProfile.expectedIncome} />
                    <ProfileDetailItem icon={Heart} label="Expected Age Difference" value={selectedProfile.expectedAgeDifference} />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}