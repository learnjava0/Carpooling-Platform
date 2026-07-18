package com.odoohackathon.odoohackathon.domain.ride.repository;

import com.odoohackathon.odoohackathon.domain.ride.entity.RideLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RideLocationRepository extends JpaRepository<RideLocation, Long> {
}
