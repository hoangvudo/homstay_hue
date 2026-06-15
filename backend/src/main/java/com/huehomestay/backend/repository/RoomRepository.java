package com.huehomestay.backend.repository;

import com.huehomestay.backend.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, String> {
    List<Room> findByHomestayId(String homestayId);
    List<Room> findByHomestayHostId(String hostId);
}
