"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Calendar, Users, Loader } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
export default function Hero() {
  const [location, setLocation] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  
  const [guests, setGuests] = useState(1);
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const guestRef = useRef<HTMLDivElement>(null);
  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      if (guestRef.current && !guestRef.current.contains(event.target as Node)) {
        setShowGuestDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  // Fetch location suggestions from OpenStreetMap
  useEffect(() => {
    if (location.length < 2) {
      setSuggestions([]);
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
      setLoadingSuggestions(true);
      try {
        const res = await axios.get(`https://nominatim.openstreetmap.org/search?q=${location}+Huế&format=json&limit=5`);
        setSuggestions(res.data);
      } catch (error) {
        console.error('Lỗi khi tìm địa điểm', error);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [location]);
  const handleSearch = () => {
    const section = document.getElementById('homestays');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <section className="relative h-screen flex items-center justify-center pt-20">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/images/bg-hue.png)' }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 drop-shadow-lg"
        >
          Khám phá vẻ đẹp Huế <br className="hidden md:block"/> 
          cùng Homestay lý tưởng
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto font-medium drop-shadow-md"
        >
          Đặt phòng nhanh chóng, giá tốt, trải nghiệm văn hóa cố đô Huế một cách chân thực nhất.
        </motion.p>
        {/* Search Bar - Glassmorphism */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="glass max-w-5xl mx-auto p-4 rounded-3xl md:rounded-full"
        >
          <div className="flex flex-col md:flex-row gap-4 md:gap-2 items-center">
            
            {/* Location Input */}
            <div ref={searchRef} className="flex-1 w-full relative">
              <div 
                className="flex items-center gap-3 bg-white/20 px-6 py-4 rounded-full border border-white/20 hover:bg-white/30 transition-colors cursor-text"
                onClick={() => setShowSuggestions(true)}
              >
                <MapPin className="text-hue-gold w-6 h-6 flex-shrink-0" />
                <div className="text-left w-full">
                  <p className="text-xs font-semibold text-white/80 uppercase tracking-wider">Địa điểm</p>
                  <input 
                    type="text" 
                    placeholder="Bạn muốn đến đâu?" 
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      setShowSuggestions(true);
                    }}
                    className="bg-transparent border-none text-white placeholder-white/60 focus:outline-none w-full font-medium" 
                  />
                </div>
              </div>
              
              {/* Suggestions Dropdown */}
              <AnimatePresence>
                {showSuggestions && location.length >= 2 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-full bg-white rounded-2xl shadow-xl overflow-hidden z-50 text-left border border-gray-100"
                  >
                    {loadingSuggestions ? (
                      <div className="p-4 text-center text-gray-500 flex items-center justify-center gap-2">
                        <Loader className="w-4 h-4 animate-spin" /> Đang tìm kiếm...
                      </div>
                    ) : suggestions.length > 0 ? (
                      <ul className="py-2">
                        {suggestions.map((s: any) => (
                          <li 
                            key={s.place_id} 
                            onClick={() => {
                              setLocation(s.display_name.split(',')[0]);
                              setShowSuggestions(false);
                            }}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-start gap-3 border-b border-gray-50 last:border-0"
                          >
                            <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-semibold text-gray-800">{s.display_name.split(',')[0]}</p>
                              <p className="text-xs text-gray-500 truncate max-w-[250px]">{s.display_name}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="p-4 text-center text-gray-500 text-sm">Không tìm thấy địa điểm</div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* Date Inputs */}
            <div className="flex-1 w-full flex items-center gap-3 bg-white/20 px-6 py-4 rounded-full border border-white/20 hover:bg-white/30 transition-colors">
              <Calendar className="text-hue-gold w-6 h-6 flex-shrink-0" />
              <div className="text-left w-full flex gap-2">
                <div className="flex-1">
                  <p className="text-[10px] font-semibold text-white/80 uppercase tracking-wider mb-0.5">Nhận phòng</p>
                  <input 
                    type="date" 
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="bg-transparent border-none text-white focus:outline-none w-full text-sm font-medium [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert cursor-pointer" 
                  />
                </div>
                <div className="w-[1px] bg-white/20"></div>
                <div className="flex-1 pl-2">
                  <p className="text-[10px] font-semibold text-white/80 uppercase tracking-wider mb-0.5">Trả phòng</p>
                  <input 
                    type="date" 
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn || new Date().toISOString().split('T')[0]}
                    className="bg-transparent border-none text-white focus:outline-none w-full text-sm font-medium [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert cursor-pointer" 
                  />
                </div>
              </div>
            </div>
            {/* Guests Input */}
            <div ref={guestRef} className="flex-1 w-full relative">
              <div 
                className="flex items-center gap-3 bg-white/20 px-6 py-4 rounded-full border border-white/20 hover:bg-white/30 transition-colors cursor-pointer h-full"
                onClick={() => setShowGuestDropdown(!showGuestDropdown)}
              >
                <Users className="text-hue-gold w-6 h-6 flex-shrink-0" />
                <div className="text-left w-full">
                  <p className="text-xs font-semibold text-white/80 uppercase tracking-wider">Khách</p>
                  <p className="text-white font-medium">{guests} khách</p>
                </div>
              </div>
              
              <AnimatePresence>
                {showGuestDropdown && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-full bg-white rounded-2xl shadow-xl p-4 z-50 text-left border border-gray-100"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-800">Số lượng khách</p>
                        <p className="text-xs text-gray-500">Từ 1 tuổi trở lên</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => setGuests(Math.max(1, guests - 1))}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-gray-800 hover:text-gray-800 transition"
                        >
                          -
                        </button>
                        <span className="w-4 text-center font-semibold text-gray-800">{guests}</span>
                        <button 
                          onClick={() => setGuests(guests + 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-gray-800 hover:text-gray-800 transition"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button onClick={handleSearch} className="w-full md:w-auto bg-gradient-to-r from-hue-red to-hue-red-dark hover:from-hue-red-dark hover:to-hue-red text-white p-4 md:px-8 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center justify-center gap-2 flex-shrink-0">
              <Search className="w-5 h-5" />
              <span className="font-semibold text-lg md:hidden">Tìm kiếm</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
