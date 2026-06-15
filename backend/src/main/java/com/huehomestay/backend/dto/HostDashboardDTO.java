package com.huehomestay.backend.dto;

import com.huehomestay.backend.entity.Booking;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class HostDashboardDTO {
    private double totalRevenue;
    private long totalGuests;
    private long totalBookings;
    private double averageRating;
    private List<Booking> recentBookings;
    private long availableRooms;
    private long occupiedRooms;
}
