package com.odoohackathon.odoohackathon.domain.user.controller;

import com.odoohackathon.odoohackathon.domain.user.dto.AuthRequest;
import com.odoohackathon.odoohackathon.domain.user.dto.AuthResponse;
import com.odoohackathon.odoohackathon.domain.user.dto.RegisterRequest;
import com.odoohackathon.odoohackathon.domain.user.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Allows React frontend to connect
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody java.util.Map<String, String> request) {
        authService.generatePasswordResetToken(request.get("email"));
        return ResponseEntity.ok("If the email exists, a reset token has been generated.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody java.util.Map<String, String> request) {
        authService.resetPassword(request.get("token"), request.get("newPassword"));
        return ResponseEntity.ok("Password successfully reset.");
    }

    @ExceptionHandler(org.springframework.security.core.AuthenticationException.class)
    public ResponseEntity<String> handleAuthenticationException(Exception e) {
        return ResponseEntity.status(401).body("Invalid email or password");
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGeneralException(Exception e) {
        return ResponseEntity.status(400).body(e.getMessage());
    }
}
