package com.odoohackathon.odoohackathon.domain.user.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class SavedLocationDTO {
    private Long id;
    private String name;
    private String address;
    private LocalDateTime createdAt;
}
