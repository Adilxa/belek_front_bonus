"use client";
import useAuth from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { Phone, ArrowLeft, MessageSquare, RefreshCw } from "lucide-react";

const VerificationForm = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [resendCooldown, setResendCooldown] = useState(0);
    const params = useSearchParams();
    const router = useRouter();
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const phoneNumber: string = params.get('phone') || '';
    const { otpVerify, onLogin } = useAuth();

    const mutation = useMutation({
        mutationFn: () => otpVerify(phoneNumber, otp.join('')),
        onSuccess: () => {
            router.push('/profile');
        },
        onError: (error) => {
            setError(`${error}`);
            // Очищаем поля при ошибке
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        }
    });

    const resendMutation = useMutation({
        mutationFn: () => onLogin(phoneNumber, ''), // Используем пустое имя для повторной отправки
        onSuccess: () => {
            setError('');
            // Запускаем обратный отсчет на 60 секунд
            setResendCooldown(60);
            const timer = setInterval(() => {
                setResendCooldown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        },
        onError: (error) => {
            setError('Ошибка при отправке кода. Попробуйте позже.');
        }
    });

    const handleResend = () => {
        if (resendCooldown > 0) return;
        resendMutation.mutate();
    };

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
        <div className="min-h-screen bg-black text-white overflow-hidden relative">
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-black to-gray-900/30"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(120,119,198,0.1),transparent)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(236,72,153,0.05),transparent)]"></div>
            
            <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                    <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800/50 rounded-3xl shadow-2xl p-8">
                        {/* Back Button */}
                        <button
                            onClick={() => router.back()}
                            className="flex items-center text-gray-400 hover:text-white mb-8 transition-all duration-300 group"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                            Назад
                        </button>

                        {/* Header */}
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl mb-6 shadow-xl">
                                <span className="text-2xl font-black text-black">БТ</span>
                            </div>
                            
                            <h1 className="text-2xl font-bold text-white mb-4">
                                Проверим ваш номер
                            </h1>
                            
                            <div className="space-y-3">
                                <p className="text-gray-400">
                                    Код отправлен в WhatsApp
                                </p>
                                
                                <div className="flex items-center justify-center bg-gray-800/50 border border-gray-700/30 rounded-2xl px-4 py-3">
                                    <MessageSquare className="w-5 h-5 text-green-400 mr-3" />
                                    <Phone className="w-4 h-4 text-white mr-2" />
                                    <span className="font-mono text-white font-semibold">
                                        {formatPhoneDisplay(phoneNumber)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* OTP Input Fields */}
                            <div className="space-y-4">
                                <label className="block text-gray-300 text-sm font-medium text-center">
                                    Введите 6-значный код
                                </label>
                                
                                <div className="flex justify-center space-x-3">
                                    {otp.map((digit, index) => (
                                        <input
  key={index}
  ref={(el) => {
    inputRefs.current[index] = el;
  }}
  type="text"
  inputMode="numeric"
  maxLength={1}
  value={digit}
  onChange={(e) => handleOtpChange(index, e.target.value)}
  onKeyDown={(e) => handleKeyDown(index, e)}
  onPaste={handlePaste}
  className={`w-12 h-14 text-center text-xl font-bold bg-gray-800/60 border-2 rounded-2xl focus:outline-none transition-all duration-300 ${
    error
      ? 'border-red-500/50 focus:border-red-400 bg-red-500/10'
      : digit 
      ? 'border-white/30 focus:border-white/60 bg-white/5'
      : 'border-gray-700/50 focus:border-gray-500/60 hover:border-gray-600/50'
  } text-white placeholder-gray-500`}
  disabled={mutation.isPending}
  autoComplete="off"
/>

                                    ))}
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
                                    <p className="text-red-400 text-sm text-center font-medium">{error}</p>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={mutation.isPending || otp.join('').length !== 6}
                                className="w-full bg-white text-black py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.02] shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                            >
                                {mutation.isPending ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-600 border-t-black mr-3"></div>
                                        Проверка...
                                    </>
                                ) : (
                                    'Подтвердить'
                                )}
                            </button>
                        </form>

                        {/* Resend Section */}
                        <div className="mt-8 pt-6 border-t border-gray-800/30">
                            <div className="text-center space-y-4">
                                <p className="text-gray-400 text-sm">
                                    Не получили код?
                                </p>
                                
                                <button
                                    onClick={handleResend}
                                    disabled={resendCooldown > 0 || resendMutation.isPending}
                                    className="inline-flex items-center text-white font-semibold hover:text-gray-300 transition-colors duration-300 bg-gray-800/50 border border-gray-700/30 px-6 py-3 rounded-2xl hover:bg-gray-800/70 hover:border-gray-600/50 group disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {resendMutation.isPending ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-white mr-2"></div>
                                            Отправка...
                                        </>
                                    ) : resendCooldown > 0 ? (
                                        <>
                                            <RefreshCw className="w-4 h-4 mr-2" />
                                            Повторить через {resendCooldown}с
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                                            Отправить повторно
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerificationForm;