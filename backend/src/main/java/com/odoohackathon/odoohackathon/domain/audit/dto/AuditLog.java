package com.odoohackathon.odoohackathon.domain.audit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {
    private String eventTime;
    private String eventType;
    private String userEmail;
    private String details;
    private String ipAddress;
}
