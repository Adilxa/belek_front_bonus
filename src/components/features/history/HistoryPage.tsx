// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { ArrowLeft, Calendar, Filter, Search, CheckCircle, XCircle, Clock, MapPin, Receipt, Zap } from 'lucide-react';
// import { useAuth } from '@/hooks/useAuth';

// interface Transaction {
//   id: string;
//   type: 'purchase' | 'bonus_added' | 'bonus_used' | 'bonus_expired';
//   date: string;
//   time: string;
//   shop: string;
//   shopAddress: string;
//   amount: number;
//   bonusesEarned: number;
//   bonusesUsed: number;
//   description: string;
//   status: 'completed' | 'pending' | 'cancelled';
//   receiptNumber?: string;
// }

// export default function HistoryPage() {
//   const [transactions, setTransactions] = useState<Transaction[]>([]);
//   const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedFilter, setSelectedFilter] = useState<'all' | 'purchase' | 'bonus'>('all');
//   const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'week' | 'month' | '3months'>('all');
  
//   const router = useRouter();
//   const { isAuthenticated, getUser } = useAuth();

//   // Mock данные для истории транзакций
//   const mockTransactions: Transaction[] = [
//     {
//       id: '1',
//       type: 'purchase',
//       date: '2024-08-15',
//       time: '14:30',
//       shop: 'БТ Бишкек (Ала-Тоо)',
//       shopAddress: 'пр. Чуй, 219',
//       amount: 25000,
//       bonusesEarned: 375,
//       bonusesUsed: 0,
//       description: 'Холодильник LG GC-B247JQDV',
//       status: 'completed',
//       receiptNumber: 'BT240815001'
//     },
//     {
//       id: '2',
//       type: 'purchase',
//       date: '2024-07-22',
//       time: '11:15',
//       shop: 'БТ Ош',
//       shopAddress: 'ул. Ленина, 331',
//       amount: 45000,
//       bonusesEarned: 675,
//       bonusesUsed: 200,
//       description: 'Стиральная машина Samsung WW90T4540AE',
//       status: 'completed',
//       receiptNumber: 'BT240722045'
//     },
//     {
//       id: '3',
//       type: 'bonus_added',
//       date: '2024-07-20',
//       time: '09:00',
//       shop: 'Система',
//       shopAddress: 'Автоматическое начисление',
//       amount: 0,
//       bonusesEarned: 500,
//       bonusesUsed: 0,
//       description: 'Бонус за достижение статуса "Золотой"',
//       status: 'completed'
//     },
//     {
//       id: '4',
//       type: 'purchase',
//       date: '2024-06-10',
//       time: '16:45',
//       shop: 'БТ Бишкек (Дордой Плаза)',
//       shopAddress: 'ТЦ Дордой Плаза, 2 этаж',
//       amount: 12000,
//       bonusesEarned: 180,
//       bonusesUsed: 50,
//       description: 'Микроволновая печь Panasonic NN-SM221W',
//       status: 'completed',
//       receiptNumber: 'BT240610078'
//     },
//     {
//       id: '5',
//       type: 'bonus_used',
//       date: '2024-05-28',
//       time: '13:20',
//       shop: 'БТ Каракол',
//       shopAddress: 'ул. Абдрахманова, 124',
//       amount: 8500,
//       bonusesEarned: 0,
//       bonusesUsed: 300,
//       description: 'Чайник электрический Tefal KI230D30',
//       status: 'completed',
//       receiptNumber: 'BT240528012'
//     },
//     {
//       id: '6',
//       type: 'purchase',
//       date: '2024-05-15',
//       time: '10:30',
//       shop: 'БТ Нарын',
//       shopAddress: 'ул. Ленина, 89',
//       amount: 35000,
//       bonusesEarned: 525,
//       bonusesUsed: 0,
//       description: 'Телевизор Samsung UE43AU7100U',
//       status: 'completed',
//       receiptNumber: 'BT240515033'
//     }
//   ];

//   // Загрузка данных
//   useEffect(() => {
//     if (!isAuthenticated()) {
//       router.push('/login');
//       return;
//     }

//     // Имитация загрузки данных
//     setTimeout(() => {
//       setTransactions(mockTransactions);
//       setFilteredTransactions(mockTransactions);
//       setIsLoading(false);
//     }, 800);
//   }, [isAuthenticated, router]);

//   // Фильтрация транзакций
//   useEffect(() => {
//     let filtered = [...transactions];

//     // Фильтр по типу
//     if (selectedFilter === 'purchase') {
//       filtered = filtered.filter(t => t.type === 'purchase');
//     } else if (selectedFilter === 'bonus') {
//       filtered = filtered.filter(t => t.type === 'bonus_added' || t.type === 'bonus_used');
//     }

//     // Фильтр по периоду
//     const now = new Date();
//     if (selectedPeriod !== 'all') {
//       const periods = {
//         week: 7,
//         month: 30,
//         '3months': 90
//       };
//       const daysBack = periods[selectedPeriod];
//       const cutoffDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
//       filtered = filtered.filter(t => new Date(t.date) >= cutoffDate);
//     }

//     // Поиск
//     if (searchTerm) {
//       filtered = filtered.filter(t =>
//         t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         t.shop.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         t.receiptNumber?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     setFilteredTransactions(filtered);
//   }, [transactions, selectedFilter, selectedPeriod, searchTerm]);

//   // Получение иконки для типа транзакции
//   const getTransactionIcon = (type: string, status: string) => {
//     if (status === 'pending') return <Clock className="w-5 h-5 text-yellow-500" />;
//     if (status === 'cancelled') return <XCircle className="w-5 h-5 text-red-500" />;
    
//     switch (type) {
//       case 'purchase':
//         return <Receipt className="w-5 h-5 text-blue-500" />;
//       case 'bonus_added':
//         return <Zap className="w-5 h-5 text-green-500" />;
//       case 'bonus_used':
//         return <Zap className="w-5 h-5 text-orange-500" />;
//       default:
//         return <CheckCircle className="w-5 h-5 text-gray-500" />;
//     }
//   };

//   // Получение цвета для типа транзакции
//   const getTransactionColor = (type: string) => {
//     switch (type) {
//       case 'purchase':
//         return 'border-blue-200 bg-blue-50';
//       case 'bonus_added':
//         return 'border-green-200 bg-green-50';
//       case 'bonus_used':
//         return 'border-orange-200 bg-orange-50';
//       case 'bonus_expired':
//         return 'border-red-200 bg-red-50';
//       default:
//         return 'border-gray-200 bg-gray-50';
//     }
//   };

//   // Форматирование даты
//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     const today = new Date();
//     const diffTime = Math.abs(today.getTime() - date.getTime());
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//     if (diffDays === 1) return 'Вчера';
//     if (diffDays === 0) return 'Сегодня';
//     if (diffDays <= 7) return `${diffDays} дн. назад`;
    
//     return date.toLocaleDateString('ru-RU', {
//       day: 'numeric',
//       month: 'short',
//       year: 'numeric'
//     });
//   };

//   // Подсчёт статистики
//   const totalSpent = transactions
//     .filter(t => t.type === 'purchase')
//     .reduce((sum, t) => sum + t.amount, 0);
  
//   const totalEarned = transactions.reduce((sum, t) => sum + t.bonusesEarned, 0);
//   const totalUsed = transactions.reduce((sum, t) => sum + t.bonusesUsed, 0);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black flex items-center justify-center">
//         <div className="text-white text-xl">Загрузка истории...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black">
//       <div className="container mx-auto px-4 py-6 max-w-4xl">
        
//         {/* Заголовок */}
//         <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-6">
//           <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6">
//             <div className="flex items-center">
//               <button 
//                 onClick={() => router.push('/profile')}
//                 className="mr-4 p-2 hover:bg-red-700 rounded-lg transition-colors"
//               >
//                 <ArrowLeft className="w-6 h-6" />
//               </button>
//               <div className="flex-1">
//                 <h1 className="text-2xl font-bold">История покупок</h1>
//                 <p className="text-red-100">{getUser()?.name}</p>
//               </div>
//             </div>
//           </div>

//           {/* Статистика */}
//           <div className="p-6 bg-gray-50">
//             <div className="grid grid-cols-3 gap-4">
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-gray-800">{totalSpent.toLocaleString()}</div>
//                 <div className="text-sm text-gray-600">Потрачено сом</div>
//               </div>
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-green-600">+{totalEarned.toLocaleString()}</div>
//                 <div className="text-sm text-gray-600">Заработано бонусов</div>
//               </div>
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-orange-600">-{totalUsed.toLocaleString()}</div>
//                 <div className="text-sm text-gray-600">Потрачено бонусов</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Поиск и фильтры */}
//         <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {/* Поиск */}
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 placeholder="Поиск по товарам, чекам..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
//               />
//             </div>

//             {/* Фильтр по типу */}
//             <select
//               value={selectedFilter}
//               onChange={(e) => setSelectedFilter(e.target.value as any)}
//               className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
//             >
//               <option value="all">Все операции</option>
//               <option value="purchase">Покупки</option>
//               <option value="bonus">Бонусы</option>
//             </select>

//             {/* Фильтр по периоду */}
//             <select
//               value={selectedPeriod}
//               onChange={(e) => setSelectedPeriod(e.target.value as any)}
//               className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
//             >
//               <option value="all">За все время</option>
//               <option value="week">За неделю</option>
//               <option value="month">За месяц</option>
//               <option value="3months">За 3 месяца</option>
//             </select>
//           </div>

//           {/* Результаты поиска */}
//           <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
//             <span>Найдено: {filteredTransactions.length} операций</span>
//             {(searchTerm || selectedFilter !== 'all' || selectedPeriod !== 'all') && (
//               <button
//                 onClick={() => {
//                   setSearchTerm('');
//                   setSelectedFilter('all');
//                   setSelectedPeriod('all');
//                 }}
//                 className="text-red-600 hover:text-red-800 font-medium"
//               >
//                 Сбросить фильтры
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Список транзакций */}
//         <div className="space-y-4">
//           {filteredTransactions.map((transaction) => (
//             <div 
//               key={transaction.id}
//               className={`bg-white rounded-xl shadow-lg border-l-4 ${getTransactionColor(transaction.type)} hover:shadow-xl transition-all`}
//             >
//               <div className="p-6">
//                 <div className="flex items-start justify-between">
                  
//                   {/* Основная информация */}
//                   <div className="flex items-start space-x-4 flex-1">
//                     <div className="mt-1">
//                       {getTransactionIcon(transaction.type, transaction.status)}
//                     </div>
                    
//                     <div className="flex-1">
//                       <div className="flex items-center space-x-3 mb-2">
//                         <h3 className="font-semibold text-gray-800 text-lg">
//                           {transaction.description}
//                         </h3>
//                         {transaction.receiptNumber && (
//                           <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-mono">
//                             #{transaction.receiptNumber}
//                           </span>
//                         )}
//                       </div>
                      
//                       <div className="flex items-center text-gray-600 text-sm space-x-4 mb-3">
//                         <div className="flex items-center">
//                           <MapPin className="w-4 h-4 mr-1" />
//                           <span>{transaction.shop}</span>
//                         </div>
//                         <div className="flex items-center">
//                           <Calendar className="w-4 h-4 mr-1" />
//                           <span>{formatDate(transaction.date)} в {transaction.time}</span>
//                         </div>
//                       </div>
                      
//                       {transaction.shopAddress !== 'Автоматическое начисление' && (
//                         <p className="text-gray-500 text-sm">{transaction.shopAddress}</p>
//                       )}
//                     </div>
//                   </div>

//                   {/* Суммы */}
//                   <div className="text-right space-y-1">
//                     {transaction.amount > 0 && (
//                       <div className="text-xl font-bold text-gray-800">
//                         {transaction.amount.toLocaleString()} сом
//                       </div>
//                     )}
                    
//                     {transaction.bonusesEarned > 0 && (
//                       <div className="text-green-600 font-semibold">
//                         +{transaction.bonusesEarned} бонусов
//                       </div>
//                     )}
                    
//                     {transaction.bonusesUsed > 0 && (
//                       <div className="text-orange-600 font-semibold">
//                         -{transaction.bonusesUsed} бонусов
//                       </div>
//                     )}
                    
//                     <div className={`text-xs px-2 py-1 rounded-full inline-block ${
//                       transaction.status === 'completed' 
//                         ? 'bg-green-100 text-green-800' 
//                         : transaction.status === 'pending'
//                         ? 'bg-yellow-100 text-yellow-800'
//                         : 'bg-red-100 text-red-800'
//                     }`}>
//                       {transaction.status === 'completed' && 'Завершено'}
//                       {transaction.status === 'pending' && 'В обработке'}
//                       {transaction.status === 'cancelled' && 'Отменено'}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}

//           {/* Пустое состояние */}
//           {filteredTransactions.length === 0 && (
//             <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
//               <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//               <h3 className="text-xl font-bold text-gray-800 mb-2">История пуста</h3>
//               <p className="text-gray-600 mb-4">
//                 {searchTerm || selectedFilter !== 'all' || selectedPeriod !== 'all'
//                   ? 'По выбранным фильтрам операций не найдено'
//                   : 'Здесь будут отображаться ваши покупки и операции с бонусами'
//                 }
//               </p>
//               <button
//                 onClick={() => router.push('/profile')}
//                 className="bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-700 hover:to-red-900 transition-all"
//               >
//                 Вернуться в профиль
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }