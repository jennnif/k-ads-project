package com.kt.kads.service;

import com.kt.kads.entity.Campaign;
import com.kt.kads.repository.CampaignRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class CampaignService implements ICampaignService {
    
    private final CampaignRepository campaignRepository;
    
    public CampaignService(CampaignRepository campaignRepository) {
        this.campaignRepository = campaignRepository;
    }
    
    @Override
    public Optional<Campaign> findById(Long id) {
        return campaignRepository.findById(id);
    }
    
    @Override
    public List<Campaign> findAll() {
        return campaignRepository.findAll();
    }
    
    @Override
    public List<Campaign> findByNameContaining(String name) {
        return campaignRepository.findByNameIgnoreCaseContaining(name);
    }
    
    @Override
    public List<Campaign> findByStatus(Campaign.Status status) {
        return campaignRepository.findByStatus(status);
    }
    
    @Override
    public List<Campaign> findBySegmentId(Long segmentId) {
        return campaignRepository.findBySegmentId(segmentId);
    }
    
    @Override
    public List<Campaign> findByDateRange(LocalDate from, LocalDate to) {
        return campaignRepository.findByStartDateLessThanEqualAndEndDateGreaterThanEqual(to, from);
    }
    
    @Override
    @Transactional
    public Campaign createCampaign(Campaign campaign) {
        return campaignRepository.save(campaign);
    }
    
    @Override
    @Transactional
    public Campaign updateCampaign(Long id, Campaign campaign) {
        Campaign existingCampaign = findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Campaign not found: " + id));
        
        existingCampaign.setName(campaign.getName());
        existingCampaign.setStatus(campaign.getStatus());
        existingCampaign.setBudget(campaign.getBudget());
        existingCampaign.setStartDate(campaign.getStartDate());
        existingCampaign.setEndDate(campaign.getEndDate());
        existingCampaign.setSegmentId(campaign.getSegmentId());
        existingCampaign.setChannelType(campaign.getChannelType());
        existingCampaign.setConversionGoal(campaign.getConversionGoal());
        
        return campaignRepository.save(existingCampaign);
    }
    
    @Override
    @Transactional
    public void deleteCampaign(Long id) {
        campaignRepository.deleteById(id);
    }
    
    /**
     * 매일 자정에 실행되어 기간이 지난 캠페인의 상태를 ENDED로 변경
     */
    @Override
    @Scheduled(cron = "0 0 0 * * ?") // 매일 자정
    @Transactional
    public void updateExpiredCampaigns() {
        LocalDate today = LocalDate.now();
        
        // 기간이 지났고 ACTIVE 또는 PAUSED 상태인 캠페인들을 찾아서 ENDED로 변경
        List<Campaign> expiredCampaigns = campaignRepository.findByEndDateBeforeAndStatusIn(
            today, 
            List.of(Campaign.Status.ACTIVE, Campaign.Status.PAUSED)
        );
        
        for (Campaign campaign : expiredCampaigns) {
            campaign.setStatus(Campaign.Status.ENDED);
            campaignRepository.save(campaign);
        }
        
        if (!expiredCampaigns.isEmpty()) {
            System.out.println("Updated " + expiredCampaigns.size() + " expired campaigns to ENDED status");
        }
    }
    
    /**
     * 수동으로 기간이 지난 캠페인 상태 업데이트 (테스트용)
     */
    @Override
    @Transactional
    public void manuallyUpdateExpiredCampaigns() {
        updateExpiredCampaigns();
    }
}
