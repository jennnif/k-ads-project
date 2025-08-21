package com.kt.kads.dto;

import com.kt.kads.entity.Campaign;

public class CampaignDto {
    
    public record CampaignUpsertRequest(
            String name,
            Campaign.Status status,
            String budget,     // decimal string e.g. "100000.00"
            String startDate,  // yyyy-MM-dd
            String endDate,    // yyyy-MM-dd
            Long segmentId
    ) {}

    public record CampaignResponse(
            Long id, String name, Campaign.Status status,
            String budget, String startDate, String endDate,
            Long segmentId, String createdAt, String updatedAt
    ) {
        public static CampaignResponse from(Campaign c) {
            return new CampaignResponse(
                    c.getId(),
                    c.getName(),
                    c.getStatus(),
                    c.getBudget().toPlainString(),
                    c.getStartDate().toString(),
                    c.getEndDate().toString(),
                    c.getSegmentId(),
                    c.getCreatedAt().toString(),
                    c.getUpdatedAt().toString()
            );
        }
    }
}