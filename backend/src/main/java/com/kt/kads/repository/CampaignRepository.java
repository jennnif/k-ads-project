package com.kt.kads.repository;

import com.kt.kads.entity.Campaign;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface CampaignRepository extends JpaRepository<Campaign, Long> {
    List<Campaign> findByNameIgnoreCaseContaining(String q);
    List<Campaign> findByStatus(Campaign.Status status);
    List<Campaign> findBySegmentId(Long segmentId);

    // 날짜 겹침 검색: [startDate, endDate]가 주어진 기간과 겹치는 항목
    List<Campaign> findByStartDateLessThanEqualAndEndDateGreaterThanEqual(LocalDate to, LocalDate from);
    
    // 기간이 지난 캠페인을 찾기 위한 메서드
    List<Campaign> findByEndDateBeforeAndStatusIn(LocalDate endDate, List<Campaign.Status> statuses);
}