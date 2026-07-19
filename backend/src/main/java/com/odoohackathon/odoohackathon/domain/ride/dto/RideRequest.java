package com.odoohackathon.odoohackathon.domain.ride.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RideRequest {
    private Long vehicleId;
    private String pickupLocation;
    private String destination;
    private LocalDateTime departureTime;
    private int availableSeats;
    private BigDecimal farePerSeat;
    private String routeWaypoints;
}
