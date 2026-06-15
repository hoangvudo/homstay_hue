"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, User, ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axiosClient from '@/lib/axiosClient';
import NotificationModal, { ModalType } from '@/components/NotificationModal';
// === SCHEMAS ===
const baseSchema = {
  name: yup.string().required('Vui lòng nhập họ tên'),
  email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập Email'),
  phone: yup.string().required('Vui lòng nhập số điện thoại'),
  password: yup.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự').required('Vui lòng nhập mật khẩu'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Mật khẩu không khớp').required('Vui lòng xác nhận mật khẩu'),
};
const userSchema = yup.object().shape(baseSchema);
const hostSchema = yup.object().shape({
  ...baseSchema,
  homestayName: yup.string().required('Vui lòng nhập tên Homestay'),
  homestayAddress: yup.string().required('Vui lòng nhập địa chỉ'),
  description: yup.string().required('Vui lòng nhập mô tả ngắn'),
});
export default function RegisterPage() {
  const [step, setStep] = useState(1); // 1: Role Selection, 2: Registration Form
  const [role, setRole] = useState<'USER' | 'HOST'>('USER');
  // Khởi tạo Form. Tùy thuộc vào Role, form sẽ apply schema tương ứng.
  const schema = role === 'USER' ? userSchema : hostSchema;
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema as any),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  // Modal state
  const [modal, setModal] = useState<{ isOpen: boolean; type: ModalType; title?: string; message: string }>({
    isOpen: false, type: 'success', message: ''
  });
  const handleRoleSelect = (selectedRole: 'USER' | 'HOST') => {
    setRole(selectedRole);
    setStep(2);
    reset(); // Reset form khi chuyển role
  };
  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      // Gọi tới Backend Java Spring Boot
      await axiosClient.post('/auth/register', { role, ...data });
      setModal({
        isOpen: true,
        type: 'success',
        title: 'Đăng ký thành công!',
        message: 'Tài khoản của bạn đã được tạo. Hãy đăng nhập để bắt đầu trải nghiệm Hue Homestay.',
      });
    } catch (error: any) {
      setModal({
        isOpen: true,
        type: 'error',
        title: 'Đăng ký thất bại',
        message: error.response?.data?.error || 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  // Các variants cho animation chuyển màn
  const variants = {
    enter: { x: 50, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 }
  };
  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat relative py-12 overflow-hidden"
      style={{ backgroundImage: 'url(/images/bg-hue.png)' }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[3px]"></div>
      <div className="relative z-10 w-full max-w-4xl px-4">
        
        {/* Header Logo */}
        <div className="text-center mb-10">
          <Link href="/">
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-2 font-bold tracking-wider cursor-pointer hover:scale-105 transition-transform inline-block">
              Hue <span className="text-hue-gold">Homestay</span>
            </h1>
          </Link>
          <p className="text-white/80 text-base">Chào mừng bạn đến với cộng đồng của chúng tôi</p>
        </div>
        <div className="relative">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: CHỌN ROLE */}
            {step === 1 && (
              <motion.div
                key="step1"
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4 }}
                className="grid md:grid-cols-2 gap-6"
              >
                {/* Card User */}
                <motion.div 
                  whileHover={{ scale: 1.03, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRoleSelect('USER')}
                  className="glass p-8 rounded-2xl cursor-pointer border border-white/20 hover:border-hue-gold/50 transition-colors group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="text-hue-gold w-6 h-6" />
                  </div>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/40 flex items-center justify-center mb-6 border border-blue-500/30">
                    <User className="text-blue-300 w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-white mb-3">Khách Du Lịch</h3>
                  <ul className="text-white/80 space-y-3">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-hue-gold" /> Tìm kiếm homestay Huế</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-hue-gold" /> Đặt phòng online</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-hue-gold" /> Thanh toán trực tuyến an toàn</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-hue-gold" /> Đánh giá & Bình luận</li>
                  </ul>
                </motion.div>
                {/* Card Host */}
                <motion.div 
                  whileHover={{ scale: 1.03, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRoleSelect('HOST')}
                  className="glass p-8 rounded-2xl cursor-pointer border border-white/20 hover:border-hue-red/50 transition-colors group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="text-hue-red w-6 h-6" />
                  </div>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-hue-red/30 to-hue-red-dark/50 flex items-center justify-center mb-6 border border-hue-red/40">
                    <Home className="text-red-200 w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-white mb-3">Chủ Homestay</h3>
                  <ul className="text-white/80 space-y-3">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-hue-gold" /> Đăng tải Homestay của bạn</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-hue-gold" /> Quản lý danh sách phòng</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-hue-gold" /> Quản lý lượt đặt phòng</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-hue-gold" /> Theo dõi doanh thu</li>
                  </ul>
                </motion.div>
              </motion.div>
            )}
            {/* STEP 2: REGISTRATION FORM */}
            {step === 2 && (
              <motion.div
                key="step2"
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4 }}
                className="max-w-2xl mx-auto glass p-8 md:p-10 rounded-2xl"
              >
                <button 
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Quay lại chọn vai trò
                </button>
                <h2 className="text-3xl font-serif text-white font-bold mb-6">
                  Đăng ký {role === 'USER' ? 'Khách hàng' : 'Chủ Homestay'}
                </h2>
                {errorMessage && (
                  <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
                    {errorMessage}
                  </div>
                )}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    {/* Common Fields */}
                    <div>
                      <input type="text" placeholder="Họ và tên" {...register('name')} className="w-full glass-input py-3 px-4 rounded-xl text-white" />
                      {errors.name && <p className="text-red-300 text-xs mt-1 ml-1">{errors.name.message as string}</p>}
                    </div>
                    <div>
                      <input type="email" placeholder="Email" {...register('email')} className="w-full glass-input py-3 px-4 rounded-xl text-white" />
                      {errors.email && <p className="text-red-300 text-xs mt-1 ml-1">{errors.email.message as string}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <input type="text" placeholder="Số điện thoại" {...register('phone')} className="w-full glass-input py-3 px-4 rounded-xl text-white" />
                      {errors.phone && <p className="text-red-300 text-xs mt-1 ml-1">{errors.phone.message as string}</p>}
                    </div>
                    {/* Host Specific Fields */}
                    {role === 'HOST' && (
                      <>
                        <div className="md:col-span-2">
                          <input type="text" placeholder="Tên Homestay" {...register('homestayName')} className="w-full glass-input py-3 px-4 rounded-xl text-white" />
                          {errors.homestayName && <p className="text-red-300 text-xs mt-1 ml-1">{errors.homestayName.message as string}</p>}
                        </div>
                        <div className="md:col-span-2">
                          <input type="text" placeholder="Địa chỉ Homestay" {...register('homestayAddress')} className="w-full glass-input py-3 px-4 rounded-xl text-white" />
                          {errors.homestayAddress && <p className="text-red-300 text-xs mt-1 ml-1">{errors.homestayAddress.message as string}</p>}
                        </div>
                        <div className="md:col-span-2">
                          <textarea rows={3} placeholder="Mô tả ngắn gọn về Homestay" {...register('description')} className="w-full glass-input py-3 px-4 rounded-xl text-white resize-none" />
                          {errors.description && <p className="text-red-300 text-xs mt-1 ml-1">{errors.description.message as string}</p>}
                        </div>
                      </>
                    )}
                    {/* Passwords */}
                    <div>
                      <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="Mật khẩu" 
                          {...register('password')} 
                          className="w-full glass-input py-3 pl-4 pr-12 rounded-xl text-white" 
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-red-300 text-xs mt-1 ml-1">{errors.password.message as string}</p>}
                    </div>
                    <div>
                      <div className="relative">
                        <input 
                          type={showConfirmPassword ? "text" : "password"} 
                          placeholder="Xác nhận mật khẩu" 
                          {...register('confirmPassword')} 
                          className="w-full glass-input py-3 pl-4 pr-12 rounded-xl text-white" 
                        />
                        <button 
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="text-red-300 text-xs mt-1 ml-1">{errors.confirmPassword.message as string}</p>}
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full mt-6 py-3.5 rounded-xl bg-gradient-to-r from-hue-red to-hue-red-dark hover:from-hue-red-dark hover:to-hue-red text-white font-semibold shadow-lg transition-all duration-300 flex justify-center items-center gap-2 group"
                  >
                    {isLoading ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      'Tạo Tài Khoản'
                    )}
                  </button>
                </form>
                <p className="mt-6 text-center text-white/80 text-sm">
                  Đã có tài khoản?{' '}
                  <Link href="/login" className="text-hue-gold hover:underline font-medium">
                    Đăng nhập
                  </Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {/* Notification Modal */}
      <NotificationModal
        isOpen={modal.isOpen}
        onClose={() => setModal(prev => ({ ...prev, isOpen: false }))}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.type === 'success' ? () => router.push('/login') : undefined}
        buttonText={modal.type === 'success' ? 'Đi đến Đăng nhập' : 'Thử lại'}
      />
    </div>
  );
}
