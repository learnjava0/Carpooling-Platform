package com.odoohackathon.odoohackathon.domain.audit.service;

import com.odoohackathon.odoohackathon.domain.audit.dto.AuditLog;
import com.odoohackathon.odoohackathon.domain.analytics.dto.AnalyticsReportDTO;
import com.odoohackathon.odoohackathon.domain.trip.dto.TripDTO;
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

    public byte[] generateAdminAnalyticsPdfReport(AnalyticsReportDTO dto) throws DocumentException {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, out);
        document.open();
        
        document.add(new Paragraph("========================================="));
        document.add(new Paragraph("    RIDECONNECT ADMIN ANALYTICS REPORT   "));
        document.add(new Paragraph("========================================="));
        document.add(new Paragraph("Generated at: " + java.time.LocalDateTime.now()));
        document.add(new Paragraph(" "));
        document.add(new Paragraph("PLATFORM OVERVIEW METRICS:"));
        document.add(new Paragraph("-----------------------------------------"));
        document.add(new Paragraph("Total Rides/Trips Registered: " + dto.getTotalTrips()));
        document.add(new Paragraph("Total Commuting Distance Carpooled: " + String.format("%.2f", dto.getTotalDistanceTravelledKm()) + " km"));
        document.add(new Paragraph("Estimated Fuel Saved: " + String.format("%.2f", dto.getEstimatedFuelConsumptionLiters()) + " liters"));
        document.add(new Paragraph("Total Carbon (CO2) Emissions Reduced: " + String.format("%.2f", dto.getTotalDistanceTravelledKm() * 0.2) + " kg"));
        document.add(new Paragraph("Total Cost Saved by Employees: INR " + String.format("%.2f", dto.getTotalCostSaved())));
        document.add(new Paragraph("Average Platform Cost per KM: INR " + String.format("%.2f", dto.getCostPerKilometer())));
        document.add(new Paragraph("========================================="));
        document.add(new Paragraph(" "));
        document.add(new Paragraph("End of Analytics Report. RideConnect Mobility Operating System."));
        
        document.close();
        return out.toByteArray();
    }

    public byte[] generateEmployeePdfReport(String employeeEmail, List<TripDTO> trips) throws DocumentException {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, out);
        document.open();
        
        document.add(new Paragraph("========================================="));
        document.add(new Paragraph("    RIDECONNECT PERSONAL TRIPS REPORT    "));
        document.add(new Paragraph("========================================="));
        document.add(new Paragraph("Employee Account: " + employeeEmail));
        document.add(new Paragraph("Generated at: " + java.time.LocalDateTime.now()));
        document.add(new Paragraph(" "));
        
        long completedCount = trips.stream().filter(t -> "COMPLETED".equalsIgnoreCase(t.getStatus().name()) || "STARTED".equalsIgnoreCase(t.getStatus().name())).count();
        java.math.BigDecimal totalSpent = trips.stream()
                .filter(t -> !"CANCELLED".equalsIgnoreCase(t.getStatus().name()) && !"REJECTED".equalsIgnoreCase(t.getStatus().name()))
                .map(t -> t.getTotalFare() != null ? t.getTotalFare() : java.math.BigDecimal.ZERO)
                .reduce(java.math.BigDecimal.ZERO, (a, b) -> a.add(b));
        double totalDistance = completedCount * 15.0; // Assume 15km average trip
        
        document.add(new Paragraph("SUMMARY METRICS:"));
        document.add(new Paragraph("-----------------------------------------"));
        document.add(new Paragraph("Total Trips Booked: " + trips.size()));
        document.add(new Paragraph("Completed Trips: " + completedCount));
        document.add(new Paragraph("Total Estimated Money Spent: INR " + totalSpent));
        document.add(new Paragraph("Total Travelled Distance: " + totalDistance + " km"));
        document.add(new Paragraph("CO2 Saved (based on sharing): " + String.format("%.2f", totalDistance * 0.2) + " kg"));
        document.add(new Paragraph("-----------------------------------------"));
        document.add(new Paragraph(" "));
        document.add(new Paragraph("DETAILED TRIP LIST:"));
        document.add(new Paragraph(" "));
        
        for (TripDTO trip : trips) {
            String route = trip.getRidePickupLocation() + " -> " + trip.getRideDestination();
            String details = String.format("Trip ID: %d | Status: %s | Fare: INR %s\nRoute: %s\nTime: %s\nSeats Booked: %d\n",
                    trip.getId(), trip.getStatus(), trip.getTotalFare(), route, trip.getRideDepartureTime(), trip.getBookedSeats());
            document.add(new Paragraph(details));
            document.add(new Paragraph("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -"));
        }
        
        document.add(new Paragraph("Thank you for sharing rides and protecting the planet!"));
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
