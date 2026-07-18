package com.odoohackathon.odoohackathon.domain.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsReportDTO {
    private long totalTrips;
    private double totalDistanceTravelledKm;
    private double estimatedFuelConsumptionLiters;
    private BigDecimal totalCostSaved;
    private BigDecimal costPerKilometer;
}
