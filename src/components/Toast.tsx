import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose, duration = 5000 }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-white border border-emerald-200 shadow-2xl rounded-2xl p-4 flex items-center gap-3 max-w-sm shadow-emerald-900/5">
        <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-900">Booking Confirmed!</p>
          <p className="text-xs text-slate-600 line-clamp-2">{message}</p>
        </div>
        <button 
          onClick={onClose}
          className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 transition-colors shrink-0 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
