package com.odoohackathon.odoohackathon.domain.chat.repository;

import com.odoohackathon.odoohackathon.domain.chat.entity.ChatEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRepository extends JpaRepository<ChatEntity, Long> {
    List<ChatEntity> findByTripIdOrderByTimestampAsc(Long tripId);
}
