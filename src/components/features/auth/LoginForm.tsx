'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Phone, MessageSquare, Sparkles } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import { useMutation } from '@tanstack/react-query';

export default function LoginForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    phone: ''
  });

  const router = useRouter();
  const { onLogin } = useAuth();

  // Валидация формы
  const validateForm = () => {
    const newErrors = { name: '', phone: '' };
    let isValid = true;

    // Проверка имени
    if (!formData.name.trim()) {
      newErrors.name = 'Введите ФИО';
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'ФИО должно содержать минимум 2 символа';
      isValid = false;
    }

    // Проверка телефона
    if (!formData.phone.trim()) {
      newErrors.phone = 'Введите номер телефона';
      isValid = false;
    } else if (formData.phone.length < 13) { // +996xxxxxxxxx = 13 символов
      newErrors.phone = 'Введите полный номер телефона';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const mutation = useMutation({
    mutationFn: () => onLogin(formData.phone, formData.name),
    onSuccess: () => {
      router.push("/verification/?phone=" + formData.phone)
    },
    onError: (error) => {
      setErrors(prev => ({ ...prev, phone: `${error}Ошибка сети. Попробуйте позже.` }));
    }
  });

  // Обработчик отправки формы
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      mutation.mutate();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  // Форматирование номера телефона
  const formatPhone = (value: string) => {
    // Убираем все кроме цифр
    const numbers = value.trim().replace(/\D/g, '');

    // Если нет цифр, возвращаем пустую строку
    if (numbers.length === 0) {
      return '';
    }

    // Если начинается не с 996, добавляем префикс
    let formatted = numbers;
    if (!numbers.startsWith('996')) {
      if (numbers.startsWith('0')) {
        formatted = '996' + numbers.slice(1);
      } else {
        formatted = '996' + numbers;
      }
    }

    // Ограничиваем длину до 12 цифр для кыргызских номеров (996 + 9 цифр)
    formatted = formatted.slice(0, 12);

    // Форматируем как +996XXXXXXXXX (без пробелов)
    return '+' + formatted;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData(prev => ({ ...prev, phone: formatted }));

    // Очищаем ошибку при изменении
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, name: e.target.value }));

    // Очищаем ошибку при изменении
    if (errors.name) {
      setErrors(prev => ({ ...prev, name: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-black to-gray-900/30"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.1),transparent)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(236,72,153,0.05),transparent)]"></div>
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800/50 rounded-3xl shadow-2xl p-8">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl mb-6 shadow-2xl relative">
                <span className="text-3xl font-black text-black">БТ</span>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              
              <h1 className="text-3xl font-black text-white mb-3 tracking-tight">
                БТ ТЕХНИКА
              </h1>
              <h2 className="text-xl font-bold text-white mb-2">Бонусная программа</h2>
              <p className="text-gray-400">Присоединяйтесь к нашей программе лояльности</p>
            </div>

            {/* Form */}
            <div className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="block text-gray-300 text-sm font-medium">
                  Ваше ФИО
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                  <input
                    type="text"
                    placeholder="Иванов Иван Иванович"
                    value={formData.name}
                    onChange={handleNameChange}
                    className={`w-full pl-12 pr-4 py-4 bg-gray-800/60 border-2 rounded-2xl focus:outline-none transition-all duration-300 text-lg text-white placeholder-gray-500 ${
                      errors.name
                        ? 'border-red-500/50 focus:border-red-400 bg-red-500/10'
                        : 'border-gray-700/50 focus:border-white/60 hover:border-gray-600/50 focus:bg-gray-800/80'
                    }`}
                  />
                </div>
                {errors.name && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                    <p className="text-red-400 text-sm">{errors.name}</p>
                  </div>
                )}
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <label className="block text-gray-300 text-sm font-medium">
                  Номер телефона
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                  <input
                    type="tel"
                    placeholder="+996 XXX XXX XXX"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className={`w-full pl-12 pr-4 py-4 bg-gray-800/60 border-2 rounded-2xl focus:outline-none transition-all duration-300 text-lg text-white placeholder-gray-500 font-mono ${
                      errors.phone
                        ? 'border-red-500/50 focus:border-red-400 bg-red-500/10'
                        : 'border-gray-700/50 focus:border-white/60 hover:border-gray-600/50 focus:bg-gray-800/80'
                    }`}
                  />
                </div>
                {errors.phone && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                    <p className="text-red-400 text-sm">{errors.phone}</p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={mutation.isPending}
                className="w-full bg-white text-black py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.02] shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center group"
              >
                {mutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-600 border-t-black mr-3"></div>
                    Отправка кода...
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                    Получить код
                  </>
                )}
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-8 pt-6 border-t border-gray-800/30">
              <div className="bg-gray-800/40 border border-gray-700/30 rounded-2xl p-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-green-500/10 border border-green-500/20 p-2 rounded-xl flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">WhatsApp верификация</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Код подтверждения будет отправлен в WhatsApp на указанный номер
                    </p>
                  </div>
                </div>
              </div>
            </div>

           
          </div>
        </div>
      </div>
    </div>
  );
}