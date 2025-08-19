package com.kt.kads.kpi;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface KpiAggregateRepository extends JpaRepository<KpiAggregate, Long> {

    List<KpiAggregate> findByCampaignIdAndAggregationDateBetween(
            Long campaignId, LocalDate from, LocalDate to);

    @Query("""
            select coalesce(sum(k.impressions),0),
                   coalesce(sum(k.clicks),0),
                   coalesce(sum(k.conversions),0),
                   coalesce(sum(k.spend),0)
            from KpiAggregate k
            where k.campaign.id = :campaignId
              and k.aggregationDate between :from and :to
            """)
    Object[] sumAll(Long campaignId, LocalDate from, LocalDate to);
}
