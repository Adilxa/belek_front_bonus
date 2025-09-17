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
        <div 
          className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-5 hover:bg-gray-800/60 hover:border-gray-600/40 transition-all duration-300 group" 
          key={index}
        >
          {/* Header with product name and cashback */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="font-bold text-white text-lg mb-1 group-hover:text-blue-100 transition-colors duration-300">
                {item?.productName || 'Операция'}
              </h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">Успешно обработано</span>
              </div>
            </div>
            
            <div className="bg-green-500/10 border border-green-500/20 backdrop-blur-sm px-4 py-2 rounded-2xl group-hover:bg-green-500/20 group-hover:border-green-500/30 transition-all duration-300">
              <div className="flex items-center space-x-1">
                <span className="text-green-400 font-black text-lg">
                  +{item?.cashbackAmount || 50}
                </span>
                <span className="text-yellow-400 text-lg animate-pulse">⚡</span>
              </div>
              <span className="text-green-400/70 text-xs font-medium">бонусы</span>
            </div>
          </div>

          {/* Transaction details */}
          <div className="space-y-3">
            {/* Date and price row */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center">
                  <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-gray-300 text-sm font-medium">
                  {dateParser(item?.createdAt)}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
              
                <span className="text-purple-400 text-sm font-semibold">
                  {item?.productPrice || 'N/A'} KGS
                </span>
              </div>
            </div>

            {/* Location and ID row */}
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-600/30 border border-gray-500/30 rounded-lg flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-gray-400">Магазин на ул. Иваново</span>
              </div>
              
              <div className="bg-gray-700/30 border border-gray-600/30 px-2 py-1 rounded-lg">
                <span className="text-gray-400 font-mono">ID: {item?.id}</span>
              </div>
            </div>
          </div>

          {/* Balance information */}
          {item?.balanceBefore !== undefined && (
            <div className="mt-4 pt-4 border-t border-gray-700/30">
              <div className="bg-gray-700/20 border border-gray-600/20 rounded-xl p-3">
                <h4 className="text-white text-sm font-semibold mb-2 flex items-center">
                  <svg className="w-4 h-4 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Изменение баланса
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <p className="text-gray-400 text-xs mb-1">До операции</p>
                    <div className="bg-gray-800/50 border border-gray-700/30 rounded-lg px-3 py-2">
                      <span className="text-white font-semibold">{item.balanceBefore}</span>
                      <span className="text-yellow-400 ml-1">⚡</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-xs mb-1">После операции</p>
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
                      <span className="text-green-400 font-semibold">{item.balanceAfter}</span>
                      <span className="text-yellow-400 ml-1">⚡</span>
                    </div>
                  </div>
                </div>
                
                {/* Growth indicator */}
                <div className="mt-2 flex items-center justify-center">
                  <div className="bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1 flex items-center space-x-1">
                    <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                    </svg>
                    <span className="text-green-400 text-xs font-semibold">
                      +{(item.balanceAfter - item.balanceBefore)} бонусов
                    </span>
                  </div>
                </div>
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