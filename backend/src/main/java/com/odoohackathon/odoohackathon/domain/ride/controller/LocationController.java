package com.odoohackathon.odoohackathon.domain.ride.controller;

import com.odoohackathon.odoohackathon.domain.ride.dto.LocationUpdate;
import com.odoohackathon.odoohackathon.domain.ride.entity.Ride;
import com.odoohackathon.odoohackathon.domain.ride.entity.RideLocation;
import com.odoohackathon.odoohackathon.domain.ride.repository.RideLocationRepository;
import com.odoohackathon.odoohackathon.domain.ride.repository.RideRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;

@Controller
@RequiredArgsConstructor
public class LocationController {

    private final RideRepository rideRepository;
    private final RideLocationRepository locationRepository;

    @MessageMapping("/location/{rideId}")
    @SendTo("/topic/location/{rideId}")
    @Transactional
    public LocationUpdate updateLocation(@DestinationVariable Long rideId, LocationUpdate locationUpdate) {
        Ride ride = rideRepository.findById(rideId).orElse(null);
        if (ride != null) {
            RideLocation loc = RideLocation.builder()
                    .ride(ride)
                    .latitude(locationUpdate.getLat())
                    .longitude(locationUpdate.getLng())
                    .build();
            locationRepository.save(loc);
        }
        return locationUpdate;
    }
}
