package com.odoohackathon.odoohackathon.domain.trip.controller;

import com.odoohackathon.odoohackathon.domain.trip.dto.TripDTO;
import com.odoohackathon.odoohackathon.domain.trip.dto.TripRequest;
import com.odoohackathon.odoohackathon.domain.trip.service.TripService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TripController {

    private final TripService tripService;

    @PostMapping
    public ResponseEntity<TripDTO> bookTrip(
            @RequestBody TripRequest request,
            Authentication authentication
    ) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(tripService.bookTrip(userEmail, request));
    }

    @GetMapping("/me")
    public ResponseEntity<List<TripDTO>> getMyTrips(Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(tripService.getPassengerTrips(userEmail));
    }

    @PatchMapping("/{tripId}/status")
    public ResponseEntity<TripDTO> updateTripStatus(
            @PathVariable Long tripId,
            @RequestParam String status,
            Authentication authentication
    ) {
        String driverEmail = authentication.getName();
        return ResponseEntity.ok(tripService.updateTripStatus(tripId, status, driverEmail));
    }

    @PatchMapping("/{tripId}/cancel")
    public ResponseEntity<TripDTO> cancelTripPassenger(
            @PathVariable Long tripId,
            Authentication authentication
    ) {
        String userEmail = authentication.getName();
        // Just calling updateTripStatus and assuming service handles passenger cancellation logic,
        // or just bypassing strict driver check for the hackathon
        return ResponseEntity.ok(tripService.cancelTripAsPassenger(tripId, userEmail));
    }

    @PostMapping("/{tripId}/accept")
    public ResponseEntity<TripDTO> acceptTrip(
            @PathVariable Long tripId,
            Authentication authentication
    ) {
        String driverEmail = authentication.getName();
        return ResponseEntity.ok(tripService.acceptTrip(tripId, driverEmail));
    }

    @PostMapping("/{tripId}/reject")
    public ResponseEntity<TripDTO> rejectTrip(
            @PathVariable Long tripId,
            Authentication authentication
    ) {
        String driverEmail = authentication.getName();
        return ResponseEntity.ok(tripService.rejectTrip(tripId, driverEmail));
    }

    @PostMapping("/{tripId}/verify-otp")
    public ResponseEntity<TripDTO> verifyOtpAndStart(
            @PathVariable Long tripId,
            @RequestParam String otp,
            Authentication authentication
    ) {
        String driverEmail = authentication.getName();
        return ResponseEntity.ok(tripService.verifyOtpAndStartTrip(tripId, otp, driverEmail));
    }
}
