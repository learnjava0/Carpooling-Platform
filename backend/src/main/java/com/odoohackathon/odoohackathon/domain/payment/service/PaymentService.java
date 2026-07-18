package com.odoohackathon.odoohackathon.domain.payment.service;

import com.odoohackathon.odoohackathon.domain.payment.dto.PaymentRequest;
import com.odoohackathon.odoohackathon.domain.payment.dto.TransactionDTO;
import com.odoohackathon.odoohackathon.domain.payment.dto.WalletDTO;
import com.odoohackathon.odoohackathon.domain.payment.entity.PaymentTransaction;
import com.odoohackathon.odoohackathon.domain.payment.entity.Wallet;
import com.odoohackathon.odoohackathon.domain.payment.repository.PaymentTransactionRepository;
import com.odoohackathon.odoohackathon.domain.payment.repository.WalletRepository;
import com.odoohackathon.odoohackathon.domain.trip.entity.Trip;
import com.odoohackathon.odoohackathon.domain.trip.entity.TripStatus;
import com.odoohackathon.odoohackathon.domain.trip.repository.TripRepository;
import com.odoohackathon.odoohackathon.domain.user.entity.User;
import com.odoohackathon.odoohackathon.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final WalletRepository walletRepository;
    private final PaymentTransactionRepository transactionRepository;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    public WalletDTO getMyWallet(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Wallet wallet = walletRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Wallet not found"));
        return mapToDto(wallet);
    }

    @Transactional
    public WalletDTO rechargeWallet(String userEmail, PaymentRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Wallet wallet = walletRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Wallet not found"));

        wallet.setBalance(wallet.getBalance().add(request.getAmount()));
        wallet = walletRepository.save(wallet);

        PaymentTransaction transaction = PaymentTransaction.builder()
                .wallet(wallet)
                .amount(request.getAmount())
                .paymentMethod(request.getPaymentMethod())
                .transactionType("RECHARGE")
                .status("SUCCESS")
                .build();
        transactionRepository.save(transaction);

        return mapToDto(wallet);
    }

    @Transactional
    public TransactionDTO payForTrip(String userEmail, PaymentRequest request) {
        User passenger = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        Trip trip = tripRepository.findById(request.getTripId())
                .orElseThrow(() -> new IllegalArgumentException("Trip not found"));

        if (!trip.getPassenger().getId().equals(passenger.getId())) {
            throw new IllegalArgumentException("You can only pay for your own trips");
        }
        
        if (trip.getStatus() != TripStatus.COMPLETED && trip.getStatus() != TripStatus.PAYMENT_PENDING) {
            throw new IllegalArgumentException("Trip is not ready for payment");
        }

        Wallet passengerWallet = walletRepository.findByUserId(passenger.getId())
                .orElseThrow(() -> new IllegalArgumentException("Wallet not found"));

        if ("WALLET".equalsIgnoreCase(request.getPaymentMethod())) {
            if (passengerWallet.getBalance().compareTo(trip.getTotalFare()) < 0) {
                throw new IllegalArgumentException("Insufficient wallet balance");
            }
            passengerWallet.setBalance(passengerWallet.getBalance().subtract(trip.getTotalFare()));
            walletRepository.save(passengerWallet);
        }

        PaymentTransaction transaction = PaymentTransaction.builder()
                .trip(trip)
                .wallet(passengerWallet)
                .amount(trip.getTotalFare())
                .paymentMethod(request.getPaymentMethod())
                .transactionType("DEDUCTION")
                .status("SUCCESS")
                .build();
        
        transaction = transactionRepository.save(transaction);
        
        trip.setStatus(TripStatus.PAYMENT_COMPLETED);
        tripRepository.save(trip);

        // Also credit the driver's wallet (simplified for this hackathon)
        Wallet driverWallet = walletRepository.findByUserId(trip.getRide().getDriver().getId())
                .orElseThrow(() -> new IllegalArgumentException("Driver Wallet not found"));
        driverWallet.setBalance(driverWallet.getBalance().add(trip.getTotalFare()));
        walletRepository.save(driverWallet);

        PaymentTransaction driverTransaction = PaymentTransaction.builder()
                .trip(trip)
                .wallet(driverWallet)
                .amount(trip.getTotalFare())
                .paymentMethod("SYSTEM_TRANSFER")
                .transactionType("EARNING")
                .status("SUCCESS")
                .build();
        transactionRepository.save(driverTransaction);

        return mapToDto(transaction);
    }

    public List<TransactionDTO> getMyTransactions(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Wallet wallet = walletRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Wallet not found"));

        return transactionRepository.findByWalletId(wallet.getId())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private WalletDTO mapToDto(Wallet wallet) {
        return WalletDTO.builder()
                .id(wallet.getId())
                .userId(wallet.getUser().getId())
                .balance(wallet.getBalance())
                .build();
    }

    private TransactionDTO mapToDto(PaymentTransaction tx) {
        return TransactionDTO.builder()
                .id(tx.getId())
                .tripId(tx.getTrip() != null ? tx.getTrip().getId() : null)
                .amount(tx.getAmount())
                .paymentMethod(tx.getPaymentMethod())
                .transactionType(tx.getTransactionType())
                .status(tx.getStatus())
                .createdAt(tx.getCreatedAt())
                .build();
    }
}
