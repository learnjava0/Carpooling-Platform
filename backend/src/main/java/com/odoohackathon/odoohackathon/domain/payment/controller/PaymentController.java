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

        if ("RECHARGE".equalsIgnoreCase(verifyRequest.getPurpose())) {
            PaymentRequest rechargeReq = new PaymentRequest();
            rechargeReq.setAmount(verifyRequest.getAmount());
            rechargeReq.setPaymentMethod("RAZORPAY");
            WalletDTO wallet = paymentService.rechargeWallet(authentication.getName(), rechargeReq);
            // We just return null/empty for TransactionDTO since the frontend Wallet.jsx expects WalletDTO but verify razorpay returns TransactionDTO.
            // Wait, we can return the WalletDTO wrapped in a ResponseEntity, or just return an empty TransactionDTO and let the frontend fetch the wallet.
            // Let's just return a dummy transaction for now, the frontend will refetch the wallet.
            TransactionDTO dummy = new TransactionDTO();
            dummy.setStatus("SUCCESS");
            return ResponseEntity.ok(dummy);
        } else if ("TRIP_PAYMENT".equalsIgnoreCase(verifyRequest.getPurpose())) {
            PaymentRequest tripPayReq = new PaymentRequest();
            tripPayReq.setTripId(verifyRequest.getTripId());
            tripPayReq.setAmount(verifyRequest.getAmount());
            tripPayReq.setPaymentMethod("RAZORPAY");
            return ResponseEntity.ok(paymentService.payForTrip(authentication.getName(), tripPayReq));
        }

        throw new IllegalArgumentException("Unknown payment purpose");
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

    @PostMapping("/log-failure")
    public ResponseEntity<Void> logPaymentFailure(
            @RequestBody PaymentRequest request,
            Authentication authentication
    ) {
        paymentService.logFailedPayment(authentication.getName(), request);
        return ResponseEntity.ok().build();
    }
}
