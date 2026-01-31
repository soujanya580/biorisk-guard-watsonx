
import React, { useEffect } from 'react';
import { ShieldAlert, X, ChevronRight } from 'lucide-react';

interface ToastProps {
  message: string;
  vendorName: string;
  onClose: () => void;
  onClick: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, vendorName, onClose, onClick }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 8000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-12 right-12 z-[100] w-[400px] bg-[#262626] border border-[#0062FF]/30 border-l-4 border-l-[#0062FF] shadow-2xl animate-in slide-in-from-right-8 duration-500">
      <div className="p-5 flex gap-4">
        <div className="p-2.5 bg-[#161616] border border-[#393939] text-[#0062FF] h-fit">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex justify-between items-start">
            <h4 className="text-[10px] font-bold text-[#0062FF] uppercase tracking-[0.2em]">New Security Logic Found</h4>
            <button onClick={onClose} className="text-[#393939] hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="cursor-pointer group" onClick={onClick}>
            <p className="text-sm font-bold text-white mb-1 group-hover:text-[#0062FF] transition-colors">{vendorName}</p>
            <p className="text-xs text-[#A8A8A8] leading-relaxed line-clamp-2">{message}</p>
            <div className="pt-3 flex items-center gap-1 text-[10px] font-bold text-[#0062FF] uppercase tracking-widest">
              Inspect Anomaly <ChevronRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;
