"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Shield, Camera, Save, ArrowLeft, MapPin, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import NotificationModal, { ModalType } from '@/components/NotificationModal';
interface UserData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  createdAt?: string;
}
export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [modal, setModal] = useState<{ isOpen: boolean; type: ModalType; title?: string; message: string }>({
    isOpen: false, type: 'success', message: ''
  });
  const router = useRouter();
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setFormData({ name: parsed.name || '', phone: parsed.phone || '' });
    } else {
      router.push('/login');
    }
  }, [router]);
  const handleSave = () => {
    if (!user) return;
    const updatedUser = { ...user, name: formData.name, phone: formData.phone };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing(false);
    setModal({
      isOpen: true,
      type: 'success',
      title: 'Cập nhật thành công!',
      message: 'Thông tin cá nhân của bạn đã được lưu lại.',
    });
  };
  const getInitial = () => user?.name?.charAt(0).toUpperCase() || 'U';
  const getRoleName = () => {
    if (user?.role === 'ADMIN') return 'Quản trị viên';
    if (user?.role === 'HOST') return 'Chủ Homestay';
    return 'Khách hàng';
  };
  const getRoleColor = () => {
    if (user?.role === 'ADMIN') return 'from-slate-700 to-slate-900';
    if (user?.role === 'HOST') return 'from-[#8B4513] to-[#A0522D]';
    return 'from-blue-500 to-blue-700';
  };
  if (!user) return null;
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-[#FDFBF7] to-[#F5F0E8] pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Back button */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
            <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#8B4513] transition-colors text-sm font-medium">
              <ArrowLeft className="w-4 h-4" /> Về trang chủ
            </Link>
          </motion.div>
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-xl overflow-hidden"
          >
            {/* Cover Banner */}
            <div className={`h-40 bg-gradient-to-r ${getRoleColor()} relative`}>
              <div className="absolute inset-0 opacity-10">
                <div className="w-full h-full" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            {/* Avatar & Basic Info */}
            <div className="relative px-8 pb-8">
              <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16">
                {/* Avatar */}
                <div className="relative group">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#8B4513] to-[#D4AF37] flex items-center justify-center text-white text-5xl font-bold shadow-2xl border-4 border-white">
                    {getInitial()}
                  </div>
                  <button className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-[#8B4513] transition-colors opacity-0 group-hover:opacity-100">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                {/* Name & Role */}
                <div className="flex-1 pb-2">
                  <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r ${getRoleColor()} text-white`}>
                      <Shield className="w-3 h-3" />
                      {getRoleName()}
                    </span>
                    <span className="text-sm text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Tham gia từ {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'Tháng 6, 2026'}
                    </span>
                  </div>
                </div>
                {/* Edit Button */}
                <div>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2.5 bg-[#8B4513] text-white rounded-xl font-medium hover:bg-[#A0522D] transition-all shadow-lg shadow-[#8B4513]/20 hover:shadow-xl hover:-translate-y-0.5"
                    >
                      Chỉnh sửa
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-5 py-2.5 border border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-all"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/20"
                      >
                        <Save className="w-4 h-4" /> Lưu
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Info Cards */}
            <div className="px-8 pb-10">
              <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-[#8B4513]" />
                Thông tin cá nhân
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Họ và tên</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium text-lg flex items-center gap-2">
                      <User className="w-4 h-4 text-[#8B4513]" />
                      {user.name}
                    </p>
                  )}
                </div>
                {/* Email */}
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Email</label>
                  <p className="text-gray-800 font-medium text-lg flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#8B4513]" />
                    {user.email}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Email không thể thay đổi</p>
                </div>
                {/* Phone */}
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Số điện thoại</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
                      placeholder="Nhập số điện thoại"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium text-lg flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#8B4513]" />
                      {user.phone || 'Chưa cập nhật'}
                    </p>
                  )}
                </div>
                {/* Role */}
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Vai trò</label>
                  <p className="text-gray-800 font-medium text-lg flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#8B4513]" />
                    {getRoleName()}
                  </p>
                </div>
              </div>
            </div>
            {/* Quick Links */}
            <div className="px-8 pb-10">
              <h2 className="text-lg font-bold text-gray-800 mb-6">Truy cập nhanh</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <Link href="/bookings" className="group p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 hover:border-blue-200 transition-all hover:shadow-lg hover:-translate-y-1">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-800">Lịch sử đặt phòng</h3>
                  <p className="text-sm text-gray-500 mt-1">Xem các đơn đặt phòng</p>
                </Link>
                <Link href="/#homestays" className="group p-5 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-100 hover:border-emerald-200 transition-all hover:shadow-lg hover:-translate-y-1">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-emerald-200 transition-colors">
                    <MapPin className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-gray-800">Khám phá Homestay</h3>
                  <p className="text-sm text-gray-500 mt-1">Tìm nơi lưu trú lý tưởng</p>
                </Link>
                <Link href="/#promotions" className="group p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100 hover:border-amber-200 transition-all hover:shadow-lg hover:-translate-y-1">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-amber-200 transition-colors">
                    <span className="text-2xl">🎁</span>
                  </div>
                  <h3 className="font-bold text-gray-800">Khuyến mãi</h3>
                  <p className="text-sm text-gray-500 mt-1">Ưu đãi đặc biệt cho bạn</p>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <NotificationModal
        isOpen={modal.isOpen}
        onClose={() => setModal(prev => ({ ...prev, isOpen: false }))}
        type={modal.type}
        title={modal.title}
        message={modal.message}
      />
    </>
  );
}
