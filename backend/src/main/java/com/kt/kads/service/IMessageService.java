package com.kt.kads.service;

import com.kt.kads.entity.Message;
import java.util.List;
import java.util.Optional;

public interface IMessageService {
    
    /**
     * ID로 메시지 조회
     */
    Optional<Message> findById(Long id);
    
    /**
     * 모든 메시지 조회
     */
    List<Message> findAll();
    
    /**
     * 캠페인별 메시지 조회
     */
    List<Message> findByCampaignId(Long campaignId);
    
    /**
     * 타입별 메시지 조회
     */
    List<Message> findByType(Message.Type type);
    
    /**
     * 상태별 메시지 조회
     */
    List<Message> findByStatus(Message.Status status);
    
    /**
     * 제목으로 메시지 검색
     */
    List<Message> findByTitleContaining(String title);
    
    /**
     * 메시지 생성
     */
    Message createMessage(Message message);
    
    /**
     * 메시지 수정
     */
    Message updateMessage(Long id, Message message);
    
    /**
     * 메시지 삭제
     */
    void deleteMessage(Long id);
}
