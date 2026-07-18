package com.odoohackathon.odoohackathon.domain.chat.controller;

import com.odoohackathon.odoohackathon.domain.chat.dto.ChatMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

@Controller
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat/{tripId}")
    public void sendMessage(@DestinationVariable Long tripId, @Payload ChatMessage message) {
        messagingTemplate.convertAndSend("/topic/chat/" + tripId, message);
    }
}
