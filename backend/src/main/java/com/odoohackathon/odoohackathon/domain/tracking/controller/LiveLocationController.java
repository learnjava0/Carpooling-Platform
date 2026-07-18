package com.odoohackathon.odoohackathon.domain.tracking.controller;

import com.odoohackathon.odoohackathon.domain.tracking.dto.LocationUpdateRequest;
import com.odoohackathon.odoohackathon.domain.tracking.entity.LiveLocation;
import com.odoohackathon.odoohackathon.domain.tracking.service.LiveLocationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tracking")
public class LiveLocationController {

    private final LiveLocationService liveLocationService;

    public LiveLocationController(LiveLocationService liveLocationService) {
        this.liveLocationService = liveLocationService;
    }

    @PostMapping("/{tripId}/location")
    public ResponseEntity<LiveLocation> updateLocation(
            @PathVariable Long tripId, 
            @RequestBody LocationUpdateRequest request) {
        return ResponseEntity.ok(liveLocationService.updateLocation(tripId, request));
    }

    @GetMapping("/{tripId}/location")
    public ResponseEntity<LiveLocation> getLocation(@PathVariable Long tripId) {
        return ResponseEntity.ok(liveLocationService.getLocation(tripId));
    }
}
