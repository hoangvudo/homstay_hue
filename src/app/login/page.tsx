"use client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axiosClient from '@/lib/axiosClient';
import Cookies from 'js-cookie';
import NotificationModal, { ModalType } from '@/components/NotificationModal';
const schema = yup.object().shape({
  email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập Email'),
  password: yup.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự').required('Vui lòng nhập mật khẩu'),
});
export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  // Modal state
  const [modal, setModal] = useState<{ isOpen: boolean; type: ModalType; title?: string; message: string }>({
    isOpen: false, type: 'success', message: ''
  });
  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      // Gọi tới Backend Java Spring Boot
      const response = await axiosClient.post('/auth/login', data);
      const { token, user } = response.data;
      
      Cookies.set('token', token, { expires: 1 });
      localStorage.setItem('user', JSON.stringify({ ...user, token }));
      
      setModal({
        isOpen: true,
        type: 'success',
        title: 'Đăng nhập thành công!',
        message: `Chào mừng bạn quay trở lại, ${user.name || 'bạn'}! Đang chuyển hướng...`,
      });
    } catch (error: any) {
      setModal({
        isOpen: true,
        type: 'error',
        title: 'Đăng nhập thất bại',
        message: error.response?.data?.error || 'Tài khoản hoặc mật khẩu không đúng.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: 'url(/images/bg-hue.png)' }}
    >
      {/* Overlay làm tối ảnh nền để form nổi bật hơn */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="glass w-full max-w-md p-8 rounded-2xl relative z-10 mx-4"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif text-white mb-2 font-bold tracking-wider">
            Hue <span className="text-hue-gold">Homestay</span>
          </h1>
          <p className="text-white/80 text-sm">Trải nghiệm nét đẹp cố đô</p>
        </div>
        {errorMessage && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm text-center">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 h-5 w-5" />
              <input 
                type="email" 
                placeholder="Email của bạn" 
                {...register('email')}
                className="w-full glass-input py-3 pl-10 pr-4 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-hue-gold"
              />
            </div>
            {errors.email && <p className="text-red-300 text-xs mt-1 ml-1">{errors.email.message}</p>}
          </div>
          {/* Password */}
          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 h-5 w-5" />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Mật khẩu" 
                {...register('password')}
                className="w-full glass-input py-3 pl-10 pr-12 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-hue-gold"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-red-300 text-xs mt-1 ml-1">{errors.password.message}</p>}
          </div>
          {/* Remember & Forgot */}
          <div className="flex items-center justify-between text-white/90 text-sm">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" className="rounded text-hue-gold focus:ring-hue-gold bg-transparent border-white/40" />
              <span>Ghi nhớ đăng nhập</span>
            </label>
            <a href="#" className="hover:text-hue-gold transition-colors">Quên mật khẩu?</a>
          </div>
          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-hue-red to-hue-red-dark hover:from-hue-red-dark hover:to-hue-red text-white font-semibold shadow-lg transition-all duration-300 flex justify-center items-center gap-2 group"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                Đăng Nhập
              </>
            )}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-white/60 mb-4 text-sm">Hoặc đăng nhập bằng</p>
          <div className="flex gap-4 justify-center">
            <button className="p-3 rounded-full glass hover:bg-white/20 transition-colors text-white">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81Z"/></svg>
            </button>
            <button className="p-3 rounded-full glass hover:bg-white/20 transition-colors text-blue-500">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H7v-3h3V9.5C10 6.57 11.74 5 14.28 5c1.25 0 2.54.22 2.54.22v2.79h-1.43c-1.41 0-1.85.88-1.85 1.77V12h3.14l-.5 3h-2.64v6.8C18.56 20.87 22 16.84 22 12z"/></svg>
            </button>
          </div>
        </div>
        <p className="mt-8 text-center text-white/80 text-sm">
          Chưa có tài khoản?{' '}
          <Link href="/register" className="text-hue-gold hover:underline font-medium">
            Đăng ký ngay
          </Link>
        </p>
      </motion.div>
      {/* Notification Modal */}
      <NotificationModal
        isOpen={modal.isOpen}
        onClose={() => setModal(prev => ({ ...prev, isOpen: false }))}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.type === 'success' ? () => router.push('/') : undefined}
        buttonText={modal.type === 'success' ? 'Vào Trang chủ' : 'Thử lại'}
      />
    </div>
  );
}
