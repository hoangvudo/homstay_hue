package com.huehomestay.backend.controller;

import com.huehomestay.backend.dto.RegisterRequest;
import com.huehomestay.backend.dto.UserUpdateDTO;
import com.huehomestay.backend.entity.HomestayStatus;
import com.huehomestay.backend.entity.User;
import com.huehomestay.backend.repository.HomestayRepository;
import com.huehomestay.backend.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HomestayRepository homestayRepository;

    @Autowired
    private com.huehomestay.backend.service.AdminService adminService;

    @Autowired
    private com.huehomestay.backend.service.NotificationService notificationService;

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PostMapping("/users")
    public ResponseEntity<?> createUser(@Valid @RequestBody RegisterRequest request) {
        try {
            User user = adminService.createUser(request);
            return ResponseEntity.ok(user);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable String id, @Valid @RequestBody UserUpdateDTO request) {
        try {
            User user = adminService.updateUser(id, request);
            return ResponseEntity.ok(user);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        try {
            adminService.deleteUser(id);
            return ResponseEntity.ok().body("{\"message\": \"Xóa người dùng thành công\"}");
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @PostMapping("/users/{id}/toggle-status")
    public ResponseEntity<?> toggleUserStatus(@PathVariable String id) {
        boolean success = adminService.toggleUserStatus(id);
        if (success) {
            return ResponseEntity.ok().body("{\"message\": \"Cập nhật trạng thái thành công\"}");
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/homestays")
    public ResponseEntity<?> getAllHomestays() {
        return ResponseEntity.ok(homestayRepository.findAll());
    }

    @PostMapping("/homestays/{id}/approve")
    public ResponseEntity<?> approveHomestay(@PathVariable String id) {
        return homestayRepository.findById(id).map(homestay -> {
            homestay.setStatus(HomestayStatus.APPROVED);
            homestayRepository.save(homestay);
            
            // Send notification
            notificationService.sendNotification(
                homestay.getHost(),
                "Homestay được duyệt",
                "Chúc mừng! Homestay '" + homestay.getName() + "' của bạn đã được duyệt và hiển thị trên hệ thống.",
                "SUCCESS"
            );
            
            return ResponseEntity.ok("Homestay approved successfully");
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/homestays/{id}/reject")
    public ResponseEntity<?> rejectHomestay(@PathVariable String id) {
        return homestayRepository.findById(id).map(homestay -> {
            homestay.setStatus(HomestayStatus.REJECTED);
            homestayRepository.save(homestay);
            
            // Send notification
            notificationService.sendNotification(
                homestay.getHost(),
                "Homestay bị từ chối",
                "Rất tiếc, Homestay '" + homestay.getName() + "' của bạn đã bị từ chối. Vui lòng kiểm tra lại thông tin.",
                "WARNING"
            );
            
            return ResponseEntity.ok("Homestay rejected successfully");
        }).orElse(ResponseEntity.notFound().build());
    }
}
