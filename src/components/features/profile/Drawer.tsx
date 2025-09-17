'use client';

import React from 'react';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-all duration-500"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800/50 rounded-t-3xl shadow-2xl z-50 transform transition-all duration-500 ease-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: '90vh' }}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-6 pb-4">
          <div className="w-12 h-1.5 bg-gray-700 rounded-full"></div>
        </div>

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-6 border-b border-gray-800/30">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-2xl flex items-center justify-center">
                <span className="text-black font-black text-sm">БТ</span>
              </div>
              <h2 className="text-xl font-bold text-white">{title}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-3 rounded-2xl bg-gray-800/50 border border-gray-700/30 hover:bg-gray-800 hover:border-gray-600/50 transition-all duration-300 text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Content */}
        <div 
          className="px-6 py-6 overflow-y-auto" 
          style={{ maxHeight: 'calc(90vh - 140px)' }}
        >
          {children}
        </div>
      </div>
    </>
  );
};

export default Drawer;