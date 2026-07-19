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
import com.odoohackathon.odoohackathon.domain.ride.entity.Ride;
import com.odoohackathon.odoohackathon.domain.ride.repository.RideRepository;
import com.odoohackathon.odoohackathon.domain.trip.entity.Trip;
import com.odoohackathon.odoohackathon.domain.trip.entity.TripStatus;
import com.odoohackathon.odoohackathon.domain.trip.repository.TripRepository;
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
    private final RideRepository rideRepository;
    private final TripRepository tripRepository;
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

        createUserIfNotFound("admin@acme.com", "Admin", "User", Role.ADMIN, company, false, "+917820022627", null, null);
        createUserIfNotFound("alice@acme.com", "Alice", "Smith", Role.EMPLOYEE, company, true, "+917895669918", "Tesla Model 3", "KA-01-AB-1234");
        createUserIfNotFound("bob@acme.com", "Bob", "Johnson", Role.EMPLOYEE, company, false, "+919484844775", null, null);

        String[] firstNames = {"Aarav", "Arjun", "Amit", "Rahul", "Rohit", "Rohan", "Siddharth", "Vikram", "Vishal", "Manoj",
                               "Neha", "Pooja", "Priya", "Riya", "Sneha", "Shreya", "Simran", "Anjali", "Kavya", "Kiran"};
        String[] lastNames = {"Sharma", "Singh", "Kumar", "Patel", "Gupta", "Verma", "Jain", "Reddy", "Rao", "Desai",
                              "Joshi", "Iyer", "Menon", "Nair", "Kapoor", "Malhotra", "Chopra", "Agarwal", "Bhat", "Das"};
        String[] carModels = {"Maruti Swift", "Hyundai i20", "Tata Nexon", "Mahindra Thar", "Honda City", "Kia Seltos", "Toyota Innova"};
        java.util.Random random = new java.util.Random(42);

        for (int i = 1; i <= 100; i++) {
            String firstName = firstNames[random.nextInt(firstNames.length)];
            String lastName = lastNames[random.nextInt(lastNames.length)];
            String email = firstName.toLowerCase() + "." + lastName.toLowerCase() + i + "@acme.com";
            
            // Random valid-looking Indian mobile number
            long phoneNum = 9000000000L + random.nextInt(1000000000);
            String phone = "+91" + phoneNum;
            
            boolean createVehicle = random.nextDouble() < 0.35; // 35% chance to have a vehicle
            String carModel = null;
            String regNum = null;
            if (createVehicle) {
                carModel = carModels[random.nextInt(carModels.length)];
                regNum = String.format("MH-%02d-AB-%04d", random.nextInt(50) + 1, random.nextInt(9000) + 1000);
            }

            createUserIfNotFound(email, firstName, lastName, Role.EMPLOYEE, company, createVehicle, phone, carModel, regNum);
        }

        // Seed Trips for Analytics
        seedMockRidesAndTrips();
    }

    private User createUserIfNotFound(String email, String firstName, String lastName, Role role, Company company, boolean createVehicle, String phoneNumber, String vehicleModel, String vehicleRegNum) {
        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            return existingUser.get();
        }

        User user = User.builder()
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .password(passwordEncoder.encode("password123"))
                .phoneNumber(phoneNumber)
                .role(role)
                .company(company)
                .build();

        user = userRepository.save(user);

        Wallet wallet = Wallet.builder()
                .user(user)
                .balance(BigDecimal.valueOf(1000 + new java.util.Random().nextInt(4000))) // Random balance 1000-5000
                .build();
        walletRepository.save(wallet);

        if (createVehicle && vehicleModel != null && vehicleRegNum != null) {
            Vehicle vehicle = Vehicle.builder()
                    .owner(user)
                    .model(vehicleModel)
                    .registrationNumber(vehicleRegNum)
                    .seatingCapacity(4)
                    .build();
            vehicleRepository.save(vehicle);
        }

        return user;
    }

    private void seedMockRidesAndTrips() {
        Optional<User> aliceOpt = userRepository.findByEmail("alice@acme.com");
        Optional<User> adminOpt = userRepository.findByEmail("admin@acme.com");
        Optional<User> bobOpt = userRepository.findByEmail("bob@acme.com");

        if (aliceOpt.isEmpty() || adminOpt.isEmpty() || bobOpt.isEmpty()) return;

        User alice = aliceOpt.get();
        User admin = adminOpt.get();
        User bob = bobOpt.get();

        // Admin hosted a completed ride
        Vehicle adminVehicle = vehicleRepository.findByOwnerId(admin.getId()).stream().findFirst().orElse(null);
        if (adminVehicle == null) {
            adminVehicle = Vehicle.builder()
                .owner(admin)
                .model("Kia Seltos")
                .registrationNumber("MH-12-AB-9999")
                .seatingCapacity(4)
                .build();
            adminVehicle = vehicleRepository.save(adminVehicle);
        }
        
        Ride adminRide = Ride.builder()
                .driver(admin)
                .vehicle(adminVehicle)
                .pickupLocation("Andheri, Mumbai")
                .destination("Bandra Kurla Complex, Mumbai")
                .departureTime(java.time.LocalDateTime.now().minusDays(2))
                .availableSeats(2)
                .farePerSeat(new BigDecimal("150"))
                .build();
        adminRide = rideRepository.save(adminRide);

        // Alice booked a trip on Admin's ride
        Trip aliceTrip1 = Trip.builder()
                .ride(adminRide)
                .passenger(alice)
                .bookedSeats(1)
                .totalFare(new BigDecimal("150"))
                .status(TripStatus.COMPLETED)
                .startOtp("1234")
                .build();
        tripRepository.save(aliceTrip1);
        
        // Bob booked a trip on Admin's ride
        Trip bobTrip1 = Trip.builder()
                .ride(adminRide)
                .passenger(bob)
                .bookedSeats(1)
                .totalFare(new BigDecimal("150"))
                .status(TripStatus.COMPLETED)
                .startOtp("1234")
                .build();
        tripRepository.save(bobTrip1);

        // Alice hosted a completed ride
        Vehicle aliceVehicle = vehicleRepository.findByOwnerId(alice.getId()).stream().findFirst().orElse(null);
        if (aliceVehicle == null) {
            aliceVehicle = Vehicle.builder()
                .owner(alice)
                .model("Tesla Model 3")
                .registrationNumber("KA-01-AB-1234")
                .seatingCapacity(4)
                .build();
            aliceVehicle = vehicleRepository.save(aliceVehicle);
        }

        Ride aliceRide = Ride.builder()
                .driver(alice)
                .vehicle(aliceVehicle)
                .pickupLocation("Koramangala, Bangalore")
                .destination("Electronic City, Bangalore")
                .departureTime(java.time.LocalDateTime.now().minusDays(5))
                .availableSeats(2)
                .farePerSeat(new BigDecimal("200"))
                .build();
        aliceRide = rideRepository.save(aliceRide);

        // Admin booked a trip on Alice's ride
        Trip adminTrip1 = Trip.builder()
                .ride(aliceRide)
                .passenger(admin)
                .bookedSeats(1)
                .totalFare(new BigDecimal("200"))
                .status(TripStatus.COMPLETED)
                .startOtp("5678")
                .build();
        tripRepository.save(adminTrip1);

        // Alice hosted an upcoming ride
        Ride aliceRide2 = Ride.builder()
                .driver(alice)
                .vehicle(aliceVehicle)
                .pickupLocation("Indiranagar, Bangalore")
                .destination("Whitefield, Bangalore")
                .departureTime(java.time.LocalDateTime.now().plusDays(1))
                .availableSeats(3)
                .farePerSeat(new BigDecimal("250"))
                .build();
        aliceRide2 = rideRepository.save(aliceRide2);

        // Bob booked Alice's upcoming ride
        Trip bobTrip2 = Trip.builder()
                .ride(aliceRide2)
                .passenger(bob)
                .bookedSeats(1)
                .totalFare(new BigDecimal("250"))
                .status(TripStatus.PENDING)
                .startOtp("9999")
                .build();
        tripRepository.save(bobTrip2);
    }
}
