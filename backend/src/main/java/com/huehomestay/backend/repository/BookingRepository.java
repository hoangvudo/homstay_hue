package com.huehomestay.backend.repository;

import com.huehomestay.backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, String> {
    List<Booking> findByUserId(String userId);
    List<Booking> findByHomestayId(String homestayId);
    List<Booking> findByHomestayHostId(String hostId);
}
