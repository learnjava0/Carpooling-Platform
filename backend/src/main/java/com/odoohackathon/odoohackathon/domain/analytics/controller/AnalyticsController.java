package com.odoohackathon.odoohackathon.domain.analytics.controller;

import com.odoohackathon.odoohackathon.domain.analytics.dto.AnalyticsReportDTO;
import com.odoohackathon.odoohackathon.domain.analytics.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    public ResponseEntity<AnalyticsReportDTO> getDashboard(Authentication authentication) {
        // In a real app, you would add an @PreAuthorize("hasRole('COMPANY_ADMIN')") here
        return ResponseEntity.ok(analyticsService.getCompanyDashboard(authentication.getName()));
    }
}
