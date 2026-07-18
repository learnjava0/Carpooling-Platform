package com.odoohackathon.odoohackathon.domain.tracking.controller;

import com.odoohackathon.odoohackathon.domain.tracking.dto.LocationRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

// @Controller
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LocationController {

    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/tracking/{tripId}")
    public void sendLocationUpdate(@DestinationVariable Long tripId, @Payload LocationRequest location) {
        messagingTemplate.convertAndSend("/topic/tracking/" + tripId, location);
    }
}
