package com.huehomestay.backend.service;

import com.huehomestay.backend.dto.AdminDashboardDTO;
import com.huehomestay.backend.entity.Booking;
import com.huehomestay.backend.entity.HomestayStatus;
import com.huehomestay.backend.entity.User;
import com.huehomestay.backend.entity.UserStatus;
import com.huehomestay.backend.repository.BookingRepository;
import com.huehomestay.backend.repository.HomestayRepository;
import com.huehomestay.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.huehomestay.backend.dto.RegisterRequest;
import com.huehomestay.backend.dto.UserUpdateDTO;
import com.huehomestay.backend.entity.Role;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.List;
import java.util.Optional;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HomestayRepository homestayRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public AdminDashboardDTO getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalHomestays = homestayRepository.count();
        
        List<Booking> bookings = bookingRepository.findAll();
        double totalRevenue = bookings.stream().mapToDouble(b -> b.getTotalPrice().doubleValue()).sum();
        
        long pendingHomestays = homestayRepository.findAll().stream()
                .filter(h -> h.getStatus() == HomestayStatus.PENDING)
                .count();

        return AdminDashboardDTO.builder()
                .totalUsers(totalUsers)
                .totalHomestays(totalHomestays)
                .totalRevenue(totalRevenue)
                .pendingHomestays(pendingHomestays)
                .build();
    }

    public boolean toggleUserStatus(String userId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (user.getStatus() == UserStatus.ACTIVE) {
                user.setStatus(UserStatus.BLOCKED);
            } else {
                user.setStatus(UserStatus.ACTIVE);
            }
            userRepository.save(user);
            return true;
        }
        return false;
    }

    public User createUser(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email đã được sử dụng");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.valueOf(request.getRole()))
                .status(UserStatus.ACTIVE)
                .build();
        return userRepository.save(user);
    }

    public User updateUser(String id, UserUpdateDTO request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng"));
        
        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.setRole(Role.valueOf(request.getRole()));
        
        return userRepository.save(user);
    }

    public void deleteUser(String id) {
        try {
            userRepository.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            throw new IllegalStateException("Không thể xóa người dùng này vì đã có dữ liệu liên quan (Homestay, Booking). Vui lòng sử dụng tính năng Khóa (Vô hiệu hóa) thay vì xóa.");
        }
    }
}
