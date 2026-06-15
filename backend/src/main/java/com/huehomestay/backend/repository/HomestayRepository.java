package com.huehomestay.backend.repository;

import com.huehomestay.backend.entity.Homestay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HomestayRepository extends JpaRepository<Homestay, String> {
    List<Homestay> findByHostId(String hostId);
    List<Homestay> findByStatus(com.huehomestay.backend.entity.HomestayStatus status);
}
