package com.odoohackathon.odoohackathon.domain.ride.dto;

import com.odoohackathon.odoohackathon.domain.user.dto.UserDTO;
import com.odoohackathon.odoohackathon.domain.vehicle.dto.VehicleDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.odoohackathon.odoohackathon.domain.trip.dto.TripDTO;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RideDTO {
    private Long id;
    private UserDTO driver;
    private VehicleDTO vehicle;
    private String pickupLocation;
    private String destination;
    private LocalDateTime departureTime;
    private int availableSeats;
    private BigDecimal farePerSeat;

    @JsonIgnoreProperties("ride")
    private List<TripDTO> trips;
}
