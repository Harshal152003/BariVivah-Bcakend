"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Megaphone,
  Plus,
  Trash2,
  Edit2,
  Eye,
  CheckCircle,
  XCircle,
  Upload,
  AlertCircle,
  Info,
  Layers,
  ArrowUpDown,
  Smartphone,
  ExternalLink,
  RefreshCw,
  Sparkles,
  Check,
  X,
} from "lucide-react";

export default function AdBannersPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [alert, setAlert] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",
    targetUrl: "/(dashboard)/subscription",
    targetType: "in_app",
    order: 0,
    isActive: true,
  });

  const fileInputRef = useRef(null);

  // Fetch all banners
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/banners");
      const data = await res.json();
      if (data.success) {
        setBanners(data.banners || []);
      } else {
        showAlert("error", data.message || "Failed to load banners");
      }
    } catch (err) {
      console.error("Error fetching banners:", err);
      showAlert("error", "Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleOpenAdd = () => {
    setEditingBanner(null);
    setFormData({
      title: "",
      imageUrl: "",
      targetUrl: "/(dashboard)/subscription",
      targetType: "in_app",
      order: banners.length,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      imageUrl: banner.imageUrl,
      targetUrl: banner.targetUrl || "/(dashboard)/subscription",
      targetType: banner.targetType || "in_app",
      order: banner.order !== undefined ? banner.order : 0,
      isActive: banner.isActive !== undefined ? banner.isActive : true,
    });
    setIsModalOpen(true);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // File validation
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      showAlert("error", "Please upload a valid image file (PNG, JPG, or WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showAlert("error", "Image file size exceeds 5MB limit.");
      return;
    }

    try {
      setUploadingImage(true);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Image = reader.result;

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64Image }),
        });

        const uploadData = await uploadRes.json();
        if (uploadRes.ok && uploadData.url) {
          setFormData((prev) => ({ ...prev, imageUrl: uploadData.url }));
          showAlert("success", "Banner image uploaded successfully!");
        } else {
          showAlert("error", uploadData.error || "Failed to upload banner image.");
        }
        setUploadingImage(false);
      };
    } catch (err) {
      console.error("Image upload failed:", err);
      showAlert("error", "Image upload failed.");
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      showAlert("error", "Please enter a banner title.");
      return;
    }

    if (!formData.imageUrl.trim()) {
      showAlert("error", "Please upload or provide a banner image URL.");
      return;
    }

    try {
      setSubmitting(true);

      const endpoint = editingBanner
        ? `/api/admin/banners/${editingBanner._id}`
        : "/api/admin/banners";
      const method = editingBanner ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showAlert(
          "success",
          editingBanner
            ? "Banner updated successfully!"
            : "New banner created successfully!"
        );
        setIsModalOpen(false);
        fetchBanners();
      } else {
        showAlert("error", data.message || "Failed to save banner.");
      }
    } catch (err) {
      console.error("Save error:", err);
      showAlert("error", "An error occurred while saving.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (banner) => {
    try {
      const res = await fetch(`/api/admin/banners/${banner._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !banner.isActive }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showAlert(
          "success",
          `Banner ${!banner.isActive ? "activated" : "deactivated"}!`
        );
        fetchBanners();
      } else {
        showAlert("error", data.message || "Failed to update status");
      }
    } catch (err) {
      showAlert("error", "Failed to update status");
    }
  };

  const handleDelete = async (bannerId) => {
    if (!window.confirm("Are you sure you want to permanently delete this banner?")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/banners/${bannerId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showAlert("success", "Banner deleted successfully!");
        fetchBanners();
      } else {
        showAlert("error", data.message || "Failed to delete banner");
      }
    } catch (err) {
      showAlert("error", "Failed to delete banner");
    }
  };

  const activeBannersCount = banners.filter((b) => b.isActive).length;

  return (
    <div className="flex-1 bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8 overflow-y-auto">
      {/* Alert Banner */}
      {alert && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-white font-medium text-sm transition-all duration-300 ${
            alert.type === "success"
              ? "bg-emerald-600 border border-emerald-500"
              : "bg-rose-600 border border-rose-500"
          }`}
        >
          {alert.type === "success" ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{alert.message}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-rose-50 rounded-xl text-rose-600 border border-rose-100">
              <Megaphone className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Home Ad Banners
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Manage promotional banners & advertisements displayed on the mobile app home screen.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchBanners}
            className="p-2.5 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-xl transition-colors shadow-sm"
            title="Refresh Banners"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Banner</span>
          </button>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Banners
            </p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {banners.length}
            </h3>
          </div>
          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              Live Active Banners
            </p>
            <h3 className="text-2xl font-bold text-emerald-700 mt-1">
              {activeBannersCount}
            </h3>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              Optimal Mobile Ratio
            </p>
            <h3 className="text-lg font-bold text-indigo-900 mt-1 flex items-center gap-1.5">
              <span>2 : 1 Ratio</span>
              <span className="text-xs font-normal text-slate-500">(1200×600)</span>
            </h3>
          </div>
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
            <Smartphone className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Aspect Ratio & Upload Guidelines Card */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white rounded-2xl p-6 mb-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-rose-300 border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Design & Upload Specification</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Recommended Aspect Ratio: <span className="text-rose-400">2 : 1 (1200 × 600 px)</span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              For crisp, undistorted visuals on iOS and Android displays, design your promotional banners with the following standards:
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <span className="text-xs text-slate-400 block font-medium">Resolution</span>
                <span className="text-sm font-bold text-white">1200 × 600 px</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">(Min: 800×400 px)</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <span className="text-xs text-slate-400 block font-medium">Safe Margin Zone</span>
                <span className="text-sm font-bold text-white">40px Inner Padding</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Clears rounded corners</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <span className="text-xs text-slate-400 block font-medium">Formats & Limits</span>
                <span className="text-sm font-bold text-white">PNG, JPG, WebP</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Max size: 5 MB</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 border border-white/20 p-4 rounded-xl backdrop-blur-md text-xs space-y-1.5 w-full lg:w-72">
            <div className="font-semibold text-rose-300 flex items-center gap-1.5">
              <Info className="w-4 h-4" />
              <span>Pro Tip for Graphic Designers:</span>
            </div>
            <p className="text-slate-300 text-[12px] leading-normal">
              Keep headlines, offers, and logo branding centered. Avoid placing important contact text along the extreme bottom where navigation dots appear.
            </p>
          </div>
        </div>
      </div>

      {/* Banners List Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
            <span>Published Banners</span>
            <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold">
              {banners.length}
            </span>
          </h2>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-rose-500" />
            <p className="text-sm font-medium">Loading banners...</p>
          </div>
        ) : banners.length === 0 ? (
          <div className="py-16 px-4 text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-100">
              <Megaphone className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              No Advertisement Banners Yet
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Upload promotional banners to showcase subscription discounts, matrimony festivals, or announcements.
            </p>
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm px-5 py-2.5 rounded-xl shadow-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Banner</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Preview (2:1 Ratio)</th>
                  <th className="py-3.5 px-4 sm:px-6">Title & Destination</th>
                  <th className="py-3.5 px-4 sm:px-6 text-center">Priority Order</th>
                  <th className="py-3.5 px-4 sm:px-6 text-center">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {banners.map((banner) => (
                  <tr
                    key={banner._id}
                    className="hover:bg-slate-50/60 transition-colors group"
                  >
                    {/* Banner Image Preview */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="w-36 h-18 sm:w-44 sm:h-22 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative shadow-sm group-hover:shadow transition-shadow">
                        <img
                          src={banner.imageUrl}
                          alt={banner.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-1 right-1 px-1.5 py-0.5 bg-black/60 backdrop-blur-sm rounded text-[10px] font-medium text-white">
                          2:1
                        </div>
                      </div>
                    </td>

                    {/* Title & Target Info */}
                    <td className="py-4 px-4 sm:px-6">
                      <h4 className="font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                        {banner.title}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600 truncate max-w-xs">
                          {banner.targetUrl || "Default Subscription Screen"}
                        </span>
                      </div>
                      <span className="inline-block mt-1 text-[11px] text-slate-400">
                        Added on {new Date(banner.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Priority Order */}
                    <td className="py-4 px-4 sm:px-6 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 font-bold text-slate-700 text-xs">
                        #{banner.order}
                      </span>
                    </td>

                    {/* Active Status Switch */}
                    <td className="py-4 px-4 sm:px-6 text-center">
                      <button
                        onClick={() => handleToggleStatus(banner)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                          banner.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        {banner.isActive ? (
                          <>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <span className="w-2 h-2 rounded-full bg-slate-400" />
                            <span>Disabled</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(banner)}
                          className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Edit Banner"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(banner._id)}
                          className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Banner"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Banner Modal with Live Mobile Preview */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden border border-slate-100 my-8">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">
                    {editingBanner ? "Edit Advertisement Banner" : "Upload New Advertisement Banner"}
                  </h3>
                  <p className="text-xs text-slate-300">
                    Aspect Ratio: 2:1 (1200 x 600 px) for mobile app carousel
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Form + Mobile Preview */}
            <form onSubmit={handleSubmit}>
              <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Form Fields */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Banner Title */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Banner Title / Campaign Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="e.g. Navratri Special 50% Off Premium"
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-slate-900 font-medium"
                      required
                    />
                  </div>

                  {/* Image Upload Area */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Banner Image (2:1 Ratio, 1200×600 px) <span className="text-rose-500">*</span>
                    </label>

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
                        formData.imageUrl
                          ? "border-emerald-300 bg-emerald-50/30"
                          : "border-slate-300 hover:border-rose-400 bg-slate-50 hover:bg-rose-50/30"
                      }`}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/png, image/jpeg, image/webp"
                        className="hidden"
                      />

                      {uploadingImage ? (
                        <div className="py-4 flex flex-col items-center justify-center gap-2">
                          <RefreshCw className="w-6 h-6 animate-spin text-rose-500" />
                          <span className="text-xs font-medium text-slate-600">
                            Uploading image to Cloudinary...
                          </span>
                        </div>
                      ) : formData.imageUrl ? (
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5 text-left">
                            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                            <div className="overflow-hidden">
                              <span className="text-xs font-bold text-emerald-800 block">
                                Image Ready
                              </span>
                              <span className="text-[11px] text-slate-500 truncate block max-w-[200px]">
                                {formData.imageUrl}
                              </span>
                            </div>
                          </div>
                          <span className="text-xs font-semibold text-rose-600 hover:underline">
                            Change Image
                          </span>
                        </div>
                      ) : (
                        <div className="py-4 flex flex-col items-center justify-center gap-1.5">
                          <div className="p-2.5 bg-rose-50 text-rose-500 rounded-xl">
                            <Upload className="w-5 h-5" />
                          </div>
                          <p className="text-xs font-bold text-slate-800">
                            Click to upload banner graphic
                          </p>
                          <p className="text-[11px] text-slate-400">
                            PNG, JPG, or WebP (1200×600 px recommended)
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Direct Image URL input fallback */}
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 whitespace-nowrap">
                        Or enter direct URL:
                      </span>
                      <input
                        type="url"
                        value={formData.imageUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, imageUrl: e.target.value })
                        }
                        placeholder="https://..."
                        className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
                      />
                    </div>
                  </div>

                  {/* Destination / Click Route */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Destination / Screen Route
                    </label>
                    <select
                      value={formData.targetUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, targetUrl: e.target.value })
                      }
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-slate-900 font-medium"
                    >
                      <option value="/(dashboard)/subscription">
                        ⭐ Subscription Plans Screen (/(dashboard)/subscription)
                      </option>
                      <option value="/(dashboard)/(tabs)/discover">
                        🔥 Discover Feed (/(dashboard)/(tabs)/discover)
                      </option>
                      <option value="/(dashboard)/(tabs)/search">
                        🔍 Search Matches (/(dashboard)/(tabs)/search)
                      </option>
                      <option value="/(dashboard)/(tabs)/profile">
                        👤 My Profile (/(dashboard)/(tabs)/profile)
                      </option>
                    </select>
                  </div>

                  {/* Order & Status Row */}
                  <div className="grid grid-cols-2 gap-4 pt-1">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Priority Order
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.order}
                        onChange={(e) =>
                          setFormData({ ...formData, order: e.target.value })
                        }
                        className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Lower numbers appear first
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Active Status
                      </label>
                      <div className="flex items-center gap-3 pt-1.5">
                        <input
                          type="checkbox"
                          id="bannerActiveSwitch"
                          checked={formData.isActive}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              isActive: e.target.checked,
                            })
                          }
                          className="w-5 h-5 text-rose-600 rounded focus:ring-rose-500 accent-rose-600 cursor-pointer"
                        />
                        <label
                          htmlFor="bannerActiveSwitch"
                          className="text-sm font-semibold text-slate-800 cursor-pointer"
                        >
                          {formData.isActive ? "Live in App" : "Draft / Disabled"}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Live Mobile Mockup Preview */}
                <div className="lg:col-span-5 bg-slate-100 rounded-2xl p-5 border border-slate-200/80 flex flex-col items-center">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">
                    <Smartphone className="w-4 h-4 text-rose-500" />
                    <span>Live Mobile App Preview</span>
                  </div>

                  {/* Phone Mockup Frame */}
                  <div className="w-full max-w-[280px] bg-slate-900 rounded-[28px] p-2.5 shadow-2xl border-4 border-slate-800">
                    {/* Top Notch */}
                    <div className="w-20 h-3 bg-slate-800 rounded-full mx-auto mb-2" />

                    {/* Screen Viewport */}
                    <div className="bg-slate-50 rounded-[20px] p-2.5 overflow-hidden">
                      <div className="text-[10px] font-bold text-slate-400 mb-1.5">
                        Featured Announcement
                      </div>

                      {/* The Mobile Banner Card */}
                      <div className="w-full aspect-[2/1] rounded-2xl overflow-hidden relative shadow-sm bg-slate-200 border border-slate-300 flex items-center justify-center">
                        {formData.imageUrl ? (
                          <img
                            src={formData.imageUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center p-2 text-slate-400">
                            <Megaphone className="w-6 h-6 mx-auto mb-1 opacity-50" />
                            <span className="text-[10px] font-medium block">
                              Upload banner to see live preview
                            </span>
                          </div>
                        )}

                        {/* Top Right Ad Pill Badge */}
                        <div className="absolute top-1.5 right-1.5 bg-slate-100/90 border border-slate-300/80 px-1.5 py-0.5 rounded-md text-[9px] font-semibold text-slate-700 shadow-sm">
                          Ad
                        </div>

                        {/* Glass Dots Overlay */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/30 backdrop-blur-md px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <div className="w-3.5 h-1 bg-white rounded-full" />
                          <div className="w-1 h-1 bg-white/50 rounded-full" />
                          <div className="w-1 h-1 bg-white/50 rounded-full" />
                        </div>
                      </div>

                      {/* Fake Home Content below Banner */}
                      <div className="mt-3 space-y-1.5 opacity-60">
                        <div className="h-2.5 bg-slate-200 rounded w-2/3" />
                        <div className="grid grid-cols-2 gap-1.5 pt-1">
                          <div className="h-16 bg-slate-200 rounded-xl" />
                          <div className="h-16 bg-slate-200 rounded-xl" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 text-center mt-3 leading-tight">
                    Shows exact 2:1 rounded card display as seen on user devices.
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploadingImage}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 transition-all"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{editingBanner ? "Save Changes" : "Publish Banner"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
