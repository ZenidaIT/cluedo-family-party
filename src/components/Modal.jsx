import React from "react";
import { X } from "lucide-react";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = "max-w-sm",
  darkMode = false,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center sm:p-4 animate-in fade-in duration-200">
      <div
        className={`${darkMode ? "bg-slate-900 border border-slate-700 text-slate-100" : "bg-white"} w-full h-full sm:h-auto sm:rounded-xl shadow-2xl ${maxWidth} overflow-hidden flex flex-col max-h-full sm:max-h-[90vh]`}
      >
        <div
          className={`${darkMode ? "bg-slate-700 border-slate-600" : "bg-slate-200 border-slate-300"} border-b p-4 flex justify-between items-center shrink-0`}
        >
          <h3
            className={`font-bold text-lg ${darkMode ? "text-slate-100" : "text-slate-800"}`}
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            className={`${darkMode ? "hover:bg-slate-600 text-slate-300" : "hover:bg-slate-300 text-slate-600"} rounded p-1 transition-colors`}
          >
            <X size={20} />
          </button>
        </div>
        <div className={`${darkMode ? "p-0" : "p-4"} overflow-y-auto flex-1`}>
          {children}
        </div>
        {footer && (
          <div
            className={`p-4 ${darkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50"} border-t shrink-0`}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
