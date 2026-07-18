package com.odoohackathon.odoohackathon.domain.analytics.controller;

import com.odoohackathon.odoohackathon.domain.analytics.dto.AnalyticsReportDTO;
import com.odoohackathon.odoohackathon.domain.analytics.service.AnalyticsService;
import com.odoohackathon.odoohackathon.domain.audit.service.PdfReportService;
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
    private final PdfReportService pdfReportService;

    @GetMapping("/dashboard")
    public ResponseEntity<AnalyticsReportDTO> getDashboard(Authentication authentication) {
        // In a real app, you would add an @PreAuthorize("hasRole('COMPANY_ADMIN')") here
        return ResponseEntity.ok(analyticsService.getCompanyDashboard(authentication.getName()));
    }

    @GetMapping(value = "/dashboard/pdf", produces = "application/pdf")
    public ResponseEntity<byte[]> getDashboardPdf(Authentication authentication) {
        try {
            AnalyticsReportDTO dto = analyticsService.getCompanyDashboard(authentication.getName());
            byte[] pdfBytes = pdfReportService.generateAdminAnalyticsPdfReport(dto);
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=admin-analytics.pdf")
                    .body(pdfBytes);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
}
