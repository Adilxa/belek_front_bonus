'use client';

import { useEffect, useState } from 'react';
import { QrCode, History, Gift, Settings, LogOut, Zap, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getMe } from './api';
import Drawer from './Drawer';
import QRDrawer from './QRDrawer';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [isQRDrawerOpen, setIsQRDrawerOpen] = useState(false);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const [userNumber, setUserNumber] = useState<string>('');

  const [ph, setPh] = useState('');

  // Sample transaction data
  const sampleTransaction = {
    "id": 8,
    "productId": "7",
    "productName": "Brittany Hane Sr.",
    "productPrice": 59,
    "cashbackAmount": 1.8,
    "balanceBefore": 2.1,
    "balanceAfter": 3.9,
    "createdAt": "2025-09-12T20:49:36.477Z"
  };

  useEffect(() => {
    const localSt: any = JSON.parse(localStorage.getItem('user') || '') || { phoneNumber: "" };
    const parsedData = localSt.phoneNumber;
    setPh(parsedData);
  }, []);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["user"],
    queryFn: () => getMe(ph),
    enabled: !!ph
  });

  const router = useRouter()
  const openQRDrawer = () => setIsQRDrawerOpen(true);
  const closeQRDrawer = () => setIsQRDrawerOpen(false);

  const openHistoryDrawer = () => setIsHistoryDrawerOpen(true);
  const closeHistoryDrawer = () => setIsHistoryDrawerOpen(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        const name = user.name;
        setUserName(name);
        const Number = user.phoneNumber;
        setUserNumber(Number);
      } catch (e) {
        console.log(e);
      }
    }
  }, []);

  if (isLoading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-600 border-t-red-500"></div>
    </div>
  );

  const dateParser = (item: any) => {
    return new Date(item).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Combine API data with sample data for demonstration
  const allTransactions = [
    ...(data?.allTransactions || []),
    sampleTransaction
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-black to-gray-900/30"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),transparent)]"></div>

      <div className="relative z-10 max-w-md mx-auto p-6">
      

        {/* Main Profile Card */}
        <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 mb-6 shadow-2xl">
          {/* User Info */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-gray-700/50">
              <span className="text-3xl font-bold text-white">
                {data?.user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{data?.user?.name}</h2>
            <p className="text-gray-400 font-mono text-sm">{data?.user?.phoneNumber}</p>
          </div>

          {/* Balance Card */}
          <div className="bg-black/40 border border-gray-800/30 rounded-2xl p-6 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-gray-400 font-medium mb-1">Баланс</p>
                <div className="flex items-baseline">
                  <span className="text-4xl font-black text-white mr-2">
                    {data?.user?.balance || 0}
                  </span>
                  <span className="text-red-500 text-xl">⚡</span>
                </div>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl">
                <Zap className="w-8 h-8 text-red-400" />
              </div>
            </div>
          </div>

          {/* QR Button */}
          <button
            onClick={openQRDrawer}
            className="w-full bg-white text-black py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.02] shadow-xl flex items-center justify-center group"
          >
            <QrCode className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
            Показать QR код
          </button>
        </div>

        {/* Action Menu */}
        <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800/30 rounded-3xl p-6 shadow-2xl">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={openHistoryDrawer}
              className="flex flex-col items-center p-6 rounded-2xl bg-gray-800/30 border border-gray-700/30 hover:bg-gray-800/50 hover:border-gray-600/50 transition-all duration-300 group"
            >
              <History className="w-8 h-8 text-white mb-3 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-sm font-semibold text-white">История</span>
            </button>

            <button className="flex flex-col items-center p-6 rounded-2xl bg-gray-800/30 border border-gray-700/30 hover:bg-red-500/10 hover:border-red-500/30 transition-all duration-300 group" onClick={() => {
              localStorage.removeItem("user")
              router.push("/login")
            }}>
              <LogOut className="w-8 h-8 text-white mb-3 group-hover:scale-110 group-hover:text-red-400 transition-all duration-300" />
              <span className="text-sm font-semibold text-white group-hover:text-red-400">Выход</span>
            </button>
          </div>
        </div>
      </div>

      {/* Drawers */}
      <QRDrawer isOpen={isQRDrawerOpen} onClose={closeQRDrawer} refetch={refetch} />

      <Drawer isOpen={isHistoryDrawerOpen} onClose={closeHistoryDrawer} title="История операций">
        <div className="space-y-4">
          {allTransactions.map((item: any, index: any) => {
            return (
              <div className="bg-gray-800/50 border border-gray-700/30 rounded-2xl p-5" key={index}>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-white">{item?.productName}</span>
                  <div className="flex items-center bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full">
                    <span className="text-green-400 font-bold text-sm">
                      +{item?.cashbackAmount || 50}⚡
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-gray-300 text-sm">{dateParser(item?.createdAt)}</p>
                  <p className="text-gray-400 text-sm">₽{item?.productPrice || 'N/A'}</p>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Магазин на ул. Иваново</span>
                  <span>ID: {item?.id}</span>
                </div>
                {item?.balanceBefore !== undefined && (
                  <div className="mt-2 pt-2 border-t border-gray-700/30">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Баланс до: {item.balanceBefore}⚡</span>
                      <span>Баланс после: {item.balanceAfter}⚡</span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </Drawer>
    </div>
  );
}