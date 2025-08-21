package com.kt.kads.service;

import com.kt.kads.entity.RecommendedMessage;
import java.util.Map;
import java.util.Optional;

public interface IRecommendationService {
    
    /**
     * 카테고리와 채널로 랜덤 추천 메시지 조회
     */
    Map<String, Object> getRandomRecommendation(String category, String channel);
    
    /**
     * 캠페인 ID로 추천 메시지 조회
     */
    Map<String, Object> getRecommendationByCampaign(Long campaignId, String channel);
    
    /**
     * 추천 메시지 생성
     */
    RecommendedMessage createRecommendation(RecommendedMessage recommendation);
    
    /**
     * 추천 메시지 수정
     */
    RecommendedMessage updateRecommendation(Long id, RecommendedMessage recommendation);
    
    /**
     * 추천 메시지 삭제
     */
    void deleteRecommendation(Long id);
}
