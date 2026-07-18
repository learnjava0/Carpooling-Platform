package com.odoohackathon.odoohackathon.domain.trip.service;

import com.odoohackathon.odoohackathon.domain.ride.dto.RideDTO;
import com.odoohackathon.odoohackathon.domain.ride.entity.Ride;
import com.odoohackathon.odoohackathon.domain.ride.repository.RideRepository;
import com.odoohackathon.odoohackathon.domain.trip.dto.TripDTO;
import com.odoohackathon.odoohackathon.domain.trip.dto.TripRequest;
import com.odoohackathon.odoohackathon.domain.trip.entity.Trip;
import com.odoohackathon.odoohackathon.domain.trip.entity.TripStatus;
import com.odoohackathon.odoohackathon.domain.trip.repository.TripRepository;
import com.odoohackathon.odoohackathon.domain.user.dto.UserDTO;
import com.odoohackathon.odoohackathon.domain.user.entity.User;
import com.odoohackathon.odoohackathon.domain.user.repository.UserRepository;
import com.odoohackathon.odoohackathon.domain.vehicle.dto.VehicleDTO;
import com.odoohackathon.odoohackathon.domain.notification.service.TwilioService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TripService {

    private final TripRepository tripRepository;
    private final RideRepository rideRepository;
    private final UserRepository userRepository;
    private final TwilioService twilioService;

    @Transactional
    public TripDTO bookTrip(String userEmail, TripRequest request) {
        User passenger = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("Passenger not found"));

        Ride ride = rideRepository.findById(request.getRideId())
                .orElseThrow(() -> new IllegalArgumentException("Ride not found"));

        if (ride.getDriver().getId().equals(passenger.getId())) {
            throw new IllegalArgumentException("Driver cannot book their own ride");
        }

        if (ride.getAvailableSeats() < request.getBookedSeats()) {
            throw new IllegalArgumentException("Not enough available seats");
        }

        // Deduct seats from the ride
        ride.setAvailableSeats(ride.getAvailableSeats() - request.getBookedSeats());
        rideRepository.save(ride);

        BigDecimal totalFare = ride.getFarePerSeat().multiply(BigDecimal.valueOf(request.getBookedSeats()));

        String otp = twilioService.generateOtp();

        Trip trip = Trip.builder()
                .ride(ride)
                .passenger(passenger)
                .bookedSeats(request.getBookedSeats())
                .totalFare(totalFare)
                .status(TripStatus.BOOKED)
                .startOtp(otp)
                .build();

        trip = tripRepository.save(trip);

        if (passenger.getPhoneNumber() != null && !passenger.getPhoneNumber().isEmpty()) {
            twilioService.sendOtpSms(passenger.getPhoneNumber(), otp);
        }

        return mapToDto(trip);
    }

    public List<TripDTO> getPassengerTrips(String userEmail) {
        User passenger = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return tripRepository.findByPassengerId(passenger.getId())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public TripDTO updateTripStatus(Long tripId, String status, String driverEmail) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new IllegalArgumentException("Trip not found"));
        
        // Verify driver is the one updating (basic authorization)
        if (!trip.getRide().getDriver().getEmail().equals(driverEmail)) {
            throw new IllegalArgumentException("Only the driver can update the trip status");
        }

        trip.setStatus(TripStatus.valueOf(status.toUpperCase()));
        return mapToDto(tripRepository.save(trip));
    }

    @Transactional
    public TripDTO verifyOtpAndStartTrip(Long tripId, String otp, String driverEmail) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new IllegalArgumentException("Trip not found"));

        if (!trip.getRide().getDriver().getEmail().equals(driverEmail)) {
            throw new IllegalArgumentException("Only the driver can start the trip");
        }

        if (trip.getStartOtp() == null || !trip.getStartOtp().equals(otp)) {
            throw new IllegalArgumentException("Invalid OTP");
        }

        trip.setStatus(TripStatus.STARTED);
        return mapToDto(tripRepository.save(trip));
    }

    private TripDTO mapToDto(Trip trip) {
        return TripDTO.builder()
                .id(trip.getId())
                .bookedSeats(trip.getBookedSeats())
                .totalFare(trip.getTotalFare())
                .status(trip.getStatus())
                .passenger(UserDTO.builder()
                        .id(trip.getPassenger().getId())
                        .firstName(trip.getPassenger().getFirstName())
                        .lastName(trip.getPassenger().getLastName())
                        .email(trip.getPassenger().getEmail())
                        .phoneNumber(trip.getPassenger().getPhoneNumber())
                        .build())
                .ride(RideDTO.builder()
                        .id(trip.getRide().getId())
                        .pickupLocation(trip.getRide().getPickupLocation())
                        .destination(trip.getRide().getDestination())
                        .departureTime(trip.getRide().getDepartureTime())
                        .farePerSeat(trip.getRide().getFarePerSeat())
                        .driver(UserDTO.builder()
                                .firstName(trip.getRide().getDriver().getFirstName())
                                .lastName(trip.getRide().getDriver().getLastName())
                                .phoneNumber(trip.getRide().getDriver().getPhoneNumber())
                                .build())
                        .vehicle(VehicleDTO.builder()
                                .model(trip.getRide().getVehicle().getModel())
                                .registrationNumber(trip.getRide().getVehicle().getRegistrationNumber())
                                .build())
                        .build())
                .build();
    }
}
