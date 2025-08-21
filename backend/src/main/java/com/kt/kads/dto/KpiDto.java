package com.kt.kads.dto;

import com.kt.kads.entity.KpiAggregate;
import com.kt.kads.enums.PeriodBucket;
import java.math.BigDecimal;
import java.time.LocalDate;

public class KpiDto {
    
    public record KpiCreateRequest(
            Long campaignId,
            LocalDate date,
            PeriodBucket period,
            long impressions,
            long clicks,
            long conversions,
            BigDecimal spend
    ) {}

    public record KpiResponse(
            Long id, Long campaignId, LocalDate date, PeriodBucket period,
            long impressions, long clicks, long conversions, BigDecimal spend
    ) {
        public static KpiResponse from(KpiAggregate k) {
            return new KpiResponse(
                    k.getId(),
                    k.getCampaign() == null ? null : k.getCampaign().getId(),
                    k.getAggregationDate(),
                    k.getPeriod(),
                    k.getImpressions(),
                    k.getClicks(),
                    k.getConversions(),
                    k.getSpend()
            );
        }
    }

    public record KpiSummaryResponse(
            long impressions, long clicks, long conversions, BigDecimal spend
    ) {}

    public record KpiDashboardResponse(
            long totalSent, long totalClicks, long totalConversions, BigDecimal totalCost
    ) {}

    public record CampaignPerformanceResponse(
            Long campaignId, String campaignName, long sent, long clicks, long conversions, BigDecimal cost
    ) {}

    public record MessagePerformanceResponse(
            Long messageId, Long campaignId, String title, String type, 
            long impressions, long clicks, long conversions, BigDecimal cost
    ) {}
}