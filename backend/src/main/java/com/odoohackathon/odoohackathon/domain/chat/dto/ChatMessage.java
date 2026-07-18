package com.odoohackathon.odoohackathon.domain.chat.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ChatMessage {
    private String senderEmail;
    private String message;
    private LocalDateTime timestamp = LocalDateTime.now();
}
