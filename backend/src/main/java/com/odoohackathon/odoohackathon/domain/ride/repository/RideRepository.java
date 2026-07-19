package com.odoohackathon.odoohackathon.domain.ride.repository;

import com.odoohackathon.odoohackathon.domain.ride.entity.Ride;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RideRepository extends JpaRepository<Ride, Long> {
    List<Ride> findByDriverId(Long driverId);
    
    // For Ride Discovery: searching based on locations, waypoints, and departure time
    @Query("SELECT r FROM Ride r WHERE " +
           "(LOWER(r.pickupLocation) LIKE LOWER(CONCAT('%', :pickupLocation, '%')) OR LOWER(r.routeWaypoints) LIKE LOWER(CONCAT('%', :pickupLocation, '%'))) " +
           "AND (LOWER(r.destination) LIKE LOWER(CONCAT('%', :destination, '%')) OR LOWER(r.routeWaypoints) LIKE LOWER(CONCAT('%', :destination, '%'))) " +
           "AND r.departureTime >= :departureTime AND r.availableSeats >= :seats")
    List<Ride> findRidesByLocationsAndSeats(
            @org.springframework.data.repository.query.Param("pickupLocation") String pickupLocation, 
            @org.springframework.data.repository.query.Param("destination") String destination, 
            @org.springframework.data.repository.query.Param("departureTime") LocalDateTime departureTime, 
            @org.springframework.data.repository.query.Param("seats") int seats);
    @Query("SELECT DISTINCT r.pickupLocation FROM Ride r WHERE r.availableSeats > 0 AND r.departureTime >= CURRENT_TIMESTAMP")
    List<String> findDistinctPickupLocations();

    @Query("SELECT DISTINCT r.destination FROM Ride r WHERE r.availableSeats > 0 AND r.departureTime >= CURRENT_TIMESTAMP")
    List<String> findDistinctDestinations();
}
