"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, LayoutDashboard, CalendarCheck, ChevronDown, Mail, Phone, Shield, Calendar, MapPin, Users, Save, XCircle, Bell, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import ConfirmModal from '@/components/ConfirmModal';
import SlidePanel from '@/components/SlidePanel';
import NotificationModal, { ModalType } from '@/components/NotificationModal';
import { useNotification } from '@/components/NotificationProvider';
import axiosClient from '@/lib/axiosClient';
interface UserData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  createdAt?: string;
}
// Removed mockBookings
const statusConfig: Record<string, { label: string; color: string; bgColor: string; stripe: string }> = {
  PENDING: { label: 'Chờ xác nhận', color: 'text-amber-700', bgColor: 'bg-amber-50 border-amber-200', stripe: 'bg-amber-500' },
  CONFIRMED: { label: 'Đã xác nhận', color: 'text-blue-700', bgColor: 'bg-blue-50 border-blue-200', stripe: 'bg-blue-500' },
  COMPLETED: { label: 'Hoàn thành', color: 'text-emerald-700', bgColor: 'bg-emerald-50 border-emerald-200', stripe: 'bg-emerald-500' },
  CANCELLED: { label: 'Đã hủy', color: 'text-red-600', bgColor: 'bg-red-50 border-red-200', stripe: 'bg-red-400' },
};
type AccountTab = 'profile' | 'bookings';
export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  const { notifications, unreadCount, markAsRead } = useNotification();
  // Modal & panel states
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AccountTab>('profile');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [userBookings, setUserBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', phone: '' });
  const [notification, setNotification] = useState<{ isOpen: boolean; type: ModalType; title?: string; message: string }>({
    isOpen: false, type: 'success', message: ''
  });
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setProfileForm({ name: parsed.name || '', phone: parsed.phone || '' });
      } catch { setUser(null); }
    }
  }, []);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const handleLogout = () => {
    Cookies.remove('token');
    localStorage.removeItem('user');
    setUser(null);
    setDropdownOpen(false);
    setNotification({ isOpen: true, type: 'success', title: 'Đăng xuất thành công!', message: 'Hẹn gặp lại bạn lần sau. Chúc bạn có một ngày tuyệt vời!' });
  };
  const handleSaveProfile = () => {
    if (!user) return;
    const updatedUser = { ...user, name: profileForm.name, phone: profileForm.phone };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditingProfile(false);
    setNotification({ isOpen: true, type: 'success', title: 'Cập nhật thành công!', message: 'Thông tin cá nhân đã được lưu lại.' });
  };
  const openAccountModal = (tab: AccountTab = 'profile') => {
    setActiveTab(tab);
    setAccountModalOpen(true);
    if (tab === 'bookings' && user) {
      fetchUserBookings();
    }
  };
  const fetchUserBookings = async () => {
    if (!user) return;
    setLoadingBookings(true);
    try {
      const res = await axiosClient.get(`/user/${user.id}/bookings`);
      setUserBookings(res.data);
    } catch (error) {
      console.error('Lỗi khi tải lịch sử booking', error);
    } finally {
      setLoadingBookings(false);
    }
  };
  const openLogoutConfirm = () => { setDropdownOpen(false); setLogoutConfirmOpen(true); };
  const getDashboardLink = () => {
    if (user?.role === 'ADMIN') return '/admin';
    if (user?.role === 'HOST') return '/host';
    return '/';
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
  const formatPrice = (p: number) => new Intl.NumberFormat('vi-VN').format(p) + ' ₫';
  const formatDate = (d: string) => new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const getNights = (ci: string, co: string) => Math.ceil((new Date(co).getTime() - new Date(ci).getTime()) / (1000 * 60 * 60 * 24));
  const navLinks = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Homestay', href: '#homestays' },
    { name: 'Địa điểm', href: '#destinations' },
    { name: 'Khuyến mãi', href: '#promotions' },
    { name: 'Liên hệ', href: '#footer' },
  ];
  // ===== PROFILE TAB CONTENT =====
  const renderProfileTab = () => (
    <div className="flex flex-col">
      {/* Profile Header */}
      <div className={`px-6 py-8 bg-gradient-to-r ${getRoleColor()} relative`}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.3\'%3E%3Cpath d=\'M20 20h20v20H20z\'/%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="relative flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-white text-3xl font-bold border-2 border-white/30 shadow-xl">
            {getInitial()}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{user?.name}</h3>
            <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur">
              {getRoleName()}
            </span>
          </div>
        </div>
      </div>
      {/* Profile Info */}
      <div className="px-6 py-6 space-y-4">
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Họ và tên</label>
          {isEditingProfile ? (
            <input type="text" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" />
          ) : (
            <p className="text-gray-800 font-medium flex items-center gap-2"><User className="w-4 h-4 text-[#8B4513]" />{user?.name}</p>
          )}
        </div>
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Email</label>
          <p className="text-gray-800 font-medium flex items-center gap-2"><Mail className="w-4 h-4 text-[#8B4513]" />{user?.email}</p>
          {isEditingProfile && <p className="text-xs text-gray-400 mt-1">Email không thể thay đổi</p>}
        </div>
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Số điện thoại</label>
          {isEditingProfile ? (
            <input type="text" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} placeholder="Nhập số điện thoại" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" />
          ) : (
            <p className="text-gray-800 font-medium flex items-center gap-2"><Phone className="w-4 h-4 text-[#8B4513]" />{user?.phone || 'Chưa cập nhật'}</p>
          )}
        </div>
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Vai trò</label>
          <p className="text-gray-800 font-medium flex items-center gap-2"><Shield className="w-4 h-4 text-[#8B4513]" />{getRoleName()}</p>
        </div>
      </div>
      {/* Footer Buttons */}
      <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
        {!isEditingProfile ? (
          <button onClick={() => setIsEditingProfile(true)} className="w-full py-3 bg-[#8B4513] text-white rounded-xl font-medium hover:bg-[#A0522D] transition-all shadow-lg shadow-[#8B4513]/20">
            Chỉnh sửa thông tin
          </button>
        ) : (
          <div className="flex gap-3">
            <button onClick={() => setIsEditingProfile(false)} className="flex-1 py-3 border border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-100 transition-all">Hủy</button>
            <button onClick={handleSaveProfile} className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20">
              <Save className="w-4 h-4" /> Lưu
            </button>
          </div>
        )}
      </div>
    </div>
  );
  // ===== BOOKINGS TAB CONTENT =====
  const handleCancelBooking = (bookingId: string) => {
    setNotification({ isOpen: true, type: 'success', title: 'Hủy thành công!', message: `Đơn đặt phòng ${bookingId} đã được hủy. Tiền sẽ được hoàn lại trong 3-5 ngày làm việc.` });
  };
  const [cancelConfirmId, setCancelConfirmId] = useState<string | null>(null);
  const renderBookingsTab = () => (
    <div className="p-6 space-y-4">
      {loadingBookings ? (
        <div className="text-center py-8 text-gray-500">Đang tải lịch sử đặt phòng...</div>
      ) : userBookings.length > 0 ? userBookings.map((booking) => {
        const status = statusConfig[booking.status] || statusConfig['PENDING'];
        const nights = getNights(booking.checkIn, booking.checkOut);
        return (
          <div key={booking.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-all">
            <div className={`h-1 ${status.stripe}`} />
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{booking.id.substring(0,8)}</span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${status.bgColor} ${status.color}`}>{status.label}</span>
              </div>
              <h4 className="font-bold text-gray-800 text-lg">{booking.room?.homestay?.name || 'Homestay'}</h4>
              <p className="text-sm text-gray-500 mt-0.5">{booking.room?.name || 'Phòng'}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-3">
                <MapPin className="w-3.5 h-3.5 text-[#8B4513]" />{booking.room?.homestay?.address || 'Địa chỉ'}
              </div>
              <div className="mt-4 bg-gray-50 rounded-lg p-3 grid grid-cols-3 gap-3 text-center text-sm">
                <div><p className="text-gray-400 text-xs">Nhận phòng</p><p className="font-semibold text-gray-700">{formatDate(booking.checkIn)}</p></div>
                <div><p className="text-gray-400 text-xs">Trả phòng</p><p className="font-semibold text-gray-700">{formatDate(booking.checkOut)}</p></div>
                <div><p className="text-gray-400 text-xs">Số đêm</p><p className="font-semibold text-gray-700">{nights} đêm</p></div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1 text-sm text-gray-500"><Users className="w-3.5 h-3.5" /> {booking.guests} khách</div>
                <p className="text-xl font-bold text-[#8B4513]">{formatPrice(booking.totalPrice)}</p>
              </div>
              {/* === ACTION BUTTONS === */}
              <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-100">
                {booking.status === 'PENDING' && (
                  <button
                    onClick={() => setCancelConfirmId(booking.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors border border-red-100"
                  >
                    <XCircle className="w-4 h-4" /> Hủy đặt phòng
                  </button>
                )}
                {booking.status === 'PENDING' && (
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100">
                    <Phone className="w-4 h-4" /> Liên hệ chủ nhà
                  </button>
                )}
                {booking.status === 'CONFIRMED' && (
                  <>
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors border border-emerald-100">
                      <MapPin className="w-4 h-4" /> Xem chỉ đường
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100">
                      <Phone className="w-4 h-4" /> Liên hệ chủ nhà
                    </button>
                  </>
                )}
                {booking.status === 'COMPLETED' && (
                  <>
                    <button
                      onClick={() => setNotification({ isOpen: true, type: 'info', title: 'Tính năng đang phát triển', message: 'Chức năng đánh giá sẽ sớm được cập nhật. Cảm ơn bạn đã kiên nhẫn!' })}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium text-[#D4AF37] bg-[#D4AF37]/10 rounded-lg hover:bg-[#D4AF37]/20 transition-colors border border-[#D4AF37]/20"
                    >
                      ⭐ Viết đánh giá
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium text-[#8B4513] bg-[#8B4513]/10 rounded-lg hover:bg-[#8B4513]/20 transition-colors border border-[#8B4513]/20">
                      🔄 Đặt lại
                    </button>
                  </>
                )}
                {booking.status === 'CANCELLED' && (
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium text-[#8B4513] bg-[#8B4513]/10 rounded-lg hover:bg-[#8B4513]/20 transition-colors border border-[#8B4513]/20">
                    🔄 Đặt lại phòng này
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      }) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <CalendarCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h4 className="font-semibold text-gray-700">Chưa có đặt phòng nào</h4>
          <p className="text-sm text-gray-500 mt-1">Bạn chưa thực hiện chuyến đi nào cùng chúng tôi.</p>
          <button onClick={() => setAccountModalOpen(false)} className="mt-4 px-5 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">Khám phá ngay</button>
        </div>
      )}
    </div>
  );
  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3 text-gray-800' : 'bg-transparent py-5 text-white'}`}>
        <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
          <Link href="/"><h1 className="text-2xl font-serif font-bold tracking-wider cursor-pointer">Hue <span className="text-hue-gold">Homestay</span></h1></Link>
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className={`font-medium hover:text-hue-gold transition-colors ${isScrolled ? 'text-gray-700' : 'text-white/90'}`}>{link.name}</Link>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-2">
                {/* Notification Bell */}
                <div className="relative" ref={notifRef}>
                  <button 
                    onClick={() => setNotifDropdownOpen(!notifDropdownOpen)} 
                    className={`relative p-2 rounded-full transition-all ${isScrolled ? 'text-gray-600 hover:bg-gray-100' : 'text-white/90 hover:bg-white/10'}`}
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                    )}
                  </button>
                  <AnimatePresence>
                    {notifDropdownOpen && (
                      <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }} transition={{ duration: 0.15 }} className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                        <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                          <h4 className="font-semibold text-gray-800">Thông báo</h4>
                          {unreadCount > 0 && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">{unreadCount} mới</span>}
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="p-6 text-center text-gray-500 text-sm">Chưa có thông báo nào</div>
                          ) : (
                            notifications.map((n) => (
                              <div key={n.id} onClick={() => !n.read && markAsRead(n.id)} className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition cursor-pointer flex gap-3 ${!n.read ? 'bg-blue-50/30' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${n.type === 'SUCCESS' ? 'bg-emerald-100 text-emerald-600' : n.type === 'WARNING' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                                  <Bell className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                  <p className={`text-sm ${!n.read ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>{n.title}</p>
                                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                                </div>
                                {!n.read && <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />}
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setDropdownOpen(!dropdownOpen)} className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-all ${isScrolled ? 'border-gray-200 hover:border-gray-300 hover:shadow-md' : 'border-white/30 hover:border-white/60 hover:bg-white/10'}`}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8B4513] to-[#D4AF37] flex items-center justify-center text-white text-sm font-bold shadow-inner">{getInitial()}</div>
                    <span className={`text-sm font-medium max-w-[120px] truncate ${isScrolled ? 'text-gray-700' : 'text-white'}`}>{user.name}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''} ${isScrolled ? 'text-gray-500' : 'text-white/70'}`} />
                  </button>
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }} transition={{ duration: 0.15 }} className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                      <div className="px-5 py-4 bg-gradient-to-r from-[#8B4513]/5 to-[#D4AF37]/5 border-b border-gray-100">
                        <p className="font-semibold text-gray-800 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#D4AF37]/10 text-[#8B4513]">{getRoleName()}</span>
                      </div>
                      <div className="py-2">
                        {(user.role === 'ADMIN' || user.role === 'HOST') && (
                          <Link href={getDashboardLink()} onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                            <LayoutDashboard className="w-4 h-4 text-[#8B4513]" />{user.role === 'ADMIN' ? 'Trang Quản trị' : 'Quản lý Homestay'}
                          </Link>
                        )}
                        <button onClick={() => openAccountModal('profile')} className="w-full flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          <User className="w-4 h-4 text-[#8B4513]" /> Tài khoản của tôi
                        </button>
                        <button onClick={() => openAccountModal('bookings')} className="w-full flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          <CalendarCheck className="w-4 h-4 text-[#8B4513]" /> Lịch sử đặt phòng
                        </button>
                      </div>
                      <div className="border-t border-gray-100 py-2">
                        <button onClick={openLogoutConfirm} className="w-full flex items-center gap-3 px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors">
                          <LogOut className="w-4 h-4" /> Đăng xuất
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                </div>
              </div>
            ) : (
              <>
                <Link href="/login" className={`font-medium hover:text-hue-gold transition-colors ${isScrolled ? 'text-gray-700' : 'text-white'}`}>Đăng nhập</Link>
                <Link href="/register" className="bg-gradient-to-r from-hue-red to-hue-red-dark text-white px-5 py-2 rounded-full font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all">Đăng ký</Link>
              </>
            )}
          </div>
          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {/* Mobile Nav */}
        <motion.div initial={false} animate={{ height: mobileMenuOpen ? 'auto' : 0, opacity: mobileMenuOpen ? 1 : 0 }} className="md:hidden overflow-hidden bg-white text-gray-800">
          <div className="flex flex-col px-4 py-6 space-y-4 shadow-lg">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className="font-medium hover:text-hue-gold transition-colors border-b border-gray-100 pb-2">{link.name}</Link>
            ))}
            <div className="flex flex-col gap-3 pt-4">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B4513] to-[#D4AF37] flex items-center justify-center text-white font-bold">{getInitial()}</div>
                    <div><p className="font-semibold text-gray-800 text-sm">{user.name}</p><p className="text-xs text-gray-500">{getRoleName()}</p></div>
                  </div>
                  <button onClick={() => { setMobileMenuOpen(false); openAccountModal('profile'); }} className="text-center font-medium py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700">Tài khoản của tôi</button>
                  <button onClick={() => { setMobileMenuOpen(false); openAccountModal('bookings'); }} className="text-center font-medium py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700">Lịch sử đặt phòng</button>
                  <button onClick={() => { setMobileMenuOpen(false); openLogoutConfirm(); }} className="text-center font-medium py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100">Đăng xuất</button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-center font-medium py-2 rounded-lg bg-gray-100 hover:bg-gray-200">Đăng nhập</Link>
                  <Link href="/register" className="text-center bg-gradient-to-r from-hue-red to-hue-red-dark text-white px-5 py-2 rounded-lg font-medium">Đăng ký</Link>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </header>
      {/* ===== LOGOUT CONFIRM ===== */}
      <ConfirmModal
        isOpen={logoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
        onConfirm={handleLogout}
        title="Đăng xuất?"
        message="Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không?"
        confirmText="Đăng xuất"
        cancelText="Ở lại"
        danger
      />
      {/* ===== ACCOUNT MODAL (Profile + Bookings TABS) ===== */}
      <SlidePanel
        isOpen={accountModalOpen}
        onClose={() => { setAccountModalOpen(false); setIsEditingProfile(false); }}
        title="Tài khoản"
      >
        {user && (
          <div className="flex flex-col h-full">
            {/* Tab Switcher */}
            <div className="flex border-b border-gray-100 px-6 bg-white sticky top-0 z-10">
              <button
                onClick={() => { setActiveTab('profile'); setIsEditingProfile(false); }}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold border-b-2 transition-all ${
                  activeTab === 'profile'
                    ? 'border-[#8B4513] text-[#8B4513]'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                <User className="w-4 h-4" /> Thông tin cá nhân
              </button>
              <button
                onClick={() => openAccountModal('bookings')}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold border-b-2 transition-all ${
                  activeTab === 'bookings'
                    ? 'border-[#8B4513] text-[#8B4513]'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                <CalendarCheck className="w-4 h-4" /> Lịch sử đặt phòng
                {userBookings.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#8B4513]/10 text-[#8B4513]">{userBookings.length}</span>
                )}
              </button>
            </div>
            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'profile' ? renderProfileTab() : renderBookingsTab()}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </SlidePanel>
      {/* ===== CANCEL BOOKING CONFIRM ===== */}
      <ConfirmModal
        isOpen={cancelConfirmId !== null}
        onClose={() => setCancelConfirmId(null)}
        onConfirm={() => { if (cancelConfirmId) handleCancelBooking(cancelConfirmId); setCancelConfirmId(null); }}
        title="Hủy đặt phòng?"
        message="Bạn có chắc chắn muốn hủy đơn đặt phòng này? Tiền sẽ được hoàn lại trong 3-5 ngày làm việc."
        confirmText="Xác nhận hủy"
        cancelText="Giữ lại"
        danger
      />
      {/* ===== NOTIFICATION ===== */}
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />
    </>
  );
}
