package com.huehomestay.backend.controller;

import com.huehomestay.backend.entity.Booking;
import com.huehomestay.backend.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private BookingRepository bookingRepository;

    @GetMapping("/{userId}/bookings")
    public ResponseEntity<?> getMyBookings(@PathVariable String userId) {
        // In a real app, userId should be extracted from JWT
        return ResponseEntity.ok(bookingRepository.findByUserId(userId));
    }

    @PostMapping("/bookings")
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {
        // Validation logic omitted for brevity
        return ResponseEntity.ok(bookingRepository.save(booking));
    }
}
