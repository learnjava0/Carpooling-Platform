package com.odoohackathon.odoohackathon.domain.user.service;

import com.odoohackathon.odoohackathon.domain.user.dto.SavedLocationDTO;
import com.odoohackathon.odoohackathon.domain.user.entity.SavedLocation;
import com.odoohackathon.odoohackathon.domain.user.entity.User;
import com.odoohackathon.odoohackathon.domain.user.repository.SavedLocationRepository;
import com.odoohackathon.odoohackathon.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SavedLocationService {

    private final SavedLocationRepository savedLocationRepository;
    private final UserRepository userRepository;

    public List<SavedLocationDTO> getSavedLocations(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        return savedLocationRepository.findByUserId(user.getId())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public SavedLocationDTO addSavedLocation(String userEmail, SavedLocationDTO request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        SavedLocation savedLocation = SavedLocation.builder()
                .user(user)
                .name(request.getName())
                .address(request.getAddress())
                .build();
                
        savedLocation = savedLocationRepository.save(savedLocation);
        return mapToDto(savedLocation);
    }

    public void deleteSavedLocation(String userEmail, Long locationId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
                
        SavedLocation location = savedLocationRepository.findById(locationId)
                .orElseThrow(() -> new IllegalArgumentException("Location not found"));
                
        if (!location.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Unauthorized to delete this location");
        }
        
        savedLocationRepository.delete(location);
    }

    private SavedLocationDTO mapToDto(SavedLocation location) {
        return SavedLocationDTO.builder()
                .id(location.getId())
                .name(location.getName())
                .address(location.getAddress())
                .createdAt(location.getCreatedAt())
                .build();
    }
}
