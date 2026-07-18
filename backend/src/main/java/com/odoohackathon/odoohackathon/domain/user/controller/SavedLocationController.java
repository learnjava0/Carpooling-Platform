package com.odoohackathon.odoohackathon.domain.user.controller;

import com.odoohackathon.odoohackathon.domain.user.dto.SavedLocationDTO;
import com.odoohackathon.odoohackathon.domain.user.service.SavedLocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users/saved-places")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SavedLocationController {

    private final SavedLocationService savedLocationService;

    @GetMapping
    public ResponseEntity<List<SavedLocationDTO>> getSavedPlaces(Authentication authentication) {
        return ResponseEntity.ok(savedLocationService.getSavedLocations(authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<SavedLocationDTO> addSavedPlace(
            @RequestBody SavedLocationDTO request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(savedLocationService.addSavedLocation(authentication.getName(), request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSavedPlace(
            @PathVariable Long id,
            Authentication authentication
    ) {
        savedLocationService.deleteSavedLocation(authentication.getName(), id);
        return ResponseEntity.ok().build();
    }
}
