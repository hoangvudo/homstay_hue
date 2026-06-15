"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, MapPin, Star, Eye, CheckCircle, Clock, XCircle, AlertCircle, Save, Upload, Map, Search, LocateFixed, X } from 'lucide-react';
import ConfirmModal from '@/components/ConfirmModal';
import SlidePanel from '@/components/SlidePanel';
import NotificationModal, { ModalType } from '@/components/NotificationModal';
import axiosClient from '@/lib/axiosClient';
import { useRouter } from 'next/navigation';
const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode; cardBorder: string; cardShadow: string }> = {
  'PENDING': { label: 'Chờ duyệt', color: 'text-amber-700', bg: 'bg-amber-100 border-amber-200', icon: <Clock className="w-5 h-5 text-amber-600" />, cardBorder: 'border-amber-400', cardShadow: 'hover:shadow-amber-500/30' },
  'APPROVED': { label: 'Đã duyệt', color: 'text-emerald-700', bg: 'bg-emerald-100 border-emerald-200', icon: <CheckCircle className="w-5 h-5 text-emerald-600" />, cardBorder: 'border-emerald-400', cardShadow: 'hover:shadow-emerald-500/30' },
  'REJECTED': { label: 'Từ chối', color: 'text-red-700', bg: 'bg-red-100 border-red-200', icon: <XCircle className="w-5 h-5 text-red-600" />, cardBorder: 'border-red-400', cardShadow: 'hover:shadow-red-500/30' }
};

const roomStatusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode; cardBorder: string; cardShadow: string }> = {
  'Trống': { label: 'Phòng trống', color: 'text-emerald-700', bg: 'bg-emerald-100 border-emerald-200', icon: <CheckCircle className="w-5 h-5 text-emerald-600" />, cardBorder: 'border-emerald-400', cardShadow: 'hover:shadow-emerald-500/30' },
  'Đang dọn dẹp': { label: 'Đang dọn dẹp', color: 'text-amber-700', bg: 'bg-amber-100 border-amber-200', icon: <Clock className="w-5 h-5 text-amber-600" />, cardBorder: 'border-amber-400', cardShadow: 'hover:shadow-amber-500/30' },
  'Hết phòng': { label: 'Hết phòng', color: 'text-red-700', bg: 'bg-red-100 border-red-200', icon: <XCircle className="w-5 h-5 text-red-600" />, cardBorder: 'border-red-400', cardShadow: 'hover:shadow-red-500/30' },
  'Tạm ngưng': { label: 'Tạm ngưng', color: 'text-gray-700', bg: 'bg-gray-100 border-gray-200', icon: <AlertCircle className="w-5 h-5 text-gray-600" />, cardBorder: 'border-gray-400', cardShadow: 'hover:shadow-gray-500/30' },
};
const defaultForm = { name: '', address: '', description: '', image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&w=400&q=80', images: [] as string[], price: '', promotionalPrice: '', roomStatus: 'Trống' };
export default function HostHomestays() {
  const [homestays, setHomestays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    
    const fetchHomestays = async () => {
      try {
        const res = await axiosClient.get(`/host/${parsedUser.id}/homestays`);
        setHomestays(res.data);
      } catch (error) {
        console.error('Error fetching homestays:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomestays();
  }, [router]);

  const fetchHomestaysAfterAction = async () => {
    if (!user) return;
    try {
      const res = await axiosClient.get(`/host/${user.id}/homestays`);
      setHomestays(res.data);
    } catch (error) {
      console.error('Error fetching homestays:', error);
    }
  };
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState(defaultForm);
  const [showMap, setShowMap] = useState(false);
  const [mapSearch, setMapSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const [isSearchingMap, setIsSearchingMap] = useState(false);
  const [mapCoords, setMapCoords] = useState({ lat: 16.4637, lng: 107.5905 });
  const [notification, setNotification] = useState<{ isOpen: boolean; type: ModalType; title?: string; message: string }>({ isOpen: false, type: 'success', message: '' });
  // Calculate stats
  const stats = {
    'Trống': homestays.filter(h => h.roomStatus === 'Trống' || !h.roomStatus).length,
    'Đang dọn dẹp': homestays.filter(h => h.roomStatus === 'Đang dọn dẹp').length,
    'Hết phòng': homestays.filter(h => h.roomStatus === 'Hết phòng').length,
    'Tạm ngưng': homestays.filter(h => h.roomStatus === 'Tạm ngưng').length,
  };
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({ 
            ...prev, 
            images: [...(prev.images || []), reader.result as string],
            image: prev.image === defaultForm.image ? (reader.result as string) : prev.image // Auto set cover if using default
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => {
      const newImages = [...(prev.images || [])];
      newImages.splice(index, 1);
      return { ...prev, images: newImages, image: newImages.length > 0 ? newImages[0] : '' };
    });
  };
  const handleMapSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setMapSearch(val);
    
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    
    if (val.length > 2) {
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&limit=5&countrycodes=vn`);
          const data = await res.json();
          setSearchResults(data);
        } catch (error) {}
      }, 500);
    } else {
      setSearchResults([]);
    }
  };
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsSearchingMap(true);
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setMapCoords({ lat, lng });
        
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
          const data = await res.json();
          if (data && data.display_name) {
            setMapSearch(data.display_name);
            setFormData({...formData, address: data.display_name});
            setNotification({ isOpen: true, type: 'success', title: 'Đã định vị', message: 'Đã lấy vị trí hiện tại của bạn thành công.' });
          }
        } catch (error) {
          setNotification({ isOpen: true, type: 'warning', title: 'Lỗi', message: 'Không thể lấy địa chỉ từ tọa độ.' });
        } finally {
          setIsSearchingMap(false);
        }
      }, () => {
        setIsSearchingMap(false);
        setNotification({ isOpen: true, type: 'warning', title: 'Lỗi', message: 'Không thể định vị. Vui lòng bật quyền truy cập vị trí.' });
      });
    } else {
      setNotification({ isOpen: true, type: 'warning', title: 'Lỗi', message: 'Trình duyệt của bạn không hỗ trợ định vị.' });
    }
  };
  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData(defaultForm);
    setIsFormOpen(true);
  };
  const handleOpenEdit = (hs: any) => {
    setEditingId(hs.id);
    setFormData({ 
      name: hs.name, 
      address: hs.address, 
      description: hs.description || '', 
      image: hs.image || defaultForm.image,
      images: hs.images || [],
      price: hs.price || '',
      promotionalPrice: hs.promotionalPrice || '',
      roomStatus: hs.roomStatus || 'Trống'
    });
    setIsFormOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.address) {
      setNotification({ isOpen: true, type: 'warning', title: 'Thiếu thông tin', message: 'Vui lòng nhập đầy đủ Tên và Địa chỉ homestay.' });
      return;
    }

    const payload = {
      ...formData,
      price: formData.price ? parseFloat(formData.price as string) : null,
      promotionalPrice: formData.promotionalPrice ? parseFloat(formData.promotionalPrice as string) : null,
    };

    try {
      if (editingId) {
        await axiosClient.put(`/host/homestays/${editingId}`, payload);
        setNotification({ isOpen: true, type: 'success', title: 'Cập nhật thành công', message: 'Thông tin homestay đã được lưu lại.' });
      } else {
        await axiosClient.post('/host/homestays', { ...payload, host: { id: user.id } });
        setNotification({ isOpen: true, type: 'success', title: 'Thêm mới thành công', message: 'Homestay mới đã được thêm vào danh sách.' });
      }
      setIsFormOpen(false);
      fetchHomestaysAfterAction();
    } catch (error) {
      setNotification({ isOpen: true, type: 'error', title: 'Lỗi', message: 'Đã xảy ra lỗi khi lưu Homestay.' });
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await axiosClient.delete(`/host/homestays/${deleteId}`);
        setNotification({ isOpen: true, type: 'success', title: 'Xóa thành công', message: 'Homestay đã được xóa khỏi hệ thống.' });
        fetchHomestaysAfterAction();
      } catch (error) {
        setNotification({ isOpen: true, type: 'error', title: 'Lỗi', message: 'Không thể xóa Homestay.' });
      } finally {
        setDeleteId(null);
      }
    }
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Homestay</h1>
          <p className="text-gray-500 mt-1">Quản lý danh sách nhà và trạng thái phòng</p>
        </div>
        <button onClick={handleOpenAdd} className="flex items-center gap-2 px-5 py-2.5 bg-[#8B4513] text-white rounded-xl font-medium hover:bg-[#A0522D] transition shadow-lg shadow-[#8B4513]/20">
          <Plus className="w-5 h-5" /> Thêm Homestay mới
        </button>
      </div>
      {/* Summary Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(roomStatusConfig).map(([statusKey, config]) => (
          <div key={statusKey} className={`p-4 rounded-xl border shadow-sm flex items-center justify-between ${config.bg}`}>
            <div className="flex items-center gap-3">
              <div className="bg-white/60 p-2 rounded-lg shadow-sm">
                {config.icon}
              </div>
              <span className={`font-semibold ${config.color}`}>{config.label}</span>
            </div>
            <span className={`text-2xl font-bold ${config.color}`}>{stats[statusKey as keyof typeof stats]}</span>
          </div>
        ))}
      </div>
      {/* Homestay Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-10 text-gray-500">Đang tải dữ liệu...</div>
          ) : homestays.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
              <h3 className="text-xl font-bold text-gray-700 mb-2">Chưa có Homestay nào</h3>
              <p className="text-gray-500 mb-6">Bạn chưa thêm Homestay nào vào hệ thống.</p>
              <button onClick={handleOpenAdd} className="px-6 py-2.5 bg-[#8B4513] text-white rounded-lg hover:bg-hue-gold transition-colors inline-flex items-center gap-2">
                <Plus className="w-5 h-5" /> Thêm Homestay đầu tiên
              </button>
            </div>
          ) : (
            homestays.map((homestay) => {
              const config = statusConfig[homestay.status] || statusConfig['PENDING'];
              const rConfig = roomStatusConfig[homestay.roomStatus || 'Trống'];
              return (
                <div key={homestay.id} className={`bg-white rounded-2xl overflow-hidden border-2 ${rConfig.cardBorder} shadow-sm hover:shadow-lg ${rConfig.cardShadow} hover:-translate-y-1 transition-all duration-300 group`}>
                  <div className="h-48 relative overflow-hidden">
                    <img src={homestay.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80'} alt={homestay.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-3 right-3 flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md flex items-center gap-1.5 ${config.bg} ${config.color} border-none bg-white/90`}>
                        <div className={`w-2 h-2 rounded-full ${config.color.replace('text-', 'bg-')}`} />
                        {config.label}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-xl text-gray-800 line-clamp-1 group-hover:text-[#8B4513] transition">{homestay.name}</h3>
                      <div className="flex items-center gap-1 bg-[#D4AF37]/10 px-2 py-0.5 rounded text-sm font-bold text-[#8B4513]">
                        <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" /> {homestay.rating || 5.0}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4">
                      <MapPin className="w-4 h-4" /> {homestay.address}
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className={`font-medium ${rConfig.color} flex items-center gap-1.5`}>
                        {rConfig.icon} {homestay.roomStatus || 'Trống'}
                      </span>
                      
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Xem trước">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleOpenEdit(homestay)} className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition" title="Chỉnh sửa">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteId(homestay.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Xóa">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      {/* ===== FORM MODAL (ADD/EDIT) ===== */}
      <SlidePanel isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingId ? 'Chỉnh sửa Homestay' : 'Thêm Homestay mới'}>
        <div className="p-6 space-y-5">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Tên Homestay <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              placeholder="VD: Hue Riverside Villa" 
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Giá gốc (VNĐ)</label>
              <input 
                type="number" 
                value={formData.price} 
                onChange={e => setFormData({...formData, price: e.target.value})} 
                placeholder="VD: 500000" 
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" 
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Giá khuyến mãi (VNĐ)</label>
              <input 
                type="number" 
                value={formData.promotionalPrice} 
                onChange={e => setFormData({...formData, promotionalPrice: e.target.value})} 
                placeholder="VD: 450000" 
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" 
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Địa chỉ <span className="text-red-500">*</span></label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={formData.address} 
                onChange={e => setFormData({...formData, address: e.target.value})} 
                placeholder="VD: 15 Lê Lợi, TP. Huế" 
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" 
              />
              <button 
                onClick={() => setShowMap(!showMap)}
                className={`p-3 rounded-xl border flex items-center justify-center transition-colors ${showMap ? 'bg-[#8B4513] text-white border-[#8B4513]' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200'}`}
                title="Chọn từ bản đồ"
              >
                <Map className="w-5 h-5" />
              </button>
            </div>
            
            {showMap && (
              <div className="mt-3 p-3 border border-gray-200 rounded-xl bg-gray-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex gap-2 mb-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      value={mapSearch}
                      onChange={handleMapSearchChange}
                      placeholder="Tìm địa điểm (Vd: Cầu Tràng Tiền)..." 
                      className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                    {searchResults.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden z-[100] max-h-60 overflow-y-auto">
                        {searchResults.map((item, idx) => (
                          <div 
                            key={idx}
                            onClick={() => {
                              setMapCoords({ lat: parseFloat(item.lat), lng: parseFloat(item.lon) });
                              setMapSearch(item.display_name);
                              setFormData({...formData, address: item.display_name});
                              setSearchResults([]);
                              setNotification({ isOpen: true, type: 'success', title: 'Đã tìm thấy', message: 'Bản đồ đã chuyển đến vị trí tìm kiếm. Bấm vào bản đồ để ghim.' });
                            }}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-start gap-3 border-b border-gray-100 last:border-0"
                          >
                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-gray-700 line-clamp-2">{item.display_name}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={handleGetCurrentLocation}
                    disabled={isSearchingMap}
                    className="p-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition"
                    title="Sử dụng vị trí hiện tại của tôi"
                  >
                    <LocateFixed className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={async () => {
                      if (!mapSearch.trim()) return;
                      setIsSearchingMap(true);
                      try {
                        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(mapSearch)}`);
                        const data = await res.json();
                        if (data && data.length > 0) {
                          const result = data[0];
                          setMapCoords({
                            lat: parseFloat(result.lat),
                            lng: parseFloat(result.lon)
                          });
                          setMapSearch(result.display_name);
                          setFormData({...formData, address: result.display_name});
                          setNotification({ isOpen: true, type: 'success', title: 'Đã tìm thấy', message: 'Bản đồ đã chuyển đến vị trí tìm kiếm. Bấm vào bản đồ để ghim.' });
                        } else {
                          setNotification({ isOpen: true, type: 'warning', title: 'Không tìm thấy', message: 'Không tìm thấy địa điểm này. Vui lòng thử từ khóa khác.' });
                        }
                      } catch (error) {
                        setNotification({ isOpen: true, type: 'warning', title: 'Lỗi', message: 'Không thể tải dữ liệu bản đồ.' });
                      } finally {
                        setIsSearchingMap(false);
                      }
                    }}
                    disabled={isSearchingMap}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition flex items-center justify-center min-w-[100px]"
                  >
                    {isSearchingMap ? 'Đang tìm...' : 'Tìm kiếm'}
                  </button>
                </div>
                <div className="w-full h-56 bg-gray-200 rounded-lg overflow-hidden relative border border-gray-300">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    scrolling="no" 
                    marginHeight={0} 
                    marginWidth={0} 
                    src={`https://maps.google.com/maps?q=${mapCoords.lat},${mapCoords.lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`} 
                    className={`absolute inset-0 transition-all duration-1000 ${isSearchingMap ? 'opacity-50 blur-sm scale-105' : 'opacity-100 blur-0 scale-100'}`}
                  ></iframe>
                  <div className="absolute inset-0 bg-transparent cursor-crosshair hover:bg-black/5 transition-colors" onClick={() => {
                    setFormData({...formData, address: mapSearch || 'Vị trí đã chọn trên bản đồ'});
                    setShowMap(false);
                    setNotification({ isOpen: true, type: 'success', title: 'Đã ghim vị trí', message: 'Địa chỉ đã được cập nhật từ bản đồ.' });
                  }} title="Bấm vào bản đồ để ghim vị trí"></div>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center flex items-center justify-center gap-1">
                  <MapPin className="w-3 h-3" /> Hoặc bấm trực tiếp vào bản đồ để ghim vị trí
                </p>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Tình trạng phòng</label>
              <select 
                value={formData.roomStatus} 
                onChange={e => setFormData({...formData, roomStatus: e.target.value})} 
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] bg-white"
              >
                {Object.keys(roomStatusConfig).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Thư viện ảnh <span className="text-red-500">*</span></label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 transition relative">
              <input 
                type="file" 
                accept="image/*"
                multiple
                onChange={handleImageUpload} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              />
              <div className="pointer-events-none flex flex-col items-center gap-2 text-gray-500">
                <Upload className="w-6 h-6 text-gray-400" />
                <p className="text-sm">Nhấn để tải nhiều ảnh lên (hoặc kéo thả vào đây)</p>
              </div>
            </div>
            {formData.images && formData.images.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-200">
                    <img src={img} alt={`Preview ${idx}`} className="w-full h-24 object-cover" />
                    <button 
                      onClick={() => handleRemoveImage(idx)} 
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg hover:bg-red-600"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-0.5">Ảnh bìa</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button onClick={handleSave} className="w-full mt-4 py-3.5 bg-gradient-to-r from-[#8B4513] to-[#A0522D] text-white rounded-xl font-semibold shadow-lg shadow-[#8B4513]/20 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
            <Save className="w-5 h-5" /> Lưu thông tin
          </button>
        </div>
      </SlidePanel>
      {/* ===== DELETE CONFIRM ===== */}
      <ConfirmModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Xóa Homestay?"
        message="Bạn có chắc chắn muốn xóa homestay này khỏi hệ thống? Hành động này không thể hoàn tác."
        confirmText="Xóa vĩnh viễn"
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
    </div>
  );
}
