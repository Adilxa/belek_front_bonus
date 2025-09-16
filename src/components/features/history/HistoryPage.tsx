'use client';

import { History, X } from 'lucide-react';

// Компонент модалки истории

interface HistoryModalProps {
    isOpen: boolean;
    onClose: any
    data: any;
    refetch: any
}
function HistoryModal({ isOpen, onClose, data, refetch }: HistoryModalProps) {
    if (!isOpen) return null;
    console.log(data)

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
                {/* Заголовок модалки */}
                <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold">История операций</h2>
                    <button
                        onClick={() => {
                            refetch()
                            onClose()
                        }
                        }
                        className="p-1 hover:bg-red-700 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Содержимое модалки */}
                <div className="p-4 overflow-y-auto max-h-[60vh]">
                    {data?.allTransactions && data.allTransactions.length > 0 ? (
                        <div className="space-y-3">
                            {data?.allTransactions.map((item: any, index: number) => (
                                <div key={index} className="border-b border-gray-200 pb-3 last:border-b-0">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-800">
                                                {item.productName || 'Операция'}
                                            </p>
                                            {/* <p className="text-sm text-gray-600">
                                                {item.description || 'Описание недоступно'}
                                            </p> */}
                                            <p className="text-xs text-gray-500 mt-1">
                                                {item.createdAt ? new Date(item.createdAt).toLocaleDateString('ru-RU') : 'Дата недоступна'}
                                            </p>
                                        </div>
                                        <div className="ml-3 text-right">
                                            <p className={`font-bold ${item.cashbackAmount > 0 ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                {item.cashbackAmount > 0 ? '+' : ''}{item.cashbackAmount}⚡
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600 text-lg font-medium mb-2">
                                История пуста
                            </p>
                            <p className="text-gray-500">
                                Здесь будут отображаться ваши операции
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default HistoryModal