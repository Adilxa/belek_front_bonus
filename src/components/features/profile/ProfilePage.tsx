'use client';

import { useEffect, useState } from 'react';
import { QrCode, History, Gift, Settings, LogOut, Star, Trophy, Zap } from 'lucide-react';
import QRModal from './QRModal'; // Импортируйте компонент модалки

export default function ProfilePage() {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const [userNumber, setUserNumber] = useState<string>('');
  console.log(userName, userNumber)
  const openQRModal = () => setIsQRModalOpen(true);
  const closeQRModal = () => setIsQRModalOpen(false);
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        const name = user.name
        setUserName(name)
        const Number = user.phoneNumber
        setUserNumber(Number)

      } catch (e) {
        console.log(e)
      }
    }
  }, [])
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black p-4">
      <div className="max-w-md mx-auto">
        {/* Заголовок */}
        <div className="text-center mb-8 pt-8">
          <div className="bg-gradient-to-r from-red-600 to-red-800 text-white text-2xl font-bold px-6 py-3 rounded-xl inline-block mb-4">
            БТ ТЕХНИКА
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Бонусная программа</h1>
          <p className="text-gray-300">Добро пожаловать в ваш профиль</p>
        </div>

        {/* Карточка профиля */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">БТ</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">{userName}</h2>
            <p className="text-gray-600">{userNumber}</p>
          </div>

          {/* Баланс бонусов */}
          <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-800 font-semibold">Ваши бонусы</p>
                <p className="text-2xl font-bold text-red-600">1,250 ⚡</p>
              </div>
              <div className="bg-red-200 p-3 rounded-full">
                <Zap className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          {/* Кнопка QR кода */}
          <button
            onClick={openQRModal}
            className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white py-4 rounded-xl font-semibold text-lg hover:from-red-700 hover:to-red-900 transition-all transform hover:scale-[1.02] shadow-lg mb-4 flex items-center justify-center"
          >
            <QrCode className="w-6 h-6 mr-3" />
            Показать QR код
          </button>
        </div>

        {/* Меню действий */}
        <div className="bg-white rounded-2xl shadow-2xl p-4">
          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-colors">
              <History className="w-8 h-8 text-red-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">История</span>
            </button>

            <button className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-colors">
              <Gift className="w-8 h-8 text-red-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Подарки</span>
            </button>

            <button className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-colors">
              <Settings className="w-8 h-8 text-red-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Настройки</span>
            </button>

            <button className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-colors">
              <LogOut className="w-8 h-8 text-red-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Выход</span>
            </button>
          </div>
        </div>
      </div>

      {/* QR Modal */}
      <QRModal isOpen={isQRModalOpen} onClose={closeQRModal} />
    </div>
  );
}