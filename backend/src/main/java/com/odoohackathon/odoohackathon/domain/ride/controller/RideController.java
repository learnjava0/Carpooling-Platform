package com.odoohackathon.odoohackathon.domain.ride.controller;
import com.odoohackathon.odoohackathon.domain.ride.dto.RideDTO;
import com.odoohackathon.odoohackathon.domain.ride.dto.RideRequest;
import com.odoohackathon.odoohackathon.domain.ride.service.RideService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/rides")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RideController {

    private final RideService rideService;

    @PostMapping
    public ResponseEntity<RideDTO> publishRide(
            @RequestBody RideRequest request,
            Authentication authentication
    ) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(rideService.publishRide(userEmail, request));
    }

    @GetMapping("/search")
    public ResponseEntity<List<RideDTO>> searchRides(
            @RequestParam String pickupLocation,
            @RequestParam String destination,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime departureTime,
            @RequestParam(defaultValue = "1") int seats) {
        return ResponseEntity.ok(rideService.searchRides(pickupLocation, destination, departureTime, seats));
    }

    @GetMapping("/locations")
    public ResponseEntity<java.util.Map<String, List<String>>> getAvailableLocations() {
        return ResponseEntity.ok(rideService.getAvailableLocations());
    }

    @GetMapping("/me")
    public ResponseEntity<List<RideDTO>> getMyRides(Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(rideService.getDriverRides(userEmail));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RideDTO> updateMyRide(
            @PathVariable Long id,
            @RequestBody RideRequest request,
            Authentication authentication
    ) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(rideService.updateMyRide(id, userEmail, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMyRide(
            @PathVariable Long id,
            Authentication authentication
    ) {
        String userEmail = authentication.getName();
        rideService.deleteRide(id, userEmail);
        return ResponseEntity.noContent().build();
    }
}
