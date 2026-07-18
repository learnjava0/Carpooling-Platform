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
            @RequestParam int seats
    ) {
        return ResponseEntity.ok(rideService.searchRides(pickupLocation, destination, departureTime, seats));
    }

    @GetMapping("/me")
    public ResponseEntity<List<RideDTO>> getMyRides(Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(rideService.getDriverRides(userEmail));
    }
}
