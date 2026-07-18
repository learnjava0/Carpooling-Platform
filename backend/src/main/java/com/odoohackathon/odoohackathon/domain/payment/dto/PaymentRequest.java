package com.odoohackathon.odoohackathon.domain.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {
    private Long tripId;
    private BigDecimal amount;
    private String paymentMethod; // e.g., WALLET, CARD
}
