package com.odoohackathon.odoohackathon.domain.payment.controller;

import com.odoohackathon.odoohackathon.domain.payment.dto.PaymentRequest;
import com.odoohackathon.odoohackathon.domain.payment.dto.TransactionDTO;
import com.odoohackathon.odoohackathon.domain.payment.dto.WalletDTO;
import com.odoohackathon.odoohackathon.domain.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;

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
