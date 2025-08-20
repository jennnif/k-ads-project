package com.kt.kads.campaign;

import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface CampaignRepository extends JpaRepository<Campaign, Long> {
    List<Campaign> findByNameIgnoreCaseContaining(String q);
    List<Campaign> findByStatus(Campaign.Status status);
    List<Campaign> findBySegmentId(Long segmentId);

    // 날짜 겹침 검색: [startDate, endDate]가 주어진 기간과 겹치는 항목
    List<Campaign> findByStartDateLessThanEqualAndEndDateGreaterThanEqual(LocalDate to, LocalDate from);
}