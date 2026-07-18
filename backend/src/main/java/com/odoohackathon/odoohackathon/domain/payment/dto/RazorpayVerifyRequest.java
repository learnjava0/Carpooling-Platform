package com.odoohackathon.odoohackathon.domain.payment.dto;

import lombok.Data;

@Data
public class RazorpayVerifyRequest {
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;
    private Long tripId;
    private String paymentMethod;
}
