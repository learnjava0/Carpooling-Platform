package com.odoohackathon.odoohackathon.domain.payment.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class RazorpayOrderResponse {
    private String razorpayOrderId;
    private BigDecimal amount;
    private String currency;
}
