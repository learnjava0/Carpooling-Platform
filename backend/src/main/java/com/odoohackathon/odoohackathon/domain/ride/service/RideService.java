package com.odoohackathon.odoohackathon.domain.ride.service;

import com.odoohackathon.odoohackathon.domain.ride.dto.RideDTO;
import com.odoohackathon.odoohackathon.domain.ride.dto.RideRequest;
import com.odoohackathon.odoohackathon.domain.ride.entity.Ride;
import com.odoohackathon.odoohackathon.domain.ride.repository.RideRepository;
import com.odoohackathon.odoohackathon.domain.user.dto.UserDTO;
import com.odoohackathon.odoohackathon.domain.user.entity.User;
import com.odoohackathon.odoohackathon.domain.user.repository.UserRepository;
import com.odoohackathon.odoohackathon.domain.vehicle.dto.VehicleDTO;
import com.odoohackathon.odoohackathon.domain.vehicle.entity.Vehicle;
import com.odoohackathon.odoohackathon.domain.vehicle.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import com.odoohackathon.odoohackathon.domain.trip.dto.TripDTO;
import java.util.Collections;

@Service
@RequiredArgsConstructor
@Transactional
public class RideService {

    private final RideRepository rideRepository;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;

    public RideDTO publishRide(String userEmail, RideRequest request) {
        User driver = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("Driver not found"));

        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found"));

        if (!vehicle.getOwner().getId().equals(driver.getId())) {
            throw new IllegalArgumentException("Driver must own the vehicle to publish a ride");
        }
        
        if (request.getAvailableSeats() > vehicle.getSeatingCapacity()) {
            throw new IllegalArgumentException("Available seats cannot exceed vehicle capacity");
        }

        Ride ride = Ride.builder()
                .driver(driver)
                .vehicle(vehicle)
                .pickupLocation(request.getPickupLocation())
                .destination(request.getDestination())
                .departureTime(request.getDepartureTime())
                .availableSeats(request.getAvailableSeats())
                .farePerSeat(request.getFarePerSeat())
                .routeWaypoints(request.getRouteWaypoints())
                .build();

        ride = rideRepository.save(ride);
        return mapToDto(ride);
    }

    public List<RideDTO> searchRides(String pickup, String destination, LocalDateTime time, int seats) {
        return rideRepository.findRidesByLocationsAndSeats(
                pickup, destination, time, seats)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public java.util.Map<String, List<String>> getAvailableLocations() {
        java.util.Map<String, List<String>> locations = new java.util.HashMap<>();
        
        List<String> pickups = rideRepository.findDistinctPickupLocations();
        List<String> destinations = rideRepository.findDistinctDestinations();
        
        // Also fetch all route waypoints to extract intermediate stops
        List<String> waypointsList = rideRepository.findAll().stream()
                .filter(r -> r.getRouteWaypoints() != null && !r.getRouteWaypoints().isEmpty() && r.getAvailableSeats() > 0 && r.getDepartureTime().isAfter(LocalDateTime.now()))
                .map(Ride::getRouteWaypoints)
                .collect(Collectors.toList());
                
        java.util.Set<String> allLocations = new java.util.HashSet<>();
        allLocations.addAll(pickups);
        allLocations.addAll(destinations);
        
        for (String wps : waypointsList) {
            String[] parts = wps.split(",");
            for (String part : parts) {
                allLocations.add(part.trim());
            }
        }
        
        List<String> sortedLocations = new java.util.ArrayList<>(allLocations);
        java.util.Collections.sort(sortedLocations);
        
        locations.put("pickupLocations", sortedLocations);
        locations.put("destinations", sortedLocations);
        return locations;
    }

    public List<RideDTO> getDriverRides(String userEmail) {
        User driver = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("Driver not found"));

        return rideRepository.findByDriverId(driver.getId())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public RideDTO updateMyRide(Long id, String userEmail, RideRequest request) {
        Ride ride = rideRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Ride not found"));
        
        if (!ride.getDriver().getEmail().equals(userEmail)) {
            throw new IllegalArgumentException("Unauthorized to edit this ride");
        }

        if (ride.getAvailableSeats() < ride.getVehicle().getSeatingCapacity()) {
            throw new IllegalStateException("Cannot edit a ride that already has confirmed bookings.");
        }

        ride.setPickupLocation(request.getPickupLocation());
        ride.setDestination(request.getDestination());
        ride.setDepartureTime(request.getDepartureTime());
        ride.setFarePerSeat(request.getFarePerSeat());
        ride.setRouteWaypoints(request.getRouteWaypoints());

        return mapToDto(rideRepository.save(ride));
    }

    private RideDTO mapToDto(Ride ride) {
        return RideDTO.builder()
                .id(ride.getId())
                .driver(UserDTO.builder()
                        .id(ride.getDriver().getId())
                        .firstName(ride.getDriver().getFirstName())
                        .lastName(ride.getDriver().getLastName())
                        .email(ride.getDriver().getEmail())
                        .phoneNumber(ride.getDriver().getPhoneNumber())
                        .companyName(ride.getDriver().getCompany() != null ? ride.getDriver().getCompany().getName() : null)
                        .build())
                .vehicle(VehicleDTO.builder()
                        .id(ride.getVehicle().getId())
                        .model(ride.getVehicle().getModel())
                        .registrationNumber(ride.getVehicle().getRegistrationNumber())
                        .seatingCapacity(ride.getVehicle().getSeatingCapacity())
                        .build())
                .pickupLocation(ride.getPickupLocation())
                .destination(ride.getDestination())
                .departureTime(ride.getDepartureTime())
                .availableSeats(ride.getAvailableSeats())
                .farePerSeat(ride.getFarePerSeat())
                .routeWaypoints(ride.getRouteWaypoints())
                .trips(ride.getTrips() != null ? ride.getTrips().stream().map(trip -> TripDTO.builder()
                        .id(trip.getId())
                        .passenger(UserDTO.builder()
                                .id(trip.getPassenger().getId())
                                .firstName(trip.getPassenger().getFirstName())
                                .lastName(trip.getPassenger().getLastName())
                                .email(trip.getPassenger().getEmail())
                                .phoneNumber(trip.getPassenger().getPhoneNumber())
                                .build())
                        .bookedSeats(trip.getBookedSeats())
                        .totalFare(trip.getTotalFare())
                        .status(trip.getStatus())
                        .build()).collect(Collectors.toList()) : Collections.emptyList())
                .build();
    }
}
