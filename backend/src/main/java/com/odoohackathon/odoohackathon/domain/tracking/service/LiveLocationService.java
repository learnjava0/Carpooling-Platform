package com.odoohackathon.odoohackathon.domain.tracking.service;

import com.odoohackathon.odoohackathon.domain.tracking.dto.LocationUpdateRequest;
import com.odoohackathon.odoohackathon.domain.tracking.entity.LiveLocation;
import com.odoohackathon.odoohackathon.domain.tracking.repository.LiveLocationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class LiveLocationService {

    private final LiveLocationRepository liveLocationRepository;

    public LiveLocationService(LiveLocationRepository liveLocationRepository) {
        this.liveLocationRepository = liveLocationRepository;
    }

    @Transactional
    public LiveLocation updateLocation(Long tripId, LocationUpdateRequest request) {
        LiveLocation location = liveLocationRepository.findByTripId(tripId)
                .orElse(new LiveLocation(tripId, request.getLatitude(), request.getLongitude()));
        
        location.setLatitude(request.getLatitude());
        location.setLongitude(request.getLongitude());
        location.setUpdatedAt(LocalDateTime.now());
        
        return liveLocationRepository.save(location);
    }

    public LiveLocation getLocation(Long tripId) {
        return liveLocationRepository.findByTripId(tripId)
                .orElseThrow(() -> new RuntimeException("Location not found for trip: " + tripId));
    }
}
