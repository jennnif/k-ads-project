package com.kt.kads.service;

import com.kt.kads.entity.Message;
import com.kt.kads.repository.MessageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class MessageService implements IMessageService {
    
    private final MessageRepository messageRepository;
    
    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }
    
    @Override
    public Optional<Message> findById(Long id) {
        return messageRepository.findById(id);
    }
    
    @Override
    public List<Message> findAll() {
        return messageRepository.findAll();
    }
    
    @Override
    public List<Message> findByCampaignId(Long campaignId) {
        return messageRepository.findByCampaignId(campaignId);
    }
    
    @Override
    public List<Message> findByType(Message.Type type) {
        return messageRepository.findByType(type);
    }
    
    @Override
    public List<Message> findByStatus(Message.Status status) {
        return messageRepository.findByStatus(status);
    }
    
    @Override
    public List<Message> findByTitleContaining(String title) {
        return messageRepository.findByTitleIgnoreCaseContaining(title);
    }
    
    @Override
    @Transactional
    public Message createMessage(Message message) {
        return messageRepository.save(message);
    }
    
    @Override
    @Transactional
    public Message updateMessage(Long id, Message message) {
        Message existingMessage = findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Message not found: " + id));
        
        existingMessage.setCampaignId(message.getCampaignId());
        existingMessage.setType(message.getType());
        existingMessage.setTitle(message.getTitle());
        existingMessage.setContent(message.getContent());
        existingMessage.setStatus(message.getStatus());
        
        return messageRepository.save(existingMessage);
    }
    
    @Override
    @Transactional
    public void deleteMessage(Long id) {
        messageRepository.deleteById(id);
    }
}
