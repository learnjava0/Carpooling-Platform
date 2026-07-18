package com.odoohackathon.odoohackathon.domain.ride.repository;

import com.odoohackathon.odoohackathon.domain.ride.entity.Ride;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RideRepository extends JpaRepository<Ride, Long> {
    List<Ride> findByDriverId(Long driverId);
    
    // For Ride Discovery: searching based on locations and departure time (basic search)
    List<Ride> findByPickupLocationAndDestinationAndDepartureTimeGreaterThanEqualAndAvailableSeatsGreaterThanEqual(
            String pickupLocation, String destination, LocalDateTime departureTime, int seats);
}
