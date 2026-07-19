package com.odoohackathon.odoohackathon.domain.audit.service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuditService {

    @Qualifier("clickhouseJdbcTemplate")
    private final JdbcTemplate clickhouseJdbcTemplate;

    @PostConstruct
    public void init() {
        try {
            // Create the MergeTree table optimized for time-series logging
            String createTableSql = """
                CREATE TABLE IF NOT EXISTS audit_logs (
                    event_id UUID DEFAULT generateUUIDv4(),
                    event_time DateTime DEFAULT now(),
                    event_type String,
                    user_email String,
                    details String,
                    ip_address String
                ) ENGINE = MergeTree()
                ORDER BY (event_time, event_type);
                """;
            clickhouseJdbcTemplate.execute(createTableSql);
            log.info("ClickHouse audit_logs table initialized successfully.");
        } catch (Exception e) {
            log.error("Failed to initialize ClickHouse table. Logging will fall back to console: {}", e.getMessage());
        }
    }

    public static final java.util.List<com.odoohackathon.odoohackathon.domain.audit.dto.AuditLog> inMemoryLogs = java.util.Collections.synchronizedList(new java.util.ArrayList<>());

    @Async
    public void logEvent(String eventType, String userEmail, String details, String ipAddress) {
        try {
            inMemoryLogs.add(0, com.odoohackathon.odoohackathon.domain.audit.dto.AuditLog.builder()
                    .eventTime(LocalDateTime.now().toString())
                    .eventType(eventType)
                    .userEmail(userEmail)
                    .details(details)
                    .ipAddress(ipAddress)
                    .build());
            
            String insertSql = "INSERT INTO audit_logs (event_time, event_type, user_email, details, ip_address) VALUES (?, ?, ?, ?, ?)";
            clickhouseJdbcTemplate.update(insertSql, LocalDateTime.now(), eventType, userEmail, details, ipAddress);
        } catch (Exception e) {
            log.warn("[FALLBACK AUDIT LOG] Type: {}, User: {}, Details: {}", eventType, userEmail, details);
        }
    }
}
