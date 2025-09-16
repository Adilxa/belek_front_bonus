'use client';

import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface QRDrawerProps {
  isOpen: boolean;
  onClose: any;
  refetch: any;
}

export default function QRDrawer({ isOpen, onClose, refetch }: QRDrawerProps) {
  const [userId, setUserId] = useState<string>('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      // Получаем данные пользователя из localStorage
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          const id = user.phoneNumber || 'unknown';
          setUserId(id);

          // Генерируем QR код с ID пользователя
          const qrData = `${id}`;
          const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrData)}`;
          setQrCodeUrl(qrUrl);
        } catch (error) {
          console.error('Ошибка при парсинге данных пользователя:', error);
          setUserId('error');
        }
      }
    }
  }, [isOpen]);

  const handleClose = () => {
    refetch();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-all duration-500"
          onClick={handleClose}
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
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-800/30">
          <div className="flex items-center justify-center bg-white text-black text-lg font-black px-4 py-2 rounded-2xl">
            БТ
          </div>
          <button
            onClick={handleClose}
            className="p-3 rounded-2xl bg-gray-800/50 border border-gray-700/30 hover:bg-gray-800 hover:border-gray-600/50 transition-all duration-300"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-8 overflow-y-auto text-white" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-3">QR код для оплаты</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Покажите этот код кассиру для начисления или списания бонусов
            </p>
          </div>

          {/* QR Code Container */}
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              {/* Glowing effect */}
              <div className="absolute inset-0 bg-white/5 rounded-3xl blur-xl"></div>
              <div className="relative bg-white p-8 rounded-3xl border border-gray-200/10 shadow-2xl">
                {qrCodeUrl ? (
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    className="w-56 h-56 rounded-2xl"
                    onError={() => setQrCodeUrl('')}
                  />
                ) : (
                  <div className="w-56 h-56 bg-gray-100 flex items-center justify-center rounded-2xl">
                    <div className="text-gray-500 text-center">
                      <div className="animate-spin w-8 h-8 border-3 border-black border-t-transparent rounded-full mx-auto mb-3"></div>
                      <p className="text-sm font-medium">Генерация кода...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* User ID */}
           
          </div>

          {/* Info Card */}
          <div className="mt-8 p-6 bg-gray-800/40 border border-gray-700/30 rounded-2xl backdrop-blur-sm">
            <div className="flex items-start space-x-3">
              <div className="bg-red-500/10 border border-red-500/20 p-2 rounded-xl flex-shrink-0">
                <span className="text-red-400 text-lg">💡</span>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Как использовать</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Покажите QR код кассиру или сохраните его в галерею для использования позже
                </p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleClose}
            className="w-full mt-8 bg-white text-black py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.02] shadow-xl"
          >
            Готово
          </button>
        </div>
      </div>
    </>
  );
}