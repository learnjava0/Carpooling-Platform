package com.odoohackathon.odoohackathon.domain.payment.repository;

import com.odoohackathon.odoohackathon.domain.payment.entity.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {
    List<PaymentTransaction> findByWalletId(Long walletId);
    List<PaymentTransaction> findByTripId(Long tripId);
}
