package com.odoohackathon.odoohackathon.config;

import com.odoohackathon.odoohackathon.domain.user.entity.Company;
import com.odoohackathon.odoohackathon.domain.user.entity.Role;
import com.odoohackathon.odoohackathon.domain.user.entity.User;
import com.odoohackathon.odoohackathon.domain.user.repository.CompanyRepository;
import com.odoohackathon.odoohackathon.domain.user.repository.UserRepository;
import com.odoohackathon.odoohackathon.domain.vehicle.entity.Vehicle;
import com.odoohackathon.odoohackathon.domain.vehicle.repository.VehicleRepository;
import com.odoohackathon.odoohackathon.domain.payment.entity.Wallet;
import com.odoohackathon.odoohackathon.domain.payment.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final VehicleRepository vehicleRepository;
    private final WalletRepository walletRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        Company company = companyRepository.findByEmailDomain("acme.com")
                .orElseGet(() -> companyRepository.save(Company.builder()
                        .name("Acme Corp")
                        .emailDomain("acme.com")
                        .active(true)
                        .build()));

        createUserIfNotFound("admin@acme.com", "Admin", "User", Role.ADMIN, company, false);
        User driver = createUserIfNotFound("driver@acme.com", "Driver", "John", Role.EMPLOYEE, company, true);
        createUserIfNotFound("passenger@acme.com", "Passenger", "Jane", Role.EMPLOYEE, company, false);
    }

    private User createUserIfNotFound(String email, String firstName, String lastName, Role role, Company company, boolean createVehicle) {
        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            return existingUser.get();
        }

        User user = User.builder()
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .password(passwordEncoder.encode("password123"))
                .phoneNumber("1234567890")
                .role(role)
                .company(company)
                .build();

        user = userRepository.save(user);

        Wallet wallet = Wallet.builder()
                .user(user)
                .balance(BigDecimal.valueOf(1000))
                .build();
        walletRepository.save(wallet);

        if (createVehicle) {
            Vehicle vehicle = Vehicle.builder()
                    .owner(user)
                    .model("Tesla Model 3")
                    .registrationNumber("KA-01-AB-1234")
                    .seatingCapacity(4)
                    .build();
            vehicleRepository.save(vehicle);
        }

        return user;
    }
}
