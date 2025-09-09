'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Phone } from 'lucide-react';
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
      setErrors(prev => ({ ...prev, phone: 'Ошибка сети. Попробуйте позже.' }));
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Заголовок */}
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-red-600 to-red-800 text-white text-2xl font-bold px-6 py-3 rounded-xl inline-block mb-4">
              БТ ТЕХНИКА
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Бонусная программа</h2>
            <p className="text-gray-600">Войдите в свой аккаунт</p>
          </div>

          {/* Форма */}
          <div className="space-y-6">
            {/* Поле имени */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Введите ваше ФИО"
                value={formData.name}
                onChange={handleNameChange}
                className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none transition-colors text-lg ${errors.name
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-200 focus:border-red-500'
                  }`}
              />
              {errors.name && (
                <p className="mt-2 text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            {/* Поле телефона */}
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="tel"
                placeholder="+996 XXX XXX XXX"
                value={formData.phone}
                onChange={handlePhoneChange}
                className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none transition-colors text-lg ${errors.phone
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-200 focus:border-red-500'
                  }`}
              />
              {errors.phone && (
                <p className="mt-2 text-red-500 text-sm">{errors.phone}</p>
              )}
            </div>

            {/* Кнопка отправки */}
            <button
              onClick={handleSubmit}
              disabled={mutation.isPending}
              className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white py-4 rounded-xl font-semibold text-lg hover:from-red-700 hover:to-red-900 transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {mutation.isPending ? 'Отправка...' : 'Отправить'}
            </button>
          </div>

          {/* Дополнительная информация */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Код верификации будет отправлен в WhatsApp</p>
          </div>
        </div>
      </div>
    </div>
  );
}