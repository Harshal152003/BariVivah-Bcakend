"use client";
import { useState, useEffect } from "react";
import {
  Crown,
  Star,
  Heart,
  Eye,
  Shield,
  Zap,
  Gift,
  Trophy,
  Sparkles,
  Users,
  Clock,
  X,
  Loader2,
  Plus,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Search,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function SubscriptionPlans() {
  // State for plans data and UI
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // State for CRUD operations
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    durationInDays: 30,
    features: {
      contactUnlockLimit: 0,
      chatEnabled: false,
      visitorHistory: false,
      profileBoosts: 0,
      advancedFilters: false
    },
    displayFeatures: [],
    isActive: true,
    isFree: false,
  });
  const [newFeature, setNewFeature] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [plansPerPage] = useState(5);
  const [hoveredPlan, setHoveredPlan] = useState(null);

  // Fetch all plans
  const fetchPlans = async () => {
    try {
      const response = await fetch("/api/subscription");
      if (!response.ok) throw new Error("Failed to fetch plans");
      const data = await response.json();
      setPlans(data);
      setIsLoaded(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // CRUD Operations
  const handleAddPlan = async (planData) => {
    try {
      const finalPlanData = planData.isFree
        ? { ...planData, price: 0 }
        : planData;

      const response = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalPlanData),
      });
      const newPlan = await response.json();
      setPlans((prev) => [...prev, newPlan]);
      return true;
    } catch (err) {
      console.error("Error adding plan:", err);
      return false;
    }
  };

  const handleUpdatePlan = async (id, updates) => {
    try {
      const finalUpdates = updates.isFree ? { ...updates, price: 0 } : updates;

      const response = await fetch(`/api/subscription/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalUpdates),
      });
      const updatedPlan = await response.json();
      setPlans((prev) => prev.map((p) => (p._id === id ? updatedPlan : p)));
      return true;
    } catch (err) {
      console.error("Error updating plan:", err);
      return false;
    }
  };

  const handleDeletePlan = async (id) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;
    try {
      await fetch(`/api/subscription/${id}`, { method: "DELETE" });
      setPlans((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Error deleting plan:", err);
    }
  };

  const togglePlanStatus = async (id, currentStatus) => {
    try {
      await handleUpdatePlan(id, { isActive: !currentStatus });
    } catch (err) {
      console.error("Error toggling plan status:", err);
    }
  };

  // Form handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toggleFreePlan = () => {
    setFormData((prev) => ({
      ...prev,
      isFree: !prev.isFree,
      price: !prev.isFree ? "" : 0,
    }));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        displayFeatures: [...(prev.displayFeatures || []), newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      displayFeatures: (prev.displayFeatures || []).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = editingPlan
      ? await handleUpdatePlan(editingPlan._id, formData)
      : await handleAddPlan(formData);

    if (success) {
      setShowAddModal(false);
      setFormData({
        name: "",
        price: "",
        durationInDays: 30,
        features: {
          contactUnlockLimit: 0,
          chatEnabled: false,
          visitorHistory: false,
          profileBoosts: 0,
          advancedFilters: false
        },
        displayFeatures: [],
        isActive: true,
        isFree: false,
      });
    }
  };

  // Pagination logic
  const indexOfLastPlan = currentPage * plansPerPage;
  const indexOfFirstPlan = indexOfLastPlan - plansPerPage;
  const currentPlans = plans.slice(indexOfFirstPlan, indexOfLastPlan);
  const totalPages = Math.ceil(plans.length / plansPerPage);

  // Plan configuration
  const getPlanConfig = (plan) => {
    const lowerName = plan.name.toLowerCase();

    if (lowerName.includes("gold")) {
      return {
        icon: Crown,
        color: "from-yellow-400 to-yellow-600",
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-600",
        badgeColor: "bg-yellow-500",
        emoji: "👑",
      };
    } else if (lowerName.includes("premium")) {
      return {
        icon: Star,
        color: "from-purple-500 to-pink-500",
        bgColor: "bg-purple-100",
        textColor: "text-purple-600",
        badgeColor: "bg-purple-500",
        emoji: "💎",
      };
    } else if (lowerName.includes("free") || plan.price === 0) {
      return {
        icon: Gift,
        color: "from-gray-400 to-gray-600",
        bgColor: "bg-gray-100",
        textColor: "text-gray-600",
        badgeColor: "bg-gray-500",
        emoji: "🆓",
      };
    } else {
      return {
        icon: Shield,
        color: "from-blue-400 to-blue-600",
        bgColor: "bg-blue-100",
        textColor: "text-blue-600",
        badgeColor: "bg-blue-500",
        emoji: "🛡️",
      };
    }
  };

  // Format price display
  const formatPrice = (price) => {
    if (price === 0 || price === "0") return "Free";
    return `₹${price?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  // Get duration text
  const getDurationText = (duration) => {
    if (duration === 30) return "month";
    if (duration === 60) return "2 months";
    if (duration === 90) return "3 months";
    if (duration === 180) return "6 months";
    if (duration === 365) return "year";
    return `${duration} days`;
  };

  // Loading and error states
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50/50 via-white to-amber-50/30">
        <Loader2 className="w-12 h-12 text-rose-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50/50 via-white to-amber-50/30">
        <div className="text-center p-6 bg-white rounded-lg shadow-lg max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Error Loading Plans
          </h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={fetchPlans}
            className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/50 via-white to-amber-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-rose-100 to-amber-100 rounded-full mb-6 shadow-lg">
            <Crown className="w-10 h-10 text-rose-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Subscription Plans
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage and customize your subscription offerings
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search plans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all"
            />
          </div>

          <button
            onClick={() => {
              setEditingPlan(null);
              setFormData({
                name: "",
                price: "",
                durationInDays: 30,
                features: {
                  contactUnlockLimit: 0,
                  chatEnabled: false,
                  visitorHistory: false,
                  profileBoosts: 0,
                  advancedFilters: false
                },
                displayFeatures: [],
                isActive: true,
                isFree: false,
              });
              setShowAddModal(true);
            }}
            className="flex items-center px-5 py-2.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors shadow-md hover:shadow-lg whitespace-nowrap"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Plan
          </button>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentPlans.map((plan) => {
            const config = getPlanConfig(plan);
            const IconComponent = config.icon;

            return (
              <div
                key={plan._id}
                className={`bg-white rounded-xl p-6 shadow-lg border border-gray-200 relative overflow-hidden transition-all duration-300 ${
                  hoveredPlan === plan._id
                    ? "transform scale-[1.02] shadow-xl"
                    : ""
                } ${!plan.isActive ? "opacity-70" : ""}`}
                onMouseEnter={() => setHoveredPlan(plan._id)}
                onMouseLeave={() => setHoveredPlan(null)}
              >
                {/* Plan header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                      <span className="mr-2">{config.emoji}</span>
                      {plan.name}
                    </h3>
                    <div className="flex items-center mt-1">
                      <span
                        className={`text-3xl font-bold ${config.textColor}`}
                      >
                        {formatPrice(plan.price)}
                      </span>
                      <span className="text-gray-500 ml-1">
                        /{getDurationText(plan.durationInDays)}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-12 h-12 ${config.bgColor} rounded-full flex items-center justify-center`}
                  >
                    <IconComponent className={`w-6 h-6 ${config.textColor}`} />
                  </div>
                </div>

                {/* Features */}
                <div className="my-6 space-y-3">
                  {(plan.displayFeatures || plan.features || []).slice(0, 5).map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 text-sm text-gray-600"
                    >
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                  {(plan.displayFeatures || plan.features || []).length > 5 && (
                    <span className="text-xs text-rose-500 font-semibold block pt-1">
                      +{(plan.displayFeatures || plan.features || []).length - 5} more features
                    </span>
                  )}
                </div>

                {/* Status and actions */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <button
                    onClick={() => togglePlanStatus(plan._id, plan.isActive)}
                    className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${
                      plan.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${
                        plan.isActive ? "bg-green-500" : "bg-gray-500"
                      }`}
                    ></div>
                    {plan.isActive ? "Active" : "Inactive"}
                  </button>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingPlan(plan);
                        setFormData({
                          name: plan.name,
                          price: plan.price,
                          durationInDays: plan.durationInDays,
                          features: plan.features || {
                            contactUnlockLimit: 0,
                            chatEnabled: false,
                            visitorHistory: false,
                            profileBoosts: 0,
                            advancedFilters: false
                          },
                          displayFeatures: plan.displayFeatures || plan.features || [],
                          isActive: plan.isActive,
                          isFree: plan.price === 0,
                        });
                        setShowAddModal(true);
                      }}
                      className="p-2 text-gray-500 hover:text-rose-500 rounded-full hover:bg-gray-100 transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeletePlan(plan._id)}
                      className="p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-100 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {plans.length > plansPerPage && (
          <div className="flex justify-center items-center space-x-4 mt-8">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-full ${
                currentPage === 1
                  ? "text-gray-400"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex space-x-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page =
                  currentPage <= 3
                    ? i + 1
                    : currentPage >= totalPages - 2
                    ? totalPages - 4 + i
                    : currentPage - 2 + i;

                if (page < 1 || page > totalPages) return null;

                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentPage === page
                        ? "bg-rose-500 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`p-2 rounded-full ${
                currentPage === totalPages
                  ? "text-gray-400"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Plan Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-rose-50 to-amber-50 p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {editingPlan ? "Edit Plan" : "Create New Plan"}
                  </h3>
                  <p className="text-rose-600 mt-1 text-sm">
                    Customize your subscription offering
                  </p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Plan Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <span>Plan Name</span>
                    <span className="text-rose-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all shadow-sm"
                    placeholder="e.g. Premium Plan"
                    required
                  />
                </div>

                {/* Plan Type Toggle */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Free
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        {formData.isFree
                          ? "Free plans have ₹0 price"
                          : "Paid plans require pricing"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={toggleFreePlan}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 ${
                        formData.isFree ? "bg-rose-500" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          formData.isFree ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Price Input (Conditional) */}
                  {!formData.isFree && (
                    <div className="mt-4 space-y-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <span>Price</span>
                        <span className="text-rose-500 ml-1">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          ₹
                        </span>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all shadow-sm"
                          placeholder="299"
                          min="1"
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <span>Duration</span>
                    <span className="text-rose-500 ml-1">*</span>
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { days: 30, label: "1 Month" },
                      { days: 90, label: "3 Months" },
                      { days: 180, label: "6 Months" },
                      { days: 365, label: "1 Year" },
                    ].map((item) => (
                      <button
                        type="button"
                        key={item.days}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            durationInDays: item.days,
                          }))
                        }
                        className={`py-2 px-3 rounded-lg border transition-all ${
                          formData.durationInDays === item.days
                            ? "bg-rose-500 text-white border-rose-500 shadow-md"
                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Structured Entitlements */}
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h4 className="font-bold text-gray-800 text-sm border-b pb-2">Plan Entitlements</h4>
                  
                  {/* Contact Unlock Limit */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-600">Contact Unlock Limit</label>
                    <input
                      type="number"
                      value={formData.features?.contactUnlockLimit || 0}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        features: {
                          ...prev.features,
                          contactUnlockLimit: parseInt(e.target.value) || 0
                        }
                      }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      placeholder="e.g. 50"
                      min="0"
                    />
                  </div>

                  {/* Profile Boosts */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-600">Profile Boosts</label>
                    <input
                      type="number"
                      value={formData.features?.profileBoosts || 0}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        features: {
                          ...prev.features,
                          profileBoosts: parseInt(e.target.value) || 0
                        }
                      }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      placeholder="e.g. 5"
                      min="0"
                    />
                  </div>

                  {/* Toggle items */}
                  <div className="flex flex-col gap-2 pt-2">
                    <label className="flex items-center space-x-2 text-xs font-semibold text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!formData.features?.chatEnabled}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          features: {
                            ...prev.features,
                            chatEnabled: e.target.checked
                          }
                        }))}
                        className="rounded border-gray-300 text-rose-500 focus:ring-rose-500"
                      />
                      <span>Enable Direct Chat</span>
                    </label>

                    <label className="flex items-center space-x-2 text-xs font-semibold text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!formData.features?.visitorHistory}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          features: {
                            ...prev.features,
                            visitorHistory: e.target.checked
                          }
                        }))}
                        className="rounded border-gray-300 text-rose-500 focus:ring-rose-500"
                      />
                      <span>View Visitor History</span>
                    </label>

                    <label className="flex items-center space-x-2 text-xs font-semibold text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!formData.features?.advancedFilters}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          features: {
                            ...prev.features,
                            advancedFilters: e.target.checked
                          }
                        }))}
                        className="rounded border-gray-300 text-rose-500 focus:ring-rose-500"
                      />
                      <span>Access Advanced Filters</span>
                    </label>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Features (UI Bullet Points)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addFeature())
                      }
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all shadow-sm"
                      placeholder="Enter feature (e.g. '24/7 Support')"
                    />
                    <button
                      type="button"
                      onClick={addFeature}
                      disabled={!newFeature.trim()}
                      className={`px-4 py-3 rounded-lg transition-all flex items-center ${
                        newFeature.trim()
                          ? "bg-rose-500 text-white hover:bg-rose-600 shadow-md"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2 max-h-40 overflow-y-auto mt-2">
                    {(formData.displayFeatures || []).map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
                      >
                        <span className="text-gray-700">{feature}</span>
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active Plan Toggle */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Plan Status
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        {formData.isActive
                          ? "Active plans are visible to users"
                          : "Inactive plans are hidden"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          isActive: !prev.isActive,
                        }))
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 ${
                        formData.isActive ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          formData.isActive ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-5 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all hover:shadow-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg flex items-center"
                  >
                    <Check className="w-5 h-5 mr-2" />
                    {editingPlan ? "Update Plan" : "Create Plan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
