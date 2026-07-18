package com.odoohackathon.odoohackathon.domain.trip.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {
    private Long tripId;
    private String senderName;
    private String senderEmail;
    private String content;
    private String timestamp;
}
