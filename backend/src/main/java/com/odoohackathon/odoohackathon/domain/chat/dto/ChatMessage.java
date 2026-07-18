package com.odoohackathon.odoohackathon.domain.chat.dto;

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
    private String message;
    private LocalDateTime timestamp = LocalDateTime.now();
}
