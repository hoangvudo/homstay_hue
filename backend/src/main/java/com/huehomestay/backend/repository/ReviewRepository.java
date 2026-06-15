package com.huehomestay.backend.repository;

import com.huehomestay.backend.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, String> {
    List<Review> findByHomestayId(String homestayId);
    List<Review> findByUserId(String userId);
    List<Review> findByHomestayHostId(String hostId);
}
