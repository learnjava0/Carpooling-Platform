package com.odoohackathon.odoohackathon.domain.payment.entity;

import com.odoohackathon.odoohackathon.domain.trip.entity.Trip;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment_transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = true) // Can be null if it's just a wallet recharge
    private Trip trip;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wallet_id", nullable = false)
    private Wallet wallet;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    private String paymentMethod; // e.g., CASH, CARD, UPI, WALLET

    @Column(nullable = false)
    private String transactionType; // e.g., RECHARGE, DEDUCTION, EARNING

    @Column(nullable = false)
    private String status; // e.g., SUCCESS, PENDING, FAILED

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
