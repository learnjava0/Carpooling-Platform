package com.odoohackathon.odoohackathon.domain.vehicle.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleDTO {
    private Long id;
    private String model;
    private String registrationNumber;
    private int seatingCapacity;
    private Long userId;
}
