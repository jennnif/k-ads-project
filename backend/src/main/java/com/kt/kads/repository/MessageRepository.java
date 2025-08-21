package com.kt.kads.repository;

import com.kt.kads.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByTitleIgnoreCaseContaining(String q);
    List<Message> findByType(Message.Type type);
    List<Message> findByStatus(Message.Status status);
    List<Message> findByCampaignId(Long campaignId);
}
