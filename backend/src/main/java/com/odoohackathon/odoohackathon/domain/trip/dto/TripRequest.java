package com.odoohackathon.odoohackathon.domain.trip.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TripRequest {
    private Long rideId;
    private int bookedSeats;
}
