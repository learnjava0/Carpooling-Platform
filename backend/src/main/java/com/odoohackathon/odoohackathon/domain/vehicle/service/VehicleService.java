package com.odoohackathon.odoohackathon.domain.vehicle.service;

import com.odoohackathon.odoohackathon.domain.user.entity.User;
import com.odoohackathon.odoohackathon.domain.user.repository.UserRepository;
import com.odoohackathon.odoohackathon.domain.vehicle.dto.VehicleDTO;
import com.odoohackathon.odoohackathon.domain.vehicle.dto.VehicleRequest;
import com.odoohackathon.odoohackathon.domain.vehicle.entity.Vehicle;
import com.odoohackathon.odoohackathon.domain.vehicle.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;

    public VehicleDTO registerVehicle(String userEmail, VehicleRequest request) {
        User owner = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Vehicle vehicle = Vehicle.builder()
                .owner(owner)
                .model(request.getModel())
                .registrationNumber(request.getRegistrationNumber())
                .seatingCapacity(request.getSeatingCapacity())
                .build();

        vehicle = vehicleRepository.save(vehicle);
        return mapToDto(vehicle);
    }

    public List<VehicleDTO> getUserVehicles(String userEmail) {
        User owner = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return vehicleRepository.findByOwnerId(owner.getId())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private VehicleDTO mapToDto(Vehicle vehicle) {
        return VehicleDTO.builder()
                .id(vehicle.getId())
                .model(vehicle.getModel())
                .registrationNumber(vehicle.getRegistrationNumber())
                .seatingCapacity(vehicle.getSeatingCapacity())
                .build();
    }
}
