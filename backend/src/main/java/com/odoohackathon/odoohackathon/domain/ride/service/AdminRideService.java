package com.odoohackathon.odoohackathon.domain.ride.service;

import com.odoohackathon.odoohackathon.domain.ride.dto.RideDTO;
import com.odoohackathon.odoohackathon.domain.ride.dto.RideRequest;
import com.odoohackathon.odoohackathon.domain.ride.entity.Ride;
import com.odoohackathon.odoohackathon.domain.ride.repository.RideRepository;
import com.odoohackathon.odoohackathon.domain.user.dto.UserDTO;
import com.odoohackathon.odoohackathon.domain.vehicle.dto.VehicleDTO;
import com.odoohackathon.odoohackathon.domain.trip.dto.TripDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminRideService {

    private final RideRepository rideRepository;

    public List<RideDTO> getAllRides() {
        return rideRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public RideDTO updateRide(Long id, RideRequest request) {
        Ride ride = rideRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Ride not found"));
        
        // Cannot edit if already booked by someone (seats < capacity)
        if (ride.getAvailableSeats() < ride.getVehicle().getSeatingCapacity()) {
            throw new IllegalStateException("Cannot edit a ride that already has confirmed bookings.");
        }

        ride.setPickupLocation(request.getPickupLocation());
        ride.setDestination(request.getDestination());
        ride.setDepartureTime(request.getDepartureTime());
        ride.setFarePerSeat(request.getFarePerSeat());
        ride.setRouteWaypoints(request.getRouteWaypoints());
        // availableSeats could also be updated, but generally restricted by vehicle capacity

        ride = rideRepository.save(ride);
        return mapToDto(ride);
    }

    @Transactional
    public void deleteRide(Long id) {
        Ride ride = rideRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Ride not found"));
        
        // Cannot delete if already booked
        if (ride.getAvailableSeats() < ride.getVehicle().getSeatingCapacity()) {
            throw new IllegalStateException("Cannot delete a ride that already has confirmed bookings.");
        }

        rideRepository.delete(ride);
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
                        .companyName(ride.getDriver().getCompany().getName())
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
                                .build())
                        .bookedSeats(trip.getBookedSeats())
                        .totalFare(trip.getTotalFare())
                        .status(trip.getStatus())
                        .build()).collect(Collectors.toList()) : java.util.Collections.emptyList())
                .build();
    }
}
