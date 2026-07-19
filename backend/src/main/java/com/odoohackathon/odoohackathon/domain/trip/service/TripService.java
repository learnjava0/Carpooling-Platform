package com.odoohackathon.odoohackathon.domain.trip.service;

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
                .status(TripStatus.PENDING)
                .startOtp(otp)
                .build();

        trip = tripRepository.save(trip);

        return mapToDto(trip);
    }

    @Transactional
    public TripDTO acceptTrip(Long tripId, String driverEmail) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new IllegalArgumentException("Trip not found"));

        if (!trip.getRide().getDriver().getEmail().equals(driverEmail)) {
            throw new IllegalArgumentException("Only the driver can accept the trip");
        }

        if (trip.getStatus() != TripStatus.PENDING) {
            throw new IllegalArgumentException("Can only accept PENDING trips");
        }

        trip.setStatus(TripStatus.ACCEPTED);
        trip = tripRepository.save(trip);

        return mapToDto(trip);
    }

    @Transactional
    public TripDTO rejectTrip(Long tripId, String driverEmail) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new IllegalArgumentException("Trip not found"));

        if (!trip.getRide().getDriver().getEmail().equals(driverEmail)) {
            throw new IllegalArgumentException("Only the driver can reject the trip");
        }

        if (trip.getStatus() != TripStatus.PENDING) {
            throw new IllegalArgumentException("Can only reject PENDING trips");
        }

        // Restore seats since it's rejected
        Ride ride = trip.getRide();
        ride.setAvailableSeats(ride.getAvailableSeats() + trip.getBookedSeats());
        rideRepository.save(ride);

        trip.setStatus(TripStatus.REJECTED);
        return mapToDto(tripRepository.save(trip));
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

        if (trip.getStatus() != TripStatus.ACCEPTED) {
            throw new IllegalArgumentException("Only ACCEPTED trips can be started");
        }

        if (trip.getStartOtp() == null || !trip.getStartOtp().equals(otp)) {
            throw new IllegalArgumentException("Invalid OTP");
        }

        trip.setStatus(TripStatus.STARTED);
        return mapToDto(tripRepository.save(trip));
    }

    @Transactional
    public TripDTO cancelTripAsPassenger(Long tripId, String userEmail) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new IllegalArgumentException("Trip not found"));

        if (!trip.getPassenger().getEmail().equals(userEmail)) {
            throw new IllegalArgumentException("Only the passenger who booked this trip can cancel it");
        }

        if (trip.getStatus() != TripStatus.PENDING && trip.getStatus() != TripStatus.ACCEPTED && trip.getStatus() != TripStatus.BOOKED) {
            throw new IllegalArgumentException("Cannot cancel a trip that is already started or completed");
        }

        // Restore seats
        Ride ride = trip.getRide();
        ride.setAvailableSeats(ride.getAvailableSeats() + trip.getBookedSeats());
        rideRepository.save(ride);

        trip.setStatus(TripStatus.CANCELLED);
        return mapToDto(tripRepository.save(trip));
    }

    private TripDTO mapToDto(Trip trip) {
        return TripDTO.builder()
                .id(trip.getId())
                .bookedSeats(trip.getBookedSeats())
                .totalFare(trip.getTotalFare())
                .status(trip.getStatus())
                .startOtp(trip.getStartOtp())
                .passenger(UserDTO.builder()
                        .id(trip.getPassenger().getId())
                        .firstName(trip.getPassenger().getFirstName())
                        .lastName(trip.getPassenger().getLastName())
                        .email(trip.getPassenger().getEmail())
                        .phoneNumber(trip.getPassenger().getPhoneNumber())
                        .build())
                .ride(com.odoohackathon.odoohackathon.domain.ride.dto.RideDTO.builder()
                        .id(trip.getRide().getId())
                        .pickupLocation(trip.getRide().getPickupLocation())
                        .destination(trip.getRide().getDestination())
                        .departureTime(trip.getRide().getDepartureTime())
                        .farePerSeat(trip.getRide().getFarePerSeat())
                        .driver(UserDTO.builder()
                                .firstName(trip.getRide().getDriver().getFirstName())
                                .lastName(trip.getRide().getDriver().getLastName())
                                .email(trip.getRide().getDriver().getEmail())
                                .phoneNumber(trip.getRide().getDriver().getPhoneNumber())
                                .build())
                        .build())
                .build();
    }
}
