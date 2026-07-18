package com.odoohackathon.odoohackathon.domain.notification.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
public class TwilioService {

    @Value("${twilio.account.sid:}")
    private String accountSid;

    @Value("${twilio.auth.token:}")
    private String authToken;

    @Value("${twilio.phone.number:}")
    private String twilioPhoneNumber;

    @PostConstruct
    public void init() {
        if (accountSid != null && !accountSid.isEmpty() && authToken != null && !authToken.isEmpty()) {
            Twilio.init(accountSid, authToken);
        }
    }

    public String generateOtp() {
        SecureRandom random = new SecureRandom();
        int otp = 1000 + random.nextInt(9000);
        return String.valueOf(otp);
    }

    public void sendOtpSms(String toPhoneNumber, String otp) {
        if (accountSid == null || accountSid.isEmpty()) {
            System.out.println("Twilio not configured. OTP for " + toPhoneNumber + " is " + otp);
            return;
        }

        try {
            Message message = Message.creator(
                    new PhoneNumber(toPhoneNumber),
                    new PhoneNumber(twilioPhoneNumber),
                    "Your Carpooling Ride Start OTP is: " + otp
            ).create();
            System.out.println("OTP sent successfully. SID: " + message.getSid());
        } catch (Exception e) {
            System.err.println("Failed to send OTP via Twilio: " + e.getMessage());
            // Fallback for testing environment
            System.out.println("Fallback - OTP for " + toPhoneNumber + " is " + otp);
        }
    }
}
