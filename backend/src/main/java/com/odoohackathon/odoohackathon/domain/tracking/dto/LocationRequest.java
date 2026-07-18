package com.odoohackathon.odoohackathon.domain.tracking.dto;

import lombok.Data;

@Data
public class LocationRequest {
    private double latitude;
    private double longitude;
    private double heading;
    private double speed;
    private long timestamp;
}
