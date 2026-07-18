package com.odoohackathon.odoohackathon.domain.audit.controller;

import com.odoohackathon.odoohackathon.domain.audit.dto.AuditLog;
import com.odoohackathon.odoohackathon.domain.audit.service.PdfReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/audit")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminAuditController {

    @Qualifier("clickhouseJdbcTemplate")
    private final JdbcTemplate clickhouseJdbcTemplate;
    private final PdfReportService pdfReportService;

    @GetMapping(value = "/logs/pdf", produces = "application/pdf")
    public ResponseEntity<byte[]> downloadAuditPdf() {
        try {
            byte[] pdfBytes = pdfReportService.generateAuditPdfReport();
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=audit-logs.pdf")
                    .body(pdfBytes);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/logs")
    public ResponseEntity<List<AuditLog>> getAuditLogs() {
        try {
            String sql = "SELECT event_type, user_email, details, ip_address FROM audit_logs ORDER BY event_time DESC LIMIT 100";
            List<AuditLog> logs = clickhouseJdbcTemplate.query(sql, (rs, rowNum) -> AuditLog.builder()
                    .eventType(rs.getString("event_type"))
                    .userEmail(rs.getString("user_email"))
                    .details(rs.getString("details"))
                    .ipAddress(rs.getString("ip_address"))
                    .build());
            return ResponseEntity.ok(logs);
        } catch (Exception e) {
            // Return empty list gracefully if ClickHouse is missing during the hackathon demo
            return ResponseEntity.ok(List.of());
        }
    }
}
