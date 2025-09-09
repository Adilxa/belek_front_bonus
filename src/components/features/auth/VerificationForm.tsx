"use client";
import useAuth from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Phone, ArrowLeft } from "lucide-react";

const VerificationForm = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const params = useSearchParams();
    const router = useRouter();
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const phoneNumber: string = params.get('phone') || '';
    const { otpVerify } = useAuth();

    const mutation = useMutation({
        mutationFn: () => otpVerify(phoneNumber, otp.join('')),
        onSuccess: () => {
            router.push('/profile');
        },
        onError: (error) => {
            setError('Неверный код. Попробуйте еще раз.');
            // Очищаем поля при ошибке
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        }
    });

    // Обработчик изменения OTP
    const handleOtpChange = (index: number, value: string) => {
        // Разрешаем только цифры
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Очищаем ошибку при вводе
        if (error) setError('');

        // Автоматический переход к следующему полю
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // Обработчик клавиш
    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    // Обработчик вставки из буфера обмена
    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
        
        if (pastedData.length === 6) {
            const newOtp = pastedData.split('');
            setOtp(newOtp);
            inputRefs.current[5]?.focus();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            setError('Введите полный 6-значный код');
            return;
        }

        mutation.mutate();
    };

    // Форматирование номера телефона для отображения
    const formatPhoneDisplay = (phone: string) => {
        if (phone.startsWith('+996')) {
            return phone.replace('+996', '+996 ').replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
        }
        return phone;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    {/* Кнопка назад */}
                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-gray-500 hover:text-gray-700 mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Назад
                    </button>

                    {/* Заголовок */}
                    <div className="text-center mb-8">
                        <div className="bg-gradient-to-r from-red-600 to-red-800 text-white text-2xl font-bold px-6 py-3 rounded-xl inline-block mb-4">
                            БТ ТЕХНИКА
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Введите код верификации</h2>
                        <p className="text-gray-600 mb-2">
                            Код отправлен в WhatsApp на номер
                        </p>
                        <div className="flex items-center justify-center text-red-600 font-semibold">
                            <Phone className="w-4 h-4 mr-2" />
                            {formatPhoneDisplay(phoneNumber)}
                        </div>
                    </div>

                    {/* Форма */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Поля для OTP */}
                        <div className="flex justify-center space-x-3">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => inputRefs.current[index] = el}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={handlePaste}
                                    className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-xl focus:outline-none transition-colors ${
                                        error
                                            ? 'border-red-500 focus:border-red-500'
                                            : 'border-gray-200 focus:border-red-500'
                                    }`}
                                    disabled={mutation.isPending}
                                />
                            ))}
                        </div>

                        {/* Ошибка */}
                        {error && (
                            <p className="text-red-500 text-sm text-center">{error}</p>
                        )}

                        {/* Кнопка подтверждения */}
                        <button
                            type="submit"
                            disabled={mutation.isPending || otp.join('').length !== 6}
                            className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white py-4 rounded-xl font-semibold text-lg hover:from-red-700 hover:to-red-900 transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {mutation.isPending ? 'Проверка...' : 'Подтвердить'}
                        </button>
                    </form>

                    {/* Дополнительная информация */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500 mb-3">
                            Не получили код?
                        </p>
                        <button
                            onClick={() => {
                                // Здесь можно добавить функцию повторной отправки
                                console.log('Resend code');
                            }}
                            className="text-red-600 font-semibold hover:text-red-800 transition-colors"
                        >
                            Отправить повторно
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerificationForm;