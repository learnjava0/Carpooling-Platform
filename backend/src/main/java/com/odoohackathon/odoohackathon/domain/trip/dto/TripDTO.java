package com.odoohackathon.odoohackathon.domain.trip.dto;

import com.odoohackathon.odoohackathon.domain.ride.dto.RideDTO;
import com.odoohackathon.odoohackathon.domain.trip.entity.TripStatus;
import com.odoohackathon.odoohackathon.domain.user.dto.UserDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TripDTO {
    private Long id;
    private RideDTO ride;
    private UserDTO passenger;
    private int bookedSeats;
    private BigDecimal totalFare;
    private TripStatus status;
}
