package com.odoohackathon.odoohackathon.config;

import com.odoohackathon.odoohackathon.domain.ride.entity.Ride;
import com.odoohackathon.odoohackathon.domain.ride.repository.RideRepository;
import com.odoohackathon.odoohackathon.domain.trip.entity.Trip;
import com.odoohackathon.odoohackathon.domain.trip.entity.TripStatus;
import com.odoohackathon.odoohackathon.domain.trip.repository.TripRepository;
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
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final VehicleRepository vehicleRepository;
    private final RideRepository rideRepository;
    private final TripRepository tripRepository;
    private final WalletRepository walletRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            return; // Data already initialized
        }

        System.out.println("Initializing mock data...");

        // 1. Create a Company
        Company company = Company.builder()
                .name("Odoo Solutions")
                .emailDomain("odoo.com")
                .build();
        company = companyRepository.save(company);

        // 2. Create Users
        User admin = User.builder()
                .firstName("Admin")
                .lastName("User")
                .email("admin@odoo.com")
                .phoneNumber("9000000001")
                .password(passwordEncoder.encode("admin123"))
                .role(Role.COMPANY_ADMIN)
                .company(company)
                .build();
        admin = userRepository.save(admin);
        createWallet(admin, 1000.0);

        User employee1 = User.builder()
                .firstName("John")
                .lastName("Doe")
                .email("john@odoo.com")
                .phoneNumber("9000000002")
                .password(passwordEncoder.encode("password123"))
                .role(Role.EMPLOYEE)
                .company(company)
                .build();
        employee1 = userRepository.save(employee1);
        createWallet(employee1, 500.0);

        User employee2 = User.builder()
                .firstName("Jane")
                .lastName("Smith")
                .email("jane@odoo.com")
                .phoneNumber("9000000003")
                .password(passwordEncoder.encode("password123"))
                .role(Role.EMPLOYEE)
                .company(company)
                .build();
        employee2 = userRepository.save(employee2);
        createWallet(employee2, 750.0);

        // 3. Create Vehicles
        Vehicle vehicle1 = Vehicle.builder()
                .owner(employee1)
                .model("Tata Nexon")
                .registrationNumber("GJ01AB1234")
                .seatingCapacity(4)
                .build();
        vehicle1 = vehicleRepository.save(vehicle1);

        Vehicle vehicle2 = Vehicle.builder()
                .owner(admin)
                .model("Maruti Swift")
                .registrationNumber("GJ01CD5678")
                .seatingCapacity(3)
                .build();
        vehicle2 = vehicleRepository.save(vehicle2);

        // 4. Create Rides
        Ride ride1 = Ride.builder()
                .driver(employee1)
                .vehicle(vehicle1)
                .pickupLocation("Vastrapur, Ahmedabad")
                .destination("Odoo HQ, Gandhinagar")
                .departureTime(LocalDateTime.now().plusHours(2))
                .availableSeats(3)
                .farePerSeat(BigDecimal.valueOf(50.0))
                .build();
        ride1 = rideRepository.save(ride1);

        Ride ride2 = Ride.builder()
                .driver(admin)
                .vehicle(vehicle2)
                .pickupLocation("Satellite, Ahmedabad")
                .destination("Odoo HQ, Gandhinagar")
                .departureTime(LocalDateTime.now().plusDays(1).plusHours(9)) // Tomorrow morning
                .availableSeats(2)
                .farePerSeat(BigDecimal.valueOf(60.0))
                .build();
        ride2 = rideRepository.save(ride2);

        // 5. Create Trips
        Trip trip1 = Trip.builder()
                .ride(ride1)
                .passenger(employee2)
                .bookedSeats(1)
                .totalFare(BigDecimal.valueOf(50.0))
                .status(TripStatus.BOOKED)
                .build();
        tripRepository.save(trip1);

        System.out.println("Mock data initialization complete!");
    }

    private void createWallet(User user, double initialBalance) {
        Wallet wallet = Wallet.builder()
                .user(user)
                .balance(BigDecimal.valueOf(initialBalance))
                .build();
        walletRepository.save(wallet);
    }
}
