package com.odoohackathon.odoohackathon.domain.user.service;

import com.odoohackathon.odoohackathon.domain.user.dto.CompanySettingsDTO;
import com.odoohackathon.odoohackathon.domain.user.dto.UserDTO;
import com.odoohackathon.odoohackathon.domain.user.entity.Company;
import com.odoohackathon.odoohackathon.domain.user.entity.CompanySettings;
import com.odoohackathon.odoohackathon.domain.user.entity.Role;
import com.odoohackathon.odoohackathon.domain.user.entity.User;
import com.odoohackathon.odoohackathon.domain.user.repository.CompanySettingsRepository;
import com.odoohackathon.odoohackathon.domain.user.repository.UserRepository;
import com.odoohackathon.odoohackathon.domain.vehicle.dto.VehicleDTO;
import com.odoohackathon.odoohackathon.domain.vehicle.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final CompanySettingsRepository companySettingsRepository;
    private final VehicleRepository vehicleRepository;

    public CompanySettingsDTO getCompanySettings(String adminEmail) {
        Company company = getAdminCompany(adminEmail);
        CompanySettings settings = getOrCreateSettings(company);
        
        return CompanySettingsDTO.builder()
                .baseFare(settings.getBaseFare())
                .fuelCostPerKm(settings.getFuelCostPerKm())
                .travelCostDeduction(settings.getTravelCostDeduction())
                .build();
    }

    @Transactional
    public CompanySettingsDTO updateCompanySettings(String adminEmail, CompanySettingsDTO request) {
        Company company = getAdminCompany(adminEmail);
        CompanySettings settings = getOrCreateSettings(company);
        
        settings.setBaseFare(request.getBaseFare());
        settings.setFuelCostPerKm(request.getFuelCostPerKm());
        settings.setTravelCostDeduction(request.getTravelCostDeduction());
        
        settings = companySettingsRepository.save(settings);
        
        return CompanySettingsDTO.builder()
                .baseFare(settings.getBaseFare())
                .fuelCostPerKm(settings.getFuelCostPerKm())
                .travelCostDeduction(settings.getTravelCostDeduction())
                .build();
    }

    public List<UserDTO> getCompanyEmployees(String adminEmail) {
        Company company = getAdminCompany(adminEmail);
        return userRepository.findByCompanyId(company.getId()).stream()
                .map(user -> UserDTO.builder()
                        .id(user.getId())
                        .firstName(user.getFirstName())
                        .lastName(user.getLastName())
                        .email(user.getEmail())
                        .phoneNumber(user.getPhoneNumber())
                        .role(user.getRole())
                        .companyName(company.getName())
                        .build())
                .collect(Collectors.toList());
    }

    public List<VehicleDTO> getCompanyVehicles(String adminEmail) {
        Company company = getAdminCompany(adminEmail);
        // We get all vehicles belonging to employees of this company
        List<User> employees = userRepository.findByCompanyId(company.getId());
        
        return employees.stream()
                .flatMap(emp -> vehicleRepository.findByOwnerId(emp.getId()).stream())
                .map(v -> VehicleDTO.builder()
                        .id(v.getId())
                        .model(v.getModel())
                        .registrationNumber(v.getRegistrationNumber())
                        .seatingCapacity(v.getSeatingCapacity())
                        .userId(v.getOwner().getId())
                        .build())
                .collect(Collectors.toList());
    }

    private Company getAdminCompany(String adminEmail) {
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new IllegalArgumentException("Admin not found"));
        if (admin.getRole() != Role.ADMIN) {
            throw new IllegalArgumentException("Unauthorized");
        }
        return admin.getCompany();
    }

    private CompanySettings getOrCreateSettings(Company company) {
        return companySettingsRepository.findByCompany(company)
                .orElseGet(() -> companySettingsRepository.save(CompanySettings.builder().company(company).build()));
    }
}
