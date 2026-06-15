package com.huehomestay.backend.controller;

import com.huehomestay.backend.entity.Homestay;
import com.huehomestay.backend.entity.Room;
import com.huehomestay.backend.repository.HomestayRepository;
import com.huehomestay.backend.repository.RoomRepository;
import com.huehomestay.backend.repository.BookingRepository;
import com.huehomestay.backend.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/host")
public class HostController {

    @Autowired
    private HomestayRepository homestayRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private com.huehomestay.backend.service.HostService hostService;

    @GetMapping("/{hostId}/dashboard")
    public ResponseEntity<?> getDashboardStats(@PathVariable String hostId) {
        return ResponseEntity.ok(hostService.getDashboardStats(hostId));
    }

    @GetMapping("/{hostId}/homestays")
    public ResponseEntity<?> getMyHomestays(@PathVariable String hostId) {
        return ResponseEntity.ok(homestayRepository.findByHostId(hostId));
    }

    @PostMapping("/homestays")
    public ResponseEntity<?> createHomestay(@RequestBody Homestay homestay) {
        return ResponseEntity.ok(homestayRepository.save(homestay));
    }

    @PutMapping("/homestays/{homestayId}")
    public ResponseEntity<?> updateHomestay(@PathVariable String homestayId, @RequestBody Homestay homestayDetails) {
        return homestayRepository.findById(homestayId).map(homestay -> {
            homestay.setName(homestayDetails.getName());
            homestay.setAddress(homestayDetails.getAddress());
            homestay.setDescription(homestayDetails.getDescription());
            homestay.setImage(homestayDetails.getImage());
            homestay.setImages(homestayDetails.getImages());
            homestay.setPrice(homestayDetails.getPrice());
            homestay.setPromotionalPrice(homestayDetails.getPromotionalPrice());
            homestay.setRoomStatus(homestayDetails.getRoomStatus());
            return ResponseEntity.ok(homestayRepository.save(homestay));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/homestays/{homestayId}")
    public ResponseEntity<?> deleteHomestay(@PathVariable String homestayId) {
        return homestayRepository.findById(homestayId).map(homestay -> {
            homestayRepository.delete(homestay);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/homestays/{homestayId}/rooms")
    public ResponseEntity<?> addRoom(@PathVariable String homestayId, @RequestBody Room room) {
        return homestayRepository.findById(homestayId).map(homestay -> {
            room.setHomestay(homestay);
            return ResponseEntity.ok(roomRepository.save(room));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{hostId}/bookings")
    public ResponseEntity<?> getMyBookings(@PathVariable String hostId) {
        return ResponseEntity.ok(bookingRepository.findByHomestayHostId(hostId));
    }

    @GetMapping("/{hostId}/reviews")
    public ResponseEntity<?> getMyReviews(@PathVariable String hostId) {
        return ResponseEntity.ok(reviewRepository.findByHomestayHostId(hostId));
    }
}
