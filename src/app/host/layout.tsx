"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Home, CalendarCheck, Star, LogOut, Menu, X, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Cookies from 'js-cookie';
import NotificationDropdown from '@/components/NotificationDropdown';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}
export default function HostLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (parsed.role !== 'HOST' && parsed.role !== 'ADMIN') {
        router.push('/');
      } else {
        setUser(parsed);
      }
    } else {
      router.push('/login');
    }
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [router]);
  const handleLogout = () => {
    Cookies.remove('token');
    localStorage.removeItem('user');
    router.push('/');
  };
  const menuItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Tổng quan', href: '/host' },
    { icon: <Home className="w-5 h-5" />, label: 'Quản lý Homestay', href: '/host/homestays' },
    { icon: <CalendarCheck className="w-5 h-5" />, label: 'Đặt phòng', href: '/host/bookings' },
    { icon: <Star className="w-5 h-5" />, label: 'Đánh giá', href: '/host/reviews' },
  ];
  if (!user) return null;
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 0, x: isMobileOpen ? 0 : (isSidebarOpen ? 0 : -260) }}
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden ${isMobileOpen ? 'w-[260px] translate-x-0' : ''}`}
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between min-w-[260px]">
          <div>
            <h1 className="text-2xl font-bold text-[#8B4513] whitespace-nowrap">Hue Host</h1>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">Kênh Chủ nhà</p>
          </div>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden p-2 rounded-lg bg-gray-100 text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto min-w-[260px]">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/host' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#8B4513] to-[#A0522D] text-white shadow-lg shadow-[#8B4513]/20' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-[#8B4513]'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-gray-100 min-w-[260px]">
          <Link href="/" className="flex items-center justify-center w-full py-2.5 border-2 border-gray-200 hover:border-[#8B4513] hover:text-[#8B4513] text-gray-600 rounded-xl transition font-medium mb-3 text-sm">
            Về trang chủ
          </Link>
          <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition font-medium text-sm">
            <LogOut className="w-4 h-4" /> Đăng xuất
          </button>
        </div>
      </motion.aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                if (window.innerWidth < 1024) setMobileOpen(true);
                else setSidebarOpen(!isSidebarOpen);
              }} 
              className="p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-gray-800 hidden sm:block">
              {menuItems.find(m => m.href === pathname || (m.href !== '/host' && pathname.startsWith(m.href)))?.label || 'Bảng điều khiển'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <NotificationDropdown />
            
            <div className="h-8 w-px bg-gray-200"></div>
            
            <div className="flex items-center gap-3">
              <div className="hidden md:block text-right">
                <p className="text-sm font-bold text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-500">Chủ nhà</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B4513] to-[#D4AF37] flex items-center justify-center text-white font-bold shadow-md">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>
        {/* Page Content Scrollable Area */}
        <div className="flex-1 overflow-auto p-6 md:p-8 bg-[#FDFBF7]">
          {children}
        </div>
      </main>
    </div>
  );
}
