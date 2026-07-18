package com.odoohackathon.odoohackathon.domain.user.service;

import com.odoohackathon.odoohackathon.config.security.CustomUserDetails;
import com.odoohackathon.odoohackathon.config.security.JwtService;
import com.odoohackathon.odoohackathon.domain.payment.entity.Wallet;
import com.odoohackathon.odoohackathon.domain.payment.repository.WalletRepository;
import com.odoohackathon.odoohackathon.domain.user.dto.AuthRequest;
import com.odoohackathon.odoohackathon.domain.user.dto.AuthResponse;
import com.odoohackathon.odoohackathon.domain.user.dto.RegisterRequest;
import com.odoohackathon.odoohackathon.domain.user.dto.UserDTO;
import com.odoohackathon.odoohackathon.domain.audit.service.AuditService;
import com.odoohackathon.odoohackathon.domain.user.entity.Company;
import com.odoohackathon.odoohackathon.domain.user.entity.Role;
import com.odoohackathon.odoohackathon.domain.user.entity.User;
import com.odoohackathon.odoohackathon.domain.user.entity.PasswordResetToken;
import com.odoohackathon.odoohackathon.domain.user.repository.CompanyRepository;
import com.odoohackathon.odoohackathon.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final WalletRepository walletRepository;
    private final AuditService auditService;
    private final com.odoohackathon.odoohackathon.domain.user.repository.PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }

        // Extract domain from email to find or create company
        String emailDomain = request.getEmail().substring(request.getEmail().indexOf("@") + 1);
        Company company = companyRepository.findByEmailDomain(emailDomain)
                .orElseGet(() -> companyRepository.save(Company.builder()
                        .name(emailDomain)
                        .emailDomain(emailDomain)
                        .active(true)
                        .build()));

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .role(Role.EMPLOYEE)
                .company(company)
                .build();

        user = userRepository.save(user);

        // Create a wallet for the user automatically
        Wallet wallet = Wallet.builder()
                .user(user)
                .balance(BigDecimal.ZERO)
                .build();
        walletRepository.save(wallet);

        CustomUserDetails userDetails = new CustomUserDetails(user);
        String jwtToken = jwtService.generateToken(userDetails);

        return AuthResponse.builder()
                .token(jwtToken)
                .user(mapToDto(user))
                .build();
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        CustomUserDetails userDetails = new CustomUserDetails(user);
        String jwtToken = jwtService.generateToken(userDetails);

        auditService.logEvent("USER_LOGIN", request.getEmail(), "Successful login", "IP_NOT_CAPTURED");

        return AuthResponse.builder()
                .token(jwtToken)
                .user(mapToDto(user))
                .build();
    }

    private UserDTO mapToDto(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole())
                .companyName(user.getCompany().getName())
                .build();
    }

    @Transactional
    public void generatePasswordResetToken(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User with this email not found"));

        passwordResetTokenRepository.deleteByUser(user);

        String token = java.util.UUID.randomUUID().toString();
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .user(user)
                .expiryDate(java.time.LocalDateTime.now().plusHours(1))
                .build();

        passwordResetTokenRepository.save(resetToken);
        
        // In a real hackathon app with email setup, we would send an email here.
        // For now, we will print it to the console for testing purposes.
        System.out.println("PASSWORD RESET TOKEN FOR " + email + ": " + token);
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid token"));

        if (resetToken.getExpiryDate().isBefore(java.time.LocalDateTime.now())) {
            passwordResetTokenRepository.delete(resetToken);
            throw new IllegalArgumentException("Token has expired");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        passwordResetTokenRepository.delete(resetToken);
    }
}
