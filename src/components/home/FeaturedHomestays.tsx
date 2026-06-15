"use client";
import React, { useState, useEffect } from 'react';
import { Star, MapPin, Wifi, Car, Coffee, Wind, Tv, Bath, X, Calendar, Users, ChevronLeft, ChevronRight, Heart, Share2, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SlidePanel from '@/components/SlidePanel';
import NotificationModal, { ModalType } from '@/components/NotificationModal';
import axiosClient from '@/lib/axiosClient';
// Mảng tiện nghi mặc định cho UI
const defaultAmenities = ['wifi', 'parking', 'ac', 'tv', 'bathroom'];
const getAmenityIcon = (name: string) => {
  switch (name) {
    case 'wifi': return <Wifi className="w-4 h-4" />;
    case 'parking': return <Car className="w-4 h-4" />;
    case 'ac': return <Wind className="w-4 h-4" />;
    case 'tv': return <Tv className="w-4 h-4" />;
    case 'bathroom': return <Bath className="w-4 h-4" />;
    default: return <CheckCircle className="w-4 h-4" />;
  }
};
const formatPrice = (p: number) => new Intl.NumberFormat('vi-VN').format(p) + ' ₫';
export default function FeaturedHomestays() {
  const [homestays, setHomestays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // States
  const [selectedHomestay, setSelectedHomestay] = useState<any | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // Booking states
  const [bookingModal, setBookingModal] = useState<any | null>(null);
  const [bookingForm, setBookingForm] = useState({
    homestayId: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    name: '',
    phone: '',
    note: '',
  });
  const [notification, setNotification] = useState<{ isOpen: boolean; type: ModalType; title?: string; message: string }>({ isOpen: false, type: 'success', message: '' });
  useEffect(() => {
    const fetchHomestays = async () => {
      try {
        const res = await axiosClient.get('/public/homestays');
        setHomestays(res.data);
      } catch (error) {
        console.error('Error fetching homestays', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomestays();
  }, []);
  const openHomestayDetails = (hs: any) => {
    setSelectedHomestay(hs);
    setCurrentImageIndex(0);
  };
  const openBooking = (hs: any) => {
    setBookingModal(hs);
    setBookingForm({ homestayId: hs.id, checkIn: '', checkOut: '', guests: 1, name: '', phone: '', note: '' });
  };
  const handleBookingSubmit = async () => {
    if (!bookingForm.checkIn || !bookingForm.checkOut || !bookingForm.name || !bookingForm.phone) {
      setNotification({ isOpen: true, type: 'warning', title: 'Thiếu thông tin', message: 'Vui lòng điền đầy đủ thông tin ngày nhận/trả và liên hệ.' });
      return;
    }

    if (!bookingForm.homestayId) {
      setNotification({ isOpen: true, type: 'warning', title: 'Lỗi', message: 'Không thể xác định Homestay đang chọn.' });
      return;
    }

    try {
      await axiosClient.post('/public/bookings', bookingForm);
      setBookingModal(null);
      setNotification({ isOpen: true, type: 'success', title: 'Đặt phòng thành công!', message: 'Đơn đặt phòng của bạn đã được gửi trực tiếp đến chủ nhà.' });
    } catch (error) {
      console.error('Lỗi khi đặt phòng:', error);
      setNotification({ isOpen: true, type: 'warning', title: 'Lỗi', message: 'Đã xảy ra lỗi khi đặt phòng. Vui lòng thử lại sau.' });
    }
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getNights = () => {
    if (!bookingForm.checkIn || !bookingForm.checkOut) return 0;
    const start = new Date(bookingForm.checkIn);
    const end = new Date(bookingForm.checkOut);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };


  return (
    <>
      <section id="homestays" className="py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Homestay nổi bật</h2>
              <p className="text-gray-600 max-w-2xl">Những chỗ nghỉ được đánh giá cao nhất bởi hàng ngàn du khách với tiện nghi hiện đại và không gian đậm chất Huế.</p>
            </div>
          </div>
          {loading ? (
            <div className="text-center py-20 text-gray-500">Đang tải danh sách Homestay...</div>
          ) : homestays.length === 0 ? (
            <div className="text-center py-20 text-gray-500 bg-gray-50 rounded-2xl border border-gray-100">
              <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700">Chưa có Homestay nào</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {homestays.map((homestay, index) => (
                <motion.div
                  key={homestay.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img src={homestay.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80'} alt={homestay.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <Star className="w-4 h-4 text-hue-gold fill-current" />
                      <span className="text-sm font-bold text-gray-800">4.8</span>
                    </div>
                    {homestay.roomStatus === 'Hết phòng' && (
                      <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                        Hết phòng
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{homestay.name}</h3>
                    <div className="flex items-center text-gray-500 text-sm mb-4">
                      <MapPin className="w-4 h-4 mr-1 text-[#8B4513]" />
                      <span className="line-clamp-1">{homestay.address}</span>
                    </div>
                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                      <button onClick={() => openHomestayDetails(homestay)} className="bg-gray-100 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-200">Chi tiết</button>
                      {homestay.roomStatus !== 'Hết phòng' ? (
                        <button onClick={() => openBooking(homestay)} className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#8B4513]">Đặt ngay</button>
                      ) : (
                        <button disabled className="bg-red-50 text-red-500 border border-red-200 px-4 py-2 rounded-xl text-sm font-bold cursor-not-allowed">Hết phòng</button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
      <SlidePanel isOpen={selectedHomestay !== null} onClose={() => setSelectedHomestay(null)} title={selectedHomestay?.name || 'Chi tiết'}>
        {selectedHomestay && (
          <div className="p-6">
            {/* Main Image & Gallery */}
            <div className="mb-6">
              <div className="relative h-64 bg-gray-100 rounded-xl overflow-hidden mb-3">
                <img 
                  src={
                    [selectedHomestay.image, ...(selectedHomestay.images || [])].filter(Boolean)[currentImageIndex] || 
                    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80'
                  } 
                  alt="Homestay" 
                  className="w-full h-full object-cover transition-all duration-500" 
                />
              </div>
              
              {selectedHomestay.images && selectedHomestay.images.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2 snap-x">
                  {[selectedHomestay.image, ...selectedHomestay.images].filter(Boolean).map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all snap-start ${currentImageIndex === idx ? 'border-[#8B4513]' : 'border-transparent hover:border-gray-300'}`}
                    >
                      <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price Info */}
            <div className="mb-6 pb-6 border-b border-gray-100">
              <div className="flex items-end gap-3 mb-3">
                {selectedHomestay.promotionalPrice && selectedHomestay.promotionalPrice < selectedHomestay.price ? (
                  <>
                    <span className="text-2xl font-bold text-[#8B4513]">{formatPrice(selectedHomestay.promotionalPrice)}</span>
                    <span className="text-gray-400 line-through text-sm mb-1">{formatPrice(selectedHomestay.price)}</span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-[#8B4513]">{formatPrice(selectedHomestay.price || 0)}</span>
                )}
                <span className="text-gray-500 text-sm mb-1">/ đêm</span>
              </div>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{selectedHomestay.description || 'Chưa có bài viết mô tả cho Homestay này.'}</p>
            </div>
            <h4 className="font-bold text-gray-800 text-lg mb-4">Tiện nghi có sẵn</h4>
            <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-8">
              {defaultAmenities.map((am) => (
                <div key={am} className="flex items-center gap-2 text-gray-600">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-[#8B4513]">{getAmenityIcon(am)}</div>
                  <span className="text-sm capitalize">{am}</span>
                </div>
              ))}
            </div>
            {selectedHomestay.roomStatus !== 'Hết phòng' ? (
              <button onClick={() => { setSelectedHomestay(null); openBooking(selectedHomestay); }} className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-[#8B4513] transition">Đặt phòng ngay</button>
            ) : (
              <div className="w-full py-3 bg-red-50 text-red-600 border border-red-200 rounded-xl font-bold text-center flex flex-col items-center justify-center">
                <span>Đã hết phòng</span>
                <span className="text-xs font-normal mt-0.5">Vui lòng liên hệ chủ nhà để biết thêm thông tin.</span>
              </div>
            )}
          </div>
        )}
      </SlidePanel>
      <SlidePanel isOpen={bookingModal !== null} onClose={() => setBookingModal(null)} title="Đặt phòng">
        {bookingModal && (
          <div className="p-6">

            {/* Date Selection */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block flex items-center gap-1.5"><Calendar className="w-4 h-4 text-[#8B4513]" />Nhận phòng</label>
                <input type="date" value={bookingForm.checkIn} onChange={e => setBookingForm({ ...bookingForm, checkIn: e.target.value })} min={new Date().toISOString().split('T')[0]} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block flex items-center gap-1.5"><Calendar className="w-4 h-4 text-[#8B4513]" />Trả phòng</label>
                <input type="date" value={bookingForm.checkOut} onChange={e => setBookingForm({ ...bookingForm, checkOut: e.target.value })} min={bookingForm.checkIn || new Date().toISOString().split('T')[0]} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent" />
              </div>
            </div>
            {/* Guests */}
            <div className="mb-5">
              <label className="text-sm font-semibold text-gray-700 mb-2 block flex items-center gap-1.5"><Users className="w-4 h-4 text-[#8B4513]" />Số khách</label>
              <div className="flex items-center gap-4">
                <button onClick={() => setBookingForm({ ...bookingForm, guests: Math.max(1, bookingForm.guests - 1) })} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 text-xl font-bold">−</button>
                <span className="text-xl font-bold text-gray-800 w-8 text-center">{bookingForm.guests}</span>
                <button onClick={() => setBookingForm({ ...bookingForm, guests: Math.min(10, bookingForm.guests + 1) })} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 text-xl font-bold">+</button>
                <span className="text-sm text-gray-400">/ tối đa 10 khách</span>
              </div>
            </div>
            {/* Contact Info */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Họ và tên</label>
                <input type="text" value={bookingForm.name} onChange={e => setBookingForm({ ...bookingForm, name: e.target.value })} placeholder="Nguyễn Văn A" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Số điện thoại</label>
                <input type="text" value={bookingForm.phone} onChange={e => setBookingForm({ ...bookingForm, phone: e.target.value })} placeholder="0901 234 567" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent" />
              </div>
            </div>
            {/* Note */}
            <div className="mb-6">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Ghi chú (tùy chọn)</label>
              <textarea rows={2} value={bookingForm.note} onChange={e => setBookingForm({ ...bookingForm, note: e.target.value })} placeholder="Yêu cầu đặc biệt, giờ nhận phòng..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent resize-none" />
            </div>
            {/* Price Summary */}
            {bookingModal && getNights() > 0 && (
              <div className="bg-gradient-to-r from-[#8B4513]/5 to-[#D4AF37]/5 rounded-xl p-5 mb-6 border border-[#D4AF37]/20">
                <h4 className="font-bold text-gray-800 mb-3">Chi tiết giá</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>{bookingModal.name} × {getNights()} đêm</span>
                    <span>{formatPrice((bookingModal.promotionalPrice || bookingModal.price || 0) * getNights())}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Phí dịch vụ</span>
                    <span>{formatPrice(50000)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg text-[#8B4513] pt-3 border-t border-[#D4AF37]/20">
                    <span>Tổng cộng</span>
                    <span>{formatPrice((bookingModal.promotionalPrice || bookingModal.price || 0) * getNights() + 50000)}</span>
                  </div>
                </div>
              </div>
            )}
            {/* Submit */}
            <button onClick={handleBookingSubmit} className="w-full py-3.5 bg-gradient-to-r from-[#8B4513] to-[#A0522D] text-white rounded-xl font-semibold shadow-lg shadow-[#8B4513]/20 hover:shadow-xl hover:-translate-y-0.5 transition-all text-base flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5" /> Xác nhận Đặt phòng
            </button>
            <p className="text-xs text-gray-400 text-center mt-3">Bạn sẽ không bị trừ tiền cho đến khi chủ nhà xác nhận</p>
          </div>
        )}
      </SlidePanel>
      {/* Notification */}
      <NotificationModal isOpen={notification.isOpen} onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))} type={notification.type} title={notification.title} message={notification.message} />
    </>
  );
}
