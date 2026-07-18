package com.odoohackathon.odoohackathon.domain.audit.service;

import com.odoohackathon.odoohackathon.domain.audit.dto.AuditLog;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Service
public class PdfReportService {

    private final JdbcTemplate clickhouseJdbcTemplate;

    public PdfReportService(@Qualifier("clickhouseJdbcTemplate") JdbcTemplate clickhouseJdbcTemplate) {
        this.clickhouseJdbcTemplate = clickhouseJdbcTemplate;
    }

    public byte[] generateAuditPdfReport() throws DocumentException {
        String sql = "SELECT event_time, event_type, user_email, details, ip_address FROM audit_logs ORDER BY event_time DESC LIMIT 200";
        List<AuditLog> logs = clickhouseJdbcTemplate.query(sql, (rs, rowNum) -> mapRow(rs));

        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, out);
        document.open();
        document.add(new Paragraph("Audit Log Report"));
        document.add(new Paragraph("Generated at: " + java.time.LocalDateTime.now()));
        document.add(new Paragraph(" "));
        for (AuditLog log : logs) {
            String line = String.format("%s | %s | %s | %s | %s", log.getEventTime(), log.getEventType(), log.getUserEmail(), log.getDetails(), log.getIpAddress());
            document.add(new Paragraph(line));
        }
        document.close();
        return out.toByteArray();
    }

    private AuditLog mapRow(ResultSet rs) throws SQLException {
        return AuditLog.builder()
                .eventTime(rs.getString("event_time"))
                .eventType(rs.getString("event_type"))
                .userEmail(rs.getString("user_email"))
                .details(rs.getString("details"))
                .ipAddress(rs.getString("ip_address"))
                .build();
    }
}
