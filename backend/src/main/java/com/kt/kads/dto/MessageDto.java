package com.kt.kads.dto;

import com.kt.kads.entity.Message;

public class MessageDto {
    
    public record MessageUpsertRequest(
            String title,
            String content,
            Message.Type type,
            Long campaignId
    ) {}

    public record MessageResponse(
            Long id, String title, String content, 
            Message.Type type, Message.Status status,
            Long campaignId, String createdAt
    ) {
        public static MessageResponse from(Message m) {
            return new MessageResponse(
                    m.getId(),
                    m.getTitle(),
                    m.getContent(),
                    m.getType(),
                    m.getStatus(),
                    m.getCampaignId(),
                    m.getCreatedAt().toString()
            );
        }
    }
}