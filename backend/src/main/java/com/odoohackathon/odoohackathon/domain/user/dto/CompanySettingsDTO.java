package com.odoohackathon.odoohackathon.domain.user.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanySettingsDTO {
    private BigDecimal baseFare;
    private BigDecimal fuelCostPerKm;
    private BigDecimal travelCostDeduction;
}
