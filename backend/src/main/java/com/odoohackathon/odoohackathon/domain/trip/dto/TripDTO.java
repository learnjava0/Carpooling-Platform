package com.odoohackathon.odoohackathon.domain.trip.dto;

import com.odoohackathon.odoohackathon.domain.trip.entity.TripStatus;
import com.odoohackathon.odoohackathon.domain.user.dto.UserDTO;
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
public class TripDTO {
    private Long id;
    private UserDTO passenger;
    private int bookedSeats;
    private BigDecimal totalFare;
    private TripStatus status;
    private String startOtp;
    // Flat ride info (avoids circular dependency with RideDTO)
    private String ridePickupLocation;
    private String rideDestination;
    private LocalDateTime rideDepartureTime;
}
