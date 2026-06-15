package com.huehomestay.backend.controller;

import com.huehomestay.backend.entity.Homestay;
import com.huehomestay.backend.repository.HomestayRepository;
import com.huehomestay.backend.entity.HomestayStatus;
import com.huehomestay.backend.entity.Booking;
import com.huehomestay.backend.entity.Room;
import com.huehomestay.backend.entity.User;
import com.huehomestay.backend.repository.BookingRepository;
import com.huehomestay.backend.repository.RoomRepository;
import com.huehomestay.backend.service.NotificationService;
import java.time.LocalDate;
import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    @Autowired
    private HomestayRepository homestayRepository;

    @GetMapping("/homestays")
    public ResponseEntity<?> getApprovedHomestays() {
        return ResponseEntity.ok(homestayRepository.findByStatus(HomestayStatus.APPROVED));
    }

    @GetMapping("/homestays/{id}")
    public ResponseEntity<?> getHomestayById(@PathVariable String id) {
        return homestayRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Data
    public static class BookingRequest {
        private String homestayId;
        private LocalDate checkIn;
        private LocalDate checkOut;
        private int guests;
        private String name;
        private String phone;
        private String note;
    }

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private NotificationService notificationService;

    @PostMapping("/bookings")
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest req) {
        Homestay homestay = homestayRepository.findById(req.getHomestayId()).orElse(null);
        if (homestay == null) return ResponseEntity.badRequest().body("Homestay not found");

        long days = ChronoUnit.DAYS.between(req.getCheckIn(), req.getCheckOut());
        if (days <= 0) days = 1;
        
        BigDecimal pricePerNight = homestay.getPromotionalPrice() != null ? homestay.getPromotionalPrice() : (homestay.getPrice() != null ? homestay.getPrice() : BigDecimal.ZERO);
        BigDecimal total = pricePerNight.multiply(new BigDecimal(days)).add(new BigDecimal("50000"));

        Booking booking = Booking.builder()
            .homestay(homestay)
            .checkInDate(req.getCheckIn())
            .checkOutDate(req.getCheckOut())
            .numberOfGuests(req.getGuests())
            .guestName(req.getName())
            .guestPhone(req.getPhone())
            .note(req.getNote())
            .totalPrice(total)
            .status(com.huehomestay.backend.entity.BookingStatus.PENDING)
            .build();
        
        bookingRepository.save(booking);

        User host = homestay.getHost();
        if (host != null) {
            notificationService.sendNotification(
                host, 
                "Đơn đặt phòng mới", 
                "Khách " + req.getName() + " vừa đặt phòng tại " + homestay.getName(), 
                "INFO"
            );
        }

        return ResponseEntity.ok(booking);
    }
}
