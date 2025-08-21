package com.kt.kads.controller;

import com.kt.kads.service.IRecommendationService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = {"http://localhost:3000","http://localhost:5173"}, allowCredentials = "true")
public class RecommendationController {

    private final IRecommendationService recommendationService;

    public RecommendationController(IRecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    // 1) 단순 카테고리/채널로 랜덤 추천
    //    GET /api/recommendations/random?category=신규회원&channel=SMS
    @GetMapping("/random")
    public Map<String, Object> random(@RequestParam(required = false) String category,
                                      @RequestParam(required = false) String channel) {
        return recommendationService.getRandomRecommendation(category, channel);
    }

    // 2) campaignId로 추천 (캠페인명 → 카테고리 매핑 후 추천)
    //    GET /api/recommendations/by-campaign/{campaignId}?channel=SMS
    @GetMapping("/by-campaign/{campaignId}")
    public Map<String, Object> byCampaign(@PathVariable Long campaignId,
                                          @RequestParam(required = false) String channel) {
        return recommendationService.getRecommendationByCampaign(campaignId, channel);
    }
}
