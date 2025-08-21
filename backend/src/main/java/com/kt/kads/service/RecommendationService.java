package com.kt.kads.service;

import com.kt.kads.entity.RecommendedMessage;
import com.kt.kads.entity.Campaign;
import com.kt.kads.repository.RecommendedMessageRepository;
import com.kt.kads.repository.CampaignRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.Map;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class RecommendationService implements IRecommendationService {
    
    private final RecommendedMessageRepository recoRepo;
    private final CampaignRepository campaignRepo;
    
    public RecommendationService(RecommendedMessageRepository recoRepo, CampaignRepository campaignRepo) {
        this.recoRepo = recoRepo;
        this.campaignRepo = campaignRepo;
    }
    
    @Override
    public Map<String, Object> getRandomRecommendation(String category, String channel) {
        // 우선 category+channel으로 시도하고, 없으면 점진 폴백
        Optional<RecommendedMessage> picked = recoRepo.pickRandom(category, channel);
        if (picked.isEmpty() && category != null && !category.isBlank()) {
            picked = recoRepo.pickRandom(category, null);
        }
        if (picked.isEmpty() && channel != null && !channel.isBlank()) {
            picked = recoRepo.pickRandom(null, channel);
        }
        if (picked.isEmpty()) {
            picked = recoRepo.pickRandom(null, null);
        }
        
        return picked
                .map(this::toDto)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "no recommendation"));
    }
    
    @Override
    public Map<String, Object> getRecommendationByCampaign(Long campaignId, String channel) {
        Campaign c = campaignRepo.findById(campaignId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "campaign not found"));
        
        String category = mapCampaignTitleToCategory(c.getTitle());
        
        // 디버깅에 유용 (원하면 주석 처리)
        System.out.println("[reco] campaignId=" + campaignId
                + ", name=" + c.getTitle()
                + ", mappedCategory=" + category
                + ", channel=" + channel);
        
        Optional<RecommendedMessage> picked = recoRepo.pickRandom(category, channel);
        if (picked.isEmpty()) picked = recoRepo.pickRandom(category, null);
        if (picked.isEmpty()) picked = recoRepo.pickRandom(null, channel);
        if (picked.isEmpty()) picked = recoRepo.pickRandom(null, null);
        
        return picked
                .map(this::toDto)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "no recommendation"));
    }
    
    @Override
    @Transactional
    public RecommendedMessage createRecommendation(RecommendedMessage recommendation) {
        return recoRepo.save(recommendation);
    }
    
    @Override
    @Transactional
    public RecommendedMessage updateRecommendation(Long id, RecommendedMessage recommendation) {
        RecommendedMessage existing = recoRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Recommendation not found: " + id));
        
        existing.setContent(recommendation.getContent());
        existing.setCategory(recommendation.getCategory());
        existing.setTone(recommendation.getTone());
        existing.setChannel(recommendation.getChannel());
        existing.setLanguage(recommendation.getLanguage());
        existing.setWeight(recommendation.getWeight());
        existing.setIsActive(recommendation.getIsActive());
        
        return recoRepo.save(existing);
    }
    
    @Override
    @Transactional
    public void deleteRecommendation(Long id) {
        recoRepo.deleteById(id);
    }
    
    private Map<String, Object> toDto(RecommendedMessage m) {
        return Map.of(
                "id", m.getId(),
                "content", m.getContent(),
                "category", m.getCategory(),
                "channel", m.getChannel()
        );
    }
    
    // 캠페인 제목을 간단 규칙으로 카테고리에 매핑 (공백 제거 포함)
    private static String mapCampaignTitleToCategory(String title) {
        if (title == null) return "기타";
        String raw = title.toLowerCase();
        String t = raw.replaceAll("\\s+", ""); // 공백 제거 버전
        
        if (raw.contains("장바구니") || raw.contains("결제")) return "장바구니";
        if (raw.contains("재구매") || raw.contains("반복"))   return "재구매";
        if (raw.contains("휴면") || raw.contains("복귀"))     return "휴면고객";
        if (raw.contains("런칭") || raw.contains("신규") || raw.contains("오픈")) return "신규회원";
        if (raw.contains("한정") || raw.contains("품절") || raw.contains("재입고")) return "한정수량";
        if (raw.contains("혜택") || raw.contains("쿠폰") || raw.contains("할인"))   return "혜택";
        if (raw.contains("후기") || raw.contains("클립") || raw.contains("ugc"))    return "UGC";
        
        // 브랜드/SM 엔터 매핑 강화
        if (raw.contains("브랜드") || raw.contains("sm 엔터") || t.contains("smenter") || t.contains("sm엔터"))
            return "브랜드";
        
        if (raw.contains("대출") || raw.contains("금융")) return "금융";
        return "기타";
    }
}
