package com.odoohackathon.odoohackathon.domain.ride.controller;

import com.odoohackathon.odoohackathon.domain.ride.dto.RideDTO;
import com.odoohackathon.odoohackathon.domain.ride.dto.RideRequest;
import com.odoohackathon.odoohackathon.domain.ride.service.AdminRideService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/rides")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminRideController {

    private final AdminRideService adminRideService;

    @GetMapping
    public ResponseEntity<List<RideDTO>> getAllRides() {
        return ResponseEntity.ok(adminRideService.getAllRides());
    }

    @PutMapping("/{id}")
    public ResponseEntity<RideDTO> updateRide(@PathVariable Long id, @RequestBody RideRequest request) {
        return ResponseEntity.ok(adminRideService.updateRide(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRide(@PathVariable Long id) {
        adminRideService.deleteRide(id);
        return ResponseEntity.ok().build();
    }
}
