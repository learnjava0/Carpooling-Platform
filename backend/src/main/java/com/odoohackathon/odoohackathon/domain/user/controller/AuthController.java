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
}
