package com.odoohackathon.odoohackathon.domain.trip.service;

import com.odoohackathon.odoohackathon.domain.ride.entity.Ride;
import com.odoohackathon.odoohackathon.domain.ride.repository.RideRepository;
import com.odoohackathon.odoohackathon.domain.trip.dto.TripDTO;
import com.odoohackathon.odoohackathon.domain.trip.dto.TripRequest;
import com.odoohackathon.odoohackathon.domain.trip.entity.Trip;
import com.odoohackathon.odoohackathon.domain.trip.entity.TripStatus;
import com.odoohackathon.odoohackathon.domain.trip.repository.TripRepository;
import com.odoohackathon.odoohackathon.domain.user.entity.User;
import com.odoohackathon.odoohackathon.domain.user.repository.UserRepository;
import com.odoohackathon.odoohackathon.domain.notification.service.TwilioService;
import com.odoohackathon.odoohackathon.domain.vehicle.entity.Vehicle;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TripServiceTest {

    @Mock
    private TripRepository tripRepository;

    @Mock
    private RideRepository rideRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private TwilioService twilioService;

    @InjectMocks
    private TripService tripService;

    private User driver;
    private User passenger;
    private Ride ride;
    private Vehicle vehicle;

    @BeforeEach
    void setUp() {
        driver = User.builder().id(1L).email("driver@company.com").firstName("Driver").build();
        passenger = User.builder().id(2L).email("passenger@company.com").firstName("Passenger").build();
        
        vehicle = Vehicle.builder().id(1L).model("Sedan").build();

        ride = Ride.builder()
                .id(1L)
                .driver(driver)
                .vehicle(vehicle)
                .availableSeats(4)
                .farePerSeat(BigDecimal.valueOf(150))
                .build();
    }

    @Test
    void testBookTrip_Success() {
        TripRequest request = new TripRequest();
        request.setRideId(1L);
        request.setBookedSeats(2);

        when(userRepository.findByEmail("passenger@company.com")).thenReturn(Optional.of(passenger));
        when(rideRepository.findById(1L)).thenReturn(Optional.of(ride));
        when(twilioService.generateOtp()).thenReturn("1234");
        
        Trip savedTrip = Trip.builder()
                .id(1L)
                .ride(ride)
                .passenger(passenger)
                .bookedSeats(2)
                .totalFare(BigDecimal.valueOf(300))
                .status(TripStatus.BOOKED)
                .startOtp("1234")
                .build();
                
        when(tripRepository.save(any(Trip.class))).thenReturn(savedTrip);

        TripDTO result = tripService.bookTrip("passenger@company.com", request);

        assertNotNull(result);
        assertEquals(TripStatus.BOOKED, result.getStatus());
        assertEquals(2, result.getBookedSeats());
        assertEquals(BigDecimal.valueOf(300), result.getTotalFare());
        
        // Verify available seats decreased
        assertEquals(2, ride.getAvailableSeats());
        verify(rideRepository, times(1)).save(ride);
    }

    @Test
    void testCancelTrip_Success() {
        Trip trip = Trip.builder()
                .id(100L)
                .ride(ride)
                .passenger(passenger)
                .bookedSeats(2)
                .status(TripStatus.BOOKED)
                .build();

        when(tripRepository.findById(100L)).thenReturn(Optional.of(trip));
        when(tripRepository.save(any(Trip.class))).thenReturn(trip);

        int initialSeats = ride.getAvailableSeats(); // 4

        TripDTO result = tripService.cancelTripAsPassenger(100L, "passenger@company.com");

        assertNotNull(result);
        assertEquals(TripStatus.CANCELLED, trip.getStatus());
        
        // Verify seats were restored: originally 4 + 2 restored = 6
        assertEquals(initialSeats + 2, ride.getAvailableSeats());
        verify(rideRepository, times(1)).save(ride);
    }
}
