package com.odoohackathon.odoohackathon.domain.payment.dto;

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
public class TransactionDTO {
    private Long id;
    private Long tripId;
    private BigDecimal amount;
    private String paymentMethod;
    private String transactionType;
    private String status;
    private LocalDateTime createdAt;
}
