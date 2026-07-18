package com.odoohackathon.odoohackathon.domain.admin.dto;

import lombok.Data;

@Data
public class DriverOnboardRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String phoneNumber;
    private String driverLicense;
    private String vehicleModel;
    private String vehicleRegistration;
    private int seatingCapacity;
    private String insuranceDocument;
    private String registrationDocument;
    private String pollutionDocument;
}
