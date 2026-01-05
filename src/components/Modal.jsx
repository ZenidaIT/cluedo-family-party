import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full h-full sm:h-auto sm:rounded-xl shadow-2xl sm:max-w-sm overflow-hidden flex flex-col max-h-full sm:max-h-[90vh]">
        <div className="bg-slate-900 text-white p-4 flex justify-between items-center shrink-0">
          <h3 className="font-bold text-lg">{title}</h3>
          <button onClick={onClose} className="hover:bg-slate-700 rounded p-1"><X size={20}/></button>
        </div>
        <div className="p-4 overflow-y-auto flex-1">
          {children}
        </div>
        {footer && <div className="p-4 bg-slate-50 border-t shrink-0">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
