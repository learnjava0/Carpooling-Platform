package com.odoohackathon.odoohackathon.domain.chat.service;

import com.odoohackathon.odoohackathon.domain.chat.dto.ChatMessage;
import com.odoohackathon.odoohackathon.domain.chat.entity.ChatEntity;
import com.odoohackathon.odoohackathon.domain.chat.repository.ChatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;

    public ChatMessage saveMessage(Long tripId, ChatMessage message) {
        ChatEntity entity = ChatEntity.builder()
                .tripId(tripId)
                .senderName(message.getSenderName())
                .senderEmail(message.getSenderEmail())
                .message(message.getMessage())
                .build();
        
        entity = chatRepository.save(entity);
        
        return ChatMessage.builder()
                .tripId(entity.getTripId())
                .senderName(entity.getSenderName())
                .senderEmail(entity.getSenderEmail())
                .message(entity.getMessage())
                .timestamp(entity.getTimestamp())
                .build();
    }

    public List<ChatMessage> getChatHistory(Long tripId) {
        return chatRepository.findByTripIdOrderByTimestampAsc(tripId).stream()
                .map(entity -> ChatMessage.builder()
                        .tripId(entity.getTripId())
                        .senderName(entity.getSenderName())
                        .senderEmail(entity.getSenderEmail())
                        .message(entity.getMessage())
                        .timestamp(entity.getTimestamp())
                        .build())
                .collect(Collectors.toList());
    }
}
