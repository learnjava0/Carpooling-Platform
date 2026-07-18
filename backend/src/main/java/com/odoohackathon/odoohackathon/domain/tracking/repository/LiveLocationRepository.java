package com.odoohackathon.odoohackathon.domain.tracking.repository;

import com.odoohackathon.odoohackathon.domain.tracking.entity.LiveLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LiveLocationRepository extends JpaRepository<LiveLocation, Long> {
    Optional<LiveLocation> findByTripId(Long tripId);
}
