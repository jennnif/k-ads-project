package com.kt.kads.message;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AdMessageRepository extends JpaRepository<AdMessage, Long> {
    List<AdMessage> findByCampaignId(Long campaignId);
}
