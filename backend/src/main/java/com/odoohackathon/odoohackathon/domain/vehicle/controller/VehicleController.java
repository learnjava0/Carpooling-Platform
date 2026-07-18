package com.odoohackathon.odoohackathon.domain.vehicle.controller;

import com.odoohackathon.odoohackathon.domain.vehicle.dto.VehicleDTO;
import com.odoohackathon.odoohackathon.domain.vehicle.dto.VehicleRequest;
import com.odoohackathon.odoohackathon.domain.vehicle.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@PreAuthorize("hasRole('EMPLOYEE')")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VehicleController {

    private final VehicleService vehicleService;

    @PostMapping
    public ResponseEntity<VehicleDTO> registerVehicle(
            @RequestBody VehicleRequest request,
            Authentication authentication
    ) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(vehicleService.registerVehicle(userEmail, request));
    }

    @GetMapping
    public ResponseEntity<List<VehicleDTO>> getUserVehicles(Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(vehicleService.getUserVehicles(userEmail));
    }
}
