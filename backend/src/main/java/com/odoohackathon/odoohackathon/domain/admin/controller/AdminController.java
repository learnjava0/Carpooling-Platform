package com.odoohackathon.odoohackathon.domain.admin.controller;

import com.odoohackathon.odoohackathon.domain.user.dto.UserDTO;
import com.odoohackathon.odoohackathon.domain.user.entity.Company;
import com.odoohackathon.odoohackathon.domain.user.entity.Role;
import com.odoohackathon.odoohackathon.domain.user.entity.User;
import com.odoohackathon.odoohackathon.domain.user.repository.CompanyRepository;
import com.odoohackathon.odoohackathon.domain.user.repository.UserRepository;
import com.odoohackathon.odoohackathon.domain.vehicle.dto.VehicleDTO;
import com.odoohackathon.odoohackathon.domain.vehicle.dto.VehicleRequest;
import com.odoohackathon.odoohackathon.domain.vehicle.entity.Vehicle;
import com.odoohackathon.odoohackathon.domain.vehicle.repository.VehicleRepository;
import com.odoohackathon.odoohackathon.domain.trip.repository.TripRepository;
import com.odoohackathon.odoohackathon.domain.payment.entity.Wallet;
import com.odoohackathon.odoohackathon.domain.payment.repository.WalletRepository;
import com.odoohackathon.odoohackathon.domain.admin.dto.DriverOnboardRequest;
import com.odoohackathon.odoohackathon.domain.user.dto.CompanySettingsDTO;
import com.odoohackathon.odoohackathon.domain.user.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final TripRepository tripRepository;
    private final CompanyRepository companyRepository;
    private final WalletRepository walletRepository;
    private final PasswordEncoder passwordEncoder;
    private final AdminService adminService;

    @PostMapping("/drivers/onboard")
    @Transactional
    public ResponseEntity<UserDTO> onboardDriver(@RequestBody DriverOnboardRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }

        String emailDomain = request.getEmail().substring(request.getEmail().indexOf("@") + 1);
        Company company = companyRepository.findByEmailDomain(emailDomain)
                .orElseGet(() -> companyRepository.save(Company.builder()
                        .name(emailDomain)
                        .emailDomain(emailDomain)
                        .active(true)
                        .build()));

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .driverLicense(request.getDriverLicense())
                .role(Role.EMPLOYEE)
                .company(company)
                .build();

        user = userRepository.save(user);

        Wallet wallet = Wallet.builder()
                .user(user)
                .balance(BigDecimal.ZERO)
                .build();
        walletRepository.save(wallet);

        Vehicle vehicle = Vehicle.builder()
                .owner(user)
                .model(request.getVehicleModel())
                .registrationNumber(request.getVehicleRegistration())
                .seatingCapacity(request.getSeatingCapacity())
                .insuranceDocument(request.getInsuranceDocument())
                .registrationDocument(request.getRegistrationDocument())
                .pollutionDocument(request.getPollutionDocument())
                .build();
        vehicleRepository.save(vehicle);

        return ResponseEntity.ok(mapUserToDto(user));
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        userRepository.deleteById(userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/vehicles/{vehicleId}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long vehicleId) {
        vehicleRepository.deleteById(vehicleId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/users/{userId}")
    public ResponseEntity<UserDTO> updateUser(
            @PathVariable Long userId,
            @RequestBody UserDTO request
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhoneNumber(request.getPhoneNumber());
        if (request.getEmail() != null && !request.getEmail().isEmpty()) {
            user.setEmail(request.getEmail());
        }
        
        userRepository.save(user);
        return ResponseEntity.ok(mapUserToDto(user));
    }

    @PutMapping("/vehicles/{vehicleId}")
    public ResponseEntity<VehicleDTO> updateVehicle(
            @PathVariable Long vehicleId,
            @RequestBody VehicleRequest request
    ) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found"));
        
        vehicle.setModel(request.getModel());
        vehicle.setRegistrationNumber(request.getRegistrationNumber());
        vehicle.setSeatingCapacity(request.getSeatingCapacity());
        
        vehicleRepository.save(vehicle);
        return ResponseEntity.ok(mapVehicleToDto(vehicle));
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Long>> getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalDrivers = vehicleRepository.findAll().stream()
                .map(v -> v.getOwner().getId())
                .distinct()
                .count();
        long totalVehicles = vehicleRepository.count();
        long totalTrips = tripRepository.count();
        
        // Mocking distance and fuel stats since live GPS isn't persistently tracked yet
        long totalDistanceKm = totalTrips * 12; // avg 12 km per trip
        long fuelConsumptionLiters = totalDistanceKm / 15; // avg 15 km/l
        long costPerKm = 10; // avg 10 Rs/km

        Map<String, Long> stats = Map.of(
                "totalUsers", totalUsers,
                "totalDrivers", totalDrivers,
                "totalVehicles", totalVehicles,
                "totalTrips", totalTrips,
                "totalDistance", totalDistanceKm,
                "fuelConsumption", fuelConsumptionLiters,
                "costPerKm", costPerKm
        );

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        // Fetch all users and map to DTOs without wallet/balance info
        List<UserDTO> users = userRepository.findAll().stream()
                .map(this::mapUserToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @GetMapping("/settings")
    public ResponseEntity<CompanySettingsDTO> getSettings(Authentication authentication) {
        return ResponseEntity.ok(adminService.getCompanySettings(authentication.getName()));
    }

    @PutMapping("/settings")
    public ResponseEntity<CompanySettingsDTO> updateSettings(
            @RequestBody CompanySettingsDTO request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(adminService.updateCompanySettings(authentication.getName(), request));
    }

    @GetMapping("/employees")
    public ResponseEntity<List<UserDTO>> getEmployees(Authentication authentication) {
        return ResponseEntity.ok(adminService.getCompanyEmployees(authentication.getName()));
    }

    @GetMapping("/vehicles")
    public ResponseEntity<List<VehicleDTO>> getAllVehicles() {
        List<VehicleDTO> vehicles = vehicleRepository.findAll().stream()
                .map(this::mapVehicleToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(vehicles);
    }

    @PutMapping("/users/{userId}/role")
    public ResponseEntity<UserDTO> updateUserRole(
            @PathVariable Long userId,
            @RequestParam Role role
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setRole(role);
        userRepository.save(user);
        return ResponseEntity.ok(mapUserToDto(user));
    }

    private UserDTO mapUserToDto(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole())
                .companyName(user.getCompany() != null ? user.getCompany().getName() : null)
                .build();
    }

    private VehicleDTO mapVehicleToDto(Vehicle vehicle) {
        return VehicleDTO.builder()
                .id(vehicle.getId())
                .model(vehicle.getModel())
                .registrationNumber(vehicle.getRegistrationNumber())
                .seatingCapacity(vehicle.getSeatingCapacity())
                .userId(vehicle.getOwner() != null ? vehicle.getOwner().getId() : null)
                .build();
    }
}
