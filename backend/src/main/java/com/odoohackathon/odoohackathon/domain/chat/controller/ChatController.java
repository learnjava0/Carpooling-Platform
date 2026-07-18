package com.odoohackathon.odoohackathon.domain.chat.controller;

import com.odoohackathon.odoohackathon.domain.chat.dto.ChatMessage;
import com.odoohackathon.odoohackathon.domain.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatService;

    @MessageMapping("/chat/{tripId}")
    public void sendMessage(@DestinationVariable Long tripId, @Payload ChatMessage message) {
        // 1. Save to DB
        ChatMessage savedMessage = chatService.saveMessage(tripId, message);
        // 2. Broadcast to all listeners
        messagingTemplate.convertAndSend("/topic/chat/" + tripId, savedMessage);
    }

    @GetMapping("/api/chat/{tripId}")
    public ResponseEntity<List<ChatMessage>> getChatHistory(@PathVariable Long tripId) {
        return ResponseEntity.ok(chatService.getChatHistory(tripId));
    }
}
