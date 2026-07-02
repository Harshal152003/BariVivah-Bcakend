"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Crown, Clock, CheckCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ContextualSubscriptionModal({ isOpen, onClose, interestData }) {
    const router = useRouter();

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>

                    {/* Header Image/Gradient */}
                    <div className="bg-gradient-to-br from-primary to-secondary p-8 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/30">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-1">Unlock This Match!</h2>
                        <p className="text-white/90 text-sm">Someone interested in you is waiting...</p>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <div className="mb-6 bg-rose-50 border border-rose-100 rounded-xl p-4">
                            <p className="text-secondary font-medium mb-1">
                                💖 Someone who matches your preferences is interested in you!
                            </p>
                            <div className="flex items-center text-primary text-xs font-semibold mt-2">
                                <Clock className="w-3 h-3 mr-1" />
                                <span>Interest expires in 48 hours</span>
                            </div>
                        </div>

                        <div className="space-y-3 mb-8">
                            <h3 className="text-sm font-semibold text-secondary/70 uppercase tracking-wider mb-2">
                                Subscribe to Unlock:
                            </h3>
                            <div className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                                <span className="text-gray-700">See full profile & photos (Unblurred)</span>
                            </div>
                            <div className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                                <span className="text-gray-700">Accept interest and start chatting</span>
                            </div>
                            <div className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                                <span className="text-gray-700">View contact details</span>
                            </div>
                        </div>

                        <button
                            onClick={() => router.push("/dashboard/subscription")}
                            className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 flex items-center justify-center"
                        >
                            <Crown className="w-5 h-5 mr-2" />
                            Upgrade to Unlock
                        </button>

                        <p className="text-center text-xs text-gray-400 mt-4">
                            Join 10,000+ happy couples on BariVivah
                        </p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
