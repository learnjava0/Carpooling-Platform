package com.odoohackathon.odoohackathon.domain.payment.controller;

import com.odoohackathon.odoohackathon.domain.payment.dto.PaymentRequest;
import com.odoohackathon.odoohackathon.domain.payment.dto.RazorpayOrderResponse;
import com.odoohackathon.odoohackathon.domain.payment.dto.RazorpayVerifyRequest;
import com.odoohackathon.odoohackathon.domain.payment.dto.TransactionDTO;
import com.odoohackathon.odoohackathon.domain.payment.dto.WalletDTO;
import com.odoohackathon.odoohackathon.domain.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-order")
    public ResponseEntity<RazorpayOrderResponse> createRazorpayOrder(@RequestParam BigDecimal amount) {
        String orderId = paymentService.createRazorpayOrder(amount);
        
        RazorpayOrderResponse response = new RazorpayOrderResponse();
        response.setRazorpayOrderId(orderId);
        response.setAmount(amount);
        response.setCurrency("INR");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-razorpay")
    public ResponseEntity<TransactionDTO> verifyRazorpay(
            @RequestBody RazorpayVerifyRequest verifyRequest,
            Authentication authentication
    ) {
        boolean isValid = paymentService.verifyRazorpayPayment(
                verifyRequest.getRazorpayOrderId(),
                verifyRequest.getRazorpayPaymentId(),
                verifyRequest.getRazorpaySignature()
        );

        if (!isValid) {
            throw new IllegalArgumentException("Invalid Razorpay Signature");
        }

        // If valid, process the payment as normal
        PaymentRequest paymentRequest = new PaymentRequest();
        paymentRequest.setTripId(verifyRequest.getTripId());
        paymentRequest.setPaymentMethod(verifyRequest.getPaymentMethod());
        
        TransactionDTO transaction = paymentService.payForTrip(authentication.getName(), paymentRequest);
        return ResponseEntity.ok(transaction);
    }

    @GetMapping("/wallet")
    public ResponseEntity<WalletDTO> getMyWallet(Authentication authentication) {
        return ResponseEntity.ok(paymentService.getMyWallet(authentication.getName()));
    }

    @PostMapping("/wallet/recharge")
    public ResponseEntity<WalletDTO> rechargeWallet(
            @RequestBody PaymentRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(paymentService.rechargeWallet(authentication.getName(), request));
    }

    @PostMapping("/trip/pay")
    public ResponseEntity<TransactionDTO> payForTrip(
            @RequestBody PaymentRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(paymentService.payForTrip(authentication.getName(), request));
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<TransactionDTO>> getMyTransactions(Authentication authentication) {
        return ResponseEntity.ok(paymentService.getMyTransactions(authentication.getName()));
    }
}
