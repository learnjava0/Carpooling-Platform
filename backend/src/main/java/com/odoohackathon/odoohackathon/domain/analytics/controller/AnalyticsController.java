package com.odoohackathon.odoohackathon.domain.analytics.controller;

import com.odoohackathon.odoohackathon.domain.analytics.dto.AnalyticsReportDTO;
import com.odoohackathon.odoohackathon.domain.analytics.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

    /**
     * RBAC: Only COMPANY_ADMIN users may access the analytics dashboard.
     * Returns 403 Forbidden for EMPLOYEE role.
     */
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('COMPANY_ADMIN')")
    public ResponseEntity<AnalyticsReportDTO> getDashboard(Authentication authentication) {
        return ResponseEntity.ok(analyticsService.getCompanyDashboard(authentication.getName()));
    }
}
