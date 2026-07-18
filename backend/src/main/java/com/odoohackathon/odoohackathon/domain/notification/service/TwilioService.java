package com.odoohackathon.odoohackathon.domain.notification.service;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
public class TwilioService {

    public String generateOtp() {
        SecureRandom random = new SecureRandom();
        int otp = 1000 + random.nextInt(9000);
        return String.valueOf(otp);
    }
}
