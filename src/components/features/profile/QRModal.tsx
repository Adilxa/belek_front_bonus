'use client';

import { X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QRModal({ isOpen, onClose }: QRModalProps) {
  const [userId, setUserId] = useState<string>('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      // Получаем данные пользователя из localStorage
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          const id = user.phoneNumber ||  'unknown';
          setUserId(id);
          
          // Генерируем QR код с ID пользователя
          // Используем публичный API для генерации QR кода
          const qrData = `${id}`;
          const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;
          setQrCodeUrl(qrUrl);
        } catch (error) {
          console.error('Ошибка при парсинге данных пользователя:', error);
          setUserId('error');
        }
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 relative">
        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Заголовок */}
        <div className="text-center mb-6">
          <div className="bg-gradient-to-r from-red-600 to-red-800 text-white text-lg font-bold px-4 py-2 rounded-xl inline-block mb-3">
            БТ ТЕХНИКА
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Ваш QR код</h2>
          <p className="text-gray-600 text-sm">
            Покажите этот код кассиру для начисления бонусов
          </p>
        </div>

        {/* QR код */}
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
            {qrCodeUrl ? (
              <Image
                src={qrCodeUrl}
                alt="QR Code"
                className="w-48 h-48"
                onError={() => setQrCodeUrl('')}
              />
            ) : (
              <div className="w-48 h-48 bg-gray-200 flex items-center justify-center rounded-lg">
                <div className="text-gray-500 text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p className="text-sm">Загрузка QR кода...</p>
                </div>
              </div>
            )}
          </div>

          {/* ID пользователя */}
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">ID пользователя:</p>
            <p className="text-lg font-mono font-bold text-gray-800 bg-gray-100 px-3 py-1 rounded">
              {userId || 'Загрузка...'}
            </p>
          </div>
        </div>

        {/* Дополнительная информация */}
        <div className="mt-6 p-4 bg-red-50 rounded-xl">
          <p className="text-sm text-red-800 text-center">
            💡 Сохраните этот QR код в галерею или покажите экран кассиру
          </p>
        </div>

        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          className="w-full mt-4 bg-gradient-to-r from-red-600 to-red-800 text-white py-3 rounded-xl font-semibold hover:from-red-700 hover:to-red-900 transition-all"
        >
          Закрыть
        </button>
      </div>
    </div>
  );
}