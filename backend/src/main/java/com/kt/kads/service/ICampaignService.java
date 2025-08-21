package com.kt.kads.service;

import com.kt.kads.entity.Campaign;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ICampaignService {
    
    /**
     * ID로 캠페인 조회
     */
    Optional<Campaign> findById(Long id);
    
    /**
     * 모든 캠페인 조회
     */
    List<Campaign> findAll();
    
    /**
     * 이름으로 캠페인 검색
     */
    List<Campaign> findByNameContaining(String name);
    
    /**
     * 상태별 캠페인 조회
     */
    List<Campaign> findByStatus(Campaign.Status status);
    
    /**
     * 세그먼트별 캠페인 조회
     */
    List<Campaign> findBySegmentId(Long segmentId);
    
    /**
     * 기간별 캠페인 조회
     */
    List<Campaign> findByDateRange(LocalDate from, LocalDate to);
    
    /**
     * 캠페인 생성
     */
    Campaign createCampaign(Campaign campaign);
    
    /**
     * 캠페인 수정
     */
    Campaign updateCampaign(Long id, Campaign campaign);
    
    /**
     * 캠페인 삭제
     */
    void deleteCampaign(Long id);
    
    /**
     * 기간이 지난 캠페인 상태를 ENDED로 변경
     */
    void updateExpiredCampaigns();
    
    /**
     * 수동으로 기간이 지난 캠페인 상태 업데이트
     */
    void manuallyUpdateExpiredCampaigns();
}
