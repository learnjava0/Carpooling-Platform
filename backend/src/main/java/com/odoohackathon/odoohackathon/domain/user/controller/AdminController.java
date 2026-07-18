package com.odoohackathon.odoohackathon.domain.user.controller;

import com.odoohackathon.odoohackathon.domain.user.dto.CompanySettingsDTO;
import com.odoohackathon.odoohackathon.domain.user.dto.UserDTO;
import com.odoohackathon.odoohackathon.domain.user.service.AdminService;
import com.odoohackathon.odoohackathon.domain.vehicle.dto.VehicleDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/settings")
    public ResponseEntity<CompanySettingsDTO> getSettings(Authentication authentication) {
        return ResponseEntity.ok(adminService.getCompanySettings(authentication.getName()));
    }

    @PutMapping("/settings")
    public ResponseEntity<CompanySettingsDTO> updateSettings(
            @RequestBody CompanySettingsDTO request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(adminService.updateCompanySettings(authentication.getName(), request));
    }

    @GetMapping("/employees")
    public ResponseEntity<List<UserDTO>> getEmployees(Authentication authentication) {
        return ResponseEntity.ok(adminService.getCompanyEmployees(authentication.getName()));
    }

    @GetMapping("/vehicles")
    public ResponseEntity<List<VehicleDTO>> getVehicles(Authentication authentication) {
        return ResponseEntity.ok(adminService.getCompanyVehicles(authentication.getName()));
    }
}
