package com.huehomestay.backend.service;

import com.huehomestay.backend.dto.HostDashboardDTO;
import com.huehomestay.backend.entity.Booking;
import com.huehomestay.backend.entity.BookingStatus;
import com.huehomestay.backend.entity.Review;
import com.huehomestay.backend.entity.Room;
import com.huehomestay.backend.repository.BookingRepository;
import com.huehomestay.backend.repository.ReviewRepository;
import com.huehomestay.backend.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HostService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private RoomRepository roomRepository;

    public HostDashboardDTO getDashboardStats(String hostId) {
        List<Booking> bookings = bookingRepository.findByHomestayHostId(hostId);
        
        double totalRevenue = bookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED || b.getStatus() == BookingStatus.CONFIRMED)
                .mapToDouble(b -> b.getTotalPrice().doubleValue())
                .sum();
                
        long totalGuests = bookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED || b.getStatus() == BookingStatus.CONFIRMED)
                .mapToLong(Booking::getNumberOfGuests)
                .sum();
                
        long totalBookings = bookings.size();

        List<Review> reviews = reviewRepository.findByHomestayHostId(hostId);
        double averageRating = reviews.isEmpty() ? 0.0 : reviews.stream().mapToInt(Review::getRating).average().orElse(0.0);

        List<Booking> recentBookings = bookings.stream()
                .sorted(Comparator.comparing(Booking::getCreatedAt).reversed())
                .limit(5)
                .collect(Collectors.toList());

        List<Room> rooms = roomRepository.findByHomestayHostId(hostId);
        long availableRooms = rooms.stream().filter(Room::isAvailable).count();
        long occupiedRooms = rooms.size() - availableRooms;

        return HostDashboardDTO.builder()
                .totalRevenue(totalRevenue)
                .totalGuests(totalGuests)
                .totalBookings(totalBookings)
                .averageRating(averageRating)
                .recentBookings(recentBookings)
                .availableRooms(availableRooms)
                .occupiedRooms(occupiedRooms)
                .build();
    }
}
