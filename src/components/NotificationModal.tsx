"use client";
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
export type ModalType = 'success' | 'error' | 'warning' | 'info';
interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: ModalType;
  title?: string;
  message: string;
  buttonText?: string;
  onConfirm?: () => void;
  autoClose?: number; // ms, 0 = no auto close
}
const iconMap = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};
const colorMap = {
  success: {
    bg: 'bg-gradient-to-br from-emerald-500 to-green-600',
    ring: 'ring-emerald-500/30',
    text: 'text-emerald-400',
    button: 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700',
    glow: 'shadow-emerald-500/25',
  },
  error: {
    bg: 'bg-gradient-to-br from-red-500 to-rose-600',
    ring: 'ring-red-500/30',
    text: 'text-red-400',
    button: 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700',
    glow: 'shadow-red-500/25',
  },
  warning: {
    bg: 'bg-gradient-to-br from-amber-500 to-orange-600',
    ring: 'ring-amber-500/30',
    text: 'text-amber-400',
    button: 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700',
    glow: 'shadow-amber-500/25',
  },
  info: {
    bg: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    ring: 'ring-blue-500/30',
    text: 'text-blue-400',
    button: 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700',
    glow: 'shadow-blue-500/25',
  },
};
const defaultTitles: Record<ModalType, string> = {
  success: 'Thành công!',
  error: 'Lỗi!',
  warning: 'Cảnh báo!',
  info: 'Thông báo',
};
export default function NotificationModal({
  isOpen,
  onClose,
  type = 'success',
  title,
  message,
  buttonText,
  onConfirm,
  autoClose = 0,
}: NotificationModalProps) {
  const Icon = iconMap[type];
  const colors = colorMap[type];
  const displayTitle = title || defaultTitles[type];
  const displayButtonText = buttonText || (type === 'success' ? 'Tuyệt vời!' : 'Đã hiểu');
  useEffect(() => {
    if (isOpen && autoClose > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoClose);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, onClose]);
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);
  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`relative w-full max-w-sm bg-white rounded-3xl shadow-2xl ${colors.glow} overflow-hidden`}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all z-10"
            >
              <X className="w-5 h-5" />
            </button>
            {/* Top Decorative Stripe */}
            <div className={`h-1.5 w-full ${colors.bg}`} />
            {/* Content */}
            <div className="px-8 pt-8 pb-6 text-center">
              {/* Animated Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
                className={`mx-auto w-20 h-20 rounded-full ${colors.bg} flex items-center justify-center mb-6 shadow-lg ${colors.glow}`}
              >
                <motion.div
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <Icon className="w-10 h-10 text-white" strokeWidth={2.5} />
                </motion.div>
              </motion.div>
              {/* Title */}
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-gray-800 mb-2"
              >
                {displayTitle}
              </motion.h3>
              {/* Message */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-500 text-base leading-relaxed"
              >
                {message}
              </motion.p>
            </div>
            {/* Button */}
            <div className="px-8 pb-8">
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleConfirm}
                className={`w-full py-3.5 rounded-xl ${colors.button} text-white font-semibold shadow-lg transition-all duration-300 text-base`}
              >
                {displayButtonText}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
